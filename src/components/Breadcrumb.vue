<template>
    <el-breadcrumb separator-class='el-icon-arrow-right'>
        <el-breadcrumb-item
            :to='{ path: navItem.navHref }'
            v-for='(navItem, index) in navList' :key='index'>
            {{ navItem.navName }}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'Breadcrumb',
    props: ['navList']
};
</script>

<style scoped>

</style>