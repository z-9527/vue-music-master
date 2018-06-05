import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from '@/page/Recommend'
// import Singerlist from '@/page/Singerlist'
// import Toplists from '@/page/Toplists'
// import Search from '@/page/Search'
// import Singer from '@/page/Singer'
// import Album from '@/page/Album'
// import Toplist from '@/page/Toplist'
// import HotSongSheet from '@/page/HotSongSheet'
// import User from '@/page/User'

const Recommend = (resolve) => {
  import('@/page/Recommend').then((module) => {
    resolve(module)
  })
}

const Singerlist = (resolve) => {
  import('@/page/Singerlist').then((module) => {
    resolve(module)
  })
}

const Toplists = (resolve) => {
  import('@/page/Toplists').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('@/page/Search').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('@/page/Singer').then((module) => {
    resolve(module)
  })
}

const Album = (resolve) => {
  import('@/page/Album').then((module) => {
    resolve(module)
  })
}

const Toplist = (resolve) => {
  import('@/page/Toplist').then((module) => {
    resolve(module)
  })
}

const HotSongSheet = (resolve) => {
  import('@/page/HotSongSheet').then((module) => {
    resolve(module)
  })
}

const User = (resolve) => {
  import('@/page/User').then((module) => {
    resolve(module)
  })
}


Vue.use(Router)

export default new Router({
    routes: [
        {
            path:'/',
            redirect:'/recommend'
        },
        {
            path:'/recommend',
            component:Recommend,
            children:[
                {
                    path:'/recommend/songsheet',
                    component:HotSongSheet
                }
            ]
        },
        {
            path:'/singerlist',
            component:Singerlist,
            children:[
                {
                    path:'/singerlist/singer/:id',
                    component:Singer
                }
            ]
        },
        {
            path:'/toplists',
            component:Toplists,
            children:[
                {
                    path:'/toplists/toplist/:id',
                    component:Toplist
                }
            ]
        },
        {
            path:'/search',
            component:Search
        },
        {
            path:'/album/:id',
            component:Album
        },
        {
            path:'/user',
            component:User
        },
    ]

})
