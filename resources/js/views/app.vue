<template>
    <div class="container p-3">
        <div>
            <div class="justify-content-end">
                <div class="dropdown m-1">
                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Сортировать
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" @click.prevent="sort( 'idASC')">Id &#9650</a></li>
                        <li><a class="dropdown-item" @click.prevent="sort('idDESC')">Id &#9660</a></li>
                        <li><a class="dropdown-item" @click.prevent="sort('dateASC')">Date &#9650</a></li>
                        <li><a class="dropdown-item" @click.prevent="sort('dateDESC')">Date &#9660</a></li>
                    </ul>
                </div>
            </div>
            <div class="card bg-light rounded my-3" v-for="comment in paginated">
                <div class="d-flex justify-content-between">
                    <div class="d-flex">
                        <h5 class="mx-1">#{{comment.id}}</h5>
                        <h4 class="mx-1">{{comment.name}}</h4>
                    </div>
                    <div class="d-flex">
                        <a class="btn btn-danger mx-1" @click.prevent="deleteOne(comment.id)">Удалить</a>
                    </div>
                </div>
                <div class="border-top border-bottom">
                    <p class="mx-4">{{ comment.text }}</p>
                </div>
                <div>
                    <h6 class="mx-2">{{comment.date}}</h6>
                </div>
            </div>
        </div>
        <div class="my-2">
            <nav>
                <ul class="pagination">
                    <li class="page-item"><button class="page-link" @click="prevPage" :disabled="currPage===0">Prev</button></li>
                    <li class="page-item mx-1"><input type="number" class="form-control page-control" v-model="currPage"></li>
                    <li class="page-item"><button class="page-link" @click="nextPage" :disabled="currPage=== pages">Next</button></li>
                    <li class="page-item"><h6 class="m-2">{{currPage}} - {{pages}}</h6></li>
                </ul>
            </nav>
        </div>
        <div class="border-top">
            <div v-if="errors.length">
                <div v-for="error in errors">
                    <div class="alert alert-danger">{{error}}</div>
                </div>
            </div>
            <form>
                <div>
                    <label for="name" class="form-label">Имя</label>
                    <input type="text" class="form-control name-control" id="name" name="name" v-model="name" required>
                </div>
                <div>
                    <label for="text" class="form-label">Комментарий</label>
                    <textarea type="text" class="form-control comment-control" id="text" name="text" v-model="text" required></textarea>
                </div>
                <div class="my-3">
                    <label for="date">Дата публикации</label>
                    <date-picker id="date" v-model="datetime" type="datetime" :lang="ru"></date-picker>
                </div>
                <div>
                    <button class="btn btn-primary" @click.prevent="insertOne">Отправить</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import 'vue2-datepicker/index.css';
import {mapActions} from "vuex";
import ru from "vue2-datepicker/locale/es/ru";

const default_layout = "default";


export default {
    components: {DatePicker},
    computed: {
        ru() {
            return ru
        },
        paginated() {return this.$store.state.paginatedComments;},
        pages() { return this.$store.state.pagesCount;},
        currPage: {
            get(){
                return this.$store.state.currentPage;
            },
            set(newPage) {
                if(newPage >= 0 && newPage <= this.pages) {
                    this.$store.dispatch('setPage', newPage);
                }
            }
        }
    },
    data() {
        return {
            datetime: null,
            name: null,
            text: null,
            errors: [],
        }
    },
    mounted() {
        this.$store.dispatch('getComments');
    },
    methods: {
        ...mapActions({
           sort: 'sortComments'
        }),
        insertOne: function () {
            this.errors = [];
            if(!this.name) {
                this.errors.push('Введите имя');
            }
            if(!this.text) {
                this.errors.push('Введите комментарий');
            }
            if(!this.datetime) {
                this.errors.push('Укажите дату');
            }
            if(this.errors.length) {
                return;
            }
            const data = JSON.stringify({
                name: this.name,
                text: this.text,
                date: this.datetime
            })
            this.$store.dispatch('insertOne', data);
            this.name = '';
            this.text = '';
            this.datetime = '';
        },
        deleteOne(id) {
            this.$store.dispatch('deleteOne', id);
        },
        nextPage: function () {
            this.$store.dispatch('setPage', ++this.currPage);
        },
        prevPage() {
            this.$store.dispatch('setPage', --this.currPage);
        }
    }
};
</script>
<style lang="css" scoped>
@import "../../css/app.css";
</style>
