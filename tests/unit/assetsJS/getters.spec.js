import { expect } from 'chai';
import * as getters from '_js/getters';
describe('getters.js for Global', () => {
    it('errorMessage', () => {
        const value = 'ok',
            test = getters.errorMessage(value),
            eqValue = v => expect(test(v)).to.equal(value);
        expect(test(true)).to.be.true;
        eqValue(false);
    });
    it('mobileCN', () => {
        const isTrue = v => expect(getters.mobileCN(v)).to.be.true,
            isFlase = v => expect(getters.mobileCN(v)).to.equal('请输入正确的手机号');
        isTrue(15000000000);
        isTrue(19000000000);
        isTrue('015000000000');
        isFlase(150000000001);
    });
    it('isLength', () => {
        const test = (i, v) => getters.isLength(i)(v);
        expect(test(0, [])).to.be.true;
        expect(test(2, [1, 2])).to.be.true;
        expect(test(2, 'aaa')).to.be.false;
    });
    it('notEmpty', () => {
        expect(getters.notEmpty(1)).to.be.true;
        expect(getters.notEmpty(0)).to.be.true;
        expect(getters.notEmpty('')).to.be.false;
        expect(getters.notEmpty(null)).to.be.false;
        expect(getters.notEmpty(undefined)).to.be.false;
    });
    it('required', () => {
        const value = '不能为空!';
        expect(getters.required('')).to.equal(value);
        expect(getters.required('1')).to.be.true;
    });
    it('relationDate', () => {
        const test = getters.relationDate(new Date());
        expect(test(new Date('2000-12-30'))).to.be.above(0);
        expect(test(new Date('2020-12-30'))).to.be.below(0);
        expect(test(new Date())).to.equal(0);
    });
    it('getOffset', () => {
        // 模拟el对象
        let loopEl = i => {
            let v = {
                    offsetLeft: 100,
                    offsetTop: 100,
                },
                temp = { ...v };
            while (i - 1) {
                temp = {
                    ...v,
                    offsetParent: { ...temp },
                };
                i--;
            }
            return temp;
        };
        let value = loopEl(5);
        expect(getters.getOffset(value)).to.eql({
            offsetLeft: 500,
            offsetTop: 500,
        });
    });
});
