function LinkController(worldCtrl) {
    this.worldController = worldCtrl;
}

LinkController.prototype.run = function() {
    for (var roomName in this.worldController.roomCollection) {
        var room = this.worldController.roomCollection[roomName];
        if (!this.worldController.linkCollection[roomName] || this.worldController.linkCollection[roomName].length == 0) {
            continue;
        }

        this._transferEnergy(room);
    }
};

LinkController.prototype._transferEnergy = function(room) {
    var linkCollection = this.worldController.linkCollection[room.getName()] || [];
    linkCollection.forEach(function(link) {
        if (link.cooldown > 0 && link.energy <= 0) {
            return;
        }

        if (!Memory.linkHandling.sourceLinkCollection[link.id]) {
            return;
        }

        for (var targetLinkId in Memory.linkHandling.targetLinkCollection) {
            var targetLink = Game.getObjectById(targetLinkId)
            if (!targetLink || Memory.linkHandling.targetLinkCollection[targetLinkId] != link.id) {
                continue;
            }

            link.transferEnergy(targetLink);
        }
    });
};


module.exports = LinkController;
