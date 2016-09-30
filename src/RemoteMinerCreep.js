/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function RemoteMinerCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
RemoteMinerCreep.prototype.doWork = function() {
    if (!this.remember('task')) {
        this._isMining(true);
    }

    var remoteMiningFlag = Game.flags['REMOTE'];
    if (!remoteMiningFlag) {
        return;
    }

    if (this.creep.pos.roomName != remoteMiningFlag.pos.roomName || this.creep.pos.getRangeTo(remoteMiningFlag) > 4) {
        this._walk(remoteMiningFlag);
        return;
    }

    if (this._isMining()) {
        this._harvestEnergy(this);
    }

};

module.exports = RemoteMinerCreep;
