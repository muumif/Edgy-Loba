const { expect } = require("chai");
const chaiAsPromised = require("chai-as-promised");

const { makeHelpEmbed } = require("../commands/help");
const { makeInfoEmbed } = require("../commands/info");
const { makeCraftingEmbed } = require("../commands/apexMisc/crafting");
const { makeMapEmbed } = require("../commands/apexMisc/map");
const { makeNewsEmbed } = require("../commands/apexMisc/news");
const { makePredatorEmbed } = require("../commands/apexMisc/predCap");
const { makeStatusEmbed } = require("../commands/apexMisc/status");
const { makeStoreEmbed } = require("../commands/apexMisc/store");
const { makeLinkEmbed } = require("../commands/userStats/link");
const { makeTopEmbed } = require("../commands/userStats/localTop");
const { makeStatsEmbed } = require("../commands/userStats/stats");
const { makeUnlinkEmbed } = require("../commands/userStats/unlink");

describe("commands", function() {
	describe("apexMisc commands", function() {
		describe("crafting command", function() {
			it("without args", async function() {
				return await makeCraftingEmbed().then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("Crafting Rotation");
					}
				});
			});
		});

		describe("map command", function() {
			it("without args", async function() {
				return await makeMapEmbed().then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("Map Rotation");
					}
				});
			});
		});

		/*
		describe("news command", function() {
			it("without args", async function() {
				return await makeNewsEmbed().then(async result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("Latest news");
					}
				});
			});
		});

		describe("predCap command", function() {
			it("without args", async function() {
				return await makePredatorEmbed().then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("Predator Cap");
					}
				});
			});
		});


		describe("status command", function() {
			it("without args", async function() {
				return await makeStatusEmbed().then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("Server Status");
					}
				});
			});
		});
		*/
		
		describe("store command", function() {
			it("without args", async function() {
				return await makeStoreEmbed().then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("Store");
					}
				});
			});
		});
	});

	describe("userStats commands", function() {
		describe("link command", function() {
			it("with already existing args", async function() {
				return await makeLinkEmbed("muumif", "pc", "684035492446339073", "438081715576242176").then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("Username already linked!");
					}
				});
			});

			it("with undefined name", async function() {
				return await makeLinkEmbed(undefined, undefined, "684035492446341473", "4380841245576242176").then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("No username given!");
					}
				});
			});

			it("with undefined platform", async function() {
				return await makeLinkEmbed("tester", undefined, "684035492446341473", "4380841245576242176").then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("No platform given!");
					}
				});
			});
		});

		describe("unlink command", function() {
			it ("without args", async function() {
				return await makeUnlinkEmbed("6840354924462411473", "43808414124576242176").then(result => {
					if (expect(result).to.be.a("Object")) {
						return expect(result.title).to.equal("You don't have any linked IGN-s!");
					}
				});
			});
		});
	});

	describe("help command", function() {
		it("without args", async function() {
			return await makeHelpEmbed().then(result => {
				if (expect(result).to.be.a("Object")) {
					return expect(result.title).to.equal("Help");
				}
			});
		});

		it("with args stats", async function() {
			return await makeHelpEmbed("stats").then(result => {
				if (expect(result).to.be.a("Object")) {
					return expect(result.title).to.equal("Help stats");
				}
			});
		});

		it("with args misc", async function() {
			return await makeHelpEmbed("misc").then(result => {
				if (expect(result).to.be.a("Object")) {
					return expect(result.title).to.equal("Help misc");
				}
			});
		});
	});

	describe("info command", function() {
		it("without args", async function() {
			return await makeInfoEmbed().then(result => {
				if (expect(result).to.be.a("Object")) {
					return expect(result.title).to.equal("Info");
				}
			});
		});
	});
});