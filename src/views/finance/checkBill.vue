<template lang="html">
    <v-layout column
              fill-height
              pa-3>
        <v-flex shrink>
            <select-forms class="select"
                          flex-row
                          :forms="$data.$selectForms"
                          @submit.prevent="getData">
                <date-range :start-date.sync="selectData.startDate"
                            :end-date.sync="selectData.endDate"
                            :rules="$data.$required" />
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

        <v-flex grow my-3>
            <list-table class="table"
                        :headers="$data.$listHeader"
                        :items="formatData"
                        :loading="dataLoading"
                        hide-actions>
                <template v-slot:items="props">
                    <td>{{ props.item.providerName }}</td>
                    <td>{{ props.item.steitmentCode }}</td>
                    <td>
                        <div v-text="props.item.startDate[0]" />
                        <div v-text="props.item.endDate[0]" />
                    </td>
                    <td>{{ props.item.totalAmount }}</td>
                    <td>{{ props.item.sendUserName }}</td>
                    <td>
                        <div v-text="props.item.timeOutDate[0]" />
                        <div v-text="props.item.timeOutDate[1]" />
                    </td>
                    <td>{{ props.item.writeOffStatus }}</td>
                    <td class="nowrap">
                        <v-btn color="info"
                               small
                               @click="showBillInfo(props.item)">
                            详情
                        </v-btn>
                        <v-btn color="info"
                               small
                               @click="downloadCheckBillFile({id: props.item.id, code: props.item.steitmentCode})">
                            下载
                        </v-btn>
                    </td>
                </template>
            </list-table>
            <title-dialog v-model="dialog"
                          scrollable
                          render-every
                          title="对账单详情"
                          transition="dialog-transition">
                <check-bill-info :value="bill"
                                 @close="dialog = false" />
            </title-dialog>
        </v-flex>
        <v-flex shrink>
            <pages v-model="page"
                   :length="pageLength"
                   @input="getData" />
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions } from 'vuex';
import { objSplit } from '_js/mutations';
import SelectForms from '~/ui/forms/selectForms';
import DateRange from '~/ui/forms/datePicker/range';
import CheckBillInfo from './checkBillInfo';

import pageMixin from '@/mixins/page';
export default {
    name: 'CheckBill',
    components: {
        SelectForms,
        DateRange,
        CheckBillInfo,
    },
    mixins: [pageMixin],
    data() {
        return {
            selectData: {
                ticketNumber: '',
                writeOffStatus: '',
                steitmentCode: '',
                startDate: '',
                endDate: '',
                uuid: '',
                pnr: '',
            },
            $selectForms: [
                ['ticketNumber', '票号'],
                ['writeOffStatus', '状态'],
                ['steitmentCode', '对账单号'],
                ['uuid', '订单号'],
                ['pnr', 'PNR'],
                ['__', '对账周期'],
            ],
            dataList: [],
            $listHeader: [
                ['服务商', 'providerName'],
                ['对账单号', 'steitmentCode'],
                ['账单周期', ''],
                ['账单金额', 'totalAmount'],
                ['收件人', 'sendUserName'],
                ['确认时间', 'timeOutDate'],
                ['状态', 'writeOffStatus'],
                ['操作', ''],
            ],
            // 弹窗
            dialog: false,
            // 详情
            bill: '',
        };
    },
    computed: {
        // 格式化列表数据
        formatData() {
            // 对目标字段执行分裂
            let dateSplit = v => objSplit(v, ' '),
                // 循环处理
                loopDate = v => R.apply(R.compose, R.map(dateSplit, v));
            return R.map(loopDate([
                'startDate',
                'endDate',
                'timeOutDate',
            ]), this.dataList);
        },
    },
    created() {
        this.getData();
    },
    methods: {
        // 显示详情
        showBillInfo(v) {
            this.bill = v;
            this.dialog = true;
        },
        getData() {
            let { page: currentPage, rows: pageSize } = this.getPage(),
                post = {
                    pageTool: {
                        currentPage,
                        pageSize,
                    },
                    commandDTO: { userId: 10 },
                    ...this.selectData,
                };
            return this.getCheckBillList(post).then(res => {
                this.dataList = res.list;
                this.setPage(res.totalPage);
            });
        },
        ...mapActions('storeFinance', ['getCheckBillList', 'downloadCheckBillFile']),
    },
};
</script>

<style lang="stylus" scoped>
.table tbody td div
    white-space nowrap
</style>
