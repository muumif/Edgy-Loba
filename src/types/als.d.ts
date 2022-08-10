export interface BitlyData {
      created_at: string,
	id: string,
	link: string
	custom_bitlinks: Array,
	long_url: string,
	archived: boolean,
	tags: Array,
	deeplinks: Array,
	references: {
		group: string
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
	["EA_novafusion"]: {
		["EU-West"]: {
			Status: string,
			HTTPCode: 200,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["EU-East"]: {
			Status: string,
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-West"]: {
			Status: string,
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-Central"]: {
			Status: string,
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["US-East"]: {
			Status: string,
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["SouthAmerica"]: {
			Status: string,
			HTTPCode: number,
			ResponseTime: number,
			QueryTimestamp: number
		},
		["Asia"]: {
			Status: string,
			HTTPCode: number,
			ResponseTime: number,
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