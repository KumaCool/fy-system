<template lang="html">
    <v-layout column>
        <v-flex shrink>
            合计：{{ totalAmount }}
        </v-flex>
        <v-flex grow>
            <list-table class="table"
                        :headers="listHeader"
                        :items="dataList"
                        :loading="dataLoading"
                        hide-actions>
                <template v-slot:items="{item}">
                    <td>{{ item.uuid }}</td>
                    <td>{{ item.customerName }}</td>
                    <td>{{ item.orderInfo.enterpriseName }}</td>
                    <td />
                    <td>{{ item.pnrNo }}</td>
                    <td>{{ item.ticketNumber }}</td>
                    <td>{{ item.orderInfo.createTime }}</td>
                    <td>{{ item.salePrice }}</td>
                    <td>{{ item.taxPrice }}</td>
                    <td>{{ item.commisionAmount }}</td>
                    <td>{{ item.serviceAmount }}</td>
                    <td>{{ item.saleAmount }}</td>
                    <td>{{ item.uatpSaleAmount }}</td>
                    <td>{{ item.payableSaleAmount }}</td>
                    <td>{{ item.descrip }}</td>
                </template>
            </list-table>
        </v-flex>
        <v-flex shrink my-3>
            <pages v-model="page"
                   :length="pageLength"
                   @input="getData" />
        </v-flex>
        <v-flex shrink class="buttom">
            <v-btn color="warning" @click="download">
                确认下载
            </v-btn>
            <v-btn color="warning" @click="close">
                关闭
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapActions } from 'vuex';

import pageMixin from '@/mixins/page';
export default {
    name: 'CheckBillInfo',
    mixins: [pageMixin],
    props: {
        totalAmount: {
            type: Number,
            default: 0,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    data() {
        return { dataList: [] };
    },
    computed: {
        listHeader() {
            let keys = [
                    'text',
                    'value',
                    'sortable',
                ],
                data = [
                    ['订单号', 'uuid'],
                    ['旅客姓名', 'customerName'],
                    ['组织架构', 'orderInfo.enterpriseName'],
                    ['成本中心', ''],
                    ['编码', 'pnrNo'],
                    ['票号', 'ticketNumber'],
                    ['操作日期', 'orderInfo.createTime'],
                    ['票面', 'salePrice'],
                    ['税金', 'taxPrice'],
                    ['公司佣金', 'commisionAmount'],
                    ['标准服务费', 'serviceAmount'],
                    ['合计', 'saleAmount'],
                    ['UATP-卡支付', 'uatpSaleAmount'],
                    ['应付款', 'payableSaleAmount'],
                    ['备注', 'descrip'],
                ];
            return R.map(R.zipObj(keys), data);
        },
    },
    watch: {
        value: {
            handler() {
                this.getData();
            },
            immediate: true,
        },
    },
    methods: {
        // 下载
        download() {},
        close() {
            return this.$emit('close');
        },
        getData() {
            let { page: currentPage, rows: pageSize } = this.getPage(),
                post = {
                    pageTool: {
                        currentPage,
                        pageSize,
                    },
                    steitmentId: this.value,
                };
            return this.getCheckBillInfo(post).then(res => {
                this.dataList = res.list;
                this.setPage(res.totalPage);
            });
        },
        ...mapActions('storeFinance', ['getCheckBillInfo']),
    },
};
</script>

<style lang="stylus" scoped>
.buttom
    margin 0 auto
</style>
