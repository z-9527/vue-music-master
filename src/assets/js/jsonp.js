import originJsonp from 'jsonp'
 
 //data对象转化为字符串后拼接到url后面去
export default function jsonp(url,data,option){
	url+=(url.indexOf('?')<0 ? '?': '&')+query(data);

	return new Promise((resolve,reject)=>{
		originJsonp(url,option,(err,data)=>{
			if (!err) {
				resolve(data)
			}else{
				reject(err)
			}
		})
	})
}


function query(data){
	var queryStr='';
	for(var [key,value] of Object.entries(data)){
		queryStr+=`&${key}=${value}`;
	}
	return queryStr?queryStr.substring(1):'';
}