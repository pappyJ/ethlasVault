// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ETHLAS VAULT
 * @author Peter Joshua
 * @notice A contract that allows users to deposit and withdraw ERC20 tokens
 * @dev The contract uses the Ownable contract from OpenZeppelin for access control
 */
contract ETHLASVAULT is Ownable {
    using SafeMath for uint256;

    /**
     * @notice Struct to store deposit information for a user and a token
     * @param amount The amount of tokens deposited
     * @param depositTime The timestamp of the deposit
     */
    struct DepositInfo {
        uint256 amount;
        uint256 depositTime;
    }

    /**
     * @notice Struct to store token information
     * @param allowed Whether the token is allowed or not
     * @param decimals The decimal places of the token
     */
    struct TokenInfo {
        bool allowed;
        uint8 decimals;
    }

    mapping(address => mapping(address => DepositInfo)) private _deposits;
    mapping(address => TokenInfo) public tokenInfo;
    mapping(address => uint256) public totalDeposits;
    bool public paused;

    event Deposit(address indexed account, address indexed tokenAddress, uint256 amount);
    event Withdrawal(address indexed account, address indexed tokenAddress, uint256 amount);
    event TokenAllowed(address indexed tokenAddress, bool allowed, uint8 decimals);
    event Paused(bool paused);

    constructor() Ownable() {}

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    /**
     * @notice Allows a user to deposit tokens into the contract
     * @param _tokenAddress The address of the ERC20 token to be deposited
     * @param _amount The amount of tokens to be deposited
     * @dev The function requires that the token is allowed and the contract is not paused
     */
    function deposit(address _tokenAddress, uint256 _amount) public virtual whenNotPaused {
        require(_amount > 0, "Deposit amount must be greater than zero");
        require(tokenInfo[_tokenAddress].allowed, "Token not allowed");

        IERC20 token = IERC20(_tokenAddress);
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        DepositInfo storage depositInfo = _deposits[_tokenAddress][msg.sender];
        depositInfo.amount = depositInfo.amount.add(_amount);
        depositInfo.depositTime = block.timestamp;
        totalDeposits[_tokenAddress] = totalDeposits[_tokenAddress].add(_amount);

        emit Deposit(msg.sender, _tokenAddress, _amount);
    }

    /**
     * @notice Allows the contract owner to withdraw tokens from the contract
     * @param _tokenAddress The address of the ERC20 token to be withdrawn
     * @param _amount The amount of tokens to be withdrawn
     * @dev The function requires that the token is allowed, the contract is not paused, and the owner has sufficient balance
     */
    function withdraw(address _tokenAddress, uint256 _amount) public virtual onlyOwner whenNotPaused {
        require(_amount > 0, "Withdrawal amount must be greater than zero");
        require(tokenInfo[_tokenAddress].allowed, "Token not allowed");

        DepositInfo storage depositInfo = _deposits[_tokenAddress][msg.sender];
        require(depositInfo.amount >= _amount, "Insufficient balance");

        depositInfo.amount = depositInfo.amount.sub(_amount);
        totalDeposits[_tokenAddress] = totalDeposits[_tokenAddress].sub(_amount);

        IERC20 token = IERC20(_tokenAddress);
        require(token.transfer(msg.sender, _amount), "Token transfer failed");

        emit Withdrawal(msg.sender, _tokenAddress, _amount);
    }

    /**
     * @notice Allows the contract owner to allow or disallow a token
     * @param _tokenAddress The address of the ERC20 token to be allowed or disallowed
     * @param _allowed Whether the token should be allowed or disallowed
     * @param _decimals The decimal places of the token
     */
    function allowToken(address _tokenAddress, bool _allowed, uint8 _decimals) public onlyOwner {
        tokenInfo[_tokenAddress].allowed = _allowed;
        tokenInfo[_tokenAddress].decimals = _decimals;
        emit TokenAllowed(_tokenAddress, _allowed, _decimals);
    }

    /**
     * @notice Allows the contract owner to pause the contract
     */
    function pause() public onlyOwner {
        paused = true;
        emit Paused(true);
    }

    /**
     * @notice Allows the contract owner to unpause the contract
     */
    function unpause() public onlyOwner {
        paused = false;
        emit Paused(false);
    }

    /**
     * @notice Retrieves the deposit information for a user and a token
     * @param _account The address of the user
     * @param _tokenAddress The address of the ERC20 token
     * @return The deposit amount and deposit time for the user and token
     */
    function getDepositInfo(address _account, address _tokenAddress) public view returns (uint256, uint256) {
        DepositInfo storage depositInfo = _deposits[_tokenAddress][_account];
        return (depositInfo.amount, depositInfo.depositTime);
    }

    /**
     * @notice Retrieves the total deposits for a token
     * @param _tokenAddress The address of the ERC20 token
     * @return The total deposits for the token
     */
    function getTotalDeposits(address _tokenAddress) public view returns (uint256) {
        return totalDeposits[_tokenAddress];
    }

    /**
     * @notice Retrieves the token information for a given token address
     * @param _tokenAddress The address of the ERC20 token
     * @return The token's allowed status and decimal places
     */
    function getTokenInfo(address _tokenAddress) public view returns (bool, uint8) {
        return (tokenInfo[_tokenAddress].allowed, tokenInfo[_tokenAddress].decimals);
    }
}