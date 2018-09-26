const Reference = require('../../../../lib/stateView/Reference');
const DapObject = require('../../../../lib/stateView/dapObject/DapObject');

const generateDapObjectId = require('../../../../lib/stateView/dapObject/generateDapObjectId');

describe('DapObject', () => {
  it('should get DapObject ID', async () => {
    const blockchainUserId = '3557b9a8dfcc1ef9674b50d8d232e0e3e9020f49fa44f89cace622a01f43d03e';
    const slotNumber = 0;
    const dapObjectData = {
      objtype: 'user',
      idx: slotNumber,
      rev: 1,
      act: 0,
    };
    const reference = new Reference();
    const dapObject = new DapObject(blockchainUserId, dapObjectData, reference);
    const dapObjectId = generateDapObjectId(blockchainUserId, slotNumber);
    expect(dapObject.getId()).to.be.equal(dapObjectId);
  });

  it('should serialize DapObject', () => {
    const blockchainUserId = '3557b9a8dfcc1ef9674b50d8d232e0e3e9020f49fa44f89cace622a01f43d03e';
    const dapObjectData = {
      objtype: 'user',
      idx: 0,
      rev: 1,
      act: 1,
    };
    const blockHash = 'b8ae412cdeeb4bb39ec496dec34495ecccaf74f9fa9eaa712c77a03eb1994e75';
    const blockHeight = 1;
    const headerHash = '17jasdjk129uasd8asd023098SD09023jll123jlasd90823jklD';
    const hashSTPacket = 'ad877138as8012309asdkl123l123lka908013';
    const reference = new Reference(
      blockHash,
      blockHeight,
      headerHash,
      hashSTPacket,
    );
    const dapObject = new DapObject(blockchainUserId, dapObjectData, reference);

    const dapObjectSerialized = dapObject.toJSON();
    expect(dapObjectSerialized).to.deep.equal({
      blockchainUserId,
      type: dapObjectData.objtype,
      object: dapObjectData,
      revision: dapObjectData.rev,
      reference: reference.toJSON(),
    });
  });

  it('should have DapObject action constants', async () => {
    expect(DapObject.ACTION_CREATE).to.be.equal(0);
    expect(DapObject.ACTION_UPDATE).to.be.equal(1);
    expect(DapObject.ACTION_DELETE).to.be.equal(2);
  });

  it('should get DapObject action', async () => {
    const blockchainUserId = '3557b9a8dfcc1ef9674b50d8d232e0e3e9020f49fa44f89cace622a01f43d03e';
    const dapObjectData = {
      id: '1234',
      objtype: 'user',
      idx: 0,
      rev: 1,
      act: 0,
    };
    const reference = new Reference();
    const dapObject = new DapObject(blockchainUserId, dapObjectData, reference);
    expect(dapObject.getAction()).to.be.equal(0);
  });
});