import Vue from 'vue';
import VueRouter from 'vue-router';

/*使用路由*/
Vue.use(VueRouter);

import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Welcome from '@/pages/Welcome';
import Users from '@/pages/user/Users';
import Rights from '@/pages/power/Rights';
import Roles from '@/pages/power/Roles';
import Goods from '@/pages/goods/Goods';
import Categories from '@/pages/goods/Categories';
import Params from '@/pages/goods/Params';
import Orders from '@/pages/order/Orders';
import Reports from '@/pages/Statistics/Reports';
import Add from '@/pages/goods/Add';

const router = new VueRouter({
    routes: [
        {
            /*访问主页面时, 重定向到登录页面*/
            path: '/',
            redirect: '/login'
        },
        {
            name: 'login',
            path: '/login',
            component: Login,
            meta: { isAuth: false, title: '登录' }
        },
        {
            name: 'home',
            path: '/home',
            component: Home,
            meta: { isAuth: true, title: '主页' },
            redirect: '/home/welcome',
            children: [
                {
                    name: 'welcome',
                    path: 'welcome',
                    component: Welcome,
                    meta: { isAuth: true, title: '欢迎' }
                },
                {
                    name: 'users',
                    path: 'users',
                    component: Users,
                    meta: { isAuth: true, title: '用户列表' }
                },
                {
                    name: 'rights',
                    path: 'rights',
                    component: Rights,
                    meta: { isAuth: true, title: '权限列表' }
                },
                {
                    name: 'roles',
                    path: 'roles',
                    component: Roles,
                    meta: { isAuth: true, title: '角色权限' }
                },
                {
                    name: 'goods',
                    path: 'goods',
                    component: Goods,
                    meta: { isAuth: true, title: '商品列表' }
                },
                {
                    name: 'add',
                    path: 'add',
                    component: Add,
                    meta: { isAuth: true, title: '添加商品' }
                },
                {
                    name: 'categories',
                    path: 'categories',
                    component: Categories,
                    meta: { isAuth: true, title: '商品分类' }
                },
                {
                    name: 'params',
                    path: 'params',
                    component: Params,
                    meta: { isAuth: true, title: '分类参数' }
                },
                {
                    name: 'orders',
                    path: 'orders',
                    component: Orders,
                    meta: { isAuth: true, title: '订单管理' }
                },
                {
                    name: 'reports',
                    path: 'reports',
                    component: Reports,
                    meta: { isAuth: true, title: '数据报表' }
                }
            ]
        }
    ]
});

/*全局前置路由守卫: 初始化时调用, 每次路由切换之前被调用*/
router.beforeEach((to, from, next) => {
    /*判断是否需要鉴权*/
    if (to.meta.isAuth) {
        if (sessionStorage.getItem('token')) {
            next();
        } else {
            alert('请先登录');
            next('/login');
        }
    } else {
        next();
    }
});

/*全局后置路由守卫: 初始化时调用, 每次路由切换之后被调用*/
router.afterEach((to, from) => {
    document.title = to.meta.title;
});

export default router;