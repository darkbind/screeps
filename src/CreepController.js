var c = require('Const'),
    Util = require('Util'),
    AbstractCreep = require('AbstractCreep'),
    HarvesterCreep = require('HarvesterCreep'),
    MinerCreep = require('MinerCreep'),
    DistributorCreep = require('DistributorCreep'),
    UpgraderCreep = require('UpgraderCreep'),
    BuilderCreep = require('BuilderCreep'),
    RepairCreep = require('RepairCreep'),
    ClaimerCreep = require('ClaimerCreep'),
    RemoteMinerCreep = require('RemoteMinerCreep'),
    RemoteHarvesterCreep = require('RemoteHarvesterCreep');


function CreepController(worldCtrl, resourceCtrl) {
    this.worldController = worldCtrl;
    this.resourceController = resourceCtrl;
    this.creepCollection = [];

    this.creepStats = {
        harvester: 0,
        miner: 0,
        upgrader: 0,
        builder: 0,
        repairer: 0,
        distributor: 0,
        claimer: 0,
        remoteMiner: 0,
        remoteHarvester: 0
    };
    this.creepCount = 0;

    this.hasUpgrader = false;
    this.hasHarvester = false;
    this.hasBuilder = false;
    this.hasRepairer = false;
    this.hasDistributor = false;
    this.hasMiner = false;
}

CreepController.prototype._emergencySuicide = function() {
    if (!Memory.lastEnergyHarvest || ((Memory.lastEnergyHarvest + 200) < Game.time)) {
        this.creepCollection.forEach(function (creep) {
            if (creep.remember('role') == c.CREEP_ROLE_MINER || creep.remember('role') == c.CREEP_ROLE_HARVESTER) {
                return;
            }

            creep.creep.suicide();
        });
    }
};

CreepController.prototype.run = function() {
    this._registerCreepCollection();
    this._checkCreepPopulation();
    this._doWork();
    this._emergencySuicide();
    this._buryDead();

    console.log('creeps stats', JSON.stringify(this.creepStats));
};

CreepController.prototype._discoverCreep = function(creep) {
    this.creepCount += 1;
    this.creepStats[creep.remember('role')] += 1;
    if (creep.remember('formerRole')) {
        if (!this.creepStats[creep.remember('formerRole')]) {
            this.creepStats[creep.remember('formerRole')] = 0;
        }

        this.creepStats[creep.remember('formerRole')] += 1;
    }
};

CreepController.prototype._registerCreepCollection = function() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name], wrappedCreep;

        if (!creep) {
            this._buryDead(name);
            continue;
        }

        switch (creep.memory.role) {
            case c.CREEP_ROLE_BUILDER: {
                wrappedCreep = new BuilderCreep(creep);
                this.hasBuilder = true;
                break;
            }
            case c.CREEP_ROLE_REPAIRER: {
                wrappedCreep = new RepairCreep(creep);
                this.hasRepairer = true;
                break;
            }

            case c.CREEP_ROLE_UPGRADER: {
                wrappedCreep = new UpgraderCreep(creep);
                this.hasUpgrader = true;
                break;
            }

            case c.CREEP_ROLE_HARVESTER: {
                wrappedCreep = new HarvesterCreep(creep);
                this.hasHarvester = true;
                break;
            }

            case c.CREEP_ROLE_REMOTE_HARVESTER: {
                wrappedCreep = new RemoteHarvesterCreep(creep);
                this.hasHarvester = true;
                break;
            }

            case c.CREEP_ROLE_DISTRIBUTOR: {
                wrappedCreep = new DistributorCreep(creep);
                this.hasDistributor = true;
                break;
            }

            case c.CREEP_ROLE_MINER: {
                wrappedCreep = new MinerCreep(creep);
                this.hasMiner = true;
                break;
            }

            case c.CREEP_ROLE_REMOTE_MINER: {
                wrappedCreep = new RemoteMinerCreep(creep);
                this.hasMiner = true;
                break;
            }

            case c.CREEP_ROLE_CLAIMER: {
                wrappedCreep = new ClaimerCreep(creep);
                this.hasMiner = true;
                break;
            }

            default: {
                continue;
            }
        }

        Util.inherit(AbstractCreep, wrappedCreep);
        wrappedCreep.setWorldController(this.worldController);
        wrappedCreep.setResourceController(this.resourceController);

        this._discoverCreep(wrappedCreep);
        this.creepCollection.push(wrappedCreep);
    }
};

