function checkPlainObject(value) {
    return (
        value !== null &&
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}

function applySpec(specification) {
    return function (...args) {
        const appliedSpec = {};

        for (const [key, value] of Object.entries(specification)) {
            if (typeof value === 'function') {
                appliedSpec[key] = value(...args);
            } else if (checkPlainObject(value)) {
                appliedSpec[key] = applySpec(value)(...args);
            }
        }

        return appliedSpec;
    };
}

export default applySpec;
