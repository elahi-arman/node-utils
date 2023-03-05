const log = require("./log");

/**
 * @function parseOptions
 * @description reads arguments from the command line and returns
 *              as an object. Any positional arguments go into an
 *              array under the key positional. Any unknown options
 *              go under the unknown key.
 * @param {Array<{name, synonyms}>}
 * @returns {Record<string | Array<string>>}
 *
 * @example
 * const options = parseOptions({port: ['p', 'port']})
 * const port = options.port[0]
 *
 */
const parseOptions = (options) => {
  // create lookup table out of options so the function
  // definition is nicer.
  const optionsMap = {};
  for (const [key, opt] of Object.entries(options)) {
    optionsMap[key] = key;
    for (const o of opt) {
      optionsMap[o] = key;
    }
  }

  // create a shallow copy so we don't destroy the original process.argv
  const arguments = process.argv.slice(2);
  const parsedArguments = {
    positional: [],
    unknown: {},
  };

  while (arguments.length > 0) {
    const argument = arguments.shift();
    if (isFlag(argument)) {
      const flag = argument.replace(/^-*/, "");
      let params = parsedArguments[flag] || [];

      // next token is not another option, then it would
      // be a param for this flag
      while (arguments.length > 0 && !isFlag(arguments[0])) {
        params.push(arguments.shift());
      }

      if (!optionsMap[flag]) {
        log.warn(`Encountered unknown option: ${flag}`);
        parsedArguments.unknown[flag] = params;
      } else {
        parsedArguments[optionsMap[flag]] = params;
      }
    } else {
      parsedArguments.positional.push(argument);
    }
  }

  return parsedArguments;
};

const isFlag = (arg) => arg.startsWith("-");

module.exports = parseOptions;
