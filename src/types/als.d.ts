interface Tracker {
	name: string,
	value: number,
	key: string,
	rank: {
		rankPos: number,
		topPercent: number
	},
	rankPlatformSpecific: {
		rankPos: number | "NOT_CALCULATED_YET",
		topPercent: number | "NOT_CALCULATED_YET"
	}
}

export interface currentSeasonData {
	info: {
		ID: number,
		Name: string,
		Split: 1 | 2
	},
	dates: {
		Start: number,
		Split: number,
		End: number
	}
}

export interface ALSUserData { // Missing new legend
		global: {
			name: string,
			uid: string,
			avatar: string,
			platform: "PC" | "X1" | "PS4" | "SWITCH",
			level: number,
			toNextLevelPercent: number,
			internalUpdateCount: number,
			bans: {
				isActive: boolean,
				remainingSeconds: number,
				last_banReason: string
			},
			rank: {
				rankScore: number,
				rankName: string,
				rankDiv: 0 | 1 | 2 | 3 | 4,
				ladderPosPlatform: number,
				rankImg: string,
				rankedSeason: string
			},
			arena: {
				rankScore: number,
				rankName: string,
				rankDiv: 0 | 1 | 2 | 3 | 4,
				ladderPosPlatform: number,
				rankImg: string,
				rankedSeason: string
			},
			battlepass: {
				level: number,
				history: {
					season1: number,
					season2: number,
					season3: number,
					season4: number,
					season5: number,
					season6: number,
					season7: number,
					season8: number,
					season9: number,
					season10: number,
					season11: number,
					season12: number,
					season13: number,
					season14: number
				}
			},
			badges: [
				{
					name: string,
					value: number
				},
			],
			levelPrestige: 0 | 1 | 2 | 3 | undefined
		},
		realtime: {
			lobbyState: "invite" | "open",
			isOnline: number,
			isInGame: number,
			canJoin: number,
			partyFull: number,
			selectedLegend: "Revenant" | "Crypto" | "Horizon" | "Gibraltar" | "Wattson" | "Fuse" | "Bangalore" | "Wraith" | "Octane" | "Bloodhound" | "Caustic" | "Lifeline" | "Pathfinder" | "Loba" | "Mirage" | "Rampart" | "Valkyrie" | "Seer" | "Ash" | "Mad Maggie" | "Vantage",
			currentState: "offline" | "inLobby" | "inMatch",
			currentStateSinceTimestamp: number,
			currentStateAsText: string
		},
		legends: {
			selected: {
				LegendName: "Revenant" | "Crypto" | "Horizon" | "Gibraltar" | "Wattson" | "Fuse" | "Bangalore" | "Wraith" | "Octane" | "Bloodhound" | "Caustic" | "Lifeline" | "Pathfinder" | "Loba" | "Mirage" | "Rampart" | "Valkyrie" | "Seer" | "Ash" | "Mad Maggie" | "Vantage",
				data: [
					Tracker
				] | undefined,
				gameInfo: {
					skin: string,
					skinRarity: "Common" | "Rare" | "Epic" | "Legendary",
					frame: string,
					frameRarity: "Common" | "Rare" | "Epic" | "Legendary",
					pose: string,
					poseRarity: "Common" | "Rare" | "Epic" | "Legendary" | "Heirloom",
					intro: string,
					introRarity: "Common" | "Rare" | "Epic" | "Legendary" | "Heirloom",
					badges: [
						{
							name: string,
							value: number,
							category: "Account Badges" | "Revenant" | "Crypto" | "Horizon" | "Gibraltar" | "Wattson" | "Fuse" | "Bangalore" | "Wraith" | "Octane" | "Bloodhound" | "Caustic" | "Lifeline" | "Pathfinder" | "Loba" | "Mirage" | "Rampart" | "Valkyrie" | "Seer" | "Ash" | "Mad Maggie" | "Vantage"
						},
					] | undefined
				},
				ImgAssets: {
					icon: string,
					banner: string
				},
			},
			all: {
				Global: {
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/global.png",
						banner: "https://api.mozambiquehe.re/assets/banners/global.jpg"
					}
				},
				Revenant: {
					data: [
						Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						] | undefined
					},
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/revenant.png",
						banner: "https://api.mozambiquehe.re/assets/banners/revenant.jpg"
					}
				},
				Crypto: {
					data: [
						{
							name: string,
							value: number,
							key: string,
							rank: {
								rankPos: number,
								topPercent: number
							},
							rankPlatformSpecific: {
								rankPos: number,
								topPercent: number
							}
						},
						{
							name: string,
							value: number,
							key: string,
							rank: {
								rankPos: number,
								topPercent: number
							},
							rankPlatformSpecific: {
								rankPos: number,
								topPercent: number
							}
						},
						{
							name: string,
							value: number,
							key: string,
							rank: {
								rankPos: number,
								topPercent: number
							},
							rankPlatformSpecific: {
								rankPos: number,
								topPercent: number
							}
						},
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						] | undefined
					},
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/crypto.png",
						banner: "https://api.mozambiquehe.re/assets/banners/crypto.jpg"
					}
				},
				Horizon: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						] | undefined
					},
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/horizon.png",
						banner: "https://api.mozambiquehe.re/assets/banners/horizon.jpg"
					}
				},
				Gibraltar: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						] | undefined
					},
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/gibraltar.png",
						banner: "https://api.mozambiquehe.re/assets/banners/gibraltar.jpg"
					}
				},
				Wattson: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						] | undefined
					},
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/wattson.png",
						banner: "https://api.mozambiquehe.re/assets/banners/wattson.jpg"
					}
				},
				Fuse: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						] | undefined
					},
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/fuse.png",
						banner: "https://api.mozambiquehe.re/assets/banners/fuse.jpg"
					}
				},
				Bangalore: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/bangalore.png",
						banner: "https://api.mozambiquehe.re/assets/banners/bangalore.jpg"
					}
				},
				Wraith: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/wraith.png",
						banner: "https://api.mozambiquehe.re/assets/banners/wraith.jpg"
					}
				},
				Octane: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/octane.png",
						banner: "https://api.mozambiquehe.re/assets/banners/octane.jpg"
					}
				},
				Bloodhound: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/bloodhound.png",
						banner: "https://api.mozambiquehe.re/assets/banners/bloodhound.jpg"
					}
				},
				Caustic: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/caustic.png",
						banner: "https://api.mozambiquehe.re/assets/banners/caustic.jpg"
					}
				},
				Lifeline: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/lifeline.png",
						banner: "https://api.mozambiquehe.re/assets/banners/lifeline.jpg"
					}
				},
				Pathfinder: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/pathfinder.png",
						banner: "https://api.mozambiquehe.re/assets/banners/pathfinder.jpg"
					}
				},
				Loba: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/loba.png",
						banner: "https://api.mozambiquehe.re/assets/banners/loba.jpg"
					}
				},
				Mirage: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/mirage.png",
						banner: "https://api.mozambiquehe.re/assets/banners/mirage.jpg"
					}
				},
				Rampart: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/rampart.png",
						banner: "https://api.mozambiquehe.re/assets/banners/rampart.jpg"
					}
				},
				Valkyrie: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/valkyrie.png",
						banner: "https://api.mozambiquehe.re/assets/banners/valkyrie.jpg"
					}
				},
				Seer: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/seer.png",
						banner: "https://api.mozambiquehe.re/assets/banners/seer.jpg"
					}
				},
				Ash: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/ash.png",
						banner: "https://api.mozambiquehe.re/assets/banners/ash.jpg"
					}
				},
				["Mad Maggie"]: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/mad maggie.png",
						banner: "https://api.mozambiquehe.re/assets/banners/mad maggie.jpg"
					}
				},
				Newcastle: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/newcastle.png",
						banner: "https://api.mozambiquehe.re/assets/banners/newcastle.jpg"
					}
				},
				Vantage: {
					data: [
Tracker
					] | undefined,
					gameInfo: {
						badges: [
								{
									name: string,
									value: number,
								},
						]
					} | undefined,
					ImgAssets: {
						icon: "https://api.mozambiquehe.re/assets/icons/vantage.png",
						banner: "https://api.mozambiquehe.re/assets/banners/vantage.jpg"
					}
				}
			}
		}
}

