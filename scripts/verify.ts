import { run } from 'hardhat';
import { exit } from 'process';
import 'dotenv/config';

/**
 * This is the main function that calls the `verify` function to verify the contract.
 * It takes no arguments and returns a Promise.
 */
async function main() {
  await verify('0x159c67578d2EA74F7C2a7Df7A6Dc43515696f1fb', []);
}

/**
 * This function verifies the contract on the Ethereum blockchain.
 * @param {string} contractAddress - The address of the contract to be verified.
 * @param {Array<String | boolean | number>} args - The constructor arguments for the contract.
 * @returns {Promise<void>} - A Promise that resolves when the contract is successfully verified.
 */
export const verify = async (contractAddress: string, args: Array<String | boolean | number>) => {
  console.log('Verifying contract...');
  try {
    // Run the 'verify:verify' task from the Hardhat environment
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    // If the contract is already verified, log a message
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already Verified!');
    } else {
      // Otherwise, log the error
      console.log(e);
    }
  }
};

// Call the main function and handle any errors
main()
  .then(() => exit(0))
  .catch((error) => {
    console.error(error);
    exit(1);
  });
