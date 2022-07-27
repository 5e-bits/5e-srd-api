export const ClassAPIResource = data => {
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

export const ResourceList = data => {
  return {
    count: data.length,
    results: data,
  };
};
