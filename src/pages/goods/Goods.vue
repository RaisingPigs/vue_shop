<template>
    <div>
        <!--顶部面包屑导航区-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--主体卡片区-->
        <el-card>
            <!--商品列表头部文字-->
            <el-row slot='header' class='card_title'>
                <span>商品列表</span>
            </el-row>

            <!--搜索框-->
            <el-row :gutter='15'>
                <el-col :span='10'>
                    <!--@clear事件, 当点击清空键清空文本框时触发-->
                    <el-input
                        placeholder='请输入商品名称'
                        v-model='queryInfo.query'
                        @keyup.enter.native='getGoodsList'
                        @clear='getGoodsList'
                        clearable>
                        <el-button
                            slot='append'
                            icon='el-icon-search'
                            @click='getGoodsList'>
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span='8'>
                    <el-button type='primary' @click='goAddPage'>增加商品</el-button>
                    <el-button type='warning'>批量操作</el-button>
                </el-col>
            </el-row>

            <!--商品列表-->
            <el-row>
                <el-table
                    :data='goodsList'
                    style='width: 100%'
                    border
                    stripe>
                    <el-table-column
                        type='index'
                        label='#'
                        width='55'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        prop='goods_name'
                        label='商品名称'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        prop='goods_price'
                        label='商品价格'
                        align='center'
                        width='200'>
                    </el-table-column>
                    <el-table-column
                        prop='goods_weight'
                        label='商品重量'
                        align='center'
                        width='200'>
                    </el-table-column>
                    <el-table-column
                        label='添加时间'
                        align='center'
                        width='200'>
                        <template v-slot='scope'>
                            <!--由于所给是秒级时间戳, 而dateformat处理的是ms级时间戳, 所以乘1000-->
                            {{ scope.row.add_time * 1000 | dateformat }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label='操作'
                        align='center'
                        width='200'>
                        <template v-slot='scope'>
                            <el-button
                                size='mini'
                                type='primary'
                                icon='el-icon-edit'>
                            </el-button>
                            <el-button
                                size='mini'
                                type='danger'
                                icon='el-icon-delete'
                                @click='deleteGoods(scope.row)'>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <!--分页区-->
            <el-row type='flex' justify='center'>
                <el-pagination
                    @size-change='handleSizeChange'
                    @current-change='handleCurrentChange'
                    :current-page='queryInfo.pagenum'
                    :page-sizes='[3, 5, 8, 10]'
                    :page-size='queryInfo.pagesize'
                    layout='total, sizes, prev, pager, next, jumper'
                    :total='total'>
                </el-pagination>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Goods',
    components: {
        Breadcrumb
    },
    data() {
        return {
            /*面包屑导航区*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '商品管理', navHref: '/home' },
                { navName: '商品列表', navHref: '' }
            ],

            /*商品查询信息*/
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            /*商品列表数据*/
            goodsList: [],
            /*总页码数*/
            total: 0
        };
    },

    methods: {
        /*获取所有商品*/
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo });
            if (res.meta.status !== 200) {
                this.$message({ message: '获取商品数据失败', center: true });
            }
            console.log(res);
            this.goodsList = res.data.goods;
            this.total = res.data.total;
        },

        /*监听页码发生变化*/
        handleCurrentChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.getGoodsList();
        },

        /*监听页大小发生变化*/
        handleSizeChange(newPagesize) {
            this.queryInfo.pagesize = newPagesize;
            this.getGoodsList();
        },

        /*删除商品*/
        async deleteGoods(goods) {
            const confirmResult = await this.$confirm(
                `此操作将永久删除 [ ${goods.goods_name} ] , 是否继续?`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err);

            if (confirmResult !== 'confirm') {
                return this.$message.info({ message: '取消删除操作', center: true });
            }

            const { data: res } = await this.$http.delete(`goods/${goods.goods_id}`);
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '删除商品失败', center: true });
            }
            
            this.$message.success({ message: '删除商品成功', center: true });
            await this.getGoodsList();
        },

        /*跳转到增加商品页面*/
        goAddPage() {
            this.$router.push('/home/add');
        }
    },
    mounted() {
        this.getGoodsList();
    }
};
</script>

<style scoped>

</style>