import Home from '@/views/home/index';

export default [
    {
        path: '/user',
        component: Home,
        children: [
            {
                path: '',
                name: 'userList',
                component: () => import('@/views/user'),
            },
        ],
    },
    {
        path: '/login',
        component: () => import('@/views/user/login'),
        children: [
            {
                path: '',
                name: 'signIn',
                component: () => import('@/views/user/login/signIn'),
            },
            {
                path: 'editPassword',
                name: 'editPassword',
                component: () => import('@/views/user/login/editPassword'),
            },
        ],
    },
];
