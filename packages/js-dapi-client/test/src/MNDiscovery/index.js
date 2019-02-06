const { SimplifiedMNList } = require('@dashevo/dashcore-lib');
const MNDiscovery = require('../../../src/MNDiscovery/index');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const RPCClient = require('../../../src/RPCClient');
const config = require('../../../src/config');
const SMNListFixture = require('../../fixtures/mnList');

chai.use(chaiAsPromised);
const {expect} = chai;

const MockedMNList = SMNListFixture.getFirstDiff();

const masternodeIps = SMNListFixture.getFirstDiff().mnList.map(masternode => masternode.service.split(':')[0]);

describe('MNDiscovery', async () => {

    describe('.getMNList()', async () => {

        before(() => {
            // Stub for request to seed, which is 127.0.0.1
            let baseHash = config.nullHash;
            let blockHash = '0000000005b3f97e0af8c72f9a96eca720237e374ca860938ba0d7a68471c4d6';
            const RPCClientStub = sinon.stub(RPCClient, 'request');
            RPCClientStub
                .withArgs({host: '127.0.0.1', port: config.Api.port}, 'getMnListDiff', { baseHash, blockHash })
                .returns(new Promise((resolve) => {
                    resolve(SMNListFixture.getFirstDiff());
                }));
          RPCClientStub
            .withArgs({ host: '127.0.0.1', port: config.Api.port }, 'getBestBlockHash', {})
            .returns(new Promise((resolve) => {
              resolve(blockHash);
            }));
        });

        after(() => {
            RPCClient.request.restore();
        });

        it('Should return MN list', async () => {
            const discovery = new MNDiscovery();
            sinon.spy(discovery.masternodeListProvider, 'getMNList');

            const MNList = await discovery.getMNList();

            const smnList = new SimplifiedMNList(MockedMNList);
            const validNodes = smnList.getValidMasternodesList();
            let i = 0;
            MNList.forEach((MNListItem) => {
                expect(MNListItem);
                expect(MNListItem.service).to.be.equal(validNodes[i].service);
                expect(MNListItem.proRegTxHash).to.be.a('string');
                expect(MNListItem.confirmedHash).to.be.a('string');
                expect(MNListItem.keyIDVoting).to.be.a('string');
                expect(MNListItem.pubKeyOperator).to.be.a('string');
                expect(MNListItem.isValid).to.be.a('boolean');
                expect(discovery.masternodeListProvider.getMNList.callCount).to.equal(1);
                i++;
            });

            discovery.masternodeListProvider.getMNList.restore();
        });

        it('Should reset cached MNList and resets it back to initial seed', async () => {
            const discovery = new MNDiscovery();
            sinon.spy(discovery.masternodeListProvider, 'getMNList');
            discovery.reset();
            expect(discovery.masternodeListProvider.seeds).to.be.undefined;
        });

        it('Should return random node from MN list', async () => {
            const discovery = new MNDiscovery();
            sinon.spy(discovery.masternodeListProvider, 'getMNList');

            var ips = [];
            async function verifyRandomf(array) {
                for (const item of array) {
                    let randomMasternode = await discovery.getRandomMasternode();
                    expect(masternodeIps).to.contain(randomMasternode.service.split(':')[0]);
                    expect(randomMasternode.proRegTxHash).to.be.a('string');
                    expect(randomMasternode.confirmedHash).to.be.a('string');
                    expect(randomMasternode.keyIDVoting).to.be.a('string');
                    expect(randomMasternode.pubKeyOperator).to.be.a('string');
                    expect(randomMasternode.service).to.be.a('string');
                    expect(randomMasternode.isValid).to.be.a('boolean');
                    ips.push(randomMasternode.service.split(':')[0]);
                }
                expect(discovery.masternodeListProvider.getMNList.callCount).to.equal(array.length);
                let uniqueIps = ips.filter(function (elem, pos) {
                    return ips.indexOf(elem) == pos;
                });
                expect(uniqueIps.length > 1).to.be.true;
                discovery.masternodeListProvider.getMNList.restore();
            }

            await verifyRandomf([0, 1, 2, 3]);
        });
    });

});
