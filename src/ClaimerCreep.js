/**
 * units constructor
 *
 * @param creep
 * @constructor
 */
function ClaimerCreep(creep) {
    this.creep = creep;
}

/**
 * units main routing
 */
ClaimerCreep.prototype.doWork = function() {
    var remoteFlag = Game.flags['REMOTE'];
    if (!remoteFlag) {
        return;
    }

    if (this.creep.pos.roomName != remoteFlag.pos.roomName) {
        this._walk(remoteFlag);
        return;
    }


    // claim controller
    var controller = this.creep.room.controller;
    if (this.creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
        this._walk(controller);
    }
};

module.exports = ClaimerCreep;
