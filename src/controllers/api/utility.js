const ClassAPIResource = data => {
  const mapped = data.map(item => {
    return {
      index: item.index,
      class: item.class.name,
      url: item.url
    };
  });

  return {
    count: data.length,
    results: mapped
  };
};

const NamedAPIResource = data => {
  const mapped = data.map(item => {
    return {
      index: item.index,
      name: item.name,
      url: item.url
    };
  });

  return {
    count: data.length,
    results: mapped
  };
};

const escapeRegExp = string => {
  return string.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

/**
 * Parses a comma separated list of values and constructs a regular expression
 * for a case-insensitive match against any of the provided values.
 *
 * E.G. `acid,lightning,slashing` -> `/acid|lightning|slashing/i`
 */

const csvToIRegExp = values => {
  const regExpString = values
    .trim()
    .split(',')
    .filter(e => e !== '')
    .join('|'); // '|' does not need to be escaped
  return new RegExp(regExpString, 'i');
};

module.exports = {
  NamedAPIResource,
  ClassAPIResource,
  escapeRegExp,
  csvToIRegExp
};
