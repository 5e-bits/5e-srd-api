# Schemas

Definitions of all schemas will be accessible in a future update. Two of the most common schemas are described here.

## API Reference

Represents a minimal representation of a resource. The detailed representation of the referenced resource can be retrieved by making a request to the referenced `URL`.

```
APIReference {
    index       string
    name        string
    url         string
    updated_at  string
}
```


## Difficulty Check (DC)

Represents a difficulty check.

```
DC {
    dc_type       APIReference
    dc_value      number
    success_type  "none" | "half" | "other"
}
```

## Damage

Represents damage.

```
Damage {
    damage_type     APIReference
    damage_dice     string
}
```

## Choice

Represents a choice made by a player. Commonly seen related to decisions made during character creation or combat (e.g.: the description of the cleric class, under **Proficiencies**, states "Skills: Choose two from	History, Insight, Medicine, Persuasion, and	Religion" [[SRD p15]](https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf#page=15))

```
Choice {
    desc      string
    choose    number
    type      string
    from      OptionSet
}
```


## OptionSet

The OptionSet structure provides the options to be chosen from, or sufficient data to fetch and interpret the options. All OptionSets have an `option_set_type` attribute that indicates the structure of the object that contains the options. The possible values are `options_array`, `equipment_category`, and `reference_list`. Other attributes on the OptionSet depend on the value of this attribute.

- `options_array`
    - `options` (array): An array of Option objects. Each item in the array represents an option that can be chosen.
- `equipment_category`
    - `equipment_category` (APIReference): A reference to an EquipmentCategory. Each item in the EquipmentCategory's `equipment` array represents one option that can be chosen.
- `resource_list`
    - `resource_list_url` (string): A reference (by URL) to a collection in the database. The URL may include query parameters. Each item in the resulting ResourceList's `results` array represents one option that can be chosen.

## Option

When the options are given in an `options_array`, each item in the array inherits from the Option structure. All Options have an `option_type` attribute that indicates the structure of the option. The value of this attribute indicates how the option should be handled, and each type has different attributes. The possible values and their corresponding attributes are listed below.

- `reference` - A terminal option. Contains a reference to a Document that can be added to the list of options chosen.
    - `item` (APIReference): A reference to the chosen item.
- `action` - A terminal option. Contains information describing an action, for use within Multiattack actions.
    - `action_name` (string): The name of the action, according to its `name` attribute.
    - `count` (number | string): The number of times this action can be repeated if this option is chosen.
    - `type` (string = `"melee" | "ranged" | "ability" | "magic"`, optional): For attack actions that can be either melee, ranged, abilities, or magic.
- `multiple` - When this option is chosen, all of its child options are chosen, and must be resolved the same way as a normal option.
    - `items` (array): An array of Option objects. All of them must be taken if the option is chosen.
- `choice` - A nested choice. If this option is chosen, the Choice structure contained within must be resolved like a normal Choice structure, and the results are the chosen options.
    - `choice` (Choice): The Choice to resolve.
- `string` - A terminal option. Contains a reference to a string.
    - `string` (string): The string.
- `ideal` - A terminal option. Contains information about an ideal.
    - `desc` (string): A description of the ideal.
    - `alignments` (ApiReference[]): A list of alignments of those who might follow the ideal.
- `counted_reference` - A terminal option. Contains a reference to something else in the API along with a count.
    - `count` (number): Count.
    - `of` (ApiReference): Thing being referenced.
- `score_prerequisite` - A terminal option. Contains a reference to an ability score and a minimum score.
    - `ability_score` (ApiReference): Ability score being referenced.
    - `minimum_score` (number): The minimum score required to satisfy the prerequisite.
- `ability_bonus` - A terminal option. Contains a reference to an ability score and a bonus
    - `ability_score` (ApiReference): Ability score being referenced
    - `bonus` (number): The bonus being applied to the ability score
- `breath` - A terminal option: Contains a reference to information about a breath attack.
    - `name` (string): Name of the breath.
    - `dc` (DC): Difficulty check of the breath attack.
    - `damage` ([Damage]): Damage dealt by the breath attack, if any.
- `damage` - A terminal option. Contains information about damage.
    - `damage_type` (ApiReference): Reference to type of damage.
    - `damage_dice` (string): Damage expressed in dice (e.g. "13d6").
    - `notes` (string): Information regarding the damage.
