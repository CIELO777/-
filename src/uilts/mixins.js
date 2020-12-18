export const ScorllMixin = {
	data() {
		return {
			current: 1,
			scrollTop: 0,
			windowHeight: 0,
			scrollHeight: 0,
		}
	},
	mounted() {
		window.onscroll = () => {
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
			var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
			if (scrollTop + windowHeight >= scrollHeight && scrollTop > 20) {
				console.log('到底了');
				this.$store.commit("SoundCurNum", "follow")
			}
		}
		this.current = 1;
	},
	beforeDestroy() {
		this.$store.commit("ClearCurNum", "follow");
		this.$store.commit("ClearCurNum", "order");
		this.$store.commit("ClearCurNum", "schedule");
		this.$store.commit("ClearCurNum", "radar");
		this.$store.commit("ClearCurNum", "operating");
		this.$store.commit("ClearCurNum", "home");
		this.$store.commit("ClearCurNum", "common");
		this.$store.commit("ClearCurNum", "highseas");
		this.$store.commit("ClearCurNum", "filter");

	},


}