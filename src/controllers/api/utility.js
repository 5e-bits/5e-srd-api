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

const ResourceList = data => {
  return {
    count: data.length,
    results: data
  };
};

const escapeRegExp = string => {
  return string.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

module.exports = {
  ClassAPIResource,
  ResourceList,
  escapeRegExp
};
