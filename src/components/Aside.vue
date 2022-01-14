<template>
    <div>
        <!--侧边菜单-->
        <el-menu class='aside_menu'
                 background-color='#333744'
                 text-color='#fff'
                 :collapse='isCollapse'
                 :collapse-transition='false'
                 :default-active='this.$route.name'
                 unique-opened
                 router>

            <!--一级菜单-->
            <!--两层for循环遍历出菜单-->
            <el-submenu :index='String(item.id)' v-for='item in menuList' :key='item.id'>
                <template slot='title'>
                    <i :class='menuIconObj[item.id]' class=' aside_icon'></i>
                    <span>{{ item.authName }}</span>
                </template>

                <!--二级菜单-->
                <!--index值为跳转路径-->
                <el-menu-item :index='subItem.path' v-for='subItem in item.children' :key='subItem.id'>
                    <i class='el-icon-menu aside_icon'></i>
                    {{ subItem.authName }}
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'Aside',
    data() {
        return {
            menuList: [],
            /*利用id作为键, 图标作为值, 来给每个菜单绑定不同的样式*/
            menuIconObj: {
                '125': 'el-icon-user-solid',
                '103': 'el-icon-s-management',
                '101': 'el-icon-s-shop',
                '102': 'el-icon-s-order',
                '145': 'el-icon-s-marketing'
            }
        };
    },
    props: ['isCollapse'],
    methods: {
        async getMenuList() {
            const { data: res } = await this.$http.get('menus');

            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg);
            }

            this.menuList = res.data;
            console.log(res);
        }
    },
    mounted() {
        this.getMenuList();
    }
};
</script>

<style scoped>
/*侧边菜单使的边框线使看起来不平*/
.aside_menu {
    border: none;
}

.aside_icon {
    color: #ffffff;

    /*使用了:class之后, 侧边菜单的icon会变样, 所以加上下面5个, 使其element原生一样*/
    font-size: 18px;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    vertical-align: middle;
}
</style>