import jsonp from '@/assets/js/jsonp.js'

export function getRecommendData(){
	const url="https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
	let data={
		format: "json",
		inCharset: "utf-8",
		outCharset: "utf-8",
		notice: 0,
		platform: "h5",
		needNewCode: 1,
	}
	return jsonp(url,data,{param:"jsonpCallback"})
}

export function getHotSongSheet(id){
	const url = "http://ustbhuangyi.com/music/api/getCdInfo"
	let data = {
		g_tk: 1928093487,
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0,
		format: 'json',
		disstid: 4024171742,
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		platform: 'yqq',
		hostUin: 0,
		needNewCode: 0,
	}
	return jsonp(url,data,{
		param:"jsonpCallback",
		prefix: "playlistinfoCallback"
	})
}