var c = require('Const'),
    cache = require('Cache'),
    PlayRoom = require('PlayRoom');

var WorldController = {
    roomCollection: {},
    constructionSiteCollection: {},
    repairStructureCollection: {},
    resourceCollection: {},
    energyCollection: {},
    towerCollection: {},
    linkCollection: {},

    storage: null,
    maxEnergy: 0,
    currentEnergy: 0
};

WorldController.init = function() {
    Memory.currentLevel = Memory.currentLevel || c.LEVEL1;
    Memory.linkHandling = Memory.linkHandling || {};
    Memory.linkHandling.sourceLinkCollection = Memory.linkHandling.sourceLinkCollection || {};
    Memory.linkHandling.targetLinkCollection = Memory.linkHandling.targetLinkCollection || {};

    // temporary
    this.checkCurrentLevel(Game.spawns['Spawn1']);
};

WorldController.getRoom = function(roomName) {
    return this.roomCollection[roomName];
};

WorldController.measureWorld = function() {
    var discoveredRoomCollection = cache.get('discoveredRoomCollection') || {};

    for (var i in Game.rooms) {
        var room = Game.rooms[i];
        if (discoveredRoomCollection[room.name]) {
            continue;
        }

        if (!discoveredRoomCollection[i]) {
            console.log('discovering room', i);
            var playRoom = new PlayRoom(room, this);
            playRoom.initStructureCollections();
            this.measureRoom(playRoom);

            discoveredRoomCollection[i] = playRoom;
        }
    }

    cache.set('discoveredRoomCollection', discoveredRoomCollection);
    this.roomCollection = discoveredRoomCollection;
};

WorldController.measureRoom = function(room) {
    this.energyCollection[room.getName()] = room.getDroppedEnergyCollection();
    var roomResourceCollection = room.getEnergyResourceCollection();
    for (var roomResource in roomResourceCollection) {
        var resource = roomResourceCollection[roomResource];
        this.resourceCollection[resource.id] = resource;
    }

    this.towerCollection[room.getName()] = room.getTowerCollection();
    this.linkCollection[room.getName()] = room.getLinkCollection();

    this.repairStructureCollection[room.getName()] = room.getRepairableStructureCollection();
};

/**
 * checks current creeps level depends on
 * available energy
 *
 * @param spawn
 */
WorldController.checkCurrentLevel = function(spawn) {
    var energy = this.getSpawnEnergyTotal(spawn);
    for (var level in c.LEVEL_DEFINITION) {
        if (level <= Memory.currentLevel) {
            continue;
        }

        if (energy >= c.LEVEL_DEFINITION[level].minEnergy) {
            console.log('upgrading level to ' + level);
            Memory.currentLevel = level;
        }
    }
};

/**
 *
 * @param spawn
 * @returns {number}
 */
WorldController.getSpawnEnergyTotal = function(spawn) {
    if (this.currentEnergy > 0) {
        return this.currentEnergy;
    }

    this.currentEnergy = spawn.energy;
    this.maxEnergy = spawn.energyCapacity;
    var extensionCollection = spawn.room.find(FIND_STRUCTURES, {
        filter: function(structure) {
            return (structure.structureType == STRUCTURE_EXTENSION)
        }
    });

    for (var extension in extensionCollection) {
        this.currentEnergy += extensionCollection[extension].energy;
        this.maxEnergy += extensionCollection[extension].energyCapacity;
    }

    return this.currentEnergy;
};

WorldController.getEnergyLevel = function() {
    return (this.currentEnergy / this.maxEnergy)*100;
};

WorldController.debugInfo = function() {
    console.log('constructionSites', JSON.stringify(this.constructionSiteCollection));
    console.log('resourceCollection', JSON.stringify(this.resourceCollection));
    console.log('repairStructureCollection', JSON.stringify(this.repairStructureCollection));
    console.log('energyCollection', JSON.stringify(this.energyCollection));
};

module.exports = WorldController;