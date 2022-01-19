<template>
    <div>
        <!--面包屑导航-->
        <Breadcrumb :nav-list='navList'></Breadcrumb>

        <el-card>
            <!--权限列表头部文字-->
            <el-row slot='header' class='card_title'>
                <span>权限列表</span>
            </el-row>

            <!--搜索框和添加角色框-->
            <el-row :gutter='15'>
                <el-col :span='10'>
                    <el-input placeholder='请输入内容' clearable>
                        <el-button slot='append' icon='el-icon-search'></el-button>
                    </el-input>
                </el-col>
                <el-col :span='8'>
                    <el-button type='primary' @click='showAddRoleDialog = true'>增加角色</el-button>
                    <el-button type='warning'>批量操作</el-button>
                </el-col>
            </el-row>

            <!--角色表格区-->
            <el-row>
                <el-table
                    :data='roleList'
                    style='width: 100%'
                    border
                    stripe>
                    <!--展开列-->
                    <!--设置type为expand, 将该列变为展开列
                        通过展开列中的插槽获取该列数据
                        通过获取的数据, 渲染标签-->
                    <el-table-column
                        type='expand'
                        width='55'
                        align='center'>
                        <!--展开列内容区-->
                        <template v-slot='scope'>
                            <!--给index为0的行, 动态添加上边框-->
                            <el-row
                                type='flex'
                                align='middle'
                                v-for='(item1, index1) in scope.row.children'
                                :key='item1.id'
                                :class='["border_bottom", index1===0 ? "border_top" : ""]'>
                                <!--一级权限-->
                                <el-col :span='5' align='center'>
                                    <div>
                                        <el-tag type='primary' closable @close='removeRightById(scope.row, item1)'>
                                            {{ item1.authName }}
                                        </el-tag>
                                    </div>
                                </el-col>

                                <!--二级权限和三级权限-->
                                <el-col :span='19' class='border_left'>
                                    <!--给index不为0的行, 动态添加上边框-->
                                    <el-row
                                        type='flex'
                                        align='middle'
                                        :class='[index2!==0 ? "border_top" : ""]'
                                        v-for='(item2, index2) in item1.children'
                                        :key='item2.id'>
                                        <el-col :span='5' align='center'>
                                            <el-tag type='success' closable @close='removeRightById(scope.row, item2)'>
                                                {{ item2.authName }}
                                            </el-tag>
                                        </el-col>

                                        <el-col :span='19' class='border_left'>
                                            <el-tag
                                                v-for='item3 in item2.children'
                                                :key='item3.id'
                                                type='warning'
                                                closable
                                                @close='removeRightById(scope.row, item3)'>
                                                {{ item3.authName }}
                                            </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                    <!--索引列-->
                    <el-table-column
                        type='index'
                        label='#'
                        width='200'
                        align='center'>
                    </el-table-column>
                    <!--以下为角色基本信息列-->
                    <el-table-column
                        prop='roleName'
                        label='角色名'
                        width='300'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        prop='roleDesc'
                        label='角色描述'
                        width='300'
                        align='center'>
                    </el-table-column>
                    <el-table-column
                        label='操作'
                        align='center'>
                        <template v-slot='scope'>
                            <el-button
                                size='mini'
                                type='primary'
                                icon='el-icon-edit'
                                @click='handleEdit(scope.row)'>
                            </el-button>
                            <el-button
                                size='mini'
                                type='danger'
                                icon='el-icon-delete'
                                @click='handleDelete(scope.row)'>
                            </el-button>
                            <el-button
                                size='mini'
                                type='warning'
                                icon='el-icon-setting'
                                @click='showSetRightDialog(scope.row)'>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <!--权限设置对话框-->
            <el-dialog
                title='设置权限'
                :visible.sync='rightDialogVisible'
                width='50%'
                :close-on-click-modal='false'
                @close='resetDefaultCheckedKeys'>
                <!--权限树控件-->
                <!--props是用来设置树形控件的属性绑定对象-->
                <!--node-key是用来设置选中某一项的id-->
                <!--:default-expand-all是用来设置是否全部展开-->
                <!--:default-checked-keys是用来设置树控件默认选中的id值-->
                <el-tree
                    ref='rightsTreeRef'
                    :data='rightsTree'
                    show-checkbox
                    node-key='id'
                    :default-expand-all='true'
                    :default-checked-keys='defaultCheckedKeys'
                    :props='rightsTreeProps'>
                </el-tree>

                <span slot='footer'>
                    <el-button @click='rightDialogVisible = false'>取 消</el-button>
                    <el-button type='primary' @click='setRights'>确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb';

