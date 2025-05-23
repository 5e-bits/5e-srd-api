import AbilityScoreModel from '@/models/2014/abilityScore'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import EquipmentModel from '@/models/2014/equipment'
import LevelModel from '@/models/2014/level'
import ProficiencyModel from '@/models/2014/proficiency'
import SubclassModel from '@/models/2014/subclass'
import {
  coalesceFilters,
  resolveChoice,
  resolveContainsStringFilter,
  resolveSpells,
  SpellQuery,
  QueryParams
} from './common'

import { ClassDocument } from '@/models/2014/class'
import {
  CountedReferenceOption,
  ChoiceOption,
  MultipleOption,
  Option,
  OptionsArrayOptionSet,
  ReferenceOption,
  EquipmentCategoryOptionSet,
  AbilityBonusOption
} from '@/models/2014/common'

const resolveEquipmentOption: any = async (option: Option) => {
  if (option.option_type === 'counted_reference') {
    return {
      ...option,
      of: await EquipmentModel.findOne({
        index: (option as CountedReferenceOption).of.index
      }).lean(),
      prerequisites: (option as CountedReferenceOption).prerequisites?.map(async (prereq) => ({
        ...prereq,
        proficiency: await ProficiencyModel.findOne({ index: prereq.proficiency?.index }).lean()
      }))
    }
  }

  if (
    option.option_type === 'choice' &&
    'equipment_category' in (option as ChoiceOption).choice.from
  ) {
    const choiceOption = option as ChoiceOption
    return {
      ...option,
      choice: resolveChoice(choiceOption.choice, {
        equipment_category: await EquipmentCategoryModel.findOne({
          index: (choiceOption.choice.from as EquipmentCategoryOptionSet).equipment_category.index
        }).lean()
      })
    }
  }

  if ('items' in option) {
    return {
      ...option,
      items: (option as MultipleOption).items.map(
        async (item) => await resolveEquipmentOption(item)
      )
    }
  }
}

const ClassResolver = {
  proficiencies: async (klass: ClassDocument, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: klass.proficiencies.map((p) => p.index) }
      }
    ]

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name))
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean()
  },
  saving_throws: async (klass: ClassDocument) =>
    await AbilityScoreModel.find({
      index: { $in: klass.saving_throws.map((st) => st.index) }
    }).lean(),
  spellcasting: async (klass: ClassDocument) =>
    klass.spellcasting
      ? {
        ...klass.spellcasting,
        spellcasting_ability: await AbilityScoreModel.findOne({
          index: klass.spellcasting.spellcasting_ability.index
        }).lean()
      }
      : null,
  spells: async (klass: ClassDocument, args: SpellQuery) =>
    resolveSpells(args, [{ classes: { $elemMatch: { index: klass.index } } }]),
  starting_equipment: async (klass: ClassDocument) => {
    const starting_equipment = klass.starting_equipment
    const equipment = await EquipmentModel.find({
      index: { $in: starting_equipment?.map((se) => se.equipment.index) }
    }).lean()

    return starting_equipment?.map((se) => ({
      ...se,
      equipment: equipment.find((e) => e.index === se.equipment.index)
    }))
  },
  class_levels: async (klass: ClassDocument) =>
    await LevelModel.find({ 'class.index': klass.index }).lean(),
  subclasses: async (klass: ClassDocument, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: klass.subclasses.map((s) => s.index) } }]

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name))
    }

    return await SubclassModel.find(coalesceFilters(filters)).lean()
  },
  multi_classing: async (klass: ClassDocument) => {
    const multiclassingToReturn: Record<string, any> = {}
    const { multi_classing } = klass

    multiclassingToReturn.proficiencies = await ProficiencyModel.find({
      index: { $in: multi_classing.proficiencies?.map((prof) => prof.index) }
    }).lean()

    if (multi_classing.prerequisites) {
      multiclassingToReturn.prerequisites = multi_classing.prerequisites.map(
        async (prerequisite) => ({
          ...prerequisite,
          ability_score: await AbilityScoreModel.findOne({
            index: prerequisite.ability_score.index
          }).lean()
        })
      )
    }

    if (
      multi_classing.prerequisite_options &&
      'options' in multi_classing.prerequisite_options.from
    ) {
      multiclassingToReturn.prerequisite_options = resolveChoice(
        multi_classing.prerequisite_options,
        {
          options: (multi_classing.prerequisite_options.from as OptionsArrayOptionSet).options.map(
            async (option: Option) => {
              if (option.option_type === 'ability_bonus') {
                return {
                  ...option,
                  ability_score: await AbilityScoreModel.findOne({
                    index: (option as AbilityBonusOption).ability_score.index
                  }).lean()
                }
              }
            }
          )
        }
      )
    }

    if (multi_classing.proficiency_choices) {
      multiclassingToReturn.proficiency_choices = multi_classing.proficiency_choices.map(
        async (choice) => {
          if ('options' in choice.from) {
            return resolveChoice(choice, {
              options: (choice.from as OptionsArrayOptionSet).options.map(
                async (option: Option) => {
                  if ('item' in option) {
                    return {
                      ...option,
                      item: await ProficiencyModel.findOne({
                        index: (option as ReferenceOption).item.index
                      }).lean()
                    }
                  }
                }
              )
            })
          }
        }
      )
    }

    return multiclassingToReturn
  },
  proficiency_choices: async (klass: ClassDocument) =>
    klass.proficiency_choices.map(async (choice) => {
      if ('options' in choice.from) {
        return resolveChoice(choice, {
          options: (choice.from as OptionsArrayOptionSet).options.map(async (option: Option) => {
            if ('item' in option) {
              return {
                ...option,
                item: await ProficiencyModel.findOne({
                  index: (option as ReferenceOption).item.index
                }).lean()
              }
            }

            if ('choice' in option && 'options' in (option as ChoiceOption).choice.from) {
              const choiceOption = option as ChoiceOption
              const options = (choiceOption.choice.from as OptionsArrayOptionSet).options.map(
                async (o: Option) => {
                  if ('item' in o) {
                    return {
                      ...o,
                      item: await ProficiencyModel.findOne({
                        index: (o as ReferenceOption).item.index
                      }).lean()
                    }
                  }
                }
              )
              return {
                ...option,
                choice: resolveChoice(choiceOption.choice, {
                  options
                })
              }
            }
          })
        })
      }
    }),
  starting_equipment_options: async (klass: ClassDocument) =>
    klass.starting_equipment_options.map(async (se_option) => {
      const optionToReturn: Record<string, any> = { ...se_option }
      const from = se_option.from

      if (from.option_set_type === 'equipment_category') {
        optionToReturn.from = {
          ...from,
          equipment_category: await EquipmentCategoryModel.findOne({
            index: (from as EquipmentCategoryOptionSet).equipment_category.index
          }).lean()
        }
      } else {
        if ('options' in from) {
          const options = (from as OptionsArrayOptionSet).options.map(
            async (option: Option) => await resolveEquipmentOption(option)
          )
          optionToReturn.from = {
            ...from,
            options
          }
        }
      }

      return optionToReturn
    })
}

export default ClassResolver