export interface CraftingData {
	bundle: string,
      start: number,
      end: number,
      startDate: string,
      endDate: string,
      bundleType: "daily" | "weekly" | "permanent",
      bundleContent: [
            {
                  item: string,
                  cost: number,
                  itemType: {
                        name: string,
                        rarity: "Common" | "Rare" | "Epic" | "Legendary",
                        asset: string,
                        rarityHex: string
                  }
            },
      ]
}

export interface DistributionData {
      name: string,
      color: string,
      totalCount: number,
}

export interface NewsData {
      title: string,
      link: string,
      img: string,
      short_desc: string,
}

export interface MapData {
	battle_royale: {
		current: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset: string,
			remainingSecs: number,
			remainingMins: number,
			remainingTimer: string
		},
		next: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset: string,
		}
	},
	arenas: {
		current: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset: string,
			remainingSecs: number,
			remainingMins: number,
			remainingTimer: string
		},
		next: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset: string
		}
	},
	ranked: {
		current: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset: string,
			remainingSecs: number,
			remainingMins: number,
			remainingTimer: string
		},
		next: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset: string
		}
	},
	arenasRanked: {
		current: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset: string,
			remainingSecs: 1483,
			remainingMins: 25,
			remainingTimer: string
		},
		next: {
			start: number,
			end: number,
			readableDate_start: string,
			readableDate_end: string,
			map: string,
			code: string,
			DurationInSecs: number,
			DurationInMinutes: number,
			asset:string
		}
	},
}

