<template lang="html">
    <v-layout column
              fill-height
              pa-3>
        <v-flex shrink>
            <select-forms class="select"
                          flex-row
                          :data="selectData"
                          :forms="selectForms"
                          @submit.prevent="getData">
                <v-select v-model="selectData.qGender"
                          :items="gender"
                          item-text="label"
                          item-value="value"
                          clearable
                          outline />
                <v-select v-model="selectData.qType"
                          class="cardType"
                          :items="cardType"
                          item-text="label"
                          item-value="value"
                          clearable
                          outline />
                <v-spacer />
                <v-btn block
                       color="warning"
                       type="submit">
                    <v-icon left small>
                        iconfont icon-search
                    </v-icon>
                    搜索
                </v-btn>
            </select-forms>
        </v-flex>
        <v-flex shrink my-3>
            <list-table class="table"
                        :headers="$data.$userListHeader"
                        :items="userList"
                        :loading="dataLoading"
                        hide-actions>
                <template v-slot:items="props">
                    <td>{{ props.item.userName }}</td>
                    <td>{{ props.item.englishName }}</td>
                    <td>{{ findDic('gender', props.item.gender).label }}</td>
                    <td>{{ props.item.age }}</td>
                    <td>
                        <div class="column">
                            <span v-for="item in props.item.idCradList" :key="item.idCradId">
                                {{ findDic('cardType', item.type).label }}
                            </span>
                        </div>
                    </td>
                    <td>
                        <div class="column">
                            <span v-for="item in props.item.idCradList" :key="item.idCradId">
                                {{ item.idCrad }}
                            </span>
                        </div>
                    </td>
                    <td>
                        <div class="column">
                            <span v-for="item in props.item.idCradList" :key="item.idCradId">
                                {{ item.validDate }}
                            </span>
                        </div>
                    </td>
                    <td>
                        <v-checkbox v-model="props.item.buyState"
                                    class="checkbox"
                                    hide-details
                                    label="单独购票"
                                    @change="changeBuyState(props.item.userId)" />
                    </td>
                    <td>
                        <v-edit-dialog lazy
                                       transition="fade-transition"
                                       :return-value.sync="props.item.loginName">
                            {{ props.item.loginName }}
                            <v-text-field
                                slot="input"
                                v-model="props.item.loginName"
                                label="value"
                                single-line
                                rules="rules" />
                        </v-edit-dialog>
                    </td>
                    <td class="actions">
                        <v-btn v-tooltip="'编辑'"
                               fab
                               small
                               color="info"
                               @click="showUserForm(props.item)">
                            <v-icon>
                                iconfont icon-write
                            </v-icon>
                        </v-btn>
                        <v-btn v-tooltip="'重置密码'"
                               fab
                               small
                               color="info"
                               @click="resetPassword(props.item.userId)">
                            <v-icon>
                                iconfont icon-reset
                            </v-icon>
                        </v-btn>
                        <v-btn v-tooltip="'删除用户'"
                               fab
                               small
                               color="error"
                               :loading="iconLoading[props.item.userId]"
                               :disabled="iconLoading[props.item.userId]"
                               @click="toDelUser(props.item.userId)">
                            <v-icon>
                                iconfont icon-delete
                            </v-icon>
                        </v-btn>
                    </td>
                </template>
            </list-table>
            <title-dialog v-model="dialog"
                          max-width="500px"
                          scrollable
                          render-every
                          content-height="500px"
                          :title="dialogTitle"
                          transition="dialog-transition">
                <v-layout v-if="repeatUser.length"
                          class="importError"
                          column
                          justify-center
                          align-center>
                    <v-flex v-for="(item, index) in repeatUser" :key="index">
                        <span v-text="item.userName" />
                        <span v-text="item.loginName" />
                        <span v-text="item.errorInfo" />
                    </v-flex>
                    <v-flex>
                        <v-btn color="warning" @click="dialog = false">
                            关闭
                        </v-btn>
                    </v-flex>
                </v-layout>
                <user-form v-else
                           v-model="userForm"
                           @change="onSubmit"
                           @close="dialog = false" />
            </title-dialog>
        </v-flex>
        <v-flex grow>
            <v-btn color="warning"
                   @click="showUserForm">
                添加员工 +
            </v-btn>
            <v-btn color="warning" @click="download">
                下载模板
            </v-btn>
            <upload color="warning" @change="uploadFile">
                <v-icon left small>
                    iconfont icon-import
                </v-icon>
                导入用户表
            </upload>
        </v-flex>
        <v-flex shrink>
            <pages v-model="page"
                   :length="pageLength"
                   @input="getData" />
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { changeKey } from '_js/mutations';
import SelectForms from '~/ui/forms/selectForms';
import Upload from '~/ui/forms/upload';
import UserForm from './userForm';

