<template>
    <div class="container p-3">
<!--        <button class="btn btn-primary" @click.prevent="generateComms">Generate</button>-->
        <div class="card bg-light rounded my-3" v-for="comment in paginated">
            <div class="d-flex justify-content-between">
                <div class="d-flex">
                    <h4 class="mx-2">{{comment.name}}</h4>
                </div>
                <div class="d-flex">
                    <a class="btn btn-primary">#edit</a>
                    <a class="btn btn-danger mx-1" @click.prevent="deleteOne(comment.id)">#delete</a>
                </div>
            </div>
            <div class="border-top border-bottom">
                <p class="mx-4">{{ comment.text }}</p>
            </div>
            <div>
                <h6 class="mx-2">{{comment.date}}</h6>
            </div>
        </div>
        <div>
            <nav>
                <ul class="pagination">
                    <li class="page-item"><button class="page-link" @click="prevPage" :disabled="page===0">Prev</button></li>
                    <li class="page-item"><input type="text" class="form-control page-control" v-model="page"></li>
                    <li class="page-item"><button class="page-link" @click="nextPage" :disabled="page=== pageCount - 1">Next</button></li>
                </ul>
            </nav>
        </div>
        <div class="border-top">
            <form>
                <div>
                    <label for="name" class="form-label">Имя</label>
                    <input type="text" class="form-control name-control" id="name" name="name" v-model="name" required>
                </div>
                <div>
                    <label for="text" class="form-label">Комментарий</label>
                    <textarea type="text" class="form-control comment-control" id="text" name="text" v-model="text" required></textarea>
                </div>
                <div>
                    <label for="date">Дата публикации</label>
                    <date-picker id="date" v-model="datetime" type="datetime"></date-picker>
                </div>
                <div>
                    <button class="btn btn-primary" @click.prevent="insertOne">Отправить</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import DatePicker from "vue2-datepicker";
import 'vue2-datepicker/index.css';

const default_layout = "default";


export default {
    components: {DatePicker},
    props: {
        size: {
            type: Number,
            required: false,
            default: 3
        }
    },
    computed: {
        pageCount() {
            return Math.ceil(this.comments.length / this.size);
        },
        paginatedComments() {
            const start = this.page * this.size;
            const end = start + this.size;
            this.paginated = this.comments.slice(start, end);
        }
    },
    data() {
        return {
            comments: null,
            datetime: null,
            name: null,
            text: null,
            page: 0,
            paginated: null,
        }
    },
    mounted() {
        this.getAll();
    },
    methods: {
        sleep(milliseconds) {
            return new Promise((resolve) => setTimeout(resolve, milliseconds));
        },
        async generateComms() {
            for (let i = 0; i < 20; i++) { // При 50, начинает сыпать 429 ошибкой, при задержке в 500 мс
                await this.sleep(1000);
                axios
                    .get('https://my.api.mockaroo.com/comms486.json?key=96438750')
                    .then(response => {
                        axios
                            .post('/api/comments', response.data,{headers:{"Content-Type" : "application/json"}})
                            .then(response => {
                                if(response.status !== 200){
                                    console.error('Error insert generated row: '+ response.status);
                                }
                            })
                            .catch(error => {console.error(error)})
                    })
            }
        },
        insertOne: function (event) {
            const data = JSON.stringify({
                name: this.name,
                text: this.text,
                date: this.datetime
            })
            axios
                .post('/api/comments', data,{headers:{"Content-Type" : "application/json"}})
                .then(response => {
                    if(response.status === 200){
                        this.getAll(); // TODO Переделать
                    }
                })
                .catch(error => {console.error(error)})

        },
        getAll: function () {
            axios
                .get('/api/comments')
                .then(response => (this.comments = response.data))
                .catch(error => {console.error(error)})
        },
        deleteOne(id) {
            axios
                .delete('/api/comments/'+id)
                .then(response => {
                    if(response.status === 200){
                    this.getAll(); // TODO Переделать
                }
                })
                .catch(error => {console.error(error)})
        },
        nextPage: function () {
            this.page++;
            this.$forceUpdate(); // Не понимаю, почему не обновляется
        },
        prevPage() {
            this.page--;
            this.$forceUpdate();
        },
    }
};
</script>
<style lang="css" scoped>
@import "../../css/app.css";
</style>
