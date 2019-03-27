import Store from '@/store';
import { getOffset } from '_js/getters';
export default {
    install(Vue) {
        Vue.directive('tooltip', {
            bind(el, { modifiers, value }) {
                let attrs = R.pick([
                        'top',
                        'bottom',
                        'left',
                        'right',
                    ], modifiers),
                    fn = () => {
                        let v = getOffset(el);
                        Store.commit('setTooltip', {
                            attrs,
                            show: true,
                            x: v.offsetLeft,
                            y: v.offsetTop,
                            content: value,
                            activator: el,
                        });
                    },
                    close = () => Store.commit('hideTooltip');
                if (modifiers.click) {
                    el.addEventListener('click', () => {
                        fn();
                        setTimeout(close, 2000);
                    });
                } else {
                    el.addEventListener('mouseenter', fn);
                    el.addEventListener('mouseleave', close);
                }
            },
        });
    },
};
