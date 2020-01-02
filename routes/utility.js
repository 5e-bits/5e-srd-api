const _ = require('lodash');

function toLower(str) {
    return _.lowerCase(str);
}

function classToIndex(class_name) {
    _.lowerCase(class_name)
    switch(class_name) {
        case "barbarian":
        return 1;
        case "bard":
        return 2;
        case "cleric":
        return 3;
        case "druid":
        return 4;
        case "fighter":
        return 5;
        case "monk":
        return 6;
        case "paladin":
        return 7;
        case "ranger":
        return 8;
        case "rogue":
        return 9;
        case "sorcerer":
        return 10;
        case "warlock":
        return 11;
        case "wizard":
        return 12;
        default:
        return 0;
    }
}

function indexToClass(class_name) {
  switch(class_name) {

    case 1:
    return "barbarian";

    case 2:
    return "bard";

    case 3:
    return "cleric";

    case 4:
    return "druid";

    case 5:
    return "fighter";

    case 6:
    return "monk";

    case 7:
    return "paladin";

    case 8:
    return "ranger";

    case 9:
    return "rogue";

    case 10:
    return "sorcerer";

    case 11:
    return "warlock";

    case 12:
    return "wizard";

    default:
    return "none";
  }
}

function classToURL(class_name) {
    return "http://dnd5eapi.co/api/classes/" + classToIndex(class_name);
}

const class_names = ["barbarian","bard","cleric","druid","fighter",
        "monk","paladin","ranger","rogue","sorcerer","warlock","wizard"]

const class_map = {}
class_map[class_names[0]] = "Barbarian"
class_map[class_names[1]] = "Bard"
class_map[class_names[2]] = "Cleric"
class_map[class_names[3]] = "Druid"
class_map[class_names[4]] = "Fighter"
class_map[class_names[5]] = "Monk"
class_map[class_names[6]] = "Paladin"
class_map[class_names[7]] = "Ranger"
class_map[class_names[8]] = "Rogue"
class_map[class_names[9]] = "Sorcerer"
class_map[class_names[10]] = "Warlock"
class_map[class_names[11]] = "Wizard"


const subclass_names = ["berserker", "lore", "life", "land", "champion", "openhand", "devotion", "hunter",
"thief", "draconic", "fiend", "evocation"]

const subclass_map = {}
subclass_map[subclass_names[0]] = "Berserker"
subclass_map[subclass_names[1]] = "Lore"
subclass_map[subclass_names[2]] = "Life"
subclass_map[subclass_names[3]] = "Land"
subclass_map[subclass_names[4]] = "Champion"
subclass_map[subclass_names[5]] = "Open Hand"
subclass_map[subclass_names[6]] = "Devotion"
subclass_map[subclass_names[7]] = "Hunter"
subclass_map[subclass_names[8]] = "Thief"
subclass_map[subclass_names[9]] = "Draconic"
subclass_map[subclass_names[10]] = "Fiend"
subclass_map[subclass_names[11]] = "Evocation"





const race_names = ["dwarf", "elf", "halfling", "human"]

const subrace_names = ["hilldwarf", "highelf", "lightfoothalfling"]
const subrace_map = {}
subrace_map[subrace_names[0]] = "Hill Dwarf"
subrace_map[subrace_names[1]] = "High Elf"
subrace_map[subrace_names[2]] = "Lightfoot Halfling"




const proficiency_categories = ["armor", "weapons", "artisans-tools", "gaming-sets", "musical-instruments", "vehicles", "other", "skills", "saving-throws"]
const proficiency_map = {}
proficiency_map[proficiency_categories[0]] = "Armor"
proficiency_map[proficiency_categories[1]] = "Weapons"
proficiency_map[proficiency_categories[2]] = "Artisan's Tools"
proficiency_map[proficiency_categories[3]] = "Gaming Sets"
proficiency_map[proficiency_categories[4]] = "Musical Instruments"
proficiency_map[proficiency_categories[5]] = "Vehicles"
proficiency_map[proficiency_categories[6]] = "Other"
proficiency_map[proficiency_categories[7]] = "Skills"
proficiency_map[proficiency_categories[8]] = "Saving Throws"

function isClassName(class_name) {

    let bool = false;

    class_names.forEach(function(element) {
        if (class_name === element) {
            bool = true;
        }
    });

    return bool;
}

function isSubclassName(subclass_name) {

    let bool = false;

    subclass_names.forEach(function(element) {
        if (subclass_name === element) {
            bool = true;
        }
    });

    return bool;
}

function isRaceName(race_name) {

    let bool = false;

    race_names.forEach(function(element) {
        if (upperFirst(race_name) === element) {
            bool = true;
        }
    });

    return bool;
}

function isSubraceName(race_name) {

    let bool = false;

    subrace_names.forEach(function(element) {
        if (race_name === element) {
            bool = true;
        }
    });

    return bool;
}

function isProficiencyCategory(race_name) {

    let bool = false;

    proficiency_categories.forEach(function(element) {
        if (race_name === element) {
            bool = true;
        }
    });

    return bool;
}

function isEquipmentCategory(race_name) {

    let bool = false;

    equipment_categories.forEach(function(element) {
        if (race_name === element) {
            bool = true;
        }
    });

    return bool;
}

function APIResource(data) {
    return{
        count: data.length,
        results: data.map((item) => {
          return {
            url: item.url
          }
        })
      }
}

function ClassAPIResource(data) {
    return{
        count: data.length,
        results: data.map((item) => {
          return {
            class: item.class.name,
            url: item.url
          }
        })
      }
}


function NamedAPIResource(data) {

    let mapped = data.map((item) => {
          return {
            name: item.name,
            url: item.url
          }
        });

    let sort = mapped.sort((a,b) => {

        var urlA = a.url
        var urlB = b.url
        if (urlA < urlB) {
            return -1;
        }
        if (urlA > urlB) {
            return 1;
        }

        // names must be equal
        return 0;
    })

    return{
        count: data.length,
        results: data.map((item) => {
          return {
            name: item.name,
            url: item.url
          }
        })
      }
}

function NamedAPIResourceWithDesc(data) {
    return{
        count: data.length,
        results: data.map((item) => {
            return {
                name: item.name,
                url: item.url,
                desc: item.desc[0]
            }
        })
      }
}

function upperFirst(string) {
    return _.upperFirst(string);
}

var utility = {
    toLower,
    classToURL,
    classToIndex,
    indexToClass,
    isClassName,
    isSubclassName,
    isRaceName,
    isSubraceName,
    isProficiencyCategory,
    APIResource,
    NamedAPIResource,
    NamedAPIResourceWithDesc,
    ClassAPIResource,
    upperFirst,
    subrace_map,
    proficiency_map,
    class_map,
    subclass_map
}

module.exports = utility;
