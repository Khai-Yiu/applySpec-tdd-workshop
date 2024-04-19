import applySpec from './apply-test';
import R from 'ramda';

describe('applySpec,', () => {
    function eq(expected, result) {
        expect(expected).toEqual(result);
    }

    it('works with empty spec', function () {
        eq(applySpec({})(), {});
    });
    it('works with unary functions', function () {
        eq(applySpec({ v: R.inc, u: R.dec })(1), { v: 2, u: 0 });
    });
    it.skip('works with binary functions', function () {
        eq(applySpec({ sum: R.add })(1, 2), { sum: 3 });
    });
    it.skip('works with nested specs', function () {
        eq(applySpec({ unnested: R.always(0), nested: { sum: R.add } })(1, 2), {
            unnested: 0,
            nested: { sum: 3 }
        });
    });
});
