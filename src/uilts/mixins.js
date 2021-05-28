export const ScorllMixin = {
	data() {
		return {
			current: 1,
			scrollTop: 0,
			windowHeight: 0,
			scrollHeight: 0,
			startY: '',    //保存touch时的Y坐标
			moveDistance: 0,    //保存向下滑动的距离
			moveState: 0,        //开始滑动到结束后状态的变化 0:下拉即可刷新 1:释放即可刷新 2:加载中
			duration: 0        //动画持续时间，0就是没有动画
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
	methods: {
		touchStart(e) {
			this.duration = 90 // 关闭动画
			this.moveDistance = 0 // 滑动距离归0
			this.startY = e.targetTouches[0].clientY  // 获得开始Y坐标
		},
		touchMove(e) {
			let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
			//首先判断我们有没有滚动条，如果有，我们下拉刷新就不能启用。
			if (scrollTop > 0) return;
			let move = e.targetTouches[0].clientY - this.startY;
			//判断手指滑动的距离，只有为正数才代表用户下拉了。
			if (move > 0) {
				//阻止默认事件，在微信浏览器中尤为有用，至于为什么，你去试就知道了。
				e.preventDefault();
				//增加滑动阻力的感觉
				this.moveDistance = Math.pow(move, 0.83);
				if (this.moveDistance > 50) {
					//如果滑动距离大于50 那我就告诉你，释放即可刷新
					if (this.moveState === 1) return;
					this.moveState = 1;
				} else {
					//否则 恢复原样
					if (this.moveState === 0) return
					this.moveState = 0
				}
			}
		},
		touchEnd(e) {
			// 只要手指拿开，我都需要加上结束时的动画，这里为300ms
			this.duration = 300
			if (this.moveDistance > 50) {
				//这里逻辑跟touchMove一样，但是需要真的加载数据了，那moveState变为2 所以加载动画在这出现
				this.moveState = 2
				//因为还没加载完，我得让加载动画显示着，所以这里移动距离为50
				this.moveDistance = 50
				this.$emit("pullRefresf")
				setTimeout(() => {
					this.moveState = 0; // 改变状态;
					this.moveDistance = 0; // 清0 
				}, 1500)
				// this.$emit('refresh', () => {
				//   //这里就是成功后的回调了，如果该函数被调用，那就以为着加载数据完成，所以状态要回到0，当然需要在父组件调用。
				//   this.moveState = 0
				// })
			} else {
				//否则 给我老老实实恢复原样
				this.moveDistance = 0
			}
		},
		pullRef() { // 触发父组件的下拉刷新
		}
	},
	computed: {
		style() {
			return {
				transition: `${this.duration}ms`,
				transform: `translate3d(0,${this.moveDistance}px, 0)`,
			}
		}
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