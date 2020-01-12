const APIResource = data => {
  const mapped = data.map(item => {
    return {
      index: item.index,
      url: item.url
    };
  });

  return {
    count: data.length,
    results: mapped
  };
};

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

const NamedAPIResourceWithDesc = data => {
  const mapped = data.map(item => {
    return {
      index: item.index,
      name: item.name,
      url: item.url,
      desc: item.desc[0]
    };
  });

  return {
    count: data.length,
    results: mapped
  };
};

module.exports = {
  APIResource,
  NamedAPIResource,
  NamedAPIResourceWithDesc,
  ClassAPIResource
};
