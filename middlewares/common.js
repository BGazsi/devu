/**
 * Load a dependency from an object repository
 * @param objectRepository object repository
 * @param propertyName dependency name
 * @returns {*}
 */

function requireOption(objectRepository, propertyName) {
    if (objectRepository && objectRepository[propertyName]) {
        return objectRepository[propertyName];
    }
    throw new TypeError(propertyName + ' required');
}

function removeFromArray(array, index) {
    var firstPart = array.slice(0, index);
    var secondPart = array.slice(index + 1);
    firstPart = firstPart.concat(secondPart);
    return firstPart;
}

module.exports.requireOption = requireOption;
module.exports.removeFromArray = removeFromArray;
