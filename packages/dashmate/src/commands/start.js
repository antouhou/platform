const Listr = require('listr');

const { flags: flagTypes } = require('@oclif/command');

const BaseCommand = require('../oclif/command/BaseCommand');

const UpdateRendererWithOutput = require('../oclif/renderer/UpdateRendererWithOutput');

const MutedError = require('../oclif/errors/MutedError');

const PRESETS = require('../presets');

class StartCommand extends BaseCommand {
  /**
   * @param {Object} args
   * @param {Object} flags
   * @param {DockerCompose} dockerCompose
   * @return {Promise<void>}
   */
  async runWithDependencies(
    {
      preset,
    },
    {
      'full-node': isFullNode,
      'operator-private-key': operatorPrivateKey,
    },
    dockerCompose,
  ) {
    const tasks = new Listr([
      {
        title: `Start ${isFullNode ? 'full node' : 'masternode'} with ${preset} preset`,
        task: async () => {
          let CORE_MASTERNODE_BLS_PRIV_KEY;

          if (operatorPrivateKey) {
            CORE_MASTERNODE_BLS_PRIV_KEY = operatorPrivateKey;
          }

          if (isFullNode) {
            CORE_MASTERNODE_BLS_PRIV_KEY = '';
          }

          await dockerCompose.up(preset, {
            CORE_MASTERNODE_BLS_PRIV_KEY,
          });
        },
      },
    ],
    { collapse: false, renderer: UpdateRendererWithOutput });

    try {
      await tasks.run();
    } catch (e) {
      // we already output errors through listr
      throw new MutedError(e);
    }
  }
}

StartCommand.description = `Start masternode
...
Start masternode with specific preset
`;

StartCommand.args = [{
  name: 'preset',
  required: true,
  description: 'preset to use',
  options: Object.values(PRESETS),
}, {
  name: 'external-ip',
  required: true,
  description: 'masternode external IP',
}, {
  name: 'port',
  required: true,
  description: 'masternode P2P port',
}];

StartCommand.flags = {
  'full-node': flagTypes.boolean({ char: 'f', description: 'start as full node', default: false }),
  'operator-private-key': flagTypes.string({ char: 'p', description: 'operator private key', default: null }),
};

module.exports = StartCommand;
