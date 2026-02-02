const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Maintainr Protocol", function () {
  let registry, donate, treasury, yellowSettlement;
  let usdc;
  let owner, maintainer, donor, recipient1, recipient2;

  beforeEach(async function () {
    [owner, maintainer, donor, recipient1, recipient2] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdc = await MockERC20.deploy("USD Coin", "USDC", 6);

    const Registry = await ethers.getContractFactory("MaintainrRegistry");
    registry = await Registry.deploy();

    const Donate = await ethers.getContractFactory("MaintainrDonate");
    donate = await Donate.deploy(await usdc.getAddress(), await registry.getAddress());

    const Treasury = await ethers.getContractFactory("MaintainrTreasury");
    treasury = await Treasury.deploy(await usdc.getAddress(), await registry.getAddress());

    const YellowSettlement = await ethers.getContractFactory("MaintainrYellowSettlement");
    yellowSettlement = await YellowSettlement.deploy(
      await usdc.getAddress(),
      await registry.getAddress(),
      await treasury.getAddress()
    );

    await usdc.mint(donor.address, ethers.parseUnits("10000", 6));
  });

  describe("MaintainrRegistry", function () {
    it("Should register a project", async function () {
      const tx = await registry.connect(maintainer).registerProject(
        "github.com/maintainer/repo",
        [recipient1.address, recipient2.address],
        [7000, 3000],
        "maintainer.eth"
      );

      await expect(tx)
        .to.emit(registry, "ProjectRegistered")
        .withArgs(1, maintainer.address, "github.com/maintainer/repo", "maintainer.eth");

      const project = await registry.getProject(1);
      expect(project.owner).to.equal(maintainer.address);
      expect(project.githubRepo).to.equal("github.com/maintainer/repo");
      expect(project.ensName).to.equal("maintainer.eth");
    });

    it("Should reject invalid splits", async function () {
      await expect(
        registry.connect(maintainer).registerProject(
          "github.com/maintainer/repo",
          [recipient1.address],
          [5000],
          "maintainer.eth"
        )
      ).to.be.revertedWith("Splits must sum to 10000");
    });

    it("Should update splits", async function () {
      await registry.connect(maintainer).registerProject(
        "github.com/maintainer/repo",
        [recipient1.address],
        [10000],
        "maintainer.eth"
      );

      await registry.connect(maintainer).updateSplits(
        1,
        [recipient1.address, recipient2.address],
        [6000, 4000]
      );

      const project = await registry.getProject(1);
      expect(project.splits[0]).to.equal(6000);
      expect(project.splits[1]).to.equal(4000);
    });
  });

  describe("MaintainrDonate", function () {
    beforeEach(async function () {
      await registry.connect(maintainer).registerProject(
        "github.com/maintainer/repo",
        [recipient1.address, recipient2.address],
        [7000, 3000],
        "maintainer.eth"
      );
    });

    it("Should process donation and split funds", async function () {
      const amount = ethers.parseUnits("100", 6);
      await usdc.connect(donor).approve(await donate.getAddress(), amount);

      const tx = await donate.connect(donor).donate(
        1,
        amount,
        "Great work!",
        "donor.eth"
      );

      await expect(tx)
        .to.emit(donate, "Donated")
        .withArgs(1, donor.address, amount, "Great work!", "donor.eth");

      expect(await usdc.balanceOf(recipient1.address)).to.equal(ethers.parseUnits("70", 6));
      expect(await usdc.balanceOf(recipient2.address)).to.equal(ethers.parseUnits("30", 6));
    });

    it("Should donate to treasury", async function () {
      const amount = ethers.parseUnits("100", 6);
      await usdc.connect(donor).approve(await donate.getAddress(), amount);

      await donate.connect(donor).donateToTreasury(
        1,
        amount,
        await treasury.getAddress(),
        "For treasury",
        "donor.eth"
      );

      expect(await usdc.balanceOf(await treasury.getAddress())).to.equal(amount);
    });
  });

  describe("MaintainrTreasury", function () {
    beforeEach(async function () {
      await registry.connect(maintainer).registerProject(
        "github.com/maintainer/repo",
        [recipient1.address, recipient2.address],
        [7000, 3000],
        "maintainer.eth"
      );
    });

    it("Should deposit to treasury", async function () {
      const amount = ethers.parseUnits("100", 6);
      await usdc.connect(donor).approve(await treasury.getAddress(), amount);

      await treasury.connect(donor).depositToTreasury(1, amount);

      expect(await treasury.getProjectBalance(1)).to.equal(amount);
    });

    it("Should distribute funds", async function () {
      const amount = ethers.parseUnits("100", 6);
      await usdc.connect(donor).approve(await treasury.getAddress(), amount);
      await treasury.connect(donor).depositToTreasury(1, amount);

      await treasury.distribute(1);

      expect(await usdc.balanceOf(recipient1.address)).to.equal(ethers.parseUnits("70", 6));
      expect(await usdc.balanceOf(recipient2.address)).to.equal(ethers.parseUnits("30", 6));
      expect(await treasury.getProjectBalance(1)).to.equal(0);
    });
  });

  describe("MaintainrYellowSettlement", function () {
    beforeEach(async function () {
      await registry.connect(maintainer).registerProject(
        "github.com/maintainer/repo",
        [recipient1.address],
        [10000],
        "maintainer.eth"
      );
    });

    it("Should settle Yellow session", async function () {
      const sessionId = ethers.keccak256(ethers.toUtf8Bytes("session1"));
      const amount = ethers.parseUnits("50", 6);

      await usdc.connect(donor).approve(await yellowSettlement.getAddress(), amount);
      await usdc.connect(donor).transfer(owner.address, amount);
      await usdc.connect(owner).approve(await yellowSettlement.getAddress(), amount);

      const tx = await yellowSettlement.connect(owner).settleSession(1, sessionId, amount);

      await expect(tx)
        .to.emit(yellowSettlement, "SessionSettled")
        .withArgs(1, sessionId, amount, owner.address);

      expect(await yellowSettlement.isSessionSettled(sessionId)).to.be.true;
    });

    it("Should reject duplicate settlement", async function () {
      const sessionId = ethers.keccak256(ethers.toUtf8Bytes("session1"));
      const amount = ethers.parseUnits("50", 6);

      await usdc.connect(donor).transfer(owner.address, amount);
      await usdc.connect(owner).approve(await yellowSettlement.getAddress(), amount);
      await yellowSettlement.connect(owner).settleSession(1, sessionId, amount);

      await usdc.mint(owner.address, amount);
      await usdc.connect(owner).approve(await yellowSettlement.getAddress(), amount);

      await expect(
        yellowSettlement.connect(owner).settleSession(1, sessionId, amount)
      ).to.be.revertedWith("Session already settled");
    });
  });
});
