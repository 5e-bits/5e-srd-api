import { Resolver, Query, Arg, Args, FieldResolver, Root } from 'type-graphql'
import { Background } from '@/models/2014/background'
import BackgroundModel from '@/models/2014/background'
import { BaseResolver } from '@/graphql/common/resolvers/BaseResolver'
import { NameSortArgs } from '@/graphql/common/args/NameSortArgs'

// Import models needed for field resolution
import ProficiencyModel from '@/models/2014/proficiency'
import LanguageModel from '@/models/2014/language'
import AlignmentModel from '@/models/2014/alignment'

// Import common GraphQL objects/types
import { APIReferenceObject, ChoiceObject } from '@/graphql/common/objects'
import {
  APIReference,
  Choice,
  OptionSet,
  Option,
  OptionsArrayOptionSet,
  ResourceListOptionSet,
  EquipmentCategoryOptionSet,
  ReferenceOption,
  IdealOption
} from '@/models/2014/common' // Import Typegoose types too

// Import GraphQL Unions and constituent types
import { GraphQLOptionSet } from '@/graphql/common/options/optionSetUnion'
import { GraphQLOption } from '@/graphql/common/options/optionUnion'
import * as OptionSetTypes from '@/graphql/common/options/optionSetTypes'
import * as OptionTypes from '@/graphql/common/options/optionTypes'

// Models needed for resolving references within choices
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'

@Resolver(Background)
export class BackgroundResolver extends BaseResolver<Background> {
  constructor() {
    super(BackgroundModel, Background)
  }

  @Query(() => Background, {
    nullable: true,
    description: 'Gets a single background by index.'
  })
  async background(@Arg('index', () => String) index: string): Promise<Background | null> {
    return this._findOneByIndex(index)
  }

  @Query(() => [Background], {
    description: 'Gets all backgrounds, optionally filtered by name and sorted.'
  })
  async backgrounds(@Args(() => NameSortArgs) args: NameSortArgs): Promise<Background[]> {
    return this._find(args)
  }

  // --- Field Resolvers ---

  /* // TODO: CIRCLE BACK - Requires Proficiency migration
  @FieldResolver(() => [APIReferenceObject], {
    description: 'Resolved proficiencies granted by the background.'
  })
  async starting_proficiencies(@Root() background: Background): Promise<APIReferenceObject[]> {
    if (!background.starting_proficiencies || background.starting_proficiencies.length === 0) {
      return [];
    }
    // Fetch the full Proficiency objects based on the references
    const proficiencyIndices = background.starting_proficiencies.map(p => p.index);
    const proficiencies = await ProficiencyModel.find({ index: { $in: proficiencyIndices } }).lean();
    // Map back to APIReferenceObject format if needed
    return proficiencies as APIReferenceObject[];
  }
  */

  // --- Helper method for Choice Resolution ---
  protected async _resolveChoiceField(
    choiceInput: Choice | undefined
  ): Promise<ChoiceObject | null> {
    if (!choiceInput) {
      return null
    }

    const resolvedChoice: ChoiceObject = {
      desc: choiceInput.desc,
      choose: choiceInput.choose,
      type: choiceInput.type,
      // We need to resolve the 'from' field based on its type
      from: await this._resolveOptionSet(choiceInput.from)
    }

    return resolvedChoice
  }

  protected async _resolveOptionSet(optionSetInput: OptionSet): Promise<typeof GraphQLOptionSet> {
    if (
      optionSetInput instanceof EquipmentCategoryOptionSet ||
      optionSetInput.option_set_type === 'equipment_category'
    ) {
      const resolvedSet = new OptionSetTypes.EquipmentCategoryOptionSetObject()
      // Fetch the referenced EquipmentCategory
      // TODO: Implement EquipmentCategory resolution when available
      // resolvedSet.equipment_category = await EquipmentCategoryModel.findOne({ index: optionSetInput.equipment_category.index }).lean();
      resolvedSet.equipment_category = {
        index: (optionSetInput as EquipmentCategoryOptionSet).equipment_category.index,
        name: 'TODO',
        url: 'TODO'
      } // Placeholder
      return resolvedSet
    } else if (
      optionSetInput instanceof ResourceListOptionSet ||
      optionSetInput.option_set_type === 'resource_list'
    ) {
      const resolvedSet = new OptionSetTypes.ResourceListOptionSetObject()
      resolvedSet.resource_list_url = (optionSetInput as ResourceListOptionSet).resource_list_url
      // Note: We don't fetch the list here; the client uses the URL.
      return resolvedSet
    } else if (
      optionSetInput instanceof OptionsArrayOptionSet ||
      optionSetInput.option_set_type === 'options_array'
    ) {
      const resolvedSet = new OptionSetTypes.OptionsArrayOptionSetObject()
      resolvedSet.options = await Promise.all(
        (optionSetInput as OptionsArrayOptionSet).options.map((option: Option) =>
          this._resolveOption(option)
        )
      )
      return resolvedSet
    }

    // Should not happen if data is valid
    throw new Error(`Unknown option_set_type: ${optionSetInput?.option_set_type}`)
  }

