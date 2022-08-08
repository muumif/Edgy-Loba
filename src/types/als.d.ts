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