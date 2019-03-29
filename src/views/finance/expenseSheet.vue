<template lang="html">
    <v-layout column
              fill-height
              pa-3>
        <v-flex shrink>
            <select-forms class="select"
                          flex-row
                          :data="selectData"
                          :forms="selectForms">
                <selector-city v-if="selectedMore"
                               v-model="selectData.startPlace"
                               outline />
                <selector-city v-if="selectedMore"
                               v-model="selectData.endPlace"
                               outline />
                <div class="d-flex dateRange">
                    <date-picker v-model="selectData.searchAircraftStartTime"
                                 clearable
                                 @change="clearEndDate('searchAircraftEndTime', $event)" />
                    <span class="label">至</span>
                    <date-picker v-model="selectData.searchAircraftEndTime"
                                 clearable
                                 :allowed-dates="allowedDates(selectData.searchAircraftStartTime)" />
                </div>
                <div v-if="selectedMore" class="d-flex dateRange">
                    <date-picker v-model="selectData.searchAppointmentStartTime"
                                 clearable
                                 @change="clearEndDate('searchAppointmentEndTime', $event)" />
                    <span class="label">至</span>
                    <date-picker v-model="selectData.searchAppointmentEndTime"
                                 clearable
                                 :allowed-dates="allowedDates(selectData.searchAppointmentStartTime)" />
                </div>
                <v-select v-model="selectData.trafficOrderId"
                          :items="payType"
                          item-text="label"
                          item-value="value"
                          clearable
                          outline />
                <v-spacer />
                <v-btn-toggle v-model="selectData.searchTicketType" class="ticketType">
                    <v-btn flat value="air">
                        飞机
                    </v-btn>
                    <v-btn flat value="train">
                        火车
                    </v-btn>
                </v-btn-toggle>
                <v-btn block
                       color="warning"
                       @click="changeSelectedMore">
                    高级搜索
                </v-btn>
                <v-btn block
                       color="warning"
                       @click="getData">
                    <v-icon left small>
                        iconfont icon-search
                    </v-icon>
                    搜索
                </v-btn>
            </select-forms>
        </v-flex>
        <v-flex grow my-3>
            <list-table class="table"
                        :headers="dataListHeader"
                        :items="formatData"
                        :loading="dataLoading"
                        hide-actions>
                <template v-slot:items="{item}">
                    <td>{{ item.trafficOrderId }}</td>
                    <td>
                        <div>{{ item.trafficNumber }}</div>
                        <div>{{ item.planeDate }}</div>
                    </td>
                    <td>
                        <div>{{ item.startPlace }}</div>
                        <div>{{ item.startTime }}</div>
                    </td>
                    <td>
                        <div>{{ item.endPlace }}</div>
                        <div>{{ item.endTime }}</div>
                    </td>
                    <td>
                        <div>{{ item.createTime[1] }}</div>
                        <div>{{ item.createTime[0] }}</div>
                    </td>
                    <td>
                        <div v-for="(v, i) in item.userName"
                             :key="i"
                             v-text="v" />
                    </td>
                    <td>
                        <div v-for="(v, i) in item.pnr"
                             :key="i"
                             v-text="v" />
                    </td>
                    <td>
                        <div v-for="(v, i) in item.ticketNo"
                             :key="i"
                             v-text="v" />
                    </td>
                    <td>{{ findDic('tripType', item.trafficOrderState).label }}</td>
                    <td>{{ item.payPrice }}</td>
                    <td>{{ findDic('payType', item.payState).label }}</td>
                </template>
            </list-table>
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
import { relationDate } from '_js/getters';
import { objSplit } from '_js/mutations';
import SelectForms from '~/ui/forms/selectForms';
import SelectorCity from '~/selectorCity';

import pageMixin from '@/mixins/page';
export default {
    name: 'ExpenseSheet',
    components: {
        SelectForms,
        SelectorCity,
    },
    mixins: [pageMixin],
    data() {
        return {
            selectData: {
                ticketNo: '',
                userName: '',
                searchIdCard: '',
                trafficNumber: '',
                pnr: '',
                startPlace: '',
                endPlace: '',
                searchAircraftStartTime: '',
                searchAircraftEndTime: '',
                trafficOrderId: '',
                searchAppointmentStartTime: '',
                searchAppointmentEndTime: '',
                searchTicketType: 'air',
            },
            // 更多搜索
            selectedMore: false,
            dataList: [],
        };
    },
    computed: {
        selectForms() {
            return this.selectedMore
                ? [
                    ['ticketNo', '票号'],
                    ['userName', '出行人'],
                    ['searchIdCard', '证件号码'],
                    ['trafficNumber', '航班号'],
                    ['pnr', 'PNR号'],
                    ['__', '出发城市'],
                    ['__', '抵达城市'],
                    ['__', '出发时间'],
                    ['__', '订单状态'],
                    ['__', '预定时间'],
                ]
                : [
                    ['userName', '出行人'],
                    ['__', '出发时间'],
                    ['__', '订单状态'],
                ];
        },
        dataListHeader() {
            let keys = [
                    'text',
                    'value',
                    'sortable',
                ],
                data = [
                    ['订单号', 'trafficOrderId'],
                    ['航班号/日期', ''],
                    ['出发地', 'startPlace'],
                    ['目的地', 'endPlace'],
                    ['预定时间', 'createTime'],
                    ['出行人', 'userName'],
                    ['PNR', 'pnr'],
                    ['票号', 'ticketNo'],
                    ['票状态', 'trafficOrderState'],
                    ['总金额', 'payPrice'],
                    ['状态', 'payState'],
                ];
            return R.map(R.zipObj(keys), data);
        },
        // 格式化列表数据
        formatData() {
            // 对目标字段执行分裂
            let dateSplit = v => objSplit(v, ' '),
                infoSplit = v => objSplit(v, ','),
                //     // 循环处理
                loop = (v, fn) => R.apply(R.compose, R.map(fn, v)),
                fn = R.compose(
                    loop([
                        'userName',
                        'pnr',
                        'ticketNo',
                    ], infoSplit),
                    loop(['createTime'], dateSplit),
                );
            return R.map(fn, this.dataList);
        },
        ...mapGetters('storeDictionary', ['payType', 'findDic']),
    },
    created() {
        this.getData();
    },
    methods: {
        // 允许操作的时间
        allowedDates(date) {
            return v => {
                if (!date) return true;
                let rel = relationDate(date);
                return rel(v) < 0;
            };
        },
        // 清空结束时间
        clearEndDate(key, v) {
            let rel = relationDate(v);
            if (rel(this.selectData[key]) > 0) this.selectData[key] = '';
        },
        // 切换更多搜索
        changeSelectedMore() {
            this.selectedMore = !this.selectedMore;
        },
        getData() {
            let post = {
                ...this.getPage(),
                ...this.selectData,
            };
            return this.getExpenseSheet(post).then(res => {
                this.dataList = res.list;
                this.setPage(res.totalPage, res.totalCount);
            });
        },
        ...mapActions('storeFinance', ['getExpenseSheet']),
    },
};
</script>

<style lang="stylus" scoped>
.ticketType >>>
    .v-btn
        color $_color_white
        background-color $_color_info
        &::before
            background none
        &.v-btn--active
            background-color $_color_warning
.dateRange
    display flex
    align-items: center;
    .label
        margin-left 10px
.table tbody td div
    white-space nowrap
</style>
