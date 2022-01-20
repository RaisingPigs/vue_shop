<template>
    <div>
        <!--头部面包屑导航-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--卡片视图-->
        <el-card>
            <!--分类列表头部文字-->
            <el-row slot='header' class='card_title'>
                <span>商品分类</span>
            </el-row>

            <!--搜索框-->
            <el-row :gutter='15'>
                <el-col :span='10'>
                    <el-input placeholder='请输入内容' clearable>
                        <el-button slot='append' icon='el-icon-search'></el-button>
                    </el-input>
                </el-col>
                <el-col :span='8'>
                    <el-button type='primary' @click='showAddCategoryDialog'>增加分类</el-button>
                    <el-button type='warning'>批量操作</el-button>
                </el-col>
            </el-row>

            <!--分类表格-->
            <el-row>
                <el-table
                    :data='categoryList'
                    style='width: 100%'
                    row-key='cat_id'
                    :tree-props="{children: 'children'}"
                    border
                    stripe>
                    <el-table-column
                        type='index'
                        label='#'
                        width='55'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        prop='cat_name'
                        label='分类名'
                        width='250'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        prop='cat_deleted'
                        width='250'
                        label='是否有效'
                        align='center'>

                        <template v-slot='scope'>
                            <el-result
                                v-if='!scope.row.cat_deleted'
                                icon='success'>
                            </el-result>
                            <el-result
                                v-if='scope.row.cat_deleted'
                                icon='error'>
                            </el-result>
                        </template>

                    </el-table-column>
                    <el-table-column
                        prop='cat_level'
                        width='250'
                        label='分类等级'
                        align='center'>
                        <template v-slot='scope'>
                            <el-tag
                                v-if='scope.row.cat_level===0'
                                type='primary'>
                                一级
                            </el-tag>
                            <el-tag
                                v-else-if='scope.row.cat_level===1'
                                type='success'>
                                二级
                            </el-tag>
                            <el-tag
                                v-else
                                type='warning'>
                                三级
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label='操作'
                        align='center'>
                        <template v-slot='scope'>
                            <el-button
                                size='mini'
                                type='primary'
                                icon='el-icon-edit'>
                            </el-button>
                            <el-button
                                size='mini'
                                type='danger'
                                icon='el-icon-delete'>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <!--分页-->
            <el-row type='flex' justify='center'>
                <el-pagination
                    @size-change='handleSizeChange'
                    @current-change='handleCurrentChange'
                    :current-page='queryInfo.pagenum'
                    :page-sizes='[3, 5, 8, 10]'
                    :page-size='queryInfo.pagesize'
                    layout='total, sizes, prev, pager, next, jumper'
                    :total='total'
                    background>
                </el-pagination>
            </el-row>

            <!--增加分类对话框-->
            <el-dialog
                title='提示'
                :visible.sync='addCategoryDialogVisible'
                width='50%'
                :close-on-click-modal='false'
                @close='resetAddCategoryForm'>

                <!--增加分类表单-->
                <el-form
                    label-width='100px'
                    ref='addCategoryFormRef'
                    :model='addCategoryForm'
                    :rules='addCategoryFormRules'
                    label-suffix=': '>
                    <el-form-item label='分类名称' prop='cat_name'>
                        <el-input
                            v-model='addCategoryForm.cat_name'
                            placeholder='请输入分类名称'
                            clearable></el-input>
                    </el-form-item>
                    <el-form-item label='父级分类'>
                        <!--:options为数据绑定对象
                            :props为级联选择器配置对象
                            由于级联选择器的value值为数组, 所以v-model应该绑定到一个数组上-->
                        <el-cascader
                            placeholder='请选择父级分类'
                            :options='parentCategoryList'
                            v-model='categoryCascaderSelectedKeys'
                            :props='categoryCascaderProps'
                            @change='categoryCascaderChange'
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>

                <span slot='footer' class='dialog-footer'>
                    <el-button @click='addCategoryDialogVisible = false'>取 消</el-button>
                    <el-button type='primary' @click='addCategory'>确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Categories',
    components: {
        Breadcrumb
    },
    data() {
        return {
            /*面包屑导航文字*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '商品管理', navHref: '' },
                { navName: '商品分类', navHref: '' }
            ],

            /*分类查询信息*/
            queryInfo: {
                type: 3, /*type为3会获取1,2,3级分类*/
                pagenum: 1,
                pagesize: 5
            },
            /*分类列表*/
            categoryList: [],
            /*总数据条数*/
            total: 0,

            /*控制增加分类对话框的显示*/
            addCategoryDialogVisible: false,
            /*增加分类表单*/
            addCategoryForm: {
                /*分类父id, 不填默认为0*/
                cat_pid: 0,
                /*分类名称*/
                cat_name: '',
                /*分类层级, 不填默认为一级分类*/
                cat_level: 0
            },
            /*增加分类表单校验规则*/
            addCategoryFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            /*父级分类列表*/
            parentCategoryList: [],
            /*级联选择器配置对象*/
            categoryCascaderProps: {
                /*指定选项标签为选项对象的某个属性值*/
                label: 'cat_name',
                /*指定选项的值为选项对象的某个属性值*/
                value: 'cat_id',
                /*指定选项的子选项为选项对象的某个属性值*/
                children: 'children',
                /*次级菜单的展开方式*/
                expandTrigger: 'hover',
                /*是否严格的遵守父子节点不互相关联*/
                checkStrictly: true
            },
            /*级联选择器的value值为数组*/
            categoryCascaderSelectedKeys: []
        };
    },
    methods: {
        /*获取分类列表*/
        async getCategoryList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo });

            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取分类列表数据失败', center: true });
            }

            this.categoryList = res.data.result;
            this.total = res.data.total;

        },

        /*监听 pagesize 变化*/
        handleSizeChange(newPagesize) {
            this.queryInfo.pagesize = newPagesize;
            this.getCategoryList();
        },

        /*监听 pagenum 变化*/
        handleCurrentChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.getCategoryList();
        },

        /*显示增加分类对话框*/
        showAddCategoryDialog() {
            this.getParentCategoryList();

            this.addCategoryDialogVisible = true;
        },

        /*获取前两级分类列表*/
        async getParentCategoryList() {
            const { data: res } = await this.$http.get('categories', { params: { type: 2 } });
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取父级分类列表失败', center: true });
            }

            this.parentCategoryList = res.data;
        },

        /*监听级联选择器变化*/
        categoryCascaderChange() {
            if (this.categoryCascaderSelectedKeys.length > 0) {
                /*父id为数组最后一个元素*/
                this.addCategoryForm.cat_pid = this.categoryCascaderSelectedKeys[this.categoryCascaderSelectedKeys.length - 1];
                this.addCategoryForm.cat_level = this.categoryCascaderSelectedKeys.length;
            } else {
                this.addCategoryForm.cat_pid = 0;
                this.addCategoryForm.cat_level = 0;
            }
        },

        /*关闭对话框, 重置增加分类表单*/
        resetAddCategoryForm() {
            this.addCategoryForm.cat_pid = 0;
            this.addCategoryForm.cat_name = '';
            this.addCategoryForm.cat_level = 0;
            this.categoryCascaderSelectedKeys = [];
            this.$refs.addCategoryFormRef.resetFields();
        },

        /*增加分类*/
        addCategory() {
            /*表单预验证*/
            this.$refs.addCategoryFormRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error({ message: '请输入信息', center: true });
                }

                /*发送请求增加分类*/
                const { data: res } = await this.$http.post('categories', this.addCategoryForm);
                if (res.meta.status !== 201) {
                    return this.$message.error({ message: '增加分类失败', center: true });
                }

                this.addCategoryDialogVisible = false;
                await this.getCategoryList();
                this.$message.success({ message: '增加分类成功', center: true });
            });
        }
    },
    mounted() {
        this.getCategoryList();
    }
};
</script>

<style scoped>

</style>