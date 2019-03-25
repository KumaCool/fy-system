import Home from '@/views/home/index';

export default [
    {
        path: '/finance',
        component: Home,
        children: [
            {
                // 对账单列表
                path: 'checkBill',
                name: 'checkBill',
                component: () => import('@/views/finance/checkBill'),
            },
            {
                // 消费记录
                path: 'expenseSheet',
                name: 'expenseSheet',
                component: () => import('@/views/finance/expenseSheet'),
            },
        ],
    },
];
