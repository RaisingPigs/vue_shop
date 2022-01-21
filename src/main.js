import Vue from 'vue';
import App from './App.vue';

/*router.js中已经引入并使用了VueRooter, 所以这里只需要引入rooter.js即可*/
import router from '@/router/rooter';
/*引入全局css*/
import '@/assets/css/global.css';
/*引入element-ui*/
import '@/plugins/element';

/*引入axios*/
import axios from 'axios';
/*配置请求的根路径*/
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';
/*添加请求拦截器*/
axios.interceptors.request.use(
    (config) => {
        /*给请求头添加Authorization字段, 值为token*/
        config.headers.Authorization = sessionStorage.getItem('token');

        return config;
    }
);
/*将axios挂载到Vue的原型对象上, 这样vm和vc就可以直接调用*/
Vue.prototype.$http = axios;


/*引入day.js时间处理库*/
import dayjs from 'dayjs';
/*全局过滤器*/
Vue.filter('dateformat', function(originVal) {
    return dayjs(originVal).format('YYYY-MM-DD hh:mm:ss');
});


/*导入富文本编辑器*/
import VueQuillEditor from 'vue-quill-editor'
/*导入富文本编辑器样式*/
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
/*注册为全局可用组件*/
Vue.use(VueQuillEditor)


Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router
}).$mount('#app');
