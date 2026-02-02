// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MaintainrRegistry.sol";
import "./MaintainrTreasury.sol";

contract MaintainrYellowSettlement is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    MaintainrRegistry public immutable registry;
    MaintainrTreasury public immutable treasury;

    mapping(bytes32 => bool) public settledSessions;

    event SessionSettled(
        uint256 indexed projectId,
        bytes32 indexed sessionId,
        uint256 totalAmount,
        address settler
    );

    constructor(
        address _usdc,
        address _registry,
        address payable _treasury
    ) Ownable(msg.sender) {
        usdc = IERC20(_usdc);
        registry = MaintainrRegistry(_registry);
        treasury = MaintainrTreasury(_treasury);
    }

    function settleSession(
        uint256 _projectId,
        bytes32 _sessionId,
        uint256 _finalAmount
    ) external onlyOwner {
        require(!settledSessions[_sessionId], "Session already settled");
        require(_finalAmount > 0, "Amount must be greater than 0");

        (
            ,
            ,
            ,
            ,
            ,
            bool active
        ) = registry.getProject(_projectId);

        require(active, "Project not active");

        settledSessions[_sessionId] = true;

        usdc.safeTransferFrom(msg.sender, address(treasury), _finalAmount);

        emit SessionSettled(_projectId, _sessionId, _finalAmount, msg.sender);
    }

    function isSessionSettled(bytes32 _sessionId) external view returns (bool) {
        return settledSessions[_sessionId];
    }
}
