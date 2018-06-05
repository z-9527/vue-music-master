<template>
    <div id="app">
        <index-header></index-header>
        <router-view></router-view>
        <player></player>
    </div>
</template>
<script>
    import IndexHeader from '@/components/IndexHeader'
    import Player from '@/components/Player'
    import '@/assets/css/reset.css'
    import '@/assets/font/iconfont.css'


    export default {
        components:{
            IndexHeader,
            Player
        }
    }
</script>
<style>
     /*隐藏滚动条*/
    ::-webkit-scrollbar{
        display:none;
    }
</style>