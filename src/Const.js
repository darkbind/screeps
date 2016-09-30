module.exports = {
    GLOBAL_CREEP_LIMIT: 30,

    CREEP_ROLE_HARVESTER: 'harvester',
    CREEP_ROLE_REMOTE_HARVESTER: 'remoteHarvester',
    CREEP_ROLE_MINER: 'miner',
    CREEP_ROLE_REMOTE_MINER: 'remoteMiner',
    CREEP_ROLE_CLAIMER: 'claimer',
    CREEP_ROLE_WARRIOR: 'warrior',
    CREEP_ROLE_DISTRIBUTOR: 'distributor',
    CREEP_ROLE_BUILDER: 'builder',
    CREEP_ROLE_UPGRADER: 'upgrader',
    CREEP_ROLE_REPAIRER: 'repairer',

    CREEP_TASK_HARVESTING: 'harvesting',
    CREEP_TASK_MINING: 'mining',
    CREEP_TASK_UPGRADING: 'upgrading',
    CREEP_TASK_BUILDING: 'building',
    CREEP_TASK_REPAIRING: 'repairing',
    CREEP_TASK_TRANSFERRING: 'transferring',

    LEVEL1: 'LEVEL1',
    LEVEL2: 'LEVEL2',
    LEVEL3: 'LEVEL3',

    LEVEL_DEFINITION: {
        LEVEL1: {
            minEnergy: 0,
            creepLimit: 9,
            creepInstances: {
                harvester: 2,
                miner: 2,
                distributor: 1,
                repairer: 1,
                builder: 1,
                upgrader: 1,
                remoteMiner: 0,
                remoteHarvester: 0
            },
            maxRepairFactor: {
                'constructedWall': 30000,
                'rampart': 300,
                'road': 4,
                'container': 10
            }
        },
        LEVEL2: {
            minEnergy: 400,
            creepLimit: 18,
            creepInstances: {
                miner: 4,
                harvester: 4,
                distributor: 2,
                builder: 2,
                upgrader: 4,
                repairer: 2,
                remoteMiner: 0,
                remoteHarvester: 0
            },
            maxRepairFactor: {
                'constructedWall': 1000,
                'rampart': 10,
                'road': 2,
                'container': 5
            }
        },
        LEVEL3: {
            minEnergy: 700,
            creepLimit: 24,
            creepInstances: {
                miner: 4,
                harvester: 5,
                distributor: 3,
                builder: 1,
                upgrader: 4,
                repairer: 2,
                remoteMiner: 1,
                remoteHarvester: 2,
                claimer: 1,
            },
            maxRepairFactor: {
                'constructedWall': 500,
                'rampart': 5,
                'road': 2,
                'container': 2
            }
        }
    },

    MIN_ENERGY_CHUNK: 50,
    MIN_CREEP_ENERGY_LEVEL: 200,

    GLOBAL_BUILD_PATTERN: {
        distributor: {
            extensionOrder: [CARRY, CARRY, CARRY, MOVE],
            LEVEL1: {
                pattern: [CARRY, CARRY, MOVE, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [CARRY, CARRY, MOVE, MOVE],
                cost: 200
            },
            LEVEL3: {
                pattern: [CARRY, CARRY, MOVE, MOVE],
                cost: 200
            },
        },
        harvester: {
            extensionOrder: [CARRY, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
            LEVEL2: {
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
            LEVEL3: {
                pattern: [WORK, CARRY, MOVE, CARRY, MOVE],
                cost: 300
            },
        },
        remoteHarvester: {
            extensionOrder: [CARRY, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, CARRY, MOVE, MOVE],
                cost: 300
            },
            LEVEL2: {
                pattern: [WORK, CARRY, CARRY, CARRY, MOVE],
                cost: 300
            },
            LEVEL3: {
                pattern: [WORK, CARRY, CARRY, CARRY, MOVE],
                cost: 300
            },
        },
        upgrader: {
            extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL3: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            }
        },
        builder: {
            extensionOrder: [WORK, CARRY, WORK, CARRY, MOVE],
            LEVEL1: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL2: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            },
            LEVEL3: {
                pattern: [WORK, CARRY, MOVE],
                cost: 200
            }
        },
        repairer: {
            extensionOrder: [CARRY, CARRY, MOVE, MOVE, WORK, WORK],
            LEVEL1: {
                pattern: [WORK, WORK, CARRY, MOVE],
                cost: 300
            },
            LEVEL2: {
                pattern: [WORK, WORK, CARRY, MOVE],
                cost: 300
            },
            LEVEL3: {
                pattern: [WORK, WORK, CARRY, MOVE],
                cost: 300
            }
        },
        miner: {
            extensionOrder: [WORK, WORK, WORK, WORK],
            LEVEL1: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            },
            LEVEL2: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            },
            LEVEL3: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            }
        },
        remoteMiner: {
            extensionOrder: [WORK, WORK, WORK, WORK],
            LEVEL1: {
                pattern: [WORK, WORK, MOVE],
                cost: 250
            },
            LEVEL2: {
                pattern: [WORK, WORK, WORK, MOVE],
                cost: 350
            },
            LEVEL3: {
                pattern: [WORK, WORK, WORK, WORK, WORK, MOVE],
                cost: 550
            }
        },
        claimer: {
            extensionOrder: [CLAIM, MOVE],
            LEVEL3: {
                pattern: [CLAIM, CLAIM, MOVE],
                cost: 1250
            }
        }
    },

    DISTRIBUTION_ENERGY_RELEVANCE: {
        'spawn':        10000000,
        'extension':    7700000,
        'tower':        7600000,
        'link':         7500000,
        'container':    7400000,
        'storage':      7300000
    },

    REFILL_ENERGY_RELEVANCE: {
        'tower':        800000,
        'spawn':        300000,
        'storage':      100000,
        'container':    50000
    }
};