export interface StatusData {
	["Origin_login"]: {
		["EU-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["EU-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-Central"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["SouthAmerica"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Asia"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		}
	},
	["EA_novafusion"]: {
		["EU-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["EU-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-Central"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["SouthAmerica"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Asia"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		}
	}
	["EA_accounts"]: {
		["EU-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		},
		["EU-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		},
		["US-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		},
		["US-Central"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		},
		["US-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		},
		["SouthAmerica"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		},
		["Asia"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		}
	},
	["ApexOauth_Crossplay"]: {
		["EU-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number
			QueryTimestamp: number
		},
		["EU-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-West"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-Central"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-East"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["SouthAmerica"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Asia"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		}
	},
	["selfCoreTest"]: {
		["Status-website"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Stats-API"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Overflow-#1"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Overflow-#2"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Origin-API"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Playstation-API"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Xbox-API"]: {
			Status: "UP" | "SLOW" | "DOWN",
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		}
	},
	["otherPlatforms"]: {
		["Playstation-Network"]: {
			Status: "UP" | "SLOW" | "DOWN",
			QueryTimestamp: number
		},
		["Xbox-Live"]: {
			Status: "UP" | "SLOW" | "DOWN",
			QueryTimestamp: number
		}
	}
}

export interface PredatorData {
		RP: {
			PC: {
				foundRank: number,
				val: number,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			},
			PS4: {
				foundRank: number,
				val: number,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			},
			X1: {
				foundRank: number,
				val: number,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			},
			SWITCH: {
				foundRank: number,
				val: number,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			}
		},
		AP: {
			PC: {
				foundRank: number,
				val: 8000,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			},
			PS4: {
				foundRank: number,
				val: 8000,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			},
			X1: {
				foundRank: number,
				val: 8000,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			},
			SWITCH: {
				foundRank: number,
				val: 8000,
				uid: string,
				updateTimestamp: number,
				totalMastersAndPreds: number
			}
		}
}