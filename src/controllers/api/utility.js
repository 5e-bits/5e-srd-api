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
  return string.toString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

module.exports = {
  NamedAPIResource,
  ClassAPIResource,
  escapeRegExp
};
