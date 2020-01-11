const APIResource = data => {
  return {
    count: data.length,
    results: data.map(item => {
      return {
        index: item.index,
        url: item.url
      };
    })
  };
};

const ClassAPIResource = data => {
  return {
    count: data.length,
    results: data.map(item => {
      return {
        index: item.index,
        class: item.class.name,
        url: item.url
      };
    })
  };
};

const NamedAPIResource = data => {
  let mapped = data.map(item => {
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
  return {
    count: data.length,
    results: data.map(item => {
      return {
        index: item.index,
        name: item.name,
        url: item.url,
        desc: item.desc[0]
      };
    })
  };
};

module.exports = {
  APIResource,
  NamedAPIResource,
  NamedAPIResourceWithDesc,
  ClassAPIResource
};
