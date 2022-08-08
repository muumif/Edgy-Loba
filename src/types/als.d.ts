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