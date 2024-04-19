function applySpec(specification) {
    return function (...args) {
        const newObject = {};

        for (const [key, value] of Object.entries(specification)) {
            newObject[key] = value(...args);
        }

        return newObject;
    };
}

export default applySpec;
