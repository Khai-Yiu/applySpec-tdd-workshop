import R from 'ramda';

function checkPlainObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

function getHighestArity(specification) {
    const highestArity = Object.values(specification).reduce(
        (currentHighestArity, value) => {
            if (typeof value === 'function') {
                return Math.max(currentHighestArity, value.length);
            } else {
                return currentHighestArity;
            }
        },
        0
    );

    return highestArity;
}

function applySpec(specification) {
    const highestArity = getHighestArity(specification) ?? 0;

    function specificationFactory(...args) {
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

    Object.defineProperty(specificationFactory, 'length', {
        value: highestArity
    });

    return R.curryN(highestArity, specificationFactory);
}

export default applySpec;
