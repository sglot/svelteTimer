export class Validator {
    hasRequired(params: object, required: required_fields) {
        for (let key in required) {
            if (Object.keys(params).indexOf(required[key]) == -1) {
                throw new Error('has no required param ' + required[key]);
            }
        }

        return true;
    }
}