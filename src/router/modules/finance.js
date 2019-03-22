import Home from '@/views/home/index';

export default [
    {
        path: '/finance',
        component: Home,
        children: [
            {
                // 消费记录
                path: 'expenseSheet',
                name: 'expenseSheet',
                component: () => import('@/views/finance/expenseSheet'),
            },
        ],
    },
];
