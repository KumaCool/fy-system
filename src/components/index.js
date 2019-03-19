const components = {
    // 自动表单集
    autoForms: () => import('~/ui/forms/index'),
    // 日期选择器
    datePicker: () => import('~/ui/forms/datePicker'),
    // 提示消息
    alertMessage: () => import('~/ui/alert/message'),
};
export default {
    install(Vue) {
        let fn = (a, b) => Vue.component(a, b);
        R.compose(
            R.forEach(R.apply(fn)),
            R.toPairs,
        )(components);
    },
};
