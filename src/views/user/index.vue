<template lang="html">
    <v-layout column
              fill-height
              pa-3>
        <v-flex shrink>
            <select-forms class="select"
                          flex-row
                          :data="selectData"
                          :forms="selectForms">
                <v-select v-model="selectData.qGender"
                          :items="gender"
                          item-text="label"
                          item-value="value"
                          outline />
                <v-select v-model="selectData.qType"
                          :items="cardType"
                          item-text="label"
                          item-value="value"
                          outline />
                <v-spacer />
                <v-btn block
                       small
                       color="warning"
                       @click="getData">
                    <v-icon left small>
                        iconfont icon-search
                    </v-icon>
                    搜索
                </v-btn>
            </select-forms>
        </v-flex>
        <v-flex shrink my-3>
            <list-table class="table"
                        :headers="userListHeader"
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
                        <v-btn fab
                               small
                               color="info"
                               @click="resetPassword(props.item.userId)">
                            <v-icon>
                                iconfont icon-reset
                            </v-icon>
                        </v-btn>
                        <v-btn fab
                               small
                               color="error"
                               @click="delUser(props.item.userId)">
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
                <user-form v-model="userForm"
                           @change="onSubmit"
                           @close="dialog = false" />
            </title-dialog>
        </v-flex>
        <v-flex grow>
            <v-btn color="warning" @click="showUserForm">
                添加员工
            </v-btn>
            <v-btn color="warning">
                下载模板
            </v-btn>
            <v-btn color="warning">
                导入用户表
            </v-btn>
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
import SelectForms from '~/ui/forms/selectForms';
import UserForm from './userForm';

import pageMixin from '@/mixins/page';
export default {
    name: 'UserList',
    components: {
        SelectForms,
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
            // 用户表单
            userForm: {},
            // 弹窗
            dialog: false,
            // 弹窗类型: 0添加, 修改
            dialogType: 0,
        };
    },
    computed: {
        selectForms() {
            return [
                ['qUserName', '姓名'],
                ['__', '性别'],
                ['qAge', '年龄'],
                ['qIdCrad', '证件号码'],
                ['__', '证件类型'],
            ];
        },
        // 用户列表标题
        userListHeader() {
            let keys = [
                    'text',
                    'value',
                    'sortable',
                ],
                data = [
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
                ];
            return R.map(R.zipObj(keys), data);
        },
        // 弹层标题
        dialogTitle() {
            return this.dialogType ? '编辑员工' : '添加员工';
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
        // 显示用户表单弹层: 有值是修改
        showUserForm(value = null) {
            if (value instanceof MouseEvent) value = null;
            this.dialogType = value ? 1 : 0;
            this.userForm = value || {};
            this.dialog = true;
        },
        // 获取列表数据
        getData() {
            let post = {
                ...this.getPage(),
                ...this.selectData,
            };
            this.loading = true;
            return this.getUserList(post).then(res => {
                this.userList = res.list;
                this.setPage(res.totalPage, res.totalCount);
            });
        },
        // 添加/编辑用户
        onSubmit(post) {
            const api = this.dialogType ? 'updateUser' : 'addUser';
            post.idCrads = JSON.stringify(post.idCrads);
            return this[api](post);
        },
        ...mapActions('storeUser', [
            'getUserList',
            'addUser',
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
</style>
