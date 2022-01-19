<template>
    <div>
        <!--头部面包屑导航-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--权限列表-->
        <el-card>
            <!--权限列表头部文字-->
            <el-row slot='header' class='card_title'>
                <span>权限列表</span>
            </el-row>

            <!--权限表格-->
            <el-table
                :data='rightsList'
                style='width: 100%'
                border
                stripe>
                <el-table-column
                    type='index'
                    label='#'
                    width='200'
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop='authName'
                    label='权限名'
                    width='310'
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop='path'
                    label='路径'
                    width='310'
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop='level'
                    label='权限等级'
                    align='center'>
                    <template v-slot='scope'>
                        <el-tag v-if='scope.row.level==="0"' type='primary'>
                            一级
                        </el-tag>
                        <el-tag v-else-if='scope.row.level==="1"' type='success'>
                            二级
                        </el-tag>
                        <el-tag v-else type='warning'>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Rights',
    components: {
        Breadcrumb
    },
    data() {
        return {
            /*面包屑导航区*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '权限管理', navHref: '' },
                { navName: '权限列表', navHref: '' }
            ],

            /*权限列表*/
            rightsList: []
        };
    },
    methods: {
        async getRightsList() {
            const { data: res } = await this.$http.get('rights/list');
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取权限列表失败', center: true });
            }

            this.rightsList = res.data;
        }
    },
    mounted() {
        this.getRightsList();
    }
};
</script>

<style scoped>

</style>