export default {
    name: 'Roles',
    components: {
        Breadcrumb
    },
    data() {
        return {
            /*头部面包屑导航*/
            navList: [
                { navName: '首页', navHref: '/home' },
                { navName: '权限管理', navHref: '' },
                { navName: '角色列表', navHref: '' }
            ],

            /*角色列表*/
            roleList: [],

            /*权限分配对话框*/
            rightDialogVisible: false,

            /*权限树*/
            rightsTree: [],
            /*树性控件的属性绑定对象*/
            rightsTreeProps: {
                /*label: 设置每一项的展示文字*/
                label: 'authName',
                /*children: 设置按数据中的那个属性分层*/
                children: 'children'
            },
            /*树控件默认选中的id值*/
            defaultCheckedKeys: [],
            /*保存打开权限分配对话框时的角色id*/
            currentRoleId: ''
        };
    },
    methods: {
        async getRoleList() {
            const { data: res } = await this.$http.get('roles');
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取用户列表失败', center: true });
            }

            this.roleList = res.data;
        },

        async removeRightById(role, right) {
            const confirmResult = await this.$confirm(
                `此操作将永久删除用户${role.roleName}的${right.authName}权限, 是否继续?`,
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err);

            /*用户取消删除*/
            if (confirmResult !== 'confirm') {
                return this.$message.info({ message: '取消删除权限', center: true });
            }

            /*发送删除请求*/
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${right.id}`);
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '删除权限失败', center: true });
            }

            /*删除成功*/
            this.$message.success({ message: '删除权限成功', center: true });
            /*调用getRoleList()会给所有表单重新渲染权限
            * 而delete请求会返回当前用户的最新权限, 所以只渲染当前用户的最新权限即可*/
            role.children = res.data;
        },

        /*打开权限设置对话框, 并传入数据*/
        async showSetRightDialog(role) {
            /*将当前的角色保存到data中*/
            this.currentRoleId = role.id;

            /*发送请求获取权限树*/
            const { data: res } = await this.$http.get('rights/tree');
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '获取权限列表失败', center: true });
            }

            /*给权限树何止*/
            this.rightsTree = res.data;

            /*递归获取某角色的三级权限id数组*/
            const arr = [];
            this.getNodeKeys(role, arr);
            this.defaultCheckedKeys = arr;

            /*打开权限列表*/
            this.rightDialogVisible = true;
        },

        /*递归获取某角色的三级权限id数组*/
        getNodeKeys(node, arr) {
            /*如果当前node节点不包含children属性, 则是三级节点*/
            if (!node.children) {
                return arr.push(node.id);
            }

            /*遍历当前节点的children*/
            node.children.forEach((item) => {
                this.getNodeKeys(item, arr);
            });
        },

        /*重置权限设置树的默认keys*/
        resetDefaultCheckedKeys() {
            this.defaultCheckedKeys = [];
        },

        /*单击对话框的确定按钮, 发送请求设置权限*/
        async setRights() {
            /*调用树控件的获取选中keys和未选中keys的方法, 并合并为一个keys数组*/
            const rightsKeys = [
                ...this.$refs.rightsTreeRef.getCheckedKeys(),
                ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
            ];

            /*将数组变为一个逗号分隔的字符串*/
            const rightsKeysStr = rightsKeys.join(',');

            /*发送请求设置角色权限*/
            const { data: res } = await this.$http.post(`roles/${this.currentRoleId}/rights`, { rids: rightsKeysStr });
            if (res.meta.status !== 200) {
                return this.$message.error({ message: '设置角色权限失败', center: true });
            }

            await this.getRoleList();
            this.rightDialogVisible = false;
            return this.$message.success({ message: '设置角色权限成功', center: true });
        },
        
        
    },
    mounted() {
        this.getRoleList();
    }
};
</script>

<style scoped>
.el-tag {
    margin: 10px;
}

.border_top {
    border-top: 1px solid #eee;
}

.border_bottom {
    border-bottom: 1px solid #eee;
}

.border_left {
    border-left: 1px solid #eee;
}


</style>