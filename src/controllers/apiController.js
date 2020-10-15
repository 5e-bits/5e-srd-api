const API_INDEX = {
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
  'starting-equipment': '/api/starting-equipment',
  subclasses: '/api/subclasses',
  subraces: '/api/subraces',
  traits: '/api/traits',
  'weapon-properties': '/api/weapon-properties',
  rules: '/api/rules',
  'rule-sections': '/api/rule-sections'
};

exports.API_INDEX = API_INDEX;

exports.index = (req, res, _next) => {
  res.status(200).json(API_INDEX);
};
