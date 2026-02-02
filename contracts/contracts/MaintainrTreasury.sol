// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MaintainrRegistry.sol";

contract MaintainrTreasury is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    MaintainrRegistry public immutable registry;

    mapping(uint256 => uint256) public projectBalances;

    event DepositedToTreasury(uint256 indexed projectId, uint256 amount);
    event Distributed(uint256 indexed projectId, uint256 totalAmount, address[] recipients);

    constructor(address _usdc, address _registry) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        registry = MaintainrRegistry(_registry);
    }

    function depositToTreasury(uint256 _projectId, uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");

        usdc.safeTransferFrom(msg.sender, address(this), _amount);
        projectBalances[_projectId] += _amount;

        emit DepositedToTreasury(_projectId, _amount);
    }

    function distribute(uint256 _projectId) external {
        uint256 balance = projectBalances[_projectId];
        require(balance > 0, "No balance to distribute");

        (
            ,
            ,
            address[] memory recipients,
            uint256[] memory splits,
            ,
            bool active
        ) = registry.getProject(_projectId);

        require(active, "Project not active");
        require(recipients.length > 0, "No recipients");

        projectBalances[_projectId] = 0;

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 recipientAmount = (balance * splits[i]) / 10000;
            if (recipientAmount > 0) {
                usdc.safeTransfer(recipients[i], recipientAmount);
            }
        }

        emit Distributed(_projectId, balance, recipients);
    }

    function getProjectBalance(uint256 _projectId) external view returns (uint256) {
        return projectBalances[_projectId];
    }

    receive() external payable {
        revert("ETH not accepted");
    }
}
