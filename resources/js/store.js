import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        comments: [],
        currentPage: 0,
        pagesCount: null,
        pageSize: 3,
        paginatedComments: [],
        currentSort: 'idASC'
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
        async getComments(context) {
            await axios
                .get('/api/comments')
                .then(response => (context.state.comments = response.data))
                .catch(error => {console.error(error)})
            context.dispatch('sortComments', context.state.currentSort);
        },
        async insertOne(context, comment) {
            await axios
                .post('/api/comments', comment,{headers:{"Content-Type" : "application/json"}})
                .then(response => {
                    if(response.status === 200){
                        context.commit('insertComment', response.data)
                    }
                })
                .catch(error => {console.error(error)})
            context.dispatch('sortComments', context.state.currentSort);
        },
        async deleteOne(context, id) {
            await axios
                .delete('/api/comments/'+id)
                .then(response => {
                    if(response.status === 200){
                        context.commit('deleteComment', id);
                        context.dispatch('sortComments', context.state.currentSort);
                    }
                })
                .catch(error => {console.error(error)})
        },
        updatePagination(context) {
            context.commit('pageCount');
            context.commit('paginate');
        },
        setPage(context, newPage) {
            context.commit('updatePage', newPage);
            context.dispatch('updatePagination');
        },
        sortComments(context, method) {
            switch (method) {
                case 'idASC':
                    context.state.currentSort = 'idASC';
                    context.commit('sortByIdASC');
                    context.dispatch('updatePagination');
                    break;
                case 'idDESC':
                    context.state.currentSort = 'idDESC';
                    context.commit('sortByIdDESC');
                    context.dispatch('updatePagination');
                    break;
                case 'dateASC':
                    context.state.currentSort = 'dateASC';
                    context.commit('sortByDateASC');
                    context.dispatch('updatePagination');
                    break;
                case 'dateDESC':
                    context.state.currentSort = 'dateDESC';
                    context.commit('sortByDateDESC');
                    context.dispatch('updatePagination');
                    break;
                default:
                    break;
            }
        }
    }
})
