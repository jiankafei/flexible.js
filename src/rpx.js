/**
 * 设置根字体大小
 * 自己添加meta标签
 * <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
 * G	{Element}	window，不要修改
 * ds	{number}	设计稿大小，默认750
 * dpx	{number}	设计稿大小对应的根字体大小，默认75
 */
;(function(G, ds, dpx){
	'use strict';
	ds = ds || 750; // 设计稿大小
	dpx = dpx || 75; // 设计稿大小对应的根字体大小

	const doc = G.document,
		de = doc.documentElement,
		maxW = 540; // 最大字体宽度
	let tid = null, // timerId
		pcStyleEle = null; //给pc添加的样式元素

	// 设置设备类型
	setDeviceType();

	// 改变窗口
	G.addEventListener('resize', tiemoutFn, false);
	G.addEventListener('pageshow', function (ev) {
		ev.persisted && tiemoutFn(); // 页面隐藏保存在 back-forward cache 中再显示时，才需要执行
	}, false);
	// 屏幕旋转
	G.orientation !== undefined && G.addEventListener('orientationchange', tiemoutFn, false);
	// 事件回调
	function tiemoutFn(){
		clearTimeout(tid);
		tid = G.setTimeout(function(){
			setDeviceType();
			setrpx();
		}, 300);
	};

	// 执行转换
	setrpx();
	// 设置根字体大小
	function setrpx(){
		let w, rpx;
		w = de.getBoundingClientRect().width;
		w > maxW && (w = maxW);
		rpx = G.parseFloat(w * dpx / ds);
		de.style.fontSize = rpx + 'px';
	};
	// 添加设备类型
	function setDeviceType(){
		const ua = G.navigator.appVersion,
			dt = deviceType(ua);
		de.classList.remove('pc', 'ios', 'android', 'wp');
		de.classList.add(dt);
		de.dataset.dpr = Math.floor(window.devicePixelRatio);
		// pc上为html元素添加特定样式
		dt === 'pc' && pcStyleEle === null && (pcStyleEle = addStylesheetRules('.pc ::-webkit-scrollbar {display: none!important;}.pc,.pc .fixed {margin-left: auto!important;margin-right: auto!important;width: 480px!important;}.pc .fixed{position: fixed!important;left: 0!important;right: 0!important;}'));
	}
	// 设备检测
	function deviceType(ua){
		let dt = 'pc';
		/(?:iPhone|iPod|iPad)/i.test(ua) ? dt = 'ios' : /(?:Android)/i.test(ua) ? dt = 'android' : /(?:Windows\sPhone)/i.test(ua) ? dt = 'wp' : dt = 'pc';
		return dt;
	};
	// 添加css规则
	function addStylesheetRules(css) {
		var head = de.firstElementChild,
			el = doc.createElement('style');
		el.type = 'text/css';
		el.styleSheet && el.styleSheet.cssText ? el.styleSheet.cssText = css : el.appendChild(doc.createTextNode(css));
		head.appendChild(el);
		return el;
	};
})(window);
