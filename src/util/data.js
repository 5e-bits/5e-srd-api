const ClassAPIResource = data => {
  const mapped = data.map(item => {
    return {
      index: item.index,
      class: item.class.name,
      url: item.url,
    };
  });

  return {
    count: data.length,
    results: mapped,
  };
};

const BackgroundAPIResource = data => {
  const mapped = data.map(item => {
    return {
      index: item.index,
      background: item.background.name,
      url: item.url,
    };
  });

  return {
    count: data.length,
    results: mapped,
  };
};

const ClassOrBackgroundAPIResource = data => {
  const mapped = data.map(item => {
    if (item.class !== undefined) {
      return {
        index: item.index,
        class: item.class.name,
        url: item.url,
      };
    }
    else if (item.background !== undefined) {
      return {
        index: item.index,
        background: item.background.name,
        url: item.url,
      };
    }
    else {
      return {
        index: item.index,
        url: item.url,
      };
    }
  });

  return {
    count: data.length,
    results: mapped,
  };
};

const ResourceList = data => {
  return {
    count: data.length,
    results: data,
  };
};

module.exports = {
  ClassAPIResource,
  BackgroundAPIResource,
  ClassOrBackgroundAPIResource,
  ResourceList,
};
