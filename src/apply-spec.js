function checkPlainObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

function applySpec(specification) {
    return function (...args) {
        if (Array.isArray(specification)) {
            return specification.map((value) => {
                if (typeof value === 'function') {
                    return value(...args);
                } else if (checkPlainObject(value)) {
                    return applySpec(value)(...args);
                }
            });
        }

        const results = {};

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

        return results;
    };
}

export default applySpec;
