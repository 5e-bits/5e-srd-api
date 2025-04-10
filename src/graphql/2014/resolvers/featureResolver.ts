import ClassModel from '@/models/2014/class';
import FeatureModel, { FeatureDocument } from '@/models/2014/feature';
import ProficiencyModel from '@/models/2014/proficiency';
import SpellModel from '@/models/2014/spell';
import SubclassModel from '@/models/2014/subclass';
import { resolveChoice, processStringOptions } from './common';

import { Feature } from '@/models/2014/feature';
import { Proficiency } from '@/models/2014/proficiency';
import {
  ChoiceOption,
  Option,
  OptionsArrayOptionSet,
  ReferenceOption,
  StringOption,
  MultipleOption,
} from '@/models/2014/common';

type FeatureSpecific = {
  subfeature_options?: {
    desc?: string;
    choose: number;
    type: string;
    from: {
      option_set_type: 'options_array';
      options: {
        option_type: 'reference';
        item: Feature;
      }[];
    };
  };
  expertise_options?: {
    desc?: string;
    choose: number;
    type: string;
    from: {
      option_set_type: 'options_array';
      options: {
        option_type: 'reference';
        item: Proficiency;
      }[];
    };
  };
  terrain_type_options?: {
    desc?: string;
    choose: number;
    type: string;
    from: {
      option_set_type: 'options_array';
      options: {
        option_type: 'string';
        string: string;
      }[];
    };
  };
  enemy_type_options?: {
    desc?: string;
    choose: number;
    type: string;
    from: {
      option_set_type: 'options_array';
      options: {
        option_type: 'string';
        string: string;
      }[];
    };
  };
  invocations?: Feature[];
};

type FeatureWithSpecific = Feature & {
  feature_specific?: FeatureSpecific;
};

const resolveExpertiseOption = async (option: Option): Promise<Option> => {
  if (option.option_type === 'reference') {
    const referenceOption = option as ReferenceOption;
    const proficiency = await ProficiencyModel.findOne({
      index: referenceOption.item.index,
    }).lean();
    if (!proficiency) {
      return referenceOption;
    }
    const resolvedOption: ReferenceOption = {
      ...referenceOption,
      item: proficiency,
    };
    return resolvedOption;
  }

  if (option.option_type === 'choice') {
    const choiceOption = option as ChoiceOption;
    if ('options' in choiceOption.choice.from) {
      const options = await Promise.all(
        (choiceOption.choice.from as OptionsArrayOptionSet).options.map(async (opt: Option) => {
          if (opt.option_type === 'reference') {
            const refOpt = opt as ReferenceOption;
            const proficiency = await ProficiencyModel.findOne({ index: refOpt.item.index }).lean();
            if (!proficiency) {
              return refOpt;
            }
            const resolvedOpt: ReferenceOption = {
              ...refOpt,
              item: proficiency,
            };
            return resolvedOpt;
          }
          return opt;
        })
      );
      const resolvedOption: ChoiceOption = {
        ...choiceOption,
        choice: resolveChoice(choiceOption.choice, {
          options,
        }),
      };
      return resolvedOption;
    }
  }

  if (option.option_type === 'multiple') {
    const multipleOption = option as MultipleOption;
    const resolvedOption: MultipleOption = {
      ...multipleOption,
      items: await Promise.all(
        multipleOption.items.map(async (item: Option) => await resolveExpertiseOption(item))
      ),
    };
    return resolvedOption;
  }

  return option;
};

const FeatureResolver = {
  class: async (feature: Feature) =>
    await ClassModel.findOne({ index: feature.class.index }).lean(),
  subclass: async (feature: Feature) =>
    feature.subclass ? await SubclassModel.findOne({ index: feature.subclass.index }).lean() : null,
  parent: async (feature: Feature) =>
    feature.parent ? await FeatureModel.findOne({ index: feature.parent.index }).lean() : null,
  prerequisites: async (feature: Feature) =>
    feature.prerequisites?.map(async (prerequisite) => {
      const prerequisiteToReturn = { ...prerequisite };

      if ('feature' in prerequisite && 'feature' in prerequisiteToReturn) {
        const foundFeature = await FeatureModel.findOne({
          url: prerequisite.feature,
        }).lean();
        prerequisiteToReturn.feature = foundFeature?.url || prerequisite.feature;
      }

      if ('spell' in prerequisite && 'spell' in prerequisiteToReturn) {
        prerequisiteToReturn.spell =
          (await SpellModel.findOne({ url: prerequisite.spell }).lean())?.url || prerequisite.spell;
      }

      return prerequisiteToReturn;
    }),
  feature_specific: async (feature: FeatureWithSpecific): Promise<FeatureSpecific | null> => {
    const { feature_specific } = feature;
    if (!feature_specific) return null;

    const resolvedFeatureSpecific: FeatureSpecific = {};

    if (feature_specific.subfeature_options) {
      resolvedFeatureSpecific.subfeature_options = resolveChoice(
        feature_specific.subfeature_options,
        {
          options: feature_specific.subfeature_options.from.options.map(async (option: Option) => {
            if ('item' in option) {
              return {
                ...option,
                item: await FeatureModel.findOne({
                  index: (option as ReferenceOption).item.index,
                }).lean(),
              };
            }
            return option;
          }),
        }
      );
    }

    if (feature_specific.expertise_options) {
      resolvedFeatureSpecific.expertise_options = resolveChoice(
        feature_specific.expertise_options,
        {
          options: feature_specific.expertise_options.from.options.map(
            async (option: Option) => await resolveExpertiseOption(option)
          ),
        }
      );
    }

    if (feature_specific.terrain_type_options) {
      resolvedFeatureSpecific.terrain_type_options = resolveChoice(
        feature_specific.terrain_type_options,
        {
          options: processStringOptions(
            feature_specific.terrain_type_options.from.options as StringOption[]
          ),
        }
      );
    }

    if (feature_specific.enemy_type_options) {
      resolvedFeatureSpecific.enemy_type_options = resolveChoice(
        feature_specific.enemy_type_options,
        {
          options: processStringOptions(
            feature_specific.enemy_type_options.from.options as StringOption[]
          ),
        }
      );
    }

    if (feature_specific.invocations) {
      const invocations = await Promise.all(
        feature_specific.invocations.map(async (invocation) => {
          const feature = await FeatureModel.findOne({ index: invocation.index }).lean();
          return feature as FeatureDocument | null;
        })
      );
      resolvedFeatureSpecific.invocations = invocations.filter(
        (f): f is FeatureDocument => f !== null
      );
    }

    return resolvedFeatureSpecific;
  },
};

export default FeatureResolver;
