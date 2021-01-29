export const pullMixin = {
	data() {
		return {
			count: 0,
			isLoading: false,
			successtext:""
		}
	},
	methods: {
		onRefresh() {
			this.getList(1)
		},
	}
}