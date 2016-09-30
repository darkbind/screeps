var c = require('Const');

/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function BuilderCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
BuilderCreep.prototype.doWork = function() {
    for (var roomName in this.worldController.roomCollection) {
        var room = this.worldController.getRoom(roomName);
        var target = room.getConstructionSite(this);
        if (target) {
            break;
        }
    }

    if (!this.remember('task')) {
        this._isHarvesting(true);
    }

    if (this._isUpgrading()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        var controller = room.getRoomController();
        if (controller) {
            switch(this.creep.upgradeController(controller)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(controller);
                    break;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    this._isHarvesting(true);
                    break;
                }
                case ERR_FULL: {
                    return;
                }
            }
        } else {
            if (this._isFullyLoaded()) {
                console.log(this.creep, this.remember('role'), 'resting');
                return;
            }

            this._isHarvesting(true);
        }
    }

    if (this._isBuilding()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        if (target) {
            switch(this.creep.build(target)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(target);
                    break;
                }
            }
        } else {
            // nothing to do and fully charged
            if (this._isFullyLoaded()) {
                this.remember('task', c.CREEP_TASK_UPGRADING);
                return;
            }

            this._isHarvesting(true);
        }
    }

    if (this._isHarvesting()) {
        if (!this._harvestEnergy(this)) {
            this._isBuilding(true);
        }

        if (this._isFullyLoaded()) {
            this._isBuilding(true);
        }
    }

};

module.exports = BuilderCreep;
