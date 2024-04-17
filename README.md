# The ETHLAS VAULT: A Secure ERC20 Token Vault

## Setting Up the ETHLAS VAULT Project with Yarn

This guide provides instructions on how to set up the ETHLAS VAULT project on your local machine using Yarn from the project repository.

**Deployed Version On Sepolia Testnet:** [ETHVAULT URL](https://sepolia.etherscan.io/address/0x4E623f6f62A932c5289e494f2EA457e926903A97#code)

## Prerequisites

Before you begin, ensure that you have the following prerequisites installed on your system:

- Git: [Download and install Git](https://git-scm.com/downloads)
- Node.js and npm (Node Package Manager): [Download and install Node.js](https://nodejs.org/en/download/)
- Yarn: [Download and install Yarn](https://classic.yarnpkg.com/en/docs/install/)
- slither(Optional): [Guide on slither installation and usage](https://hackenproof.com/blog/for-hackers/how-to-use-slither-for-auditing-smart-contracts)

## Setup Steps

Follow these steps to set up the ETHLAS VAULT project on your machine using Yarn:

### 1. Clone the Repository

Open your terminal or command prompt and run the following command to clone the ETHLAS VAULT project repository:

```bash
git clone https://github.com/pappyJ/ethlasVault.git
```

### 2. Navigate to the Project Directory

Navigate into the project directory using the `cd` command:

```bash
cd ethlasVault
```

### 3. Install Dependencies

Install project dependencies using Yarn:

```bash
yarn install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory and specify any necessary environment variables. You may need to configure variables such as Ethereum network endpoints or API keys depending on your use case.Please refer to the `.env.example` file for required variable placeholers

However, note that industry standards advise against adding private keys or sensitive information directly in `.env` files for security reasons. Instead, it's recommended to use secure methods of handling sensitive data, especially in production environments.

Nevertheless, for development purposes and easier testing, the project provides provisions for including private keys, RPC keys, and related secret keys in the `.env` file. Exercise caution when including sensitive information and ensure that proper security measures are in place, especially when deploying to public networks.

**Note:** The ETV Token contract is provided for testing purposes on local and test networks. If you do not need it, you can comment out the relevant sections in the deployment script.

### 5. Start Development

You can now start development on the ETHLAS VAULT project. Use the available scripts defined in the `package.json` file to compile contracts, run tests, and deploy contracts as needed.

### 6. Interact with Contracts

Once deployed, you can interact with ETHLAS VAULT through Ethereum wallets like MetaMask or programmatically using Ethereum-compatible libraries such as ethers.js. By calling the contract's functions, users can perform various operations, including depositing tokens, withdrawing tokens, and managing token allowances.

## Available Scripts

- **compile**: Compiles the Solidity contracts using Hardhat.
- **coverage**: Generates code coverage reports for the contracts using Hardhat's built-in coverage tool.
- **docs**: Generates documentation for the contracts using Solidity-docgen.
- **slither**: Runs the Slither static analysis tool on the contracts to detect potential vulnerabilities.
- **fork:node**: Starts a local Hardhat node forked from an existing Ethereum network (e.g., mainnet).
- **fork:script**: Runs a script with a forked local Hardhat node for testing or development purposes.
- **lint:check**: Checks the Solidity contracts and project files for linting errors using Solhint and Prettier.
- **lint:fix**: Fixes linting errors in the Solidity contracts and project files using Solhint and Prettier.
- **release**: Automatically generates a new version tag for the project using standard-version.
- **test**: Compiles the contracts and runs the tests using Hardhat and Mocha.
- **test:parallel**: Compiles the contracts and runs the tests in parallel using Hardhat and Mocha.
- **test:gas**: Runs the tests and reports gas usage for each test using Hardhat.
- **deploy:sepolia**: Deploys the contracts to the "sepolia" network using a deployment script.
- **deploy:mainnet**: Deploys the contracts to the Ethereum mainnet using a deployment script.

## Deployment Script

The deployment script (`scripts/deployment.ts`) automates the deployment process for the ETHLAS VAULT contracts. Here's how it works:

- The script fetches the deployer's account using `ethers.getSigners()`.
- It deploys the ETHLAS VAULT and ETV Token contracts using their respective contract factories.
- Once deployed, it logs the addresses of the deployed contracts and saves them to a configuration file (`contracts/addressBook.md`).
- Finally, it verifies the deployed contracts using the `verify` function.

**Note:** The ETV Token contract is provided for testing purposes on local and test networks. If you do not need it, you can comment out the relevant sections in the deployment script.

## Conclusion

You've successfully set up the ETHLAS VAULT project on your local machine using Yarn. You can now start exploring the codebase, making modifications, and interacting with the deployed contracts as needed. Happy coding!

## ETHLAS VAULT: Contract Structure

_SPDX-License-Identifier: MIT_

**Abstract**

The ETHLAS VAULT smart contract facilitates secure deposits and withdrawals of ERC20 tokens. It leverages access control mechanisms from OpenZeppelin Contracts to ensure authorized operations and adheres to industry best practices for smart contract development.

**Features**

- **Seamless ERC20 Token Management:** Users can deposit and withdraw supported ERC20 tokens with ease.
- **Granular Token Allowances:** The contract owner can manage whitelisted tokens, granting or revoking deposit/withdrawal permissions for specific tokens.
- **Pause/Unpause Functionality:** The owner has the ability to temporarily pause contract operations for maintenance or security purposes.
- **Transparent Event Logging:** Deposit, withdrawal, token allowance changes, and pause/unpause events are emitted for comprehensive audit trails.

**Technical Specifications**

- **Supported Solidity Version:** >= 0.8.20
- **External Dependencies:**
  - OpenZeppelin Contracts:
    - `@openzeppelin/contracts/token/ERC20/IERC20.sol`
    - `@openzeppelin/contracts/utils/math/SafeMath.sol`
    - `@openzeppelin/contracts/access/Ownable.sol`

**Contract Architecture**

- **`DepositInfo` Struct:** Stores deposit amount and timestamp for a specific user and token combination.
- **`TokenInfo` Struct:** Tracks the allowed status and decimal places for each supported token.
- **Mappings:**
  - `_deposits`: Maps user address to a mapping of token address to `DepositInfo`.
  - `tokenInfo`: Maps token address to `TokenInfo`.
  - `totalDeposits`: Maps token address to the total deposited amount for that token.
- **Modifiers:**
  - `whenNotPaused`: Ensures a function can only be called when the contract is not paused.
- **Events:**
  - `Deposit`: Records a user's token deposit.
  - `Withdrawal`: Records a user's token withdrawal.
  - `TokenAllowed`: Indicates a change in the allowance status for a token.
  - `Paused`: Signals the contract being paused or unpaused.

**Functionalities**

- **`deposit(address _tokenAddress, uint256 _amount)`:** Enables users to deposit tokens.

**Function Prerequisites:**

- `_tokenAddress`: (Address) The address of the ERC20 token to be deposited. Must be a valid ERC20 token address.
- `_amount`: (uint256) The amount of tokens to deposit. Must be greater than zero.
- Contract must not be paused (enforced by `whenNotPaused` modifier).
- The token must be allowed for deposit (checked within the function).

- **`withdraw(address _tokenAddress, uint256 _amount)`:** Allows the owner to withdraw tokens.

**Function Prerequisites:**

- `_tokenAddress`: (Address) The address of the ERC20 token to be withdrawn. Must be a valid ERC20 token address.
- `_amount`: (uint256) The amount of tokens to withdraw. Must be greater than zero.
- Contract must not be paused (enforced by `whenNotPaused` modifier).
- The token must be allowed for withdrawal (checked within the function).
- Owner must have sufficient balance (checked within the function).

- **`allowToken(address _tokenAddress, bool _allowed, uint8 _decimals)`:** Grants the owner control over token allowances and decimals.

**Function Prerequisites:**

- `_tokenAddress`: (Address) The address of the ERC20 token to manage. Must be a valid ERC20 token address.
- `_allowed`: (bool) Whether the token is allowed for deposits and withdrawals (true) or not (false).
- `_decimals`: (uint8) The number of decimal places for the token. Must be a valid value between 0 and the maximum supported by the ERC20 standard (typically 18).

- **`pause()`:** Pauses contract operations, restricting deposits and withdrawals (owner-only function).

**Function Prerequisites:**

- This function can only be called by the contract owner (enforced by the `Ownable` modifier).

- **`unpause()`:** Resumes contract operations, allowing deposits and withdrawals again (owner-only function).

- **`getDepositInfo(address _account, address _tokenAddress)`:** Retrieves deposit details for a user and a specific token.

**Function Prerequisites:**

- `_account`: (Address) The address of the user for whom to retrieve deposit information. Must be a valid Ethereum address.
- `_tokenAddress`: (Address) The address of the ERC20 token for which to retrieve deposit information. Must be a valid ERC20 token address.

- **`getTotalDeposits(address _tokenAddress)`:** Returns the total amount deposited for a particular token.

**Function Prerequisites:**

- `_tokenAddress`: (Address) The address of the ERC20 token for which to retrieve the total deposits. Must be a valid ERC20 token address.

- **`getTokenInfo(address _tokenAddress)`:** Fetches the allowed status and decimal places for a given token.

**Function Prerequisites:**

- `_tokenAddress`: (Address) The address of the ERC20 token for which to retrieve information. Must be a valid ERC20 token address.

**Usage**

Users can interact with ETHLAS VAULT through Ethereum wallets like MetaMask or programmatically using Ethereum-compatible libraries such as ethers.js. By calling the contract's functions, users can perform various operations, including depositing tokens, withdrawing tokens, and managing token allowances.

**Security Considerations**

The contract employs SafeMath for mathematical operations to mitigate potential overflow/underflow vulnerabilities. However, rigorous security audits are essential before deploying the contract in a production environment.

**Disclaimer**

This is for development purposes only. Use this code at your own risk and conduct thorough testing before deployment.