CreepController.prototype._doWork = function() {
    this.creepCollection.forEach(function (creep) {
        creep.doWork();
    });
};

/**
 * checks creeps population
 * to fixed limits
 *
 * @param spawn
 */
CreepController.prototype._checkCreepPopulation = function() {
    // temporary
    var spawn = Game.spawns['Spawn1'];

    if (!this._creationPossible(spawn)) {
        return;
    }

    if (this.creepCount == 0 || !this.hasHarvester || this.creepStats[c.CREEP_ROLE_HARVESTER] < 2) {
        this._createCreep(spawn, c.CREEP_ROLE_HARVESTER);
        return;
    }

    if (!this.hasMiner || this.creepStats[c.CREEP_ROLE_MINER] < 2) {
        this._createCreep(spawn, c.CREEP_ROLE_MINER);
        return;
    }

    if (!this.hasUpgrader) {
        this._createCreep(spawn, c.CREEP_ROLE_UPGRADER);
        return;
    }

    var levelDefinition = c.LEVEL_DEFINITION[Memory.currentLevel];
    if (this.creepCount >= c.GLOBAL_CREEP_LIMIT || this.creepCount >= levelDefinition.creepLimit) {
        return;
    }

    if (!this.hasRepairer) {
        this._createCreep(spawn, c.CREEP_ROLE_REPAIRER);
        return;
    }

    if (!this.hasDistributor) {
        this._createCreep(spawn, c.CREEP_ROLE_DISTRIBUTOR);
        return;
    }

    if (!this.hasBuilder) {
        this._createCreep(spawn, c.CREEP_ROLE_BUILDER);
        return;
    }

    for (var role in levelDefinition.creepInstances) {
        if (this.creepStats[role] < levelDefinition.creepInstances[role]) {
            this._createCreep(spawn, role);
            return;
        }
    }
};

/**
 * creates a creep
 *
 * @param spawn
 * @param role
 */
CreepController.prototype._createCreep = function(spawn, role) {
    console.log('try create ' + role);
    if (this._creationPossible(spawn, role)) {
        var creationEnergy = this.worldController.getSpawnEnergyTotal(spawn),
            generalConstructionPlan = c.GLOBAL_BUILD_PATTERN[role],
            levelConstructionPlan = c.GLOBAL_BUILD_PATTERN[role][Memory.currentLevel],
            buildPattern = levelConstructionPlan.pattern.slice(0),
            extensionOrder = generalConstructionPlan.extensionOrder.slice(0),
            diff = creationEnergy - levelConstructionPlan.cost;

        console.log('creationEnergy: ' + creationEnergy);
        console.log('buildPattern before: ' + JSON.stringify(buildPattern));

        if (diff >= c.MIN_ENERGY_CHUNK) {
            var i = 0, x = 0, part, cost;
            while (diff >= c.MIN_ENERGY_CHUNK) {
                if (x > 12) {
                    break;
                }

                if (i == extensionOrder.length) {
                    i = 0;
                }

                part = extensionOrder[i];
                cost = BODYPART_COST[part];

                if (diff - cost >= 0) {
                    x++;
                    buildPattern.push(part);
                    diff -= cost;
                } else {
                    break;
                }

                i++;
            }
        }

        console.log('buildPattern after: ' + JSON.stringify(buildPattern));
        var creepArgs = {role: role, canRepair: false, birthRoom: spawn.room.name};
        creepArgs.canRepair = Memory.isRepairBuilder;
        if (role == c.CREEP_ROLE_BUILDER) {
            Memory.isRepairBuilder = !Memory.isRepairBuilder;
        }

        console.log(spawn.createCreep(buildPattern, null, creepArgs));
    } else {
        console.log('create ' + role + ' failed - no energy');
    }
};

/**
 * spawn can create creep
 *
 * @param spawn
 * @param role
 * @returns {boolean}
 */
CreepController.prototype._creationPossible = function(spawn, role) {
    var energy = this.worldController.getSpawnEnergyTotal(spawn);
    if (role == undefined) {
        return energy >= c.MIN_CREEP_ENERGY_LEVEL;
    }

    return this.worldController.getSpawnEnergyTotal(spawn) >= c.GLOBAL_BUILD_PATTERN[role][Memory.currentLevel].cost;
};

CreepController.prototype._buryDead = function(creepToBury) {
    if (creepToBury != undefined) {
        delete Memory.creeps[creepToBury];
        return;
    }

    for (var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};

module.exports = CreepController;
