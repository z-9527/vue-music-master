import jsonp from '@/assets/js/jsonp.js'

export default function getAlbumData(mid){
	const url='https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg'

	let data={
		albummid:mid,
		uin: 0,
		format: 'json',
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'h5',
		needNewCode: 1,
	}
	return jsonp(url,data,{param:'jsonpCallback'})
}