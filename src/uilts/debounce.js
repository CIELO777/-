
/**
 * 函数防抖
 */
var debounce = function debounce(fn, delay) {
	// 记录上一次的延时器
	var timer = null;
	var delay = delay || 200;
	return function () {
		var args = arguments;
		var that = this;
		// 清除上一次延时器
		clearTimeout(timer)
		timer = setTimeout(function () {
			fn.apply(that, args)
		}, delay);
	}
}

//  url 参数截取
var URLCut = function urlcut(url) {
	let theRequest = new Object()
	if (url.indexOf('?') != -1) {
		var str = url.substr(1) //substr()方法返回从参数值开始到结束的字符串；
		var strs = str.split('&')
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
		}
		return theRequest //{code:'1213',suiteId:'456',state:0} 返回格式;
	}
}
export {
	debounce,
	URLCut
}