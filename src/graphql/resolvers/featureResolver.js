import ClassModel from '../../models/class';
import FeatureModel from '../../models/feature';
import ProficiencyModel from '../../models/proficiency';
import SpellModel from '../../models/spell';
import SubclassModel from '../../models/subclass';

const resolveExpertiseOption = async option => {
  if (option.option_type === 'reference') {
    return {
      ...option,
      item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
    };
  }

  if (option.option_type === 'choice') {
    return {
      ...option,
      choice: {
        ...option.choice,
        from: {
          ...option.choice.from,
          options: option.choice.from.options.map(async o => ({
            ...o,
            item: await ProficiencyModel.findOne({ index: o.item.index }).lean(),
          })),
        },
      },
    };
  }

  return {
    ...option,
    items: option.items.map(async item => await resolveExpertiseOption(item)),
  };
};

const Feature = {
  class: async feature => await ClassModel.findOne({ index: feature.class.index }).lean(),
  subclass: async feature =>
    feature.subclass ? await SubclassModel.findOne({ index: feature.subclass.index }).lean() : null,
  parent: async feature =>
    feature.parent ? await FeatureModel.findOne({ index: feature.parent.index }).lean() : null,
  prerequisites: async feature =>
    feature.prerequisites.map(async prerequisite => {
      const prerequisiteToReturn = { ...prerequisite };

      if (prerequisite.feature) {
        prerequisiteToReturn.feature = await FeatureModel.findOne({
          url: prerequisite.feature,
        }).lean();
      }

      if (prerequisite.spell) {
        prerequisiteToReturn.spell = await SpellModel.findOne({ url: prerequisite.spell }).lean();
      }

      return prerequisiteToReturn;
    }),
  feature_specific: async feature => {
    const { feature_specific } = feature;
    if (!feature_specific) {
      return null;
    }

    const featureSpecificToReturn = {};

    if (feature_specific.subfeature_options) {
      featureSpecificToReturn.subfeature_options = {
        ...feature_specific.subfeature_options,
        from: {
          ...feature_specific.subfeature_options.from,
          options: feature_specific.subfeature_options.from.options.map(async option => ({
            ...option,
            item: await FeatureModel.findOne({ index: option.item.index }).lean(),
          })),
        },
      };
    }

    if (feature_specific.expertise_options) {
      featureSpecificToReturn.expertise_options = {
        ...feature_specific.expertise_options,
        from: {
          ...feature_specific.expertise_options.from,
          options: feature_specific.expertise_options.from.options.map(
            async option => await resolveExpertiseOption(option)
          ),
        },
      };
    }

    return featureSpecificToReturn;
  },
};

export default Feature;
