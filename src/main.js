// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

//引入mint-ui
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/css/my-mint.css'  //修改mint-ui的默认样式
Vue.use(MintUI,{
	lazyload:{
		loading:require('@/assets/img/lazy1.jpg')
	}
})

import '@/assets/css/my-mint.css'  //修改mint-ui的默认样式

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
