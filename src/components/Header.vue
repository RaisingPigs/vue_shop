<template>
    <el-row class='header_row' type='flex' justify='space-between'>
        <div class='header_logo' @click='toWelcome'>
            <img src='../assets/logo.png' alt='后台管理系统'>
            <span>后台管理系统</span>
        </div>
        <div class='header_userInfo'>
            <el-avatar class='head_portrait' :size='40' :src='headPortrait'></el-avatar>
            <el-dropdown trigger='click'>
                    <span class='el-dropdown-link'>
                        {{ username }}
                        <i class='el-icon-arrow-down el-icon--right'></i>
                    </span>
                <el-dropdown-menu slot='dropdown'>
                    <el-dropdown-item>个人信息</el-dropdown-item>
                    <el-dropdown-item>修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native='logout'>退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </el-row>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            headPortrait: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            username: '用户名'
        }
    },
    methods: {
        toWelcome() {
            this.$router.push('/home/welcome')
        },
        logout() {
            sessionStorage.removeItem('token')
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>
.header_row {
    height: 100%;
    color: #fff;
    padding: 5px;
}

.header_row .header_logo {
    display: flex;
    align-items: center;
    transition: 0.5s;
}

.header_row .header_logo:hover {
    cursor: pointer;
    text-shadow: 0 0 2px #ffffff;
    transform: scale(1.02, 1.02);
}

.header_row .header_logo > img {
    width: 45px;
    height: 45px;
}

.header_row .header_logo > span {
    font-size: 25px;
    font-weight: 600;
    margin-left: 5px;
}

.header_row > .header_userInfo {
    display: flex;
    align-items: center;
}

.header_row > .header_userInfo > .head_portrait {
    margin-right: 10px;
}

.header_row > .header_userInfo .el-dropdown-link {
    cursor: pointer;
    color: #fff;
}

.header_row > .header_userInfo .el-icon-arrow-down {
    font-size: 12px;
}
</style>