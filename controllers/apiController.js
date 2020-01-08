exports.index = (req, res, _next) => {
  // TODO: Find a way to generate this list.
  var index = {
    'ability-scores': '/api/ability-scores',
    classes: '/api/classes',
    conditions: '/api/conditions',
    'damage-types': '/api/damage-types',
    'equipment-categories': '/api/equipment-categories',
    equipment: '/api/equipment',
    features: '/api/features',
    languages: '/api/languages',
    'magic-schools': '/api/magic-schools',
    monsters: '/api/monsters',
    proficiencies: '/api/proficiencies',
    races: '/api/races',
    skills: '/api/skills',
    spellcasting: '/api/spellcasting',
    spells: '/api/spells',
    startingequipment: '/api/startingequipment',
    subclasses: '/api/subclasses',
    subraces: '/api/subraces',
    traits: '/api/traits',
    'weapon-properties': '/api/weapon-properties'
  };
  res.status(200).json(index);
};
