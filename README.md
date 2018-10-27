# music

项目预览地址：[仿制QQ音乐](https://zhangzhihao1996.github.io/vue-music-master/#/recommend)  
github地址：[项目的github地址](https://github.com/zhangZhiHao1996/vue-music-master)  
数据是线上抓取的，如果页面有问题，则是数据接口出现问题，需要重新找数据接口

自己是观看慕课网上面的一款vue课程做的音乐项目。  
慕课网地址:[全网稀缺Vue 2.0高级实战 独立开发专属音乐WebAPP](https://coding.imooc.com/class/107.html)  

<h3>技术栈</h3>

 * vue
 * vue-router
 * vuex
 * jsonp
 * audio
 * flex
 * mint-ui
 
自己首先是自己写逻辑，实在解决不了的就会观看视频和视频源码。  
通过整个项目，加深了自己对vue的理解和应用，如计算属性、watch、vue生命周期、过渡、列表渲染、状态管理、路由切换、前端通信等。  
总之收获很大，在学习vue文档时，那些概念没有实际的运用场景，就没有真正的理解透彻。  
<br/>

<h3>实现的功能</h3>

 - [x] 推荐歌单页、电台、歌手、搜素页面
 - [x] 线上抓取100名歌手信息
 - [x] 编写播放器组件（包括前进、后退、上一首、下一首、播放暂停等功能）
 - [x] 全页面播放（随机播放、顺序播放、单曲循环等模式切换）
 - [x] 搜索页面下拉获取更多数据
 - [x] localStorage存储用户播放历史和喜欢歌曲
 - [x] 加载loading
 - [x] 数据全是通过线上抓取,通过用promise对象封装jsonp进行跨域
 
 ![](https://github.com/zhangZhiHao1996/image-store/blob/master/vue-music-master/02.png)&emsp;
 ![](https://github.com/zhangZhiHao1996/image-store/blob/master/vue-music-master/04.png)&emsp;
 ![](https://github.com/zhangZhiHao1996/image-store/blob/master/vue-music-master/01.gif)
 <br/><br/>
 
<h3>项目的目录结构</h3>
<img src="https://github.com/zhangZhiHao1996/image-store/blob/master/vue-music-master/2018060520585074.png"/>
api存放获取后端数据的js<br/>
assets主要存放静态的img、js、font、css等<br/>
components主要存放公用组件<br/>
page主要存放路由跳转的组件<br/>
router存放路由<br/>
store存放状态管理<br/>
App.vue是项目根组件<br/>
min.js是项目入口文件<br/>
<br/>

<h3>遇到的问题</h3>

 1. 数据难以获取，电台数据和歌词数据目前无法处理跨域，其他都是通过jsonp封装成promise对象来实现跨域（如果数据接口不能用，以后还有重新抓取）  
 2. 自己本来想实现一个菜单滚动到顶部后就固定的功能（css提供了一种新的position:sticky 也可以实现类似的功能），但是移动端不能监听onscroll事件  
 3. 利用的mint-ui的图片懒加载，但是想实现不同页面运用不同的默认懒加载图片  
 4. 在手机上展开播放列表后，还可以滚动被覆盖的其他页面  
 5. 计算属性中不能用this.\$refs。因为计算属性在created阶段之后mounted之前执行，而this.\$refs在mounted之后才存在（生命周期还有很多地方需要理解）  
 6. 项目是用原生css来写的，以前并不觉得css预处理语言有什么优势，但我在写项目样式时，才发现样式复用率太低。每次都要获取父选择器，不能嵌套写，没有变量等等  
<br/>
<h3>最后</h3>
我是自学的vue，所以可能还存在很多问题，比如代码不够规范、逻辑不够清晰、组件复用不够等。  
但总的来说还是有进步。公司现在改用react做项目，最近又在学习react。  
如果觉得可以还是star鼓励一下。


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
