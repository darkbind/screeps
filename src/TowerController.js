var c = require('Const');

function TowerController(worldCtrl) {
    this.worldController = worldCtrl;
}

TowerController.prototype.run = function() {
    for (var roomName in this.worldController.roomCollection) {
        var room = this.worldController.roomCollection[roomName];
        if (!this.worldController.towerCollection[roomName] || this.worldController.towerCollection[roomName].length == 0) {
            continue;
        }

        if (!this._defendRoom(room) && !this._healCreeps(room)) {
            this._repairStructures(room);
        }
    }
};

TowerController.prototype._defendRoom = function(room) {
    var hostiles = room.getInvaderCollection();
    Memory.invaderSpotted = hostiles.length > 0;
    if (!Memory.invaderSpotted) {
        return false;
    }

    var towers = this.worldController.towerCollection[room.getName()] || [];
    towers.forEach(function (tower) {
        if (!tower) {
            return;
        }

        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        tower.attack(target);
    });

    return true;
};

TowerController.prototype._healCreeps = function(room) {
    var injuredCreeps = room.room.find(FIND_MY_CREEPS, {
        filter: function (creep) {
            return creep.hits < creep.hitsMax
        }
    });

    if (injuredCreeps.length == 0) {
        return false;
    }

    injuredCreeps.sort(function (a, b) {
        return a.hits / a.hitsMax - b.hits / b.hitsMax;
    });

    var towers = this.worldController.towerCollection[room.getName()] || [];
    towers.forEach(function (tower) {
        if (!tower) {
            return;
        }

        tower.heal(injuredCreeps[0]);
    });

    return true;
};

TowerController.prototype._repairStructures = function(room) {
    var towerCollection = this.worldController.towerCollection[room.getName()] || [];
    var repairableStructureCollection = room.getRepairableStructureCollection();
    if (!repairableStructureCollection) {
        return;
    }

    repairableStructureCollection.sort(function(a, b) {
        var repairLevelA = c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][a.structureType] || 1,
            repairLevelB = c.LEVEL_DEFINITION[Memory.currentLevel]['maxRepairFactor'][b.structureType] || 1;

        return (a.hits / (a.hitsMax / repairLevelA) - b.hits / (b.hitsMax / repairLevelB));
    });

    towerCollection.forEach(function (tower) {
        if (!tower) {
            return;
        }

        if (tower.energy <= 100) {
            return;
        }

        var repairTarget;
        Memory.tower = Memory.tower || {};
        var towerData = Memory.tower[tower.id];
        if (!towerData) {
            Memory.tower[tower.id] = {};
        }

        repairTarget = repairableStructureCollection[0];
        tower.repair(repairTarget);
    }.bind(this));

    return true;
};


module.exports = TowerController;
