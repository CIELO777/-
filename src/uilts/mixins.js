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
			this.$store.commit("ScrollSave", scrollTop);
			// setTimeout(() => {
			if (scrollTop + windowHeight == scrollHeight && scrollTop > 15) {
				console.log('到底了',);
				this.$store.commit("SoundCurNum", "follow");
				// 记录scrollTop的位置，防止页面都scrolltop耦合
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
		// this.$store.commit("ClearCurNum", "home"); // 一级菜单不进行清除，因为从表单返回时候缓存了，所以不清空页数
		// this.$store.commit("ClearCurNum", "common"); // 一级菜单不进行清除，因为从表单返回时候缓存了，所以不清空页数
		// this.$store.commit("ClearCurNum", "highseas");
		this.$store.commit("ClearCurNum", "filter");

	},


}