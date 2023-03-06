const { fatal } = require("./log");

/**
 * @function mustBeNumber
 * @description verifies the given string is an number within the specified range
 */
const mustBeNumber = (str, { min, max, label }) => {
  const i = parseInt(str);
  const f = parseFloat(str);

  if (isNaN(i) && isNaN(f)) {
    fatal(`${label || str} was provided and is not a number`);
  }

  // n could be either a number or a float. If the nmbers are not
  // equal, return the float version since it's more specific
  let n = f === i ? i : f;

  if (min && n <= min) {
    fatal(
      `${
        label || str
      } is out of bounds. Expected a number greater than ${min} but received ${str}.`
    );
  } else if (max && n >= max) {
    fatal(
      `${
        label || str
      } is out of bounds. Expected a number less than ${max} but received ${str}.`
    );
  }

  return n;
};

module.exports = mustBeNumber;
