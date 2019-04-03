import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mount, createLocalVue } from '@vue/test-utils';
import { addElemWithDataAppToBody } from '#/tests/util/fn';
import '#/tests/util/useVuetify';

import alertMessage from '~/ui/alert/message';
import titleDialog from '~/ui/dialog/titleDialog';

use(sinonChai);

describe('ui for Components', () => {
    it('alertMessage', () => {
        const value = '这是一个弹窗',
            close = sinon.spy(),
            wrapper = mount(alertMessage, {
                propsData: { value: true },
                attrs: { close },
                slots: { default: value },
            });
        // 判断显示内容
        expect(wrapper.find('.v-snack__content').text()).to.include(value);
        // 判断关闭回调
        const btn = wrapper.find('button');
        expect(btn.exists()).to.be.true;
        btn.trigger('click');
        expect(close).to.have.been.calledOnce;
    });

    it('titleDialog', () => {
        addElemWithDataAppToBody();
        const created = sinon.spy(),
            localVue = createLocalVue(),
            spyCom = localVue.component('spy', {
                template: '<div />',
                created,
            }),
            title = '这是标题',
            wrapper = mount(titleDialog, {
                propsData: {
                    title,
                    value: true,
                    renderEvery: true,
                    contentHeight: 500,
                },
                attrs: { transition: 'dialog-transition' },
                slots: { default: spyCom },
            });
        expect(wrapper.find('.GlobalTitleDialog').text()).to.include(title);
        expect(wrapper.find('.v-card__text').element.style.height).to.equal('500px');
        wrapper.setProps({ value: false });
        expect(wrapper.find('.GlobalTitleDialog').isVisible()).to.be.false;
        // 是否重新渲染了插槽
        wrapper.setProps({ value: true });
        expect(created).to.have.been.calledTwice;
    });
});
