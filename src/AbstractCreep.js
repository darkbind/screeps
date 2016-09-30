var c = require('Const');

var AbstractCreep = {
    worldController: null,
    resourceController: null
};

AbstractCreep.setWorldController = function(worldCtrl) {
    this.worldController = worldCtrl;
};

AbstractCreep.setResourceController = function(resourceCtrl) {
    this.resourceController = resourceCtrl;
};

AbstractCreep.getRole = function(realRole) {
    var role = this.remember('role');
    if (realRole) {
        return role;
    }

    switch (role) {
        case c.CREEP_ROLE_REMOTE_HARVESTER: {
            role = c.CREEP_ROLE_HARVESTER;
            break;
        }
        case c.CREEP_ROLE_REMOTE_MINER: {
            role = c.CREEP_ROLE_MINER;
            break;
        }
    }

    return role;
};

/**
 * units memory access
 *
 * @param key
 * @param value
 * @returns {*}
 */
AbstractCreep.remember = function(key, value) {
    if (value == undefined) {
        return this.creep.memory[key];
    }

    this.creep.memory[key] = value;
    return value;
};

/**
 * remove units memory key
 *
 * @param key
 */
AbstractCreep.forget = function(key) {
    delete this.creep.memory[key];
};

/**
 * role morphing
 *
 * @param newRole
 */
AbstractCreep._morphTo = function(newRole) {
    this.remember('formerRole', this.remember('role'));
    this.remember('role', newRole);
    this.forget('task');
};

/**
 * indicates the unit carries energy
 *
 * @returns {boolean}
 * @private
 */
AbstractCreep._hasEnergy = function() {
    return this.creep.carry.energy > 0;
};

/**
 * indicates the unit cannot harvest/carry more energy
 *
 * @returns {boolean}
 * @private
 */
AbstractCreep._isFullyLoaded = function() {
    return this.creep.carry.energy == this.creep.carryCapacity;
};

/**
 * indicates the unit is transferring energy
 *
 * @param startTransferring let the unit start working
 * @returns {boolean}
 * @private
 */
AbstractCreep._isTransferring = function(startTransferring) {
    if (startTransferring == undefined) {
        return this.remember('task') == c.CREEP_TASK_TRANSFERRING;
    }

    return this.remember('task', c.CREEP_TASK_TRANSFERRING);
};

/**
 * indicates the unit needs energy and is harvesting
 *
 * @param startHarvesting let the unit start harvesting
 * @returns {boolean}
 * @private
 */
AbstractCreep._isHarvesting = function(startHarvesting) {
    if (startHarvesting == undefined) {
        return this.remember('task') == c.CREEP_TASK_HARVESTING;
    }

    return this.remember('task', c.CREEP_TASK_HARVESTING);
};

/**
 * indicates the unit is mining
 *
 * @param startMining let the unit start mining
 * @returns {boolean}
 * @private
 */
AbstractCreep._isMining = function(startMining) {
    if (startMining == undefined) {
        return this.remember('task') == c.CREEP_TASK_MINING;
    }

    return this.remember('task', c.CREEP_TASK_MINING);
};

/**
 * indicates the unit is upgrading
 *
 * @param startUpgrading let the unit start upgrading
 * @returns {boolean}
 * @private
 */
AbstractCreep._isUpgrading = function(startUpgrading) {
    if (startUpgrading == undefined) {
        return this.remember('task') == c.CREEP_TASK_UPGRADING;
    }

    return this.remember('task', c.CREEP_TASK_UPGRADING);
};

/**
 * indicates the unit is building
 *
 * @param startBuilding let the unit start upgrading
 * @returns {boolean}
 * @private
 */
AbstractCreep._isBuilding = function(startBuilding) {
    if (startBuilding == undefined) {
        return this.remember('task') == c.CREEP_TASK_BUILDING;
    }

    return this.remember('task', c.CREEP_TASK_BUILDING);
};

/**
 * indicates the unit is repairing
 *
 * @param startRepairing let the unit start repairing
 * @returns {boolean}
 * @private
 */
AbstractCreep._isRepairing = function(startRepairing) {
    if (startRepairing == undefined) {
        return this.remember('task') == c.CREEP_TASK_REPAIRING;
    }

    return this.remember('task', c.CREEP_TASK_REPAIRING);
};

/**
 * harvesting energy
 *
 * @param creep
 * @returns {boolean}
 * @private
 */
AbstractCreep._harvestEnergy = function(creep) {
    var room = this.worldController.getRoom(creep.creep.room.name),
        sourceHandler = room.sourceHandler;

    console.log('abstract', '_harvestEnergy', creep.creep, room.getName());
    var res = sourceHandler.getEnergy(creep);
    switch (res) {
        case ERR_FULL: {
            return false;
        }
        case ERR_NOT_ENOUGH_RESOURCES: {
            return !this._hasEnergy();
        }
        case ERR_INVALID_ARGS: {
            return !this._hasEnergy();
        }
        case ERR_INVALID_TARGET: {
            if (!this._hasEnergy()) {
                this._walk(Game.flags['RESTING']);
            }

            return false;
        }
    }

    if (creep.getRole() != c.CREEP_ROLE_MINER && creep.getRole() != c.CREEP_ROLE_HARVESTER) {
        Memory.lastEnergyHarvest = Game.time;
    }

    return true;
};

/**
 * move creep to target
 * if on swamp, collect the info
 *
 * @param target
 * @private
 */
AbstractCreep._walk = function(target) {
    this.creep.moveTo(target, {reusePath: 50});
};

module.exports = AbstractCreep;
