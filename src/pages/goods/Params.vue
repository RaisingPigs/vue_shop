<template>
    <div>
        <!--头部面包屑导航-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--主体卡片区-->
        <el-card>
            <!--头部警告区-->
            <el-row>
                <el-alert
                    title='注意: 只允许为第三级分类设置相关参数!'
                    type='warning'
                    center
                    show-icon
                    :closable='false'>
                </el-alert>
            </el-row>

            <!--选择商品分类区-->
            <el-row class='category_option'>
                <el-col>
                    <span>选择商品分类: </span>
                    <el-cascader
                        placeholder='请选择商品分类'
                        class='category_cascader'
                        v-model='categoryCascaderSelectedKeys'
                        :options='categoryList'
                        :props='categoryCascaderProps'
                        @change='categoryCascaderChange'
                        clearable>
                    </el-cascader>
                </el-col>
            </el-row>

            <!--参数标签页区域-->
            <el-row>
                <el-tabs
                    v-model='activeParamTabPane'
                    @tab-click='handleParamTabClick'>
                    <!--添加动态参数面板-->
                    <el-tab-pane label='动态参数' name='dynamicParamTabPane'>
                        <el-button
                            type='primary'
                            size='small'
                            :disabled='isCategoryCascaderSelected'
                            @click='showAddParamDialog'>
                            添加参数
                        </el-button>

                        <!--动态参数表格区域-->
                        <el-table
                            max-height='440'
                            v-if='!isCategoryCascaderSelected'
                            :data='dynamicParams'
                            style='width: 100%'
                            border
                            stripe>
                            <el-table-column
                                type='expand'
                                width='55'
                                align='center'>

                                <template v-slot='scope'>
                                    <el-tag
                                        :key='index'
                                        v-for='(paramValue, index) in scope.row.attr_vals'
                                        closable
                                        :disable-transitions='false'
                                        @close='deleteParamValue(scope.row, index)'>
                                        {{ paramValue }}
                                    </el-tag>
                                    <el-input
                                        ref='addTagInputRef'
                                        class='input-new-tag'
                                        v-if='scope.row.inputVisible'
                                        v-model='scope.row.inputValue'
                                        size='small'
                                        @keyup.enter.native='addParamValue(scope.row)'
                                        @blur='addParamValue(scope.row)'>
                                    </el-input>
                                    <el-button
                                        class='show_new_tag_input'
                                        v-else
                                        size='small' @click='showInput(scope.row)'>
                                        + New Tag
                                    </el-button>
                                </template>

                            </el-table-column>
                            <el-table-column
                                type='index'
                                label='#'
                                width='300'
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                prop='attr_name'
                                label='参数名称'
                                width='300'
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                label='操作'
                                align='center'>
                                <el-button
                                    size='mini'
                                    type='primary'
                                    icon='el-icon-edit'>
                                    编辑
                                </el-button>
                                <el-button
                                    size='mini'
                                    type='danger'
                                    icon='el-icon-delete'>
                                    删除
                                </el-button>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                    <!--添加静态属性面板-->
                    <el-tab-pane label='静态属性' name='staticParamTabPane'>
                        <el-button
                            size='small'
                            type='primary'
                            :disabled='isCategoryCascaderSelected'
                            @click='showAddParamDialog'>
                            添加属性
                        </el-button>

                        <!--静态参数表格区域-->
                        <el-table
                            max-height='440'
                            v-if='!isCategoryCascaderSelected'
                            :data='staticParams'
                            style='width: 100%'
                            border
                            stripe>
                            <el-table-column
                                type='expand'
                                width='55'
                                align='center'>

                                <template v-slot='scope'>
                                    <el-tag
                                        :key='index'
                                        v-for='(paramValue, index) in scope.row.attr_vals'
                                        closable
                                        :disable-transitions='false'
                                        @close='deleteParamValue(scope.row, index)'>
                                        {{ paramValue }}
                                    </el-tag>
                                    <el-input
                                        ref='addTagInputRef'
                                        class='input-new-tag'
                                        v-if='scope.row.inputVisible'
                                        v-model='scope.row.inputValue'
                                        size='small'
                                        @keyup.enter.native='addParamValue(scope.row)'
                                        @blur='addParamValue(scope.row)'>
                                    </el-input>
                                    <el-button
                                        class='show_new_tag_input'
                                        v-else
                                        size='small' @click='showInput(scope.row)'>
                                        + New Tag
                                    </el-button>
                                </template>

                            </el-table-column>
                            <el-table-column
                                type='index'
                                label='#'
                                width='300'
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                prop='attr_name'
                                label='属性名称'
                                width='300'
                                align='center'>
                            </el-table-column>
                            <el-table-column
                                label='操作'
                                align='center'>
                                <el-button
                                    size='mini'
                                    type='primary'
                                    icon='el-icon-edit'>
                                    编辑
                                </el-button>
                                <el-button
                                    size='mini'
                                    type='danger'
                                    icon='el-icon-delete'>
                                    删除
                                </el-button>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-row>

            <!--添加参数的对话框-->
            <el-dialog
                :title='addParamDialog.title'
                :visible.sync='addParamDialogVisible'
                width='50%'
                @close='resetAddParamForm'>
                <!--添加参数的表单-->
                <el-form
                    :model='addParamForm'
                    :rules='addParamFormRules'
                    ref='addParamFormRef'
                    label-width='100px'
                    label-suffix=': '>
                    <el-form-item :label='addParamDialog.label' prop='paramName'>
                        <el-input v-model='addParamForm.paramName'></el-input>
                    </el-form-item>
                </el-form>

                <span slot='footer'>
                    <el-button @click='addParamDialogVisible = false'>取 消</el-button>
                    <el-button type='primary' @click='addParam'>确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Params',
    components: {
        Breadcrumb
    },
    computed: {
        /*当级联选中的keys数组长度为0时, 禁用按钮*/
        isCategoryCascaderSelected() {
            return this.categoryCascaderSelectedKeys.length === 0;
        },

        /*当前选中的三级分类的id*/
        selectedCategoryId() {
            if (this.categoryCascaderSelectedKeys.length !== 0) {
                return this.categoryCascaderSelectedKeys[this.categoryCascaderSelectedKeys.length - 1];
            } else {
                return null;
            }
        },

        /*当前面板为动态参数还是静态属性, 用来发送请求时传参*/
        sel() {
            if (this.activeParamTabPane === 'dynamicParamTabPane') {
                return 'many';
            }
            if (this.activeParamTabPane === 'staticParamTabPane') {
                return 'only';
            }
        },

        /*添加参数对话框的标题文字*/
        addParamDialog() {
            if (this.activeParamTabPane === 'dynamicParamTabPane') {
                return { title: '添加动态参数', label: '动态参数' };
            }
            if (this.activeParamTabPane === 'staticParamTabPane') {
                return { title: '添加静态属性', label: '静态属性' };
            }
        }
    },
    data() {
        return {
            /*面包屑导航区*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '商品管理', navHref: '' },
                { navName: '分类参数', navHref: '' }
            ],
            /*三级分类列表*/
            categoryList: [],
            /*商品分类级联选择器配置对象*/
            categoryCascaderProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
                expandTrigger: 'hover'
            },
            /*商品分类级联选择器选中的keys*/
            categoryCascaderSelectedKeys: [],

            /*默认激活的参数面板*/
            activeParamTabPane: 'dynamicParamTabPane',
            /*静态参数数据*/
            staticParams: [],
            /*动态参数数据*/
            dynamicParams: [],

            /*添加参数对话框是否显示*/
            addParamDialogVisible: false,
            /*添加参数表单对象*/
            addParamForm: {
                paramName: ''
            },
            /*添加参数表单校验规则对象*/
            addParamFormRules: {
                paramName: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        /*获取所有分类*/
        async getCategoryList() {
            const { data: res } = await this.$http.get('categories');
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取商品分类列表失败', center: true });
            }

            this.categoryList = res.data;
        },

        /*获取分类参数列表*/
        async getCategoryParamList() {
            const { data: res } = await this.$http.get(`categories/${this.selectedCategoryId}/attributes`, { params: { sel: this.sel } });

            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取分类参数失败', center: true });
            }

            /*循环获取到的分类参数, 将其中的属性值按照逗号拆分为数组, 并赋值回去*/
            res.data.forEach(item => {
                if (item.attr_vals) {
                    item.attr_vals = item.attr_vals.split(' ');
                } else {
                    item.attr_vals = [];
                }

                /*给每行数据都添加 控制文本框的显示与隐藏*/
                this.$set(item, 'inputVisible', false);
                /*给每行数据都添加 绑定文本框的值*/
                this.$set(item, 'inputValue', '');
            });

            /*将获取到的动静态参数放入不同的变量中*/
            if (this.sel === 'only') {
                return this.staticParams = res.data;
            }
            if (this.sel === 'many') {
                return this.dynamicParams = res.data;
            }

        },

        /*监听级联选择器选择变化事件*/
        categoryCascaderChange() {
            /*当级联选择器选中了三级分裂时, 才发送请求
            * 当清除掉选择器里的值时, 不发送请求*/
            if (this.categoryCascaderSelectedKeys.length !== 0) {
                this.getCategoryParamList();
            }
        },

        /*监听参数页签的单击事件*/
        handleParamTabClick() {
            /*当级联选择器选中了三级分裂时, 才发送请求
            * 当清除掉选择器里的值时, 不发送请求*/
            if (this.categoryCascaderSelectedKeys.length !== 0) {
                this.getCategoryParamList();
            }
        },

        /*打开添加参数对话框*/
        showAddParamDialog() {
            this.addParamDialogVisible = true;
        },

        /*对话框关闭, 重置表单*/
        resetAddParamForm() {
            this.$refs.addParamFormRef.resetFields();
        },

        /*添加参数*/
        addParam() {
            /*进行预校验*/
            this.$refs.addParamFormRef.validate(async valid => {
                if (!valid) {
                    return this.$message.error({ message: '请正确填写信息', center: true });
                }

                /*发送请求添加参数*/
                const { data: res } = await this.$http.post(
                    `categories/${this.selectedCategoryId}/attributes`,
                    {
                        attr_name: this.addParamForm.paramName,
                        attr_sel: this.sel
                    }
                );

                if (res.meta.status !== 201) {
                    return this.$message.error({ message: '添加参数失败', center: true });
                }

                this.$message.success({ message: '添加参数成功', center: true });
                await this.getCategoryParamList();
                this.addParamDialogVisible = false;
            });
        },

        /*显示tag-input*/
        showInput(param) {
            param.inputVisible = true;
            /*文本框自动获取焦点, 包含在nextTick中才能获取到焦点*/
            this.$nextTick(() => {
                /*addTagInputRef这个el-input下的$refs.input是原始的input, 调用其focus就可以获取到焦点*/
                this.$refs.addTagInputRef.$refs.input.focus();
            });
        },

        /*发送请求添加或删除参数值*/
        async saveParamValue(param) {
            const { data: res } = await this.$http.put(
                `categories/${this.selectedCategoryId}/attributes/${param.attr_id}`,
                {
                    attr_name: param.attr_name,
                    attr_sel: this.sel,
                    attr_vals: param.attr_vals.join(' ')
                }
            );

            if (res.meta.status !== 200) {
                return this.$message.error({ message: '修改参数属性失败', center: true });
            }

            this.$message.success({ message: '修改参数属性成功', center: true });
        },

        /*回车或失去焦点添加参数值*/
        addParamValue(param) {
            /*如果每行输入值去掉空格后的长度为0, 则输入值不合法, 将其清空*/
            if (param.inputValue.trim().length === 0) {
                param.inputVisible = '';
                return param.inputVisible = false;
            }

            param.attr_vals.push(param.inputValue.trim());
            param.inputValue = '';
            param.inputVisible = false;

            /*发送请求*/
            this.saveParamValue(param);
        },

        /*删除参数值*/
        deleteParamValue(param, index) {
            param.attr_vals.splice(index, 1);

            /*发送请求*/
            this.saveParamValue(param);
        }
    },
    mounted() {
        this.getCategoryList();
    }
};
</script>

<style scoped>
.category_option {
    margin: 15px 0;
}

.category_option .category_cascader {
    width: 25%;
}

.el-tag, .show_new_tag_input, .input-new-tag {
    margin: 0 15px;
}

.input-new-tag {
    width: 90px;
    vertical-align: bottom;
}

</style>