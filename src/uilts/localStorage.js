
const local = {}
/**
 * put 把数据放到本地存储
 * @param {*} key
 * @param {*} value
 */
local.set = function (key, value) {
	window.sessionStorage.setItem(key, JSON.stringify(value));
};

local.get = function (key) {
	return window.sessionStorage.getItem(key);
};
/**
 * get 获取本地存储数据
 * @param {*} key
 */
local.U = function () {
	var obj = window.sessionStorage.getItem('userinfo');
	if (obj && obj != 'undefined' && obj != 'null') {
		return JSON.parse(obj).id;
	}
	return '';
};

local.C = function () {
	var obj = window.sessionStorage.getItem('userinfo');
	if (obj && obj != 'undefined' && obj != 'null') {
		return JSON.parse(obj).bind_comp_id;
	}
	return '';
};

/**
 * remove 清除本地数据
 * @param {*} key
 */
local.remove = function (key) {
	if (key) {
		window.sessionStorage.removeItem(key);
	} else {
		for (var i in arguments) {
			window.sessionStorage.removeItem(arguments[i]);
		}
	}
};


/**
 * seek 检查本地是否有值
 * @param {*} key
 */
local.seek = function (name) {
	if (!name) return;
	return window.sessionStorage.hasOwnProperty(name)
}
export default local