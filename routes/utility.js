var _ = require('lodash');

function classToIndex(class_name) {
    switch(class_name) {
        case "Barbarian":
        return 1;
        case "Bard":
        return 2;
        case "Cleric":
        return 3;
        case "Druid":
        return 4;
        case "Fighter":
        return 5;
        case "Monk":
        return 6;
        case "Paladin":
        return 7;
        case "Ranger":
        return 8;
        case "Rogue":
        return 9;
        case "Sorcerer":
        return 10;
        case "Warlock":
        return 11;
        case "Wizard":
        return 12;
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

function classToURL(class_name) {
    return "http://dnd5eapi.co/api/classes/" + classToIndex(class_name);
}

var class_names = ["Barbarian","Bard","Cleric","Druid","Fighter",
        "Monk","Paladin","Ranger","Rogue","Sorcerer","Warlock","Wizard"]

var race_names = ["Dwarf", "Elf", "Halfling", "Human"]


var subrace_names = ["dwarf-hill", "elf-high", "halfling-lightfoot"]
var subrace_map = {}
subrace_map[subrace_names[0]] = "Hill Dwarf"
subrace_map[subrace_names[1]] = "High Elf"
subrace_map[subrace_names[2]] = "Lightfoot Halfling"

var proficiency_categories = ["armor", "weapons", "artisans-tools", "gaming-sets", "musical-instruments", "vehicles", "other", "skills", "saving-throws"]
proficiency_map = {}
proficiency_map[proficiency_categories[0]] = "Armor"
proficiency_map[proficiency_categories[1]] = "Weapons"
proficiency_map[proficiency_categories[2]] = "Artisan's Tools"
proficiency_map[proficiency_categories[3]] = "Gaming Sets"
proficiency_map[proficiency_categories[4]] = "Musical Instruments"
proficiency_map[proficiency_categories[5]] = "Vehicles"
proficiency_map[proficiency_categories[6]] = "Other"
proficiency_map[proficiency_categories[7]] = "Skills"
proficiency_map[proficiency_categories[8]] = "Saving Throws"

var equipment_categories = ["armor", "weapons", "gear", "tools", "mounts"]
var equipment_map = {}
equipment_map[equipment_categories[0]] = "Armor"
equipment_map[equipment_categories[1]] = "Weapon"
equipment_map[equipment_categories[2]] = "Adventuring Gear"
equipment_map[equipment_categories[3]] = "Tools"
equipment_map[equipment_categories[4]] = "Mounts and Vehicles"


function isClassName(class_name) {

    let bool = false;

    class_names.forEach(function(element) {
        if (upperFirst(class_name) === element) {
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
    classToURL,
    classToIndex,
    isClassName,
    isRaceName,
    isSubraceName,
    isProficiencyCategory,
    isEquipmentCategory,
    APIResource,
    NamedAPIResource,
    NamedAPIResourceWithDesc,
    ClassAPIResource,
    upperFirst,
    subrace_map,
    proficiency_map,
    equipment_map
}

module.exports = utility;