const escapeRegExp = string => {
  return string.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

module.exports = {
  escapeRegExp,
};
