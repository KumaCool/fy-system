import Login from '@/views/login';
import SignIn from '@/views/login/signIn';
import EditPassword from '@/views/login/editPassword';

export default [
    {
        path: '/login',
        component: Login,
        children: [
            {
                path: '',
                name: 'signIn',
                component: SignIn,
            },
            {
                path: 'editPassword',
                name: 'editPassword',
                component: EditPassword,
            },
        ],
    },
];
