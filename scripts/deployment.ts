/* eslint-disable node/no-missing-import */
import { ethers, run, network } from 'hardhat';

import { appendFileSync } from 'fs';

import { join } from 'path';

import { exit } from 'process';

import TOKEN_DETAILS from '../constants';

require('dotenv');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('DEPLOYING CONTRACT WITH THE ACCOUNT :', deployer.address);

  console.log('DEPLOYER ACCOUNT BALANCE:', (await deployer.getBalance()).toString());

  // getting contract namespaces

  const TokenFactory = await ethers.getContractFactory(TOKEN_DETAILS.TOKEN_CONTRACT);

  const VaultFactory = await ethers.getContractFactory(TOKEN_DETAILS.VAULT_CONTRACT);

  const ETVToken = await TokenFactory.deploy();

  const EthlasVault = await VaultFactory.deploy();

  await ETVToken.deployed();

  await EthlasVault.deployed();

  console.log('ETV Token Contract DEPLOYED TO:', ETVToken.address);

  console.log('Ethlas Vault Contract DEPLOYED TO:', EthlasVault.address);

  const config = `
  NETWORK => ${network.name}

  =====================================================================

  ETHVAULTOKEN ${ETVToken.address}

  ETHLASVAULT ${EthlasVault.address}

  =====================================================================


  `;

  const data = JSON.stringify(config);

  appendFileSync(join(__dirname, '../contracts/addressBook.md'), JSON.parse(data));

  // verify contracts

  await verify(ETVToken.address, []);

  await verify(EthlasVault.address, []);
}

const verify = async (contractAddress: string, args: Array<String | boolean | number>) => {
  console.log('Verifying contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified!');
    } else {
      console.log(e);
    }
  }
};

main()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error);

    exit(1);
  });
