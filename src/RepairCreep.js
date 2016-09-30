/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function RepairCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
RepairCreep.prototype.doWork = function() {
    var room = this.worldController.getRoom(this.creep.room.name);

    if (!this.remember('task')) {
        this._isHarvesting(true);
    }

    if (this._isRepairing()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        var target = room.getRepairableStructure(this);
        if (target) {
            switch(this.creep.repair(target)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(target);
                    break;
                }
            }
        } else {
            // nothing to do and fully charged
            if (this._isFullyLoaded()) {
                return;
            }

            this._isHarvesting(true);
        }
    }

    if (this._isHarvesting()) {
        if (!this._harvestEnergy(this)) {
            this._isRepairing(true);
        }

        if (this._isFullyLoaded()) {
            this._isRepairing(true);
        }
    }

};

module.exports = RepairCreep;
