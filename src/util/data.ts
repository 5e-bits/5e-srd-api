type ClassAPIData = {
  index: string;
  url: string;
  class: {
    name: string;
  };
}[];
export const ClassAPIResource = (data: ClassAPIData) => {
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

export const ResourceList = (data: any[]) => {
  return {
    count: data.length,
    results: data,
  };
};
