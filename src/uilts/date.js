// 1.时间戳转为日期标准字符串：2015-03-19
var formatDate = function (date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
};
// .js方法返回值：2015-03-19 12:00：00
var formatDateTime = function (date) {
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	var second = date.getSeconds();
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};
var yesterday = function getDay(num, str) { // 获取昨日日期：2015-03-19
	var today = new Date();
	var nowTime = today.getTime();
	var ms = 24 * 3600 * 1000 * num;
	today.setTime(parseInt(nowTime + ms));
	var oYear = today.getFullYear();
	var oMoth = (today.getMonth() + 1).toString();
	if (oMoth.length <= 1) oMoth = '0' + oMoth;
	var oDay = today.getDate().toString();
	if (oDay.length <= 1) oDay = '0' + oDay;
	return oYear + str + oMoth + str + oDay;
}
var lastSevent = function lastSevent(num) {
	var date1 = new Date();
	//今天时间
	var date2 = new Date(date1);
	date2.setDate(date1.getDate() + num);
	let Mon = date2.getMonth() + 1;
	let date = date2.getDate();
	if (Mon.toString().length == 1) {
		Mon = '0' + Mon
	};
	if (date.toString().length == 1) {
		date = '0' + date
	};
	//num是正数表示之后的时间，num负数表示之前的时间，0表示今天
	var time2 = date2.getFullYear() + "-" + Mon + "-" + date;
	return time2;
}

let getM = function getM() { // 上个月第一天、上个月最后一天、当月第一天、当天
	const date = new Date()
	const m = date.getMonth() + 1
	const y = date.getFullYear()
	const d = date.getDate()
	const lastM = m > 1 ? m - 1 : 12
	const yOfLastM = lastM === 12 ? y - 1 : y
	const lastDayOfLastM = new Date(yOfLastM, lastM, 0).getDate()
	const addZero = n => n < 10 ? "0" + n : n
	return [
		`${yOfLastM}-${addZero(lastM)}-01`,
		`${yOfLastM}-${addZero(lastM)}-${addZero(lastDayOfLastM)}`,
		`${y}-${addZero(m)}-01`,
		`${y}-${addZero(m)}-${addZero(d)}`
	]
}
let month = function month() {
	var now = new Date(); //当前日期
	var nowMonth = now.getMonth(); //当前月
	var nowYear = now.getFullYear(); //当前年
	//本月的开始时间
	var monthStartDate = new Date(nowYear, nowMonth, 1);
	//本月的结束时间
	var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
	var timeStar = Date.parse(monthStartDate) / 1000;//s
	var timeend = Date.parse(monthEndDate) / 1000;//s
	return {
		timeStar: formatTime(timeStar, 'Y-M-D'),
		timeend: formatTime(timeend, 'Y-M-D')
	}
}
function formatTime(number, format) { // 时间戳转日期格式
	var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	var returnArr = [];
	var date = new Date(number * 1000);
	returnArr.push(date.getFullYear());
	returnArr.push(formatNumbers(date.getMonth() + 1));
	returnArr.push(formatNumbers(date.getDate()));
	returnArr.push(formatNumbers(date.getHours()));
	returnArr.push(formatNumbers(date.getMinutes()));
	returnArr.push(formatNumbers(date.getSeconds()));
	for (var i in returnArr) {
		format = format.replace(formateArr[i], returnArr[i]);
	}
	return format;
}

//数据转化  
function formatNumbers(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

let getCurrentDate = function getCurrentDate(format) {
	var now = new Date();
	var year = now.getFullYear(); //得到年份
	var month = now.getMonth(); //得到月份
	var date = now.getDate(); //得到日期
	var day = now.getDay(); //得到周几
	var hour = now.getHours(); //得到小时
	var minu = now.getMinutes(); //得到分钟
	var sec = now.getSeconds(); //得到秒
	month = month + 1;
	if (month < 10) month = "0" + month;
	if (date < 10) date = "0" + date;
	if (hour < 10) hour = "0" + hour;
	if (minu < 10) minu = "0" + minu;
	if (sec < 10) sec = "0" + sec;
	var time = "";
	//精确到天
	if (format == 1) {
		time = year + "-" + month + "-" + date;
	}
	//精确到分
	else if (format == 2) {
		time = year.toString() + month.toString() + date.toString() + hour.toString() + minu.toString() + sec
	}
	return time;
}
function getLastDay(year, month) {
	let new_year = year;
	let new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
	if (month > 12) {//如果当前大于12月，则年份转到下一年
		new_month -= 12;//月份减
		new_year++;//年份增
	}
	// 取当年当月对应的下个月的前一天，即当前月的最后一天
	let last_date = new Date(new_year, new_month, 0).getDate();
	return last_date;
}
function getFirstAndLastDay() {
	let now = new Date();
	let strLink = "-";
	let year = now.getFullYear();
	let month = now.getMonth() + 1;
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	let lastDay = getLastDay(year, month);
	let firstDate = year + strLink + month + strLink + '01';
	let lastDate = year + strLink + month + strLink + lastDay;
	let returnArr = [firstDate, lastDate];//以数组形式返回
	return returnArr;
}
let timestampToTime = function timestampToTime(timestamp) { // 时间戳转换 
	var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let Y = date.getFullYear() + '-';
	let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	let D = date.getDate() + ' ';
	let h = date.getHours() + ':';
	let m = date.getMinutes() + ':';
	let s = date.getSeconds();
	return Y + M + D;
}
// 获取即当月的第一天和最后一天
export {
	formatDate,
	formatDateTime,
	yesterday,
	lastSevent,
	month,
	getM,
	getCurrentDate,
	getFirstAndLastDay,
	timestampToTime
}
