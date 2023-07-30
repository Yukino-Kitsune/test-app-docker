import Vue from 'vue'
import Vuex from 'vuex'

//Main pages
import App from './views/app.vue'
import axios from "axios";

Vue.use(Vuex);
Vue.config.devtools = true;

export const store = new Vuex.Store({
    state: {
        comments: [],
        currentPage: 1,
        pagesCount: null,
        pageSize: 3,
        paginatedComments: []
    },
    mutations: {
        insertComment(state, comment) {
            state.comments.push(comment);
        },
        deleteComment(state, id) {
            state.comments = state.comments.filter((comment) => {
                if(comment.id !== id) return comment;
            })
        },
        pageCount(state) {
            state.pagesCount = Math.ceil(state.comments.length / state.pageSize) - 1;
        },
        paginate(state) {
            const start = state.currentPage * state.pageSize;
            const end = start + state.pageSize;
            state.paginatedComments = state.comments.slice(start, end);
        },
        updatePage(state, newPage) {
            state.currentPage = newPage;
        },
        sortByIdASC(state) {
            state.comments = state.comments.slice().sort(function (a, b) {
                return a.id - b.id;
            });
        },
        sortByIdDESC(state) {
            state.comments = state.comments.slice().sort(function (b, a) {
                return a.id - b.id;
            });
        },
        sortByDateASC(state) {
            state.comments = state.comments.slice().sort(function (a, b) {
                return new Date(a.date) - new Date(b.date);
            });
        },
        sortByDateDESC(state) {
            state.comments = state.comments.slice().sort(function (b, a) {
                return new Date(a.date) - new Date(b.date);
            });
        }
    },
    actions: {
        async getComments(state) {
            await axios
                .get('/api/comments')
                .then(response => (state.state.comments = response.data))
                .catch(error => {console.error(error)})
            state.dispatch('updatePagination');
        },
        async insertOne(state, comment) {
            await axios
                .post('/api/comments', comment,{headers:{"Content-Type" : "application/json"}})
                .then(response => {
                    if(response.status === 200){
                        state.commit('insertComment', response.data)
                    }
                })
                .catch(error => {console.error(error)})
            state.dispatch('updatePagination');
        },
        async deleteOne(state, id) {
            await axios
                .delete('/api/comments/'+id)
                .then(response => {
                    if(response.status === 200){
                        state.commit('deleteComment', id);
                        state.dispatch('updatePagination');
                    }
                })
                .catch(error => {console.error(error)})
        },
        updatePagination(state) {
            state.commit('pageCount');
            state.commit('paginate');
        },
        setPage(state, newPage) {
            state.commit('updatePage', newPage);
            state.dispatch('updatePagination');
        },
        sortComments(state, method) {
            switch (method) {
                case 'idASC':
                    state.commit('sortByIdASC');
                    state.dispatch('updatePagination');
                    break;
                case 'idDESC':
                    state.commit('sortByIdDESC');
                    state.dispatch('updatePagination');
                    break;
                case 'dateASC':
                    state.commit('sortByDateASC');
                    state.dispatch('updatePagination');
                    break;
                case 'dateDESC':
                    state.commit('sortByDateDESC');
                    state.dispatch('updatePagination');
                    break;
                default:
                    break;
            }
        }
    }
})

const app = new Vue({
    el: '#app',
    components: { App },
    store: store
});

