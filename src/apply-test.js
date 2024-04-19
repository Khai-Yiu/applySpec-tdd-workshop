function applySpec(functor) {
    return function (...args) {
        const newObject = {};

        for (const [key, value] of Object.entries(functor)) {
            newObject[key] = value(...args);
        }

        return newObject;
    };
}

export default applySpec;