  protected async _resolveOption(optionInput: Option): Promise<typeof GraphQLOption> {
    // Resolve individual options within an OptionsArrayOptionSet

    if (optionInput instanceof ReferenceOption || optionInput.option_type === 'ReferenceOption') {
      const resolvedOption = new OptionTypes.ReferenceOptionObject()
      // Fetch the referenced item based on the index (e.g., Language, Alignment, Proficiency)
      // This requires knowing *which* model to query based on context, which is tricky here.
      // For simplicity now, just return the reference.
      const refOption = optionInput as ReferenceOption
      resolvedOption.item = {
        index: refOption.item.index,
        name: refOption.item.name,
        url: refOption.item.url
      }
      return resolvedOption
    } else if (optionInput instanceof IdealOption || optionInput.option_type === 'IdealOption') {
      const resolvedOption = new OptionTypes.IdealOptionObject()
      const idealOption = optionInput as IdealOption
      resolvedOption.desc = idealOption.desc
      // Fetch referenced alignments
      const alignmentIndices = idealOption.alignments.map((a: APIReference) => a.index)
      const alignments = await AlignmentModel.find({ index: { $in: alignmentIndices } }).lean()
      resolvedOption.alignments = alignments as APIReferenceObject[]
      return resolvedOption
    }
    // TODO: Add cases for other Option types as needed (ActionOption, MultipleOption, StringOption, etc.)
    // For now, return a placeholder or throw an error for unhandled types
    console.warn(`Unhandled option_type in _resolveOption: ${optionInput.option_type}`)
    // Return a simple string option as a fallback for now
    const fallbackOption = new OptionTypes.StringOptionObject()
    fallbackOption.string = `Unhandled Option Type: ${optionInput.option_type}`
    return fallbackOption

    // // Or throw an error:
    // throw new Error(`Unknown option_type: ${optionInput?.option_type}`);
  }

  // --- Field Resolvers using the helper ---

  @FieldResolver(() => ChoiceObject, {
    nullable: true,
    description: 'Resolved options for starting languages.'
  })
  async language_options(@Root() background: Background): Promise<ChoiceObject | null> {
    return this._resolveChoiceField(background.language_options)
  }

  @FieldResolver(() => ChoiceObject, {
    nullable: true,
    description: 'Resolved options for personality traits.'
  })
  async personality_traits(@Root() background: Background): Promise<ChoiceObject | null> {
    return this._resolveChoiceField(background.personality_traits)
  }

  @FieldResolver(() => ChoiceObject, {
    nullable: true,
    description: 'Resolved options for ideals.'
  })
  async ideals(@Root() background: Background): Promise<ChoiceObject | null> {
    // Note: _resolveOption handles fetching Alignments for IdealOption type
    return this._resolveChoiceField(background.ideals)
  }

  @FieldResolver(() => ChoiceObject, { nullable: true, description: 'Resolved options for bonds.' })
  async bonds(@Root() background: Background): Promise<ChoiceObject | null> {
    return this._resolveChoiceField(background.bonds)
  }

  @FieldResolver(() => ChoiceObject, { nullable: true, description: 'Resolved options for flaws.' })
  async flaws(@Root() background: Background): Promise<ChoiceObject | null> {
    return this._resolveChoiceField(background.flaws)
  }

  // TODO: CIRCLE BACK - Field Resolver for starting_equipment ([EquipmentRefObject]) - Needs Equipment migrated
  // TODO: CIRCLE BACK - Field Resolver for starting_equipment_options ([ChoiceObject]) - Needs Equipment migrated
}
