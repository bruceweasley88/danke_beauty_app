<script>
export default {
	onLaunch: function () {
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/* 全局字体定义 */
@font-face {
	font-family: 'AlibabaPuHuiTi';
	src: url('/static/Alibaba-PuHuiTi-Regular.otf') format('opentype');
	font-weight: normal;
	font-style: normal;
}

@font-face {
	font-family: 'AlibabaPuHuiTi';
	src: url('/static/Alibaba-PuHuiTi-Medium.otf') format('opentype');
	font-weight: 500;
	font-style: normal;
}

@font-face {
	font-family: 'AlibabaPuHuiTi';
	src: url('/static/Alibaba-PuHuiTi-Heavy.otf') format('opentype');
	font-weight: bold;
	font-style: normal;
}

/*每个页面公共css */
page {
	font-family: 'AlibabaPuHuiTi', sans-serif;
	background: linear-gradient(180deg, #A1FFE5 0%, #DBFFE5 28.37%, #F3FFF6 50.48%, #FFF 72.6%, #FFF 100%);
	background-attachment: fixed;
	/* 固定背景，滚动时保持不变 */
	min-height: 100%;
}

.click-active {
	transition: transform 0.2s ease, opacity 0.2s ease;
}

.click-active:active {
	transform: scale(1.05);
	opacity: 0.8;
}


.click-active-max {
	transition: transform 0.2s ease, opacity 0.2s ease;
}

.click-active-max:active {
	transform: scale(1.2);
	opacity: 0.6;
}
</style>
