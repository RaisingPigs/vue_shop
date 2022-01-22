<template>
    <div>
        <!--面包屑导航-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <!--卡片视图-->
        <el-card>
            <!--用户列表头部文字-->
            <el-row slot='header' class='card_title'>
                <span>用户列表</span>
            </el-row>

            <!--搜索框-->
            <el-row :gutter='15'>
                <el-col :span='10'>
                    <!--@clear事件, 当点击清空键清空文本框时触发-->
                    <el-input placeholder='请输入内容' v-model='queryInfo.query' @keyup.enter.native='getUserList'
                              @clear='getUserList' clearable>
                        <el-button slot='append' icon='el-icon-search' @click='getUserList'></el-button>
                    </el-input>
                </el-col>
                <el-col :span='8'>
                    <el-button type='primary' @click='showAddUserDialog = true'>增加用户</el-button>
                    <el-button type='warning' @click='showSelection'>批量操作</el-button>
                    <el-button type='danger' v-show='showCheckboxes'>批量删除</el-button>
                </el-col>
            </el-row>

            <!--用户表格-->
            <el-row>
                <el-table
                    ref='userTable'
                    :data='userList'
                    tooltip-effect='dark'
                    style='width: 100%'
                    border
                    stripe>
                    <el-table-column
                        type='selection'
                        width='55'
                        align='center'
                        v-if='showCheckboxes'>
                    </el-table-column>
                    <el-table-column
                        type='index'
                        label='#'
                        width='55'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        prop='username'
                        label='姓名'
                        width='120'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        prop='email'
                        label='邮箱'
                        align='center'
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop='mobile'
                        label='电话'
                        align='center'
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        prop='role_name'
                        label='角色'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        label='状态'
                        align='center'>
                        <!--v-slot: 作用域插槽, scope.row是一行中整个对象的值-->
                        <template v-slot='scope'>
                            <el-switch
                                v-model='scope.row.mg_state'
                                active-color='#13ce66'
                                @change='updateUserStatus(scope.row)'>
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label='操作'
                        align='center'>
                        <template v-slot='scope'>
                            <el-tooltip class='item' effect='dark' content='编辑用户' placement='top'>
                                <el-button
                                    size='mini'
                                    type='primary'
                                    icon='el-icon-edit'
                                    @click='setEditUserDialog(scope.row)'>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class='item' effect='dark' content='删除用户' placement='top'>
                                <el-button
                                    size='mini'
                                    type='danger'
                                    icon='el-icon-delete'
                                    @click='deleteUser(scope.row)'>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip class='item' effect='dark' content='权限设置' placement='top'>
                                <el-button
                                    size='mini'
                                    type='warning'
                                    icon='el-icon-setting'
                                    @click='showSetRoleDialog(scope.row)'>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <!--分页-->
            <el-row type='flex' justify='center'>
                <!--分页的 @size-change和 @current-change事件不必传参也能获取页数-->
                <el-pagination
                    @size-change='handleSizeChange'
                    @current-change='handleCurrentChange'
                    :current-page='queryInfo.pagenum'
                    :page-sizes='[1, 3, 5, 8]'
                    :page-size='queryInfo.pagesize'
                    layout='total, sizes, prev, pager, next, jumper'
                    :total='total'
                    background>
                </el-pagination>
            </el-row>

            <!--新增用户对话框-->
            <!--对话框一般宽度会设置为50%-->
            <el-dialog
                title='添加用户'
                :visible.sync='showAddUserDialog'
                width='50%'
                :close-on-click-modal='false'
                @close='resetAddUserForm'>
                <!--新增用户的表单-->
                <el-form
                    label-width='80px'
                    :model='addUserForm'
                    abel-suffix=': '
                    :rules='userFormRules'
                    ref='addUserFormRef'>
                    <el-form-item label='用户名' prop='username'>
                        <el-input
                            v-model='addUserForm.username'
                            prefix-icon='el-icon-user'
                            placeholder='请输入用户名'
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='密码' prop='password'>
                        <el-input
                            v-model='addUserForm.password'
                            prefix-icon='el-icon-lock'
                            placeholder='请输入密码'
                            clearable
                            show-password>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='邮箱' prop='email'>
                        <el-input
                            v-model='addUserForm.email'
                            prefix-icon='el-icon-message'
                            placeholder='请输入邮箱'
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='手机号' prop='mobile'>
                        <el-input
                            v-model='addUserForm.mobile'
                            prefix-icon='el-icon-phone-outline'
                            placeholder='请输入手机号'
                            clearable>
                        </el-input>
                    </el-form-item>
                </el-form>
                <!--新增用户表单按钮-->
                <div slot='footer' class='dialog-footer'>
                    <el-button @click='showAddUserDialog = false'>取 消</el-button>
                    <el-button type='primary' @click='addUser'>确 定</el-button>
                </div>
            </el-dialog>

            <!--修改用户对话框-->
            <el-dialog
                title='修改用户'
                :visible.sync='showEditUserDialog'
                width='50%'
                :close-on-click-modal='false'
                @close='resetEditUserForm'>
                <!--修改用户的表单-->
                <el-form
                    label-width='80px'
                    :model='editUserForm'
                    abel-suffix=': '
                    :rules='userFormRules'
                    ref='editUserFromRef'>
                    <el-form-item label='用户名'>
                        <el-input
                            v-model='editUserForm.username'
                            prefix-icon='el-icon-user'
                            placeholder='请输入用户名'
                            clearable
                            disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='邮箱' prop='email'>
                        <el-input
                            v-model='editUserForm.email'
                            prefix-icon='el-icon-message'
                            placeholder='请输入邮箱'
                            clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item label='手机号' prop='mobile'>
                        <el-input
                            v-model='editUserForm.mobile'
                            prefix-icon='el-icon-phone-outline'
                            placeholder='请输入手机号'
                            clearable>
                        </el-input>
                    </el-form-item>
                </el-form>
                <!--修改用户表单按钮-->
                <div slot='footer' class='dialog-footer'>
                    <el-button @click='showEditUserDialog = false'>取 消</el-button>
                    <el-button type='primary' @click='editUser'>确 定</el-button>
                </div>
            </el-dialog>

            <!--分配角色对话框-->
            <el-dialog
                title='分配角色'
                :visible.sync='roleDialogVisible'
                width='50%'
                :close-on-click-modal='false'
                @close='resetRoleFrom'>

                <el-form label-width='100px' :model='setRoleForm' label-suffix=': '>
                    <el-form-item label='用户名'>
                        <el-input v-model='setRoleForm.username' disabled></el-input>
                    </el-form-item>
                    <el-form-item label='用户角色'>
                        <el-input v-model='setRoleForm.roleName' disabled></el-input>
                    </el-form-item>
                    <el-form-item label='分配新角色'>
                        <el-select
                            v-model='setRoleForm.roleId'
                            placeholder='请选择新角色'
                            clearable>
                            <el-option
                                v-for='role in roleList'
                                :key='role.id'
                                :label='role.roleName'
                                :value='role.id'>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>

                <span slot='footer' class='dialog-footer'>
                    <el-button @click='roleDialogVisible = false'>取 消</el-button>
                    <el-button type='primary' @click='setRole'>确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Users',
    components: {
        Breadcrumb
    },
    data() {
        /*邮箱校验规则*/
        /*校验方法中, 成功直接调用callback(), 失败则传入Error对象*/
        let checkEmail = (rule, value, callback) => {
            const patt = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

            if (patt.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的邮箱'));
            }
        };

        /*手机号校验规则*/
        let checkMobile = (rule, value, callback) => {
            const patt = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;

            if (patt.test(value)) {
                callback();
            } else {
                callback(new Error('请输入正确的手机号'));
            }
        };

        return {
            /*面包屑导航区*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '用户管理', navHref: '/home' },
                { navName: '用户列表', navHref: '' }
            ],

            /*获取用户列表的参数*/
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            /*用户数据*/
            userList: [],
            /*总页码*/
            total: 0,
            /*是否展示多选框*/
            showCheckboxes: false,

            /*展示添加用户对话框*/
            showAddUserDialog: false,
            /*添加用户的表单*/
            addUserForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            /*用户表单校验规则*/
            userFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    /*element-ui设置 type:'email' 可开启邮箱校验*/
                    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }

                    /*自定义邮箱校验*/
                    // { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },

            /*修改用户对话框*/
            showEditUserDialog: false,
            /*修改用户表单*/
            editUserForm: {
                id: '',
                username: '',
                email: '',
                mobile: ''
            },

            /*显示分配角色对话框*/
            roleDialogVisible: false,
            /*角色列表*/
            roleList: [],
            /*分配角色表单*/
            setRoleForm: {
                userId: '',
                username: '',
                roleName: '',
                roleId: ''
            }
        };
    },
    methods: {
        /*获取用户*/
        async getUserList() {
            /*如果查询参数不为空, 则是搜索查询, 应当重置页码*/
            if (this.queryInfo.query.trim() !== '' || this.queryInfo.query.length !== 0) {
                this.queryInfo.pagenum = 1;
            }
            
            /*发送请求获取用户列表*/
            const { data: res } = await this.$http.get('users', { params: this.queryInfo });

            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取用户列表失败', center: true });
            }

            this.total = res.data.total;
            this.userList = res.data.users;
        },

        /*展示多选框*/
        showSelection() {
            this.showCheckboxes = !this.showCheckboxes;
            this.$refs.userTable.clearSelection();
        },

        /*监听每页显示数量改变*/
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
        },

        /*监听当前页码改变*/
        handleCurrentChange(newPagenum) {
            this.queryInfo.pagenum = newPagenum;
            this.getUserList();
        },

        /*用户状态修改*/
        async updateUserStatus(user) {
            const { data: res } = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);

            if (res.meta.status !== 200) {
                /*当修改失败后, 应当让页面显示没修改前的用户状态*/
                user.mg_state = !user.mg_state;
                return this.$message.error({ message: '修改用户状态失败', center: true });
            }

            this.$message.success({ message: '更新用户状态成功', center: true });
        },

        /*添加用户对话框关闭重置添加用户的表单数据*/
        resetAddUserForm() {
            this.$refs.addUserFormRef.resetFields();
        },

        /*添加用户方法*/
        addUser() {
            this.$refs.addUserFormRef.validate(async (valid) => {
                /*预校验失败, 提示失败信息*/
                if (!valid) {
                    return this.$message.error({ message: '请输入正确的用户信息', center: true });
                }

                /*发送请求增加用户*/
                const { data: res } = await this.$http.post('users', this.addUserForm);

                if (res.meta.status !== 201) {
                    return this.$message.error({ message: '添加用户失败', center: true });
                }

                /*提示增加成功*/
                this.$message.success({ message: '添加用户成功', center: true });
                /*关闭对话框*/
                this.showAddUserDialog = false;
                /*刷新用户列表*/
                await this.getUserList();
            });
        },

        /*打开修改用户对话框, 并回显数据*/
        setEditUserDialog(user) {
            /*显示修改用户对话框*/
            this.showEditUserDialog = true;

            /*回显用户数据*/
            this.editUserForm.id = user.id;
            this.editUserForm.username = user.username;
            this.editUserForm.email = user.email;
            this.editUserForm.mobile = user.mobile;
        },

        /*修改用户对话框管理重置修改用户的表单数据*/
        resetEditUserForm() {
            this.$refs.editUserFromRef.resetFields();
        },

        /*修改用户方法*/
        editUser() {
            this.$refs.editUserFromRef.validate(async (valid) => {
                if (!valid) {
                    return this.$message.error({ message: '请输入正确的用户信息', center: true });
                }

                /*发送请求获取数据*/
                const { data: res } = await this.$http.put(`users/${this.editUserForm.id}`, this.editUserForm);

                if (res.meta.status !== 200) {
                    return this.$message.error({ message: '编辑用户失败', center: true });
                }

                /*提示修改成功*/
                this.$message.success({ message: '编辑用户成功', center: true });
                /*关闭对话框*/
                this.showEditUserDialog = false;
                /*刷新用户列表*/
                await this.getUserList();
            });
        },

        /*删除用户方法*/
        async deleteUser(user) {
            const confirmResult = await this.$confirm(`此操作将永久删除用户${user.username}, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).catch(err => err); //catch中收到err参数, 然后return err

            /*如果点击确认, confirmResult返回confirm
            * 如果点击取消, confirmResult返回cancel*/
            if (confirmResult === 'cancel') {
                this.$message.info({ message: '已取消删除', center: true });
            } else {
                /*发送请求删除用户*/
                const { data: res } = await this.$http.delete(`users/${user.id}`);
                if (res.meta.status !== 200) {
                    return this.$message.error({ message: '删除失败', center: true });
                }
                /*提示删除成功*/
                this.$message.success({ message: '删除成功!', center: true });
                /*刷新用户列表*/
                await this.getUserList();
            }
        },

        /*打开分配角色对话框, 并回显数据*/
        async showSetRoleDialog(user) {
            /*回显用户数据*/
            this.setRoleForm.userId = user.id;
            this.setRoleForm.username = user.username;
            this.setRoleForm.roleName = user.role_name;

            /*发送请求获取角色列表*/
            const { data: res } = await this.$http.get('roles');
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取角色列表失败', center: true });
            }

            /*回显角色列表的数据到roleList*/
            this.roleList = res.data;

            /*显示对话框*/
            this.roleDialogVisible = true;
        },

        /*设置用户角色*/
        async setRole() {
            /*发送请求修改用户角色*/
            const { data: res } = await this.$http.put(`users/${this.setRoleForm.userId}/role`, { rid: this.setRoleForm.roleId });

            /*失败处理*/
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '修改用户角色失败', center: true });
            }

            /*成功处理*/
            this.$message.success({ message: '修改用户角色成功', center: true });
            await this.getUserList();

            this.roleDialogVisible = false;
        },

        /*对话框关闭, 重置角色分配表单*/
        resetRoleFrom() {
            this.setRoleForm.userId = '';
            this.setRoleForm.username = '';
            this.setRoleForm.roleId = '';
            this.setRoleForm.roleName = '';

            /*这里如果直接将setRoleForm置为空对象, 当打开数据分配角色对话框时, 直接分配属性会失去get set, 从而失去双向绑定的效果*/
            // this.setRoleForm = {};
        }
    },
    mounted() {
        this.getUserList();
    }
};
</script>

<style scoped>

</style>