import pageMixin from '@/mixins/page';
export default {
    name: 'UserList',
    components: {
        SelectForms,
        Upload,
        UserForm,
    },
    mixins: [pageMixin],
    data() {
        return {
            // 搜索表单数据
            selectData: {
                qUserName: '',
                qGender: '',
                qAge: '',
                qIdCrad: '',
                qType: '',
            },
            // 用户数据
            userList: [],
            // 用户列表标题
            $userListHeader: [
                ['姓名', 'userName'],
                ['英文名', 'englishName'],
                ['性别', 'gender'],
                ['年龄', 'age'],
                ['证件类型', 'type'],
                ['证件号', 'idCrad'],
                ['证件有效期', 'validDate'],
                ['单独购票', 'buyState'],
                ['账号', 'loginName'],
                ['', ''],
            ],
            // 用户表单
            userForm: {},
            // 弹窗
            dialog: false,
            // 弹层标题
            dialogTitle: '',
            // 弹窗类型: 0添加, 修改
            dialogType: 0,
            // 图标加载状态: 删除按钮
            iconLoading: {},
            // 重复用户
            repeatUser: [],
        };
    },
    computed: {
        selectForms() {
            return [
                ['qUserName', '姓名'],
                ['__', '性别'],
                [
                    'qAge',
                    '年龄',
                    {
                        attrs: { type: 'number' },
                        on: { change: this.formatAge },
                    },
                ],
                ['qIdCrad', '证件号码'],
                ['__', '证件类型'],
            ];
        },
        ...mapGetters('storeDictionary', [
            'gender',
            'cardType',
            'findDic',
        ]),
    },
    created() {
        this.getData();
    },
    methods: {
        // 格式化年龄
        formatAge(v) {
            if (v === '') return;
            let value = Number(v);
            this.selectData.qAge = value < 0 || isNaN(value) ? 0 : value;
        },
        // 显示用户表单弹层: 有值是修改
        showUserForm(value = null) {
            if (value instanceof MouseEvent) value = null;
            this.dialogType = value ? 1 : 0;
            this.dialogTitle = this.dialogType ? '编辑员工' : '添加员工';
            this.repeatUser = [];
            this.userForm = value || {};
            this.dialog = true;
        },
        // 上传文件
        uploadFile(v) {
            return this.importUserFile(v).then(res => {
                this.getData();
                if (!res.length) return;
                this.repeatUser = res;
                this.dialog = true;
                this.dialogTitle = '异常用户!';
            });
        },
        download() {
            window.open('http://qiniu.oatalk.cn/userTemplate.xls');
        },
        // 获取列表数据
        getData() {
            let post = {
                ...this.getPage(),
                ...this.selectData,
            };
            this.loading = true;
            return this.getUserList(post).then(res => {
                // 增加按钮加载状态
                res.list.forEach(v => {
                    this.iconLoading[v.userId] = false;
                });
                this.userList = res.list;
                this.setPage(res.totalPage, res.totalCount);
            });
        },
        // 添加/编辑用户
        onSubmit(post) {
            const api = this.dialogType ? 'updateUser' : 'addUser';
            post = R.compose(
                changeKey('idCradList', 'idCrads'),
                R.over(R.lensProp('idCradList'), JSON.stringify)
            )(post);
            return this[api](post).then(() => {
                this.dialog = false;
                this.getData();
            });
        },
        // 删除用户
        toDelUser(id) {
            this.iconLoading[id] = true;
            this.delUser(id).then(() => {
                this.iconLoading[id] = false;
                this.getData();
            });
        },
        ...mapActions('storeUser', [
            'importUserFile',
            'getUserList',
            'addUser',
            'updateUser',
            'resetPassword',
            'changeBuyState',
            'delUser',
        ]),
    },
};
</script>

<style lang="stylus" scoped>
.select .formItem div:not(.label)
    width 120px
    .cardType
        width 170px
.table >>>
    td
        padding 10px 24px !important
        height auto
        vertical-align top
        white-space nowrap
        .column
            display flex
            flex-direction column
    .actions
        padding: 3px 24px 0!important
.importError span
    margin-right 10px
</style>
