const components = {
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
