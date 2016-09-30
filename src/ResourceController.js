var c = require('Const');
function ResourceController(worldController) {
    this.worldController = worldController;
}

ResourceController.prototype.checkResourceBalance = function() {
    Memory.resourceBalance = Memory.resourceBalance || {};
    for (var resourceId in this.worldController.resourceCollection) {
        console.log('resourceController', 'checking', resourceId);
        var resource = this.worldController.resourceCollection[resourceId];
        Memory.resourceBalance[resource.id] = Memory.resourceBalance[resource.id] || {};

        this._checkBalance(resource);
    }

    console.log('resourceController', 'balance', JSON.stringify(Memory.resourceBalance));
};

ResourceController.prototype._checkBalance = function(resource) {
    Memory.resourceBalance[resource.id].room = resource.pos.roomName;
    Memory.resourceBalance[resource.id].harvesterCount = 0;
    Memory.resourceBalance[resource.id].harvester = Memory.resourceBalance[resource.id].harvester || {};

    Memory.resourceBalance[resource.id].minerCount = 0;
    Memory.resourceBalance[resource.id].miner = Memory.resourceBalance[resource.id].miner || {};

    for (var harvesterCreep in Memory.resourceBalance[resource.id].harvester) {
        if (!Game.creeps[harvesterCreep]) {
            delete Memory.resourceBalance[resource.id].harvester[harvesterCreep];
        } else {
            Memory.resourceBalance[resource.id].harvesterCount += 1;
        }
    }

    for (var minerCreep in Memory.resourceBalance[resource.id].miner) {
        if (!Game.creeps[minerCreep]) {
            delete Memory.resourceBalance[resource.id].miner[minerCreep];
        } else {
            Memory.resourceBalance[resource.id].minerCount += 1;
        }
    }
};

ResourceController.prototype.getResource = function(creep) {
    console.log('resourceController', 'getResource', creep.creep);
    if (creep.remember('usedSourceId')
        && Memory.resourceBalance[creep.remember('usedSourceId')]
        && ((creep.remember('usedSourceSet') + 1500) > Game.time)
    ) {
        console.log('resourceController', 'get cached resource', creep.creep, creep.remember('role'), creep.remember('usedSourceId'));
        if (this.worldController.resourceCollection[creep.remember('usedSourceId')]) {
            return this.worldController.resourceCollection[creep.remember('usedSourceId')];
        }
    }

    var chosenResourceId = this._locateBestMatchingResource(creep),
        chosenResource = this.worldController.resourceCollection[chosenResourceId];

    if (chosenResource) {
        console.log('resourceController', 'set chosen resource', creep.creep, chosenResource);
        var role = creep.remember('role');
        if (role == c.CREEP_ROLE_HARVESTER || c.CREEP_ROLE_REMOTE_HARVESTER) {
            role = c.CREEP_ROLE_HARVESTER
        }
        if (role == c.CREEP_ROLE_MINER || c.CREEP_ROLE_REMOTE_MINER) {
            role = c.CREEP_ROLE_MINER;
        }
        Memory.resourceBalance[chosenResourceId][role+'Count'] += 1;
        Memory.resourceBalance[chosenResourceId][role][creep.creep.name] = creep.creep.name;

        creep.remember('usedSourceId', chosenResourceId);
        creep.remember('usedSourceSet', Game.time);
        return chosenResource;
    }
};

ResourceController.prototype._locateBestMatchingResource = function(creep) {
    console.log('resourceController', 'locate best matching resource', creep.creep);
    var bestMatching, count = 0;
    for (var resourceId in Memory.resourceBalance) {
        console.log('checking resource id for', creep.creep, resourceId);
        var resourceBalance = Memory.resourceBalance[resourceId];
        if (creep.remember('role') == c.CREEP_ROLE_MINER || creep.remember('role') == c.CREEP_ROLE_REMOTE_MINER) {
            console.log('checking miner count', resourceBalance.minerCount, count);
            if (resourceBalance.minerCount < count || count == 0) {
                count = resourceBalance.minerCount + 1;
                bestMatching = resourceId;
            }
        }

        if (creep.remember('role') == c.CREEP_ROLE_HARVESTER || creep.remember('role') == c.CREEP_ROLE_REMOTE_HARVESTER) {
            console.log('checking harvester count', resourceBalance.harvesterCount, count);
            if (resourceBalance.harvesterCount < count || count == 0) {
                count = resourceBalance.harvesterCount + 1;
                bestMatching = resourceId;
            }
        }
    }

    console.log('resourceController', 'best matching', bestMatching);

    return bestMatching;
};

module.exports = ResourceController;