const ProficiencyRace = {
  __resolveType(proficiencyRace) {
    if (proficiencyRace.url.includes('subrace')) {
      return 'Subrace';
    }
    if (proficiencyRace.url.includes('race')) {
      return 'Race';
    }

    return null;
  },
};

module.exports = ProficiencyRace;
