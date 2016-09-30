var WorldController = require('WorldController'),
    CreepController = require('CreepController'),
    ResourceController = require('ResourceController'),
    LinkController = require('LinkController'),
    TowerController = require('TowerController');


console.log('received tick');
WorldController.init();
WorldController.measureWorld();

module.exports.loop = function() {
    var resCtrl = new ResourceController(WorldController);
    //resCtrl.checkResourceBalance();

    new TowerController(WorldController).run();
    new LinkController(WorldController).run();
    new CreepController(WorldController, resCtrl).run();
};