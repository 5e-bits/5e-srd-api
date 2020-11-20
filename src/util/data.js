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

module.exports = {
  ClassAPIResource,
  ResourceList
};
