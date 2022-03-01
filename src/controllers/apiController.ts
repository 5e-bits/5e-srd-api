import { Request, Response } from 'express';
// TODO: We're generating this now, so we can query the DB instead of hardcoding it.
const API_INDEX = {
  'ability-scores': '/api/ability-scores',
  alignments: '/api/alignments',
  backgrounds: '/api/backgrounds',
  classes: '/api/classes',
  conditions: '/api/conditions',
  'damage-types': '/api/damage-types',
  'equipment-categories': '/api/equipment-categories',
  equipment: '/api/equipment',
  feats: '/api/feats',
  features: '/api/features',
  languages: '/api/languages',
  'magic-items': '/api/magic-items',
  'magic-schools': '/api/magic-schools',
  monsters: '/api/monsters',
  proficiencies: '/api/proficiencies',
  races: '/api/races',
  rules: '/api/rules',
  'rule-sections': '/api/rule-sections',
  skills: '/api/skills',
  spells: '/api/spells',
  subclasses: '/api/subclasses',
  subraces: '/api/subraces',
  traits: '/api/traits',
  'weapon-properties': '/api/weapon-properties',
};

const index = (req: Request, res: Response) => {
  res.status(200).json(API_INDEX);
};

export { API_INDEX, index };
