import pages from '~/ui/page';

export default {
    components: { pages },
    data() {
        return {
            // 数据总数
            totalCount: 0,
            // 页码数量
            pageLength: 0,
            // 当前页码
            page: 1,
            // 每页显示数
            pageRow: 10,
            // 数据加载
            dataLoading: false,
        };
    },
    methods: {
        // 获取页码数据
        getPage() {
            this.dataLoading = true;
            return {
                page: this.page,
                rows: this.pageRow,
            };
        },
        // 设置页码数据
        setPage(length = 0, totalCount = 0) {
            this.pageLength = length;
            this.totalCount = totalCount;
            this.dataLoading = false;
        },
    },
};
