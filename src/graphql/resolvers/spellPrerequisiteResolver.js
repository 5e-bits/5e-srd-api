const SpellPrerequisite = {
  __resolveType(prerequisite) {
    if (prerequisite.features) return 'Level';
    if (prerequisite.prerequisites) return 'Feature';

    return null;
  },
};

module.exports = SpellPrerequisite;
