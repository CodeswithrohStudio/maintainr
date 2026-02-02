// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MaintainrRegistry is Ownable {
    struct Project {
        address owner;
        string githubRepo;
        address[] recipients;
        uint256[] splits;
        string ensName;
        bool active;
    }

    uint256 private projectCounter;
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public ownerProjects;
    mapping(string => uint256) public repoToProjectId;

    event ProjectRegistered(
        uint256 indexed projectId,
        address indexed owner,
        string githubRepo,
        string ensName
    );

    event SplitsUpdated(
        uint256 indexed projectId,
        address[] recipients,
        uint256[] splits
    );

    constructor() Ownable(msg.sender) {}

    function registerProject(
        string memory _githubRepo,
        address[] memory _recipients,
        uint256[] memory _splits,
        string memory _ensName
    ) external returns (uint256) {
        require(_recipients.length > 0, "At least one recipient required");
        require(_recipients.length == _splits.length, "Recipients and splits length mismatch");
        require(_validateSplits(_splits), "Splits must sum to 10000");
        require(repoToProjectId[_githubRepo] == 0, "Repo already registered");

        projectCounter++;
        uint256 projectId = projectCounter;

        projects[projectId] = Project({
            owner: msg.sender,
            githubRepo: _githubRepo,
            recipients: _recipients,
            splits: _splits,
            ensName: _ensName,
            active: true
        });

        ownerProjects[msg.sender].push(projectId);
        repoToProjectId[_githubRepo] = projectId;

        emit ProjectRegistered(projectId, msg.sender, _githubRepo, _ensName);

        return projectId;
    }

    function updateSplits(
        uint256 _projectId,
        address[] memory _recipients,
        uint256[] memory _splits
    ) external {
        require(projects[_projectId].owner == msg.sender, "Not project owner");
        require(_recipients.length == _splits.length, "Length mismatch");
        require(_validateSplits(_splits), "Splits must sum to 10000");

        projects[_projectId].recipients = _recipients;
        projects[_projectId].splits = _splits;

        emit SplitsUpdated(_projectId, _recipients, _splits);
    }

    function getProject(uint256 _projectId) external view returns (
        address owner,
        string memory githubRepo,
        address[] memory recipients,
        uint256[] memory splits,
        string memory ensName,
        bool active
    ) {
        Project memory project = projects[_projectId];
        return (
            project.owner,
            project.githubRepo,
            project.recipients,
            project.splits,
            project.ensName,
            project.active
        );
    }

    function getOwnerProjects(address _owner) external view returns (uint256[] memory) {
        return ownerProjects[_owner];
    }

    function _validateSplits(uint256[] memory _splits) private pure returns (bool) {
        uint256 total = 0;
        for (uint256 i = 0; i < _splits.length; i++) {
            total += _splits[i];
        }
        return total == 10000;
    }
}
