/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function UpgraderCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
UpgraderCreep.prototype.doWork = function() {
    var room = this.worldController.getRoom(this.remember('birthRoom'));

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

    if (this._isHarvesting()) {
        if (!this._harvestEnergy(this)) {
            this._isUpgrading(true);
        }

        if (this._isFullyLoaded()) {
            this._isUpgrading(true);
        }
    }

};

module.exports = UpgraderCreep;
