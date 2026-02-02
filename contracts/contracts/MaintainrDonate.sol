// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./MaintainrRegistry.sol";

contract MaintainrDonate {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    MaintainrRegistry public immutable registry;

    event Donated(
        uint256 indexed projectId,
        address indexed donor,
        uint256 amount,
        string message,
        string donorENS
    );

    constructor(address _usdc, address _registry) {
        usdc = IERC20(_usdc);
        registry = MaintainrRegistry(_registry);
    }

    function donate(
        uint256 _projectId,
        uint256 _amount,
        string memory _message,
        string memory _donorENS
    ) external {
        require(_amount > 0, "Amount must be greater than 0");

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

        usdc.safeTransferFrom(msg.sender, address(this), _amount);

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 recipientAmount = (_amount * splits[i]) / 10000;
            if (recipientAmount > 0) {
                usdc.safeTransfer(recipients[i], recipientAmount);
            }
        }

        emit Donated(_projectId, msg.sender, _amount, _message, _donorENS);
    }

    function donateToTreasury(
        uint256 _projectId,
        uint256 _amount,
        address _treasury,
        string memory _message,
        string memory _donorENS
    ) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_treasury != address(0), "Invalid treasury");

        (
            ,
            ,
            ,
            ,
            ,
            bool active
        ) = registry.getProject(_projectId);

        require(active, "Project not active");

        usdc.safeTransferFrom(msg.sender, _treasury, _amount);

        emit Donated(_projectId, msg.sender, _amount, _message, _donorENS);
    }
}
