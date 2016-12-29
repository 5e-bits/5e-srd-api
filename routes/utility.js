

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

function isClassName(class_name) {
    return class_name === "Barbarian" || "Bard" || "Cleric" || "Druid" || "Fighter" || 
        "Monk" || "Paladin" || "Ranger" || "Rogue" || "Sorcerer" || "Warlock" || "Wizard" ||
        "barbarian" || "bard" || "cleric" || "druid" || "fighter" || 
        "monk" || "paladin" || "ranger" || "rogue" || "sorcerer" || "warlock" || "wizard";
}

var utility = {
    classToURL,
    classToIndex,
    isClassName
}

module.exports = utility;