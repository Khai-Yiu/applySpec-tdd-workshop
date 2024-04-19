function checkPlainObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

function applySpec(specification) {
    let highestArity = 0;

    if (checkPlainObject(specification)) {
        highestArity = Object.entries(specification).reduce(
            (accumulator, [key, value]) => {
                return Math.max(accumulator, value.length);
            },
            0
        );
    }

    function partiallyAppliedFunction(...args) {
        let results = {};

        if (Array.isArray(specification)) {
            results = [];

            return specification.map((value) => {
                if (typeof value === 'function') {
                    return value(...args);
                } else if (checkPlainObject(value)) {
                    return applySpec(value)(...args);
                }
            });
        } else if (checkPlainObject(specification)) {
            for (const [key, value] of Object.entries(specification)) {
                if (typeof value === 'function') {
                    results[key] = value(...args);
                } else if (checkPlainObject(value)) {
                    results[key] = applySpec(value)(...args);
                } else if (Array.isArray(value)) {
                    results[key] = value.map((currentSpec) => {
                        return applySpec(currentSpec)(...args);
                    });
                }
            }
        }

        return results;
    }

    Object.defineProperty(partiallyAppliedFunction, 'length', {
        value: highestArity
    });

    return partiallyAppliedFunction;
}

export default applySpec;
