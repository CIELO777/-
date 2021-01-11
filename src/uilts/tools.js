
import sha1 from './sha1';
import random from './random'
/**
  * 生成时间戳
  */
let generateTimeout = () => {
	return Date.parse(new Date()) + "";
}

/**
   * 生成随机数
   */
let generateNonce = () => {
	return random.randomFrom(100, 1000) + "";
}
/**
   * 生成签名
   */
let generateSignature3 = (...arg) => {
	let param = new Array();
	for (let i = 0; i < arg.length; i++) {
		param.push(arg[i]);
	}
	param.push("39c74162c41d455daf349fb4ea700cbd");
	param.sort();
	let paramStr = param.toString();
	let result = sha1.hex_sha1(paramStr.replace(/,/g, ""));
	return result;
}
let generateSignature4 = (...arg) => {
	let param = new Array();
	for (let i = 0; i < arg.length; i++) {
		param.push(arg[i]);
	}
	param.push("qX4YIljPxD2bZ6A1SsOUH8Gr9keLEWBNRw0g");
	param.sort();
	let paramStr = param.toString();
	let result = sha1.hex_sha1(paramStr.replace(/,/g, ""));
	return result;
}

let generateSignature = (...arg) => {
	let param = new Array();
	for (let i = 0; i < arg.length; i++) {
		param.push(arg[i]);
	}
	param.push("e11746cecff84a3f42c19d1e761ad52e");
	param.push(2);
	param.sort();
	let paramStr = param.toString();
	let result = sha1.hex_sha1(paramStr.replace(/,/g, ""));
	return result;
}

let generateSignature8 = (...arg) => {
	let param = new Array();
	for (let i = 0; i < arg.length; i++) {
		param.push(arg[i]);
	}
	param.push("a4132d61f1c28078d246ed0eb5c06282");
	param.sort();
	let paramStr = param.toString();
	let result = sha1.hex_sha1(paramStr.replace(/,/g, ""));
	return result;
}
let randomWord = (randomFlag, min, max) => {
	var str = '',
		range = min,
		pos = '',
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
	//随机产生
	if (randomFlag) {
		range = Math.round(Math.random() * (max - min)) + min;
	}
	for (var i = 0; i < range; i++) {
		pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos]
	}
	return str;
}
export {
	generateTimeout,
	generateNonce,
	generateSignature3,
	generateSignature4,
	generateSignature,
	randomWord,
	generateSignature8
};
