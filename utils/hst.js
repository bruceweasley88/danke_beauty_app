// #ifdef APP-PLUS

export const getTokenBalance = (address) => {
	if (!address) {
		return Promise.resolve('0');
	}

	const webview = getApp().globalData.webview;
	if (!webview) {
		console.error('webview未初始化');
		return Promise.reject('webview未初始化');
	}

	webview.evalJS(`window.getTokenBalance('${address}')`);

	return new Promise((resolve, reject) => {
		const callback = (balance) => {
			resolve(balance);
		};

		uni.$once('onBalance', callback);

		setTimeout(() => {
			uni.$off('onBalance', callback);
			reject('获取余额超时');
		}, 3000);
	});
}

// #endif
