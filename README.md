# The ETHLAS TOKEN VAULT

This project was developed with hardhat and also integrating other tools commonly used alongside Hardhat in the ecosystem.

The project comes with a test for that contract, a script that deploys the contract. It also comes with a variety of other tools, preconfigured to work with the project code.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.ts
TS_NODE_FILES=true npx ts-node scripts/deploy.ts
npx eslint '**/*.{js,ts}'
npx eslint '**/*.{js,ts}' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
hardhat run --network ropsten scripts/sample-script.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```

# Performance optimizations

For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see [the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).


**ETHLAS VAULT**

_SPDX-License-Identifier: MIT_

**Introduction**

This document describes the ETHLAS VAULT smart contract, a platform that allows users to deposit and withdraw ERC20 tokens. It utilizes access control functionalities from OpenZeppelin to ensure secure operations.

**Features**

- Users can deposit supported ERC20 tokens.
- Users can withdraw their deposited tokens.
- Contract owner can manage allowed tokens (allow/disallow).
- Contract owner can pause and unpause contract functionality.
- Deposit and withdrawal events are emitted for tracking purposes.

**Technical details**

- Solidity version: >= 0.8.20
- Dependencies:
  - OpenZeppelin Contracts:
    - `@openzeppelin/contracts/token/ERC20/IERC20.sol`
    - `@openzeppelin/contracts/utils/math/SafeMath.sol`
    - `@openzeppelin/contracts/access/Ownable.sol`

**Contract Structure**

- **`DepositInfo` struct:** Stores deposit amount and timestamp for a user and token.
- **`TokenInfo` struct:** Stores allowed status and decimal places of a token.
- **Mappings:**
  - `_deposits`: Maps user address to a mapping of token address to `DepositInfo`.
  - `tokenInfo`: Maps token address to `TokenInfo`.
  - `totalDeposits`: Maps token address to total deposited amount.
- **Modifiers:**
  - `whenNotPaused`: Ensures the contract is not paused before function execution.
- **Events:**
  - `Deposit`: Emitted when a user deposits tokens.
  - `Withdrawal`: Emitted when a user withdraws tokens.
  - `TokenAllowed`: Emitted when the owner allows or disallows a token.
  - `Paused`: Emitted when the contract is paused or unpaused.

**Functions**

- **`constructor`:** Initializes the contract with the owner set to the deployer address.
- **`deposit(address _tokenAddress, uint256 _amount)`:** Allows a user to deposit tokens.
  - Requires:
    - `_amount` to be greater than zero.
    - Token to be allowed.
    - Contract not to be paused.
  - Transfers tokens from user to contract and updates deposit information.
- **`withdraw(address _tokenAddress, uint256 _amount)`:** Allows the owner to withdraw tokens.
  - Requires:
    - `_amount` to be greater than zero.
    - Token to be allowed.
    - Contract not to be paused.
    - Owner to have sufficient balance.
  - Transfers tokens from contract to user and updates deposit information.
- **`allowToken(address _tokenAddress, bool _allowed, uint8 _decimals)`:** Allows the owner to manage token allowance and decimals.
  - Sets the `allowed` and `decimals` values for the specified token.
- **`pause()`:** Pauses the contract, preventing deposits and withdrawals (only owner can call).
- **`unpause()`:** Unpauses the contract, allowing deposits and withdrawals again (only owner can call).
- **`getDepositInfo(address _account, address _tokenAddress)`:** Retrieves deposit information for a user and token.
- **`getTotalDeposits(address _tokenAddress)`:** Retrieves the total deposits for a token.
- **`getTokenInfo(address _tokenAddress)`:** Retrieves the allowed status and decimal places for a token.

**Deployment and Usage**

Refer to the deployed contract address and interact with the contract functions using a compatible wallet or web3 interface.

**Security Considerations**

This contract utilizes SafeMath for arithmetic operations to prevent potential overflow/underflow vulnerabilities. However, it's crucial to conduct thorough security audits before deploying the contract in a production environment.

**Disclaimer**

This is provided for development purposes only. Use this code at your own risk and conduct proper testing before deployment.
