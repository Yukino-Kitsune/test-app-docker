<template>
    <div class="container p-3">
        <div class="card bg-light rounded my-3" v-for="comment in comments">
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
import th from "vue2-datepicker/locale/es/th";

const default_layout = "default";


export default {
    components: {DatePicker},
    computed: {},
    data() {
        return {
            comments: null,
            datetime: null,
            name: null,
            text: null,
        }
    },
    mounted() {
        this.getAll();
    },
    methods: {
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
                        this.getAll();
                    }
                })
                .catch(error => {console.log(error)})

        },
        getAll: function () {
            axios
                .get('/api/comments')
                .then(response => (this.comments = response.data))
        },
        deleteOne(id) {
            axios
                .delete('/api/comments/'+id)
                .then(response => {
                    if(response.status === 200){
                    this.getAll();
                }
                })
                .catch(error => {console.log(error)})
        }
    }
};
</script>
<style lang="css" scoped>
@import "../../css/app.css";
</style>
