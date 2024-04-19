import applySpec from './apply-spec';
import R from 'ramda';

describe('applySpec', () => {
    function eq(expected, result) {
        expect(expected).toEqual(result);
    }

    it('works with empty spec', function () {
        eq(applySpec({})(), {});
    });
    it('works with unary functions', function () {
        eq(applySpec({ v: R.inc, u: R.dec })(1), { v: 2, u: 0 });
    });
    it('works with binary functions', function () {
        eq(applySpec({ sum: R.add })(1, 2), { sum: 3 });
    });
    it('works with nested specs', function () {
        eq(applySpec({ unnested: R.always(0), nested: { sum: R.add } })(1, 2), {
            unnested: 0,
            nested: { sum: 3 }
        });
    });
    it('works with arrays of nested specs', function () {
        eq(
            applySpec({ unnested: R.always(0), nested: [{ sum: R.add }] })(
                1,
                2
            ),
            { unnested: 0, nested: [{ sum: 3 }] }
        );
    });

    it('works with arrays of spec objects', function () {
        eq(applySpec([{ sum: R.add }])(1, 2), [{ sum: 3 }]);
    });

    it('works with arrays of functions', function () {
        eq(
            applySpec([R.map(R.prop('a')), R.map(R.prop('b'))])([
                { a: 'a1', b: 'b1' },
                { a: 'a2', b: 'b2' }
            ]),
            [
                ['a1', 'a2'],
                ['b1', 'b2']
            ]
        );
    });
    it('works with a spec defining a map key', function () {
        eq(applySpec({ map: R.prop('a') })({ a: 1 }), { map: 1 });
    });
    it('retains the highest arity', function () {
        const f = applySpec({ f1: R.nAry(2, R.T), f2: R.nAry(5, R.T) });
        eq(f.length, 5);
    });
});
