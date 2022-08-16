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
