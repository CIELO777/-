export const pullMixin = {
	data() {
		return {
			count: 0,
			isLoading: false,
			successtext: ""
		}
	},
	methods: {
		onRefresh() {
			console.log(231231);
		},
	},
	created() {
		console.log('1231312');

	}
}