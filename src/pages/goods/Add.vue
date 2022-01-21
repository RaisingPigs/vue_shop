<template>
    <div>
        <!--顶部面包屑导航区-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--主体卡片视图区-->
        <el-card>
            <!--信息提示区-->
            <el-row>
                <el-alert
                    title='添加商品信息'
                    type='info'
                    center
                    show-icon
                    :closable='false'>
                </el-alert>
            </el-row>

            <!--步骤条区-->
            <el-row>
                <!--:active需要接受数字类型-->
                <el-steps
                    :active='Number(activeStep)'
                    finish-status='success'
                    align-center>
                    <el-step title='基本信息'></el-step>
                    <el-step title='商品参数'></el-step>
                    <el-step title='商品属性'></el-step>
                    <el-step title='商品图片'></el-step>
                    <el-step title='商品内容'></el-step>
                    <el-step title='完成'></el-step>
                </el-steps>
            </el-row>

            <!--商品信息区-->
            <el-row>
                <!--左侧tab栏-->
                <el-tabs
                    tab-position='left'
                    v-model='activeStep'
                    :before-leave='beforeTabLeave'
                    @tab-click='tabClicked'>
                    <!--基本信息栏-->
                    <el-tab-pane label='基本信息'>
                        <!--基本信息表单-->
                        <el-form :model='goodsInfoForm' :rules='goodsInfoFormRules' ref='goodsInfoFormRef'
                                 label-width='100px'
                                 label-suffix=': '>
                            <el-form-item label='商品名称' prop='goods_name'>
                                <el-input
                                    v-model='goodsInfoForm.goods_name'
                                    clearable>
                                </el-input>
                            </el-form-item>
                            <el-form-item label='商品价格' prop='goods_price'>
                                <el-input
                                    v-model.number='goodsInfoForm.goods_price'
                                    type='number'
                                    clearable>
                                </el-input>
                            </el-form-item>
                            <el-form-item label='商品重量' prop='goods_weight'>
                                <el-input
                                    v-model='goodsInfoForm.goods_weight'
                                    type='number'
                                    clearable>
                                </el-input>
                            </el-form-item>
                            <el-form-item label='商品数量' prop='goods_number'>
                                <el-input
                                    v-model='goodsInfoForm.goods_number'
                                    type='number'
                                    clearable>
                                </el-input>
                            </el-form-item>
                            <el-form-item label='商品分类' prop='goods_cat'>
                                <el-cascader
                                    :options='categoryList'
                                    :props='categoryCascaderProps'
                                    v-model='goodsInfoForm.goods_cat'
                                    @change='goodsCatChange'
                                    clearable>
                                </el-cascader>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <!--商品动态参数栏-->
                    <el-tab-pane label='商品参数'>
                        <!--商品动态参数表单-->
                        <el-form
                            label-width='100px'
                            label-suffix=': '>
                            <el-form-item
                                v-for='param in dynamicParams'
                                :key='param.attr_id'
                                :label='param.attr_name'>
                                <el-checkbox-group v-model='param.attr_vals_checked'>
                                    <el-checkbox
                                        v-for='(val, index) in param.attr_vals'
                                        :key='index'
                                        :label='val'
                                        size='medium'
                                        border>
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <!--商品静态属性栏-->
                    <el-tab-pane label='商品属性'>
                        <el-form
                            label-position='top'
                            label-suffix=': '>
                            <el-form-item
                                v-for='param in staticParams'
                                :key='param.attr_id'
                                :label='param.attr_name'>
                                <el-input
                                    v-model='param.attr_vals'
                                    clearable>
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>

                    <!--商品图片栏-->
                    <el-tab-pane label='商品图片'>
                        <!--action: 上传是要请求的api接口
                            on-preview: 图片预览处理函数
                            on-remove: 图片移除处理函数
                            headers: 请求头, element-ui的upload组件不一定是用axios来发请求的, 所以可能会有无效token的情况, 所以用headers设置请求头
                            list-type: 展示方式
                            on-success: 上传成功后调用函数-->
                        <el-upload
                            :action='imgUploadUrl'
                            :on-preview='handleImgPreview'
                            :on-remove='handleImgRemove'
                            :headers='headerObj'
                            list-type='picture'
                            :on-success='handleUploadSuccess'>
                            <el-button size='small' type='primary'>点击上传</el-button>
                            <div slot='tip' class='el-upload__tip'>在这里上传商品的图片</div>
                        </el-upload>
                    </el-tab-pane>

                    <!--商品内容栏-->
                    <el-tab-pane label='商品内容'>
                        <!--富文本编辑器组件-->
                        <quill-editor v-model='goodsIntroduce'></quill-editor>
                    </el-tab-pane>

                    <!--填写完成栏-->
                    <el-tab-pane label='填写完成'>
                        <p>
                            <span>商品名称: </span>
                            <span>{{ goodsInfoForm.goods_name }}</span>
                        </p>
                        <p>
                            <span>商品价格: </span>
                            <span>{{ goodsInfoForm.goods_price }}</span>
                        </p>
                        <p>
                            <span>商品重量: </span>
                            <span>{{ goodsInfoForm.goods_weight }}</span>
                        </p>
                        <p>
                            <span>商品数量: </span>
                            <span>{{ goodsInfoForm.goods_number }}</span>
                        </p>
                        <p v-for='param in dynamicParams' :key='param.attr_id'>
                            <span>{{ param.attr_name }}: </span>
                            <span v-for='(val, index) in param.attr_vals' :key='index'>{{ val }}, </span>
                        </p>
                        <p v-for='param in staticParams' :key='param.attr_id'>
                            <span>{{ param.attr_name }}: </span>
                            <span>{{ param.attr_vals }}</span>
                        </p>
                        <p>
                            <span>商品图片: </span>
                            <span v-for='pic in pics'>
                                {{ pic.pic }}, 
                            </span>
                        </p>
                        <p>
                            <span>商品介绍: </span>
                            <span>{{ goodsIntroduce }}</span>
                        </p>
                        <el-button
                            type='primary'
                            @click='addGood'>
                            添加商品
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-row>

            <!--图片预览-->
            <el-dialog
                title='图片预览'
                :visible.sync='imgPreviewDialogVisible'
                width='50%'
                align='center'>
                <img :src='imgPreviewUrl' alt='图片' style='width: 60%;'>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Add',
    components: {
        Breadcrumb
    },
    computed: {
        /*选中的分类id */
        categoryId() {
            return this.goodsInfoForm.goods_cat[this.goodsInfoForm.goods_cat.length - 1];
        },

        /*添加商品参数*/
        addGoodParams() {
            const attrArr = [];
            this.dynamicParams.forEach((item) => {
                const attrObj = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals_checked.join(' ')
                };

                attrArr.push(attrObj);
            });
            this.staticParams.forEach((item) => {
                const attrObj = {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                };

                attrArr.push(attrObj);
            });
            return {
                goods_name: this.goodsInfoForm.goods_name,
                goods_price: this.goodsInfoForm.goods_price,
                goods_number: this.goodsInfoForm.goods_number,
                goods_weight: this.goodsInfoForm.goods_weight,
                goods_cat: this.goodsInfoForm.goods_cat.join(','),
                attrs: attrArr,
                pics: this.pics,
                goods_introduce: this.goodsIntroduce
            };
        }
    },
    data() {
        let validateNumber = function(rule, value, callback) {
            if (value < 0) {
                callback(new Error('输入必须大于0'));
            }
            callback();
        };
        return {
            /*面包屑导航区*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '商品管理', navHref: '/home' },
                { navName: '商品列表', navHref: '/home/goods' },
                { navName: '商品添加', navHref: '' }
            ],

            /*设置激活步骤*/
            activeStep: '0',
            /*商品信息增加表单数据对象*/
            goodsInfoForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: []
            },
            /*商品增加表单校验规则对象*/
            goodsInfoFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                    { validator: validateNumber, trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                    { validator: validateNumber, trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                    { validator: validateNumber, trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择商品类型', trigger: 'change' }
                ]
            },
            /*分类列表数据*/
            categoryList: [],
            categoryCascaderProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children',
                expandTrigger: 'hover'
            },

            /*动态参数列表*/
            dynamicParams: [],

            /*静态参数列表*/
            staticParams: [],

            /*图片上传的url*/
            imgUploadUrl: 'https://lianghj.top:8888/api/private/v1/upload',
            /*图片上传的headers请求头*/
            headerObj: {
                Authorization: sessionStorage.getItem('token')
            },
            /*保存图片路径*/
            pics: [],
            /*图片预览对话框*/
            imgPreviewDialogVisible: false,
            /*保存预览图片的url*/
            imgPreviewUrl: '',

            /*商品介绍*/
            goodsIntroduce: ''
        };
    },
    methods: {
        /*获取分类列表*/
        async getCategoryList() {
            const { data: res } = await this.$http.get('categories');

            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取分类列表失败', center: true });
            }

            this.categoryList = res.data;
        },

        /*监听商品分类级联选择器选中变化事件*/
        goodsCatChange() {
            // console.log(this.goodsInfoForm.goods_cat);
        },

        /*切换tab标签页触发事件*/
        beforeTabLeave(activeName, oldActiveName) {
            let isPass = true;

            /*如果第一个标签页的商品名为空, 或者商品类别每选*/
            if (oldActiveName === '0') {
                /*获取商品信息表单验证返回值*/
                this.$refs.goodsInfoFormRef.validate(valid => {
                    isPass = valid;
                    return valid;
                });
            }

            if (!isPass) {
                this.activeStep = oldActiveName;
                this.$message.error({ message: '商品信息不正确', center: true });
                return false;
            }
        },

        /*点击tab触发*/
        async tabClicked() {
            /*动态参数面板*/
            if (this.activeStep === '1') {
                const { data: res } = await this.$http.get(`categories/${this.categoryId}/attributes`, { params: { sel: 'many' } });

                if (res.meta.status !== 200) {
                    return this.$message.error({ message: '获取参数信息失败', center: true });
                }

                /*将参数中的属性按空格拆成数组*/
                res.data.forEach(item => {
                    if (item.attr_vals) {
                        item.attr_vals = item.attr_vals.split(' ');
                    } else {
                        item.attr_vals = [];
                    }

                    /*多选框遍历数组attr_vals的绑定对象*/
                    item.attr_vals_checked = [];
                });

                this.dynamicParams = res.data;
            }

            /*静态属性面板*/
            if (this.activeStep === '2') {
                const { data: res } = await this.$http.get(`categories/${this.categoryId}/attributes`, { params: { sel: 'only' } });

                if (res.meta.status !== 200) {
                    return this.$message.error({ message: '获取参数信息失败', center: true });
                }

                this.staticParams = res.data;
            }
        },

        /*监听图片上传成功的事件*/
        handleUploadSuccess(resp) {
            /*拼接得到一个图片信息对象*/
            const picInfo = {
                pic: resp.data.tmp_path
            };

            /*添加到图片数组中*/
            this.pics.push(picInfo);
        },

        /*监听图片移除事件*/
        handleImgRemove(file) {
            /*获取图片的临时路径*/
            const filePath = file.response.data.tmp_path;

            /*找到其索引*/
            const index = this.pics.findIndex(item => item.pic = filePath);

            /*用splice删除*/
            this.pics.splice(index, 1);
        },

        /*监听图片预览事件*/
        handleImgPreview(file) {
            this.imgPreviewUrl = file.response.data.url;
            this.imgPreviewDialogVisible = true;
        },

        /*添加商品*/
        async addGood() {
            const { data: res } = await this.$http.post('goods', this.addGoodParams);
            if (res.meta.status !== 201) {
                return this.$message.error({ message: '添加商品失败', center: true });
            }

            this.$message.success({ message: '添加商品成功', center: true })
            await this.$router.replace('/home/goods');
        }
    },
    mounted() {
        this.getCategoryList();
    }
};
</script>

<style scoped>

</style>