import { expect } from 'chai';

import * as mutations from '_js/mutations';
describe('mutations.js for Global', () => {
    // eslint-disable-next-line
    const data = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAA7VJREFUOBFtVctuHEUUPbe75uHH+KUYORZKLE2wZCkRDzsLYMMqGzbjCBBiySJ8AEwUdt4RMfwALPgBJDwgNggJNiABciQiSJyHx4hAHAvs2PGYjN2PKs6t7h6sJGW5+tZ99bnn3uoRPGE5d6GEzbQBJw3ALUBkGs7RUza4rUBcG1NhW+ST+NFweVTh/nx70aVpi/F1NWoaXSI8UenTZlEdQdiUmU+XM49s7yd0bimwt9cuO+uaPviIl6YR/ul6TBZpBc+cuiSyZNVudNNlr9++TGRNjdPqCiQqKzirCq5C1idP9HVNe/2mHi5mGu7JldcXGfi5KvoINCBPosliG6KXGgwEKSom+d8vjwlEzpv5z5bFrVwoxdHWKt9UP/JWzxl1kIBFmGGgehxBZRJuvwPbu5tx6hFkJdC3U65Mzplof5PdRL0oVX10KWsIK0w0g+CplyFDJ+C667B//0S4aQFeq875QT2KNxvGHiYNT4fq/cvyk6kiGDvDZC/B7a3B/vMLpDwGlGfgejfoTT8J4GzKKYp49nkbRiK7kA+DV2lSsMxgmMhGT8Pe/R6ojCN8+lUgjWEffk20pyCmRioqcHEP8fZVhOmBNmzBuMN42pfXL0IQDE5ABmdgd+9AanWWXkWy9gVbnUAGJiETz1Fm8u1rCE+ew4P9CMM7PyvIaePIB28E0yk0Li3Dlfn2UR4c7M4d2H/vwZx4BeH0i0Q3lem7f8EdPqR/GUFvFy5iHrJgbJRuwGJWD4o0qAwBpWO5c8iZilE++y4RH2MzerBddpj8SnWc/L6A9PdvUNlaZaxv1IbBgV0hjlkFF5XGMEjuEA7DPbjH0uowc29CtOQbX8Fu3SQFU0Q6Tz4jxKtfIvmDHLus68S0YlwUt1nsW5qwNzCFGktzyaHnL2BXpXacidaoSxHWz3ke41vfIl3/jlRsa5gvNRPQFvfxfKnbxSo5rEflEQydPIvS82+w9BF2O+CYcKiTHpL1H4jmR9jNa7AH3TxeH0qU9gCdkRrmiBLY++BZf/X8yGhTyJEdGKVTCBuUEBFpdbcDE+9pfP8WaaxyrysQnB95/+pyfgR2l05/yIRNNforqE2n1Q87xWJW1aZXUo3ZVaUItMaWfvMfB9aUrVG8dkli1wLbz9vT/3cqRwk7ZjkalA+OyLTRv6WxRZ4+wkKx897sIjG0rOUHNrcWKPuIqaetw705/tGtJ39gi4T61Ebd//U+77g0+NVc4JO3ScvEBkvimLn2xJmJtrxz5bGfgP8ACj6+WyfyTLkAAAAASUVORK5CYII=`;

    it('objSplit', () => {
        const value = {
            a: 'hello world',
            b: '/usr/local/bin/code',
        };
        expect(mutations.objSplit('a', /\s+/)(value)).to.have.deep.property('a', value.a.split(' '));
        expect(mutations.objSplit('b', '/')(value)).to.have.deep.property('b', value.b.split('/'));
    });
    it('overList', () => {
        let value = [1, 2];
        expect(mutations.overList(R.equals(2), R.inc)(value)).to.eql([1, 3]);
    });
    it('changeKey', () => {
        let value = {
            a: 1,
            b: 2,
        };
        expect(mutations.changeKey('a', 'c')(value)).to.eql({
            c: 1,
            b: 2,
        });
    });
    it('base64ToBlob', () => {
        expect(mutations.base64ToBlob(data)).to.be.an.instanceof(Blob);
    });
    // XXX: 仅仅简单的测试了返回值是否正确,下载检测待后续开发.
    it('fileSave', () => {
        const value = 'test.txt';
        global.URL.createObjectURL = () => {};
        expect(mutations.fileSave(value, data)).to.equals(value);
    });
});
