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
            return specification.map((currentSpec) => {
                return applySpec(currentSpec)(...args);
            });
        }

        const appliedSpec = {};

        for (const [key, value] of Object.entries(specification)) {
            if (typeof value === 'function') {
                appliedSpec[key] = value(...args);
            } else if (checkPlainObject(value)) {
                appliedSpec[key] = applySpec(value)(...args);
            } else if (Array.isArray(value)) {
                appliedSpec[key] = value.map((currentSpec) => {
                    return applySpec(currentSpec)(...args);
                });
            }
        }

        return appliedSpec;
    };
}

export default applySpec;
