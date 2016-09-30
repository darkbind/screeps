/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function RemoteHarvesterCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
RemoteHarvesterCreep.prototype.doWork = function() {
    var birthRoom = this.worldController.getRoom(this.remember('birthRoom'));

    if (!this.remember('task')) {
        this._isHarvesting(true);
    }

    var remoteMiningFlag = Game.flags['REMOTE'];
    if (!remoteMiningFlag) {
        return;
    }

    if (this._isHarvesting() && (this.creep.pos.roomName != remoteMiningFlag.pos.roomName || this.creep.pos.getRangeTo(remoteMiningFlag) > 4)) {
        this._walk(remoteMiningFlag);
        return;
    }


    if (this._isTransferring()) {
        if (!this._hasEnergy()) {
            this._isHarvesting(true);
        }

        var target = birthRoom.getDestinationForHarvester(this);
        if (target) {
            switch(this.creep.transfer(target, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE: {
                    this._walk(target);
                    break;
                }
                case ERR_NOT_ENOUGH_RESOURCES: {
                    this._isHarvesting(true);
                    break;
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
            this._isTransferring(true);
        }

        if (this._isFullyLoaded()) {
            this._isTransferring(true);
        }
    }

};

module.exports = RemoteHarvesterCreep;
