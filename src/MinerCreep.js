/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function MinerCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
MinerCreep.prototype.doWork = function() {
    if (!this.remember('task')) {
        this._isMining(true);
    }

    if (this._isMining()) {
        this._harvestEnergy(this);
    }

};

module.exports = MinerCreep;
