<template>
  <el-container class='home_container'>
    <el-header class='home_header' height='70px'>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside class='home_aside' :width="isCollapse ? '64px' : '200px'">
        <!--侧边菜单的收起折叠按钮-->
        <div class='aside_toggle_btn' @click='toggleCollapse'>
          <i class='aside_icon'
             :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'">
          </i>
        </div>
        <Aside :is-collapse='isCollapse'></Aside>
      </el-aside>
      <el-main class='home_main'>
        <router-view></router-view>
      </el-main>
    </el-container>
    <el-footer class='home_footer' height='24px'>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Aside from '@/components/Aside'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    Aside
  },
  data() {
    return {
      isCollapse: false
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped>
.home_container {
  height: 100%;
}

.home_container > .home_header {
  background: #333744;
}

.home_container .home_aside {
  background: #333744;
  transition: 0.3s;
}

.home_container .home_main {
  background: #f5f5f5;
}

.home_container .home_footer {
  background: #000;
}

.aside_toggle_btn {
  background: #000;
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  color: #ffffff;
}
</style>