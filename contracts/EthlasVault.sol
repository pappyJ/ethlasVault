// SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ETHLASVAULT is Ownable {
    using SafeMath for uint256;

    struct DepositInfo {
        uint256 amount;
        uint256 depositTime;
    }

    mapping(address => mapping(address => DepositInfo)) private _deposits;
    mapping(address => bool) public allowedTokens;
    mapping(address => uint256) public totalDeposits;
    bool public paused;

    event Deposit(address indexed account, address indexed tokenAddress, uint256 amount);
    event Withdrawal(address indexed account, address indexed tokenAddress, uint256 amount);
    event TokenAllowed(address indexed tokenAddress, bool allowed);
    event Paused(bool paused);

    constructor() Ownable() {}

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function deposit(address _tokenAddress, uint256 _amount) public virtual whenNotPaused {
        require(_amount > 0, "Deposit amount must be greater than zero");
        require(allowedTokens[_tokenAddress], "Token not allowed");

        IERC20 token = IERC20(_tokenAddress);
        require(token.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");

        DepositInfo storage depositInfo = _deposits[_tokenAddress][msg.sender];
        depositInfo.amount = depositInfo.amount.add(_amount);
        depositInfo.depositTime = block.timestamp;
        totalDeposits[_tokenAddress] = totalDeposits[_tokenAddress].add(_amount);

        emit Deposit(msg.sender, _tokenAddress, _amount);
    }

    function withdraw(address _tokenAddress, uint256 _amount) public virtual onlyOwner whenNotPaused {
        require(_amount > 0, "Withdrawal amount must be greater than zero");
        require(allowedTokens[_tokenAddress], "Token not allowed");

        DepositInfo storage depositInfo = _deposits[_tokenAddress][msg.sender];
        require(depositInfo.amount >= _amount, "Insufficient balance");

        depositInfo.amount = depositInfo.amount.sub(_amount);
        totalDeposits[_tokenAddress] = totalDeposits[_tokenAddress].sub(_amount);

        IERC20 token = IERC20(_tokenAddress);
        require(token.transfer(msg.sender, _amount), "Token transfer failed");

        emit Withdrawal(msg.sender, _tokenAddress, _amount);
    }

    function allowToken(address _tokenAddress, bool _allowed) public onlyOwner {
        allowedTokens[_tokenAddress] = _allowed;
        emit TokenAllowed(_tokenAddress, _allowed);
    }

    function pause() public onlyOwner {
        paused = true;
        emit Paused(true);
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Paused(false);
    }

    function getDepositInfo(address _account, address _tokenAddress) public view returns (uint256, uint256) {
        DepositInfo storage depositInfo = _deposits[_tokenAddress][_account];
        return (depositInfo.amount, depositInfo.depositTime);
    }

    function getTotalDeposits(address _tokenAddress) public view returns (uint256) {
        return totalDeposits[_tokenAddress];
    }
}