import Vue from 'vue';

import 'element-ui/lib/theme-chalk/index.css';

import {
    Button,
    Form,
    FormItem,
    Input,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Row,
    Col,
    Avatar,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItem,
    Message,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Table,
    TableColumn,
    Tooltip,
    Switch,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select, 
    Option,
    Result,
    Cascader
} from 'element-ui';

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Row);
Vue.use(Col);
Vue.use(Avatar);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.prototype.$message = Message;
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Result);
Vue.use(Cascader);