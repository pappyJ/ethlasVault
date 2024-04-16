import 'dotenv/config';
import '@nomicfoundation/hardhat-verify';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import { HardhatUserConfig, vars } from 'hardhat/config';

const privateKey = vars.get('PRIVATE_KEY') || process.env.PRIVATE_KEY!;

interface HardhatUserConfigPro extends HardhatUserConfig {
  etherscan: { [key: string]: any };
}

const config: HardhatUserConfigPro = {
  defaultNetwork: 'hardhat',

  networks: {
    hardhat: {
      chainId: 1337,
    },
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [privateKey],
    },

    sepolia: {
      chainId: 11155111,
      url: 'https://ethereum-sepolia-rpc.publicnode.com	',
      accounts: [privateKey],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },

  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },

  paths: {
    root: './',
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 20000,
  },
};

export default config;
