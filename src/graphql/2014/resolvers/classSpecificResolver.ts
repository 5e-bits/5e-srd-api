import { ClassSpecific as ClassSpecificType } from '@/models/2014/level/types';

const ClassSpecific = {
  __resolveType(specific: ClassSpecificType) {
    if (specific.rage_count !== undefined) return 'BarbarianSpecific';
    if (specific.bardic_inspiration_die !== undefined) return 'BardSpecific';
    if (specific.channel_divinity_charges !== undefined) return 'ClericSpecific';
    if (specific.wild_shape_max_cr !== undefined) return 'DruidSpecific';
    if (specific.action_surges !== undefined) return 'FighterSpecific';
    if (specific.martial_arts) return 'MonkSpecific';
    if (specific.aura_range !== undefined) return 'PaladinSpecific';
    if (specific.favored_enemies !== undefined) return 'RangerSpecific';
    if (specific.sneak_attack) return 'RogueSpecific';
    if (specific.sorcery_points !== undefined) return 'SorcererSpecific';
    if (specific.invocations_known !== undefined) return 'WarlockSpecific';
    if (specific.arcane_recovery_levels !== undefined) return 'WizardSpecific';

    return null;
  },
};

export default ClassSpecific;
