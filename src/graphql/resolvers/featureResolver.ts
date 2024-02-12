import ClassModel from '../../models/class/index.js';
import FeatureModel from '../../models/feature/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import SpellModel from '../../models/spell/index.js';
import SubclassModel from '../../models/subclass/index.js';
import { resolveChoice } from './common.js';

import { Feature } from '../../models/feature/types';
import { Proficiency } from '../../models/proficiency/types';
import { Option } from '../../models/common/types';

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
  invocations?: Feature[];
};

const resolveExpertiseOption: any = async (option: Option) => {
  if (option.option_type === 'reference') {
    return {
      ...option,
      item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
    };
  }

  if (option.option_type === 'choice' && option.choice.from.option_set_type === 'options_array') {
    const options = option.choice.from.options.map((option) => {
      if (option.option_type === 'reference') {
        return {
          ...option,
          item: ProficiencyModel.findOne({ index: option.item.index }).lean(),
        };
      }
    });
    return {
      ...option,
      choice: resolveChoice(option.choice, {
        options,
      }),
    };
  }

  if (option.option_type === 'multiple') {
    return {
      ...option,
      items: option.items.map(async (item: Option) => await resolveExpertiseOption(item)),
    };
  }
};

const Feature = {
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
        prerequisiteToReturn.feature =
          (await FeatureModel.findOne({
            url: prerequisite.feature,
          }).lean()) || '';
      }

      if ('spell' in prerequisite && 'spell' in prerequisiteToReturn) {
        prerequisiteToReturn.spell =
          (await SpellModel.findOne({ url: prerequisite.spell }).lean()) || '';
      }

      return prerequisiteToReturn;
    }),
  feature_specific: async (feature: Feature) => {
    const { feature_specific } = feature;
    if (!feature_specific) {
      return null;
    }

    const featureSpecificToReturn: FeatureSpecific = {};

    if (
      feature_specific.subfeature_options &&
      'options' in feature_specific.subfeature_options.from
    ) {
      const options = feature_specific.subfeature_options.from.options.map(async (option) => {
        if (option.option_type === 'reference') {
          return {
            ...option,
            item: await FeatureModel.findOne({ index: option.item.index }).lean(),
          };
        }
      });
      featureSpecificToReturn.subfeature_options = resolveChoice(
        feature_specific.subfeature_options,
        {
          options,
        }
      );
    }

    if (
      feature_specific.expertise_options &&
      'options' in feature_specific.expertise_options.from
    ) {
      featureSpecificToReturn.expertise_options = resolveChoice(
        feature_specific.expertise_options,
        {
          options: feature_specific.expertise_options.from.options.map(
            async (option) => await resolveExpertiseOption(option)
          ),
        }
      );
    }

    if (feature_specific.invocations) {
      featureSpecificToReturn.invocations = await FeatureModel.find({
        index: { $in: feature_specific.invocations.map(({ index }) => index) },
      }).lean();
    }

    return featureSpecificToReturn;
  },
};

export default Feature;
