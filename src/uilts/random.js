function randomFrom(lowerValue, upperValue) {
	return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

module.exports = {
	randomFrom: randomFrom
}