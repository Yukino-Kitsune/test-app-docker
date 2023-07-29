import Vue from 'vue'
import Vuex from 'vuex'

//Main pages
import App from './views/app.vue'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})

const app = new Vue({
    el: '#app',
    components: { App },
    store: store
});


