function hasValue(value) {
  return ![null, undefined].includes(value);
}

function required(value) {
  if (!hasValue(value)) return "ERROR_REQUIRED: does not contain a value.";

  return null;
}

function number(value) {
  if (!hasValue(value)) return null;

  if (Number.isNaN(parseFloat(value)))
    return `ERROR_INVALID_NUMBER: ${value} is not a valid number.`;

  return null;
}

function email(value) {
  if (!hasValue(value)) return null;
  if (
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value,
    )
  )
    return null;

  return `ERROR_INVALID_EMAIL: ${value} is not a valid email address.`;
}

const validators = { required, email, number };

function validate(source, policy) {
  return Reflect.ownKeys(policy)
    .map((field) => {
      const value = source[field];

      /*
       * for a provided field, go through all of the provided validators and run them against the
       * current value of the field and collect the errors.
       */
      const errors = Reflect.ownKeys(policy[field])
        .map((name) => {
          if (!validators[name]) throw new Error(`VALIDATE: ${name} is not a supported validator.`);

          return (Array.isArray(value) ? value : [value]).map((data) => validators[name](data));
        })
        .reduce((acc, data) => [...acc, ...data], [])
        .filter((err) => hasValue(err));

      return { [field]: errors };
    })
    .reduce((result, field) => ({ ...result, ...field }), {});
}

function containsError(result) {
  return Reflect.ownKeys(result)
    .map((field) => result[field].length === 0)
    .includes(false);
}

module.exports = {
  required,
  email,
  hasValue,
  validate,
  containsError,
};
