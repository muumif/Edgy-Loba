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