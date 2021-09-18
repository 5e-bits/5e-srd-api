const SubclassSpecific = {
  __resolveType(specific) {
    if (specific.aura_range !== undefined) return 'DevotionSpecific';
    if (specific.additional_magical_secrets_max_lvl !== undefined) return 'LoreSpecific';

    return null;
  },
};

module.exports = SubclassSpecific;
