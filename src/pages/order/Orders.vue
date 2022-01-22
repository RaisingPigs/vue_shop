<template>
    <div>
        <!--面包屑导航区-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--主题卡片区-->
        <el-card>
            <!--搜索区-->
            <el-row>
                <el-col :span='10'>
                    <el-input
                        placeholder='请输入内容'
                        v-model.trim='queryInfo.query'
                        @keyup.enter.native='getOrderList'
                        @clear='getOrderList'
                        clearable>
                        <el-button
                            slot='append'
                            icon='el-icon-search'
                            @click='getOrderList'>
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!--订单表格区-->
            <el-row>
                <el-col>
                    <el-table
                        :data='orderList'
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
                            prop='order_number'
                            label='订单编号'
                            align='center'>
                        </el-table-column>
                        <el-table-column
                            prop='order_price'
                            label='订单价格'
                            align='center'
                            width='120'>
                        </el-table-column>
                        <el-table-column
                            label='支付状态'
                            align='center'
                            width='120'>
                            <template v-slot='scope'>
                                <el-tag
                                    v-if='scope.row.pay_status==="1"'
                                    type='success'>
                                    已付款
                                </el-tag>
                                <el-tag
                                    v-else
                                    type='danger'>
                                    未付款
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label='发货状态'
                            align='center'
                            width='120'>
                            <template v-slot='scope'>
                                <el-tag
                                    v-if='scope.row.is_send==="是"'
                                    type='primary'>
                                    已发货
                                </el-tag>
                                <el-tag
                                    v-else
                                    type='warning'>
                                    未发货
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label='下单时间'
                            align='center'
                            width='200'>
                            <template v-slot='scope'>
                                {{ scope.row.create_time * 1000 | dateformat }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label='操作'
                            align='center'>
                            <template v-slot='scope'>
                                <el-button
                                    size='mini'
                                    type='primary'
                                    icon='el-icon-edit'
                                    @click='showLocationDialog'>
                                </el-button>
                                <el-button
                                    size='mini'
                                    type='success'
                                    icon='el-icon-location'
                                    @click='showExpressDialog'>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <!--订单分页区-->
            <el-row>
                <el-col align='center'>
                    <el-pagination
                        @size-change='handlePageSizeChange'
                        @current-change='handleCurrentPageChange'
                        :current-page='queryInfo.pagenum'
                        :page-sizes='[3, 5, 8, 10]'
                        :page-size='queryInfo.pagesize'
                        layout='total, sizes, prev, pager, next, jumper'
                        :total='total'
                        background>
                    </el-pagination>
                </el-col>
            </el-row>

            <!--地址对话框-->
            <el-dialog
                title='修改地址'
                :visible.sync='locationDialogVisible'
                width='50%'
                @close='resetLocationForm'>
                <el-form
                    :model='locationForm'
                    :rules='locationFormRules'
                    ref='locationFormRef'
                    label-width='100px'
                    label-suffix=': '>
                    <el-form-item label='省市区/县' prop='province'>
                        <el-cascader
                            v-model='locationForm.province'
                            :options='locationCascader.options'
                            :props='locationCascader.props'
                            style='width: 100%'
                            clearable>
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label='详细地址' prop='detailAddress'>
                        <el-input v-model='locationForm.detailAddress'></el-input>
                    </el-form-item>
                </el-form>
                <span slot='footer'>
                    <el-button
                        @click='locationDialogVisible = false'>
                        取 消
                    </el-button>
                    <el-button
                        type='primary'
                        @click='locationDialogVisible = false'>
                        确 定
                    </el-button>
                </span>
            </el-dialog>

            <!--物流进度对话框-->
            <el-dialog
                title='物流进度'
                :visible.sync='expressDialog.visible'
                width='50%'>

                <el-timeline>
                    <el-timeline-item
                        v-for="(express, index) in expressDialog.expressInfo"
                        :key="index"
                        :timestamp="express.time">
                        {{express.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';
import cityData from '@/pages/order/citydata';

export default {
    name: 'Orders',
    components: {
        Breadcrumb
    },
    data() {
        return {
            /*面包屑导航区*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '订单管理', navHref: '/home' },
                { navName: '订单列表', navHref: '' }
            ],

            /*查询信息*/
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            /*订单总数*/
            total: 0,
            /*订单列表*/
            orderList: [],

            /*地址对话框显示与否*/
            locationDialogVisible: false,
            /*地址表单*/
            locationForm: {
                province: [],
                detailAddress: ''
            },
            /*地址表单校验规则*/
            locationFormRules: {
                province: [
                    { required: true, message: '请选择省市区/县', trigger: 'change' }
                ],
                detailAddress: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ]
            },
            /*地址级联选择器的相关属性*/
            locationCascader: {
                /*城市数据*/
                options: cityData,
                /*地址级联选择器的配置*/
                props: {
                    label: 'label',
                    value: 'value',
                    children: 'children',
                    expandTrigger: 'hover'
                }
            },

            /*物流进度对话框*/
            expressDialog: {
                /*显示与否*/
                visible: false,
                expressInfo:[]
            }
        };
    },
    methods: {
        /*获取订单列表*/
        async getOrderList() {
            /*如果查询参数不为空, 则是搜索查询, 应当重置页码*/
            if (this.queryInfo.query.trim() !== '' || this.queryInfo.query.length !== 0) {
                this.queryInfo.pagenum = 1;
            }

            /*发送请求获取数据*/
            const { data: res } = await this.$http.get('orders', { params: this.queryInfo });

            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取订单失败', center: true });
            }

            this.orderList = res.data.goods;
            this.total = res.data.total;
        },

        /*监听页大小*/
        handlePageSizeChange(newPagesize) {
            this.queryInfo.pagesize = newPagesize;
            this.getOrderList();
        },

        /*监听页码改变*/
        handleCurrentPageChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.getOrderList();
        },

        /*监听修改地址对话框显示*/
        showLocationDialog() {
            this.locationDialogVisible = true;
        },

        /*关闭对话框重置表单*/
        resetLocationForm() {
            this.$refs.locationFormRef.resetFields();
        },

        /*展示物流进度对话框*/
        showExpressDialog() {
            this.expressDialog.visible = true;
            this.getExpressProgress();
        },

        /*获取物流信息*/
        async getExpressProgress() {
            const { data: res } = await this.$http.get('/kuaidi/1106975712662');

            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取物流进度失败', center: true });
            }

            this.expressDialog.expressInfo = res.data;
        }
    },
    mounted() {
        this.getOrderList();
    }
};
</script>

<style scoped>

</style>