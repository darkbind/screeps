var Util = {};
Util.inherit = function(objectA, objectB) {
    for (var prop in objectA) {
        if (objectA.hasOwnProperty(prop)) {
            objectB[prop] = objectA[prop];
        }
    }

    return objectA;
};



module.exports = Util;
