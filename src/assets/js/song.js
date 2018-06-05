export default class Song{
	constructor({id, mid, singername, songname, albumname, duration, img, url}){
		this.id = id
		this.mid = mid
		this.singername = singername
		this.songname = songname
		this.albumname = albumname
		this.duration = duration
		this.img = img
		this.url = url
	}
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singername: filterSinger(musicData.singer),
    songname: musicData.songname,
    albumname: musicData.albumname,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}