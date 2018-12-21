<template>
    <div id="Boards">
        <div class="router-link">
            <ul class="list" v-for="board in boards" :key="board.id">
                <li class="li"><router-link :to="{ name : 'posts', params:{ id: board.id }}" >{{ board.name }}</router-link></li>
            </ul>
        </div>
        <router-view/>
    </div>
</template>

<script>
import BoardService from '../services/boards';
import Posts from './PostsList.vue';

export default {
    name: 'boards',
    data() {
        return {
        }
    },
    computed:{
        boards() {
            return this.$store.state.boards;
        }
    },
    methods: {
        async test(){
        }
    }
}
</script>

<style>
#Boards{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
}
/*.list{
    margin-left: auto;
    margin-right: auto;
    display: table;
}
.li{
    text-align: center;
    float: left;
    *float: none;
    *display: inline;
    *zoom: 1;
}*/
</style>
