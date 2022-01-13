import Vue from 'vue';
import App from './App.vue';

/*router.js中已经引入并使用了VueRooter, 所以这里只需要引入rooter.js即可*/
import router from '@/router/rooter';
/*引入全局css*/
import '@/assets/css/global.css';
/*引入element-ui*/
import '@/plugins/element';
/*引入axios*/
import axios from "axios";

/*配置请求的根路径*/
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';
/*将axios挂载到Vue的原型对象上, 这样vm和vc就可以直接调用*/
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
