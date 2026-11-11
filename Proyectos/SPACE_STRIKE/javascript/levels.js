/* SPACE STRIKE LEVELS v2.0.1 — 500 sectors */
const ADVENTURE_LEVELS = [
    {
        "id": 1,
        "name": "OUTPOST",
        "target": 490,
        "excellency": 759,
        "timeLimit": 120,
        "coins": 46,
        "kills": 10,
        "allowedTypes": [
            "basic"
        ],
        "map": {
            "x": 12,
            "y": 96.0
        }
    },
    {
        "id": 2,
        "name": "DRIFT",
        "target": 580,
        "excellency": 899,
        "timeLimit": 121,
        "coins": 52,
        "kills": 10,
        "allowedTypes": [
            "basic"
        ],
        "map": {
            "x": 31,
            "y": 96.0
        }
    },
    {
        "id": 3,
        "name": "NEBULA",
        "target": 670,
        "excellency": 1038,
        "timeLimit": 121,
        "coins": 58,
        "kills": 10,
        "allowedTypes": [
            "basic"
        ],
        "map": {
            "x": 50,
            "y": 96.0
        }
    },
    {
        "id": 4,
        "name": "SIGNAL",
        "target": 760,
        "excellency": 1178,
        "timeLimit": 122,
        "coins": 64,
        "kills": 10,
        "allowedTypes": [
            "basic"
        ],
        "map": {
            "x": 69,
            "y": 96.0
        }
    },
    {
        "id": 5,
        "name": "RIFT",
        "target": 850,
        "excellency": 1317,
        "timeLimit": 122,
        "coins": 70,
        "kills": 10,
        "allowedTypes": [
            "basic",
            "fast"
        ],
        "map": {
            "x": 88,
            "y": 96.0
        }
    },
    {
        "id": 6,
        "name": "CANYON",
        "target": 940,
        "excellency": 1457,
        "timeLimit": 123,
        "coins": 76,
        "kills": 11,
        "allowedTypes": [
            "basic",
            "fast"
        ],
        "map": {
            "x": 88,
            "y": 91.3
        }
    },
    {
        "id": 7,
        "name": "CANNON",
        "target": 1030,
        "excellency": 1596,
        "timeLimit": 123,
        "coins": 82,
        "kills": 11,
        "allowedTypes": [
            "basic",
            "fast"
        ],
        "map": {
            "x": 69,
            "y": 91.3
        }
    },
    {
        "id": 8,
        "name": "SWARM",
        "target": 1120,
        "excellency": 1736,
        "timeLimit": 124,
        "coins": 88,
        "kills": 12,
        "allowedTypes": [
            "basic",
            "fast"
        ],
        "map": {
            "x": 50,
            "y": 91.3
        }
    },
    {
        "id": 9,
        "name": "SPIRE",
        "target": 1210,
        "excellency": 1875,
        "timeLimit": 124,
        "coins": 94,
        "kills": 12,
        "allowedTypes": [
            "basic",
            "fast"
        ],
        "map": {
            "x": 31,
            "y": 91.3
        }
    },
    {
        "id": 10,
        "name": "MIRROR",
        "target": 1300,
        "excellency": 2015,
        "timeLimit": 125,
        "coins": 100,
        "kills": 13,
        "allowedTypes": [
            "basic",
            "fast"
        ],
        "map": {
            "x": 12,
            "y": 91.3
        }
    },
    {
        "id": 11,
        "name": "VOID",
        "target": 1390,
        "excellency": 2154,
        "timeLimit": 125,
        "coins": 106,
        "kills": 13,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 12,
            "y": 86.5
        }
    },
    {
        "id": 12,
        "name": "PULSE",
        "target": 1480,
        "excellency": 2294,
        "timeLimit": 126,
        "coins": 112,
        "kills": 14,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 31,
            "y": 86.5
        }
    },
    {
        "id": 13,
        "name": "GRID",
        "target": 1570,
        "excellency": 2433,
        "timeLimit": 126,
        "coins": 118,
        "kills": 14,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 50,
            "y": 86.5
        }
    },
    {
        "id": 14,
        "name": "HALO",
        "target": 1660,
        "excellency": 2573,
        "timeLimit": 127,
        "coins": 124,
        "kills": 15,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 69,
            "y": 86.5
        }
    },
    {
        "id": 15,
        "name": "FORGE",
        "target": 1750,
        "excellency": 2712,
        "timeLimit": 127,
        "coins": 130,
        "kills": 15,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 88,
            "y": 86.5
        }
    },
    {
        "id": 16,
        "name": "STORM",
        "target": 1840,
        "excellency": 2852,
        "timeLimit": 128,
        "coins": 136,
        "kills": 16,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 88,
            "y": 81.8
        }
    },
    {
        "id": 17,
        "name": "CORE",
        "target": 1930,
        "excellency": 2991,
        "timeLimit": 128,
        "coins": 142,
        "kills": 16,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 69,
            "y": 81.8
        }
    },
    {
        "id": 18,
        "name": "NEXUS",
        "target": 2020,
        "excellency": 3131,
        "timeLimit": 129,
        "coins": 148,
        "kills": 17,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 50,
            "y": 81.8
        }
    },
    {
        "id": 19,
        "name": "APEX",
        "target": 2110,
        "excellency": 3270,
        "timeLimit": 129,
        "coins": 154,
        "kills": 17,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 31,
            "y": 81.8
        }
    },
    {
        "id": 20,
        "name": "OMEGA",
        "target": 2200,
        "excellency": 3410,
        "timeLimit": 130,
        "coins": 160,
        "kills": 18,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 12,
            "y": 81.8
        }
    },
    {
        "id": 21,
        "name": "ORBIT",
        "target": 2290,
        "excellency": 3549,
        "timeLimit": 130,
        "coins": 166,
        "kills": 18,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 12,
            "y": 77.1
        }
    },
    {
        "id": 22,
        "name": "QUASAR",
        "target": 2380,
        "excellency": 3689,
        "timeLimit": 131,
        "coins": 172,
        "kills": 19,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 31,
            "y": 77.1
        }
    },
    {
        "id": 23,
        "name": "PULSAR",
        "target": 2470,
        "excellency": 3828,
        "timeLimit": 131,
        "coins": 178,
        "kills": 19,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 50,
            "y": 77.1
        }
    },
    {
        "id": 24,
        "name": "NOVA",
        "target": 2560,
        "excellency": 3968,
        "timeLimit": 132,
        "coins": 184,
        "kills": 20,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 69,
            "y": 77.1
        }
    },
    {
        "id": 25,
        "name": "ECLIPSE",
        "target": 2650,
        "excellency": 4107,
        "timeLimit": 132,
        "coins": 190,
        "kills": 20,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter"
        ],
        "map": {
            "x": 88,
            "y": 77.1
        }
    },
    {
        "id": 26,
        "name": "COMET",
        "target": 2740,
        "excellency": 4247,
        "timeLimit": 133,
        "coins": 196,
        "kills": 21,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 88,
            "y": 72.3
        }
    },
    {
        "id": 27,
        "name": "ASTRA",
        "target": 2830,
        "excellency": 4386,
        "timeLimit": 133,
        "coins": 202,
        "kills": 21,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 69,
            "y": 72.3
        }
    },
    {
        "id": 28,
        "name": "VORTEX",
        "target": 2920,
        "excellency": 4526,
        "timeLimit": 134,
        "coins": 208,
        "kills": 22,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 50,
            "y": 72.3
        }
    },
    {
        "id": 29,
        "name": "PRISM",
        "target": 3010,
        "excellency": 4665,
        "timeLimit": 134,
        "coins": 214,
        "kills": 22,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 31,
            "y": 72.3
        }
    },
    {
        "id": 30,
        "name": "ECHO",
        "target": 3100,
        "excellency": 4805,
        "timeLimit": 135,
        "coins": 220,
        "kills": 23,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 12,
            "y": 72.3
        }
    },
    {
        "id": 31,
        "name": "SILICON",
        "target": 3190,
        "excellency": 4944,
        "timeLimit": 135,
        "coins": 226,
        "kills": 23,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 12,
            "y": 67.6
        }
    },
    {
        "id": 32,
        "name": "QUANTUM",
        "target": 3280,
        "excellency": 5084,
        "timeLimit": 136,
        "coins": 232,
        "kills": 24,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 31,
            "y": 67.6
        }
    },
    {
        "id": 33,
        "name": "NEXUS-2",
        "target": 3370,
        "excellency": 5223,
        "timeLimit": 136,
        "coins": 238,
        "kills": 24,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 50,
            "y": 67.6
        }
    },
    {
        "id": 34,
        "name": "HORIZON",
        "target": 3460,
        "excellency": 5363,
        "timeLimit": 137,
        "coins": 244,
        "kills": 25,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 69,
            "y": 67.6
        }
    },
    {
        "id": 35,
        "name": "ZENITH",
        "target": 3550,
        "excellency": 5502,
        "timeLimit": 137,
        "coins": 250,
        "kills": 25,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 88,
            "y": 67.6
        }
    },
    {
        "id": 36,
        "name": "CIPHER",
        "target": 3640,
        "excellency": 5642,
        "timeLimit": 138,
        "coins": 256,
        "kills": 26,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 88,
            "y": 62.8
        }
    },
    {
        "id": 37,
        "name": "VECTOR",
        "target": 3730,
        "excellency": 5781,
        "timeLimit": 138,
        "coins": 262,
        "kills": 26,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 69,
            "y": 62.8
        }
    },
    {
        "id": 38,
        "name": "AEGIS",
        "target": 3820,
        "excellency": 5921,
        "timeLimit": 139,
        "coins": 268,
        "kills": 27,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 50,
            "y": 62.8
        }
    },
    {
        "id": 39,
        "name": "TITAN",
        "target": 3910,
        "excellency": 6060,
        "timeLimit": 139,
        "coins": 274,
        "kills": 27,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 31,
            "y": 62.8
        }
    },
    {
        "id": 40,
        "name": "FINALE",
        "target": 4000,
        "excellency": 6200,
        "timeLimit": 140,
        "coins": 280,
        "kills": 28,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 12,
            "y": 62.8
        }
    },
    {
        "id": 41,
        "name": "ORIGIN",
        "target": 4090,
        "excellency": 6339,
        "timeLimit": 140,
        "coins": 286,
        "kills": 28,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 12,
            "y": 58.1
        }
    },
    {
        "id": 42,
        "name": "FLARE",
        "target": 4180,
        "excellency": 6479,
        "timeLimit": 141,
        "coins": 292,
        "kills": 29,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 31,
            "y": 58.1
        }
    },
    {
        "id": 43,
        "name": "GLITCH",
        "target": 4270,
        "excellency": 6618,
        "timeLimit": 141,
        "coins": 298,
        "kills": 29,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 50,
            "y": 58.1
        }
    },
    {
        "id": 44,
        "name": "RADAR",
        "target": 4360,
        "excellency": 6758,
        "timeLimit": 142,
        "coins": 304,
        "kills": 30,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 69,
            "y": 58.1
        }
    },
    {
        "id": 45,
        "name": "BOLT",
        "target": 4450,
        "excellency": 6897,
        "timeLimit": 142,
        "coins": 310,
        "kills": 30,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 88,
            "y": 58.1
        }
    },
    {
        "id": 46,
        "name": "CRATER",
        "target": 4540,
        "excellency": 7037,
        "timeLimit": 143,
        "coins": 316,
        "kills": 31,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 88,
            "y": 53.4
        }
    },
    {
        "id": 47,
        "name": "DRIFT-2",
        "target": 4630,
        "excellency": 7176,
        "timeLimit": 143,
        "coins": 322,
        "kills": 31,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 69,
            "y": 53.4
        }
    },
    {
        "id": 48,
        "name": "ION",
        "target": 4720,
        "excellency": 7316,
        "timeLimit": 144,
        "coins": 328,
        "kills": 32,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 50,
            "y": 53.4
        }
    },
    {
        "id": 49,
        "name": "PLASMA",
        "target": 4810,
        "excellency": 7455,
        "timeLimit": 144,
        "coins": 334,
        "kills": 32,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 31,
            "y": 53.4
        }
    },
    {
        "id": 50,
        "name": "BINARY",
        "target": 4900,
        "excellency": 7595,
        "timeLimit": 145,
        "coins": 340,
        "kills": 33,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank"
        ],
        "map": {
            "x": 12,
            "y": 53.4
        }
    },
    {
        "id": 51,
        "name": "SECTOR-X",
        "target": 4990,
        "excellency": 7734,
        "timeLimit": 145,
        "coins": 346,
        "kills": 33,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 48.6
        }
    },
    {
        "id": 52,
        "name": "GHOST",
        "target": 5080,
        "excellency": 7874,
        "timeLimit": 146,
        "coins": 352,
        "kills": 34,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 48.6
        }
    },
    {
        "id": 53,
        "name": "PHANTOM",
        "target": 5170,
        "excellency": 8013,
        "timeLimit": 146,
        "coins": 358,
        "kills": 34,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 48.6
        }
    },
    {
        "id": 54,
        "name": "ORBIT-2",
        "target": 5260,
        "excellency": 8153,
        "timeLimit": 147,
        "coins": 364,
        "kills": 35,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 48.6
        }
    },
    {
        "id": 55,
        "name": "RING",
        "target": 5350,
        "excellency": 8292,
        "timeLimit": 147,
        "coins": 370,
        "kills": 35,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 48.6
        }
    },
    {
        "id": 56,
        "name": "DUST",
        "target": 5440,
        "excellency": 8432,
        "timeLimit": 148,
        "coins": 376,
        "kills": 36,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 43.9
        }
    },
    {
        "id": 57,
        "name": "SOLAR",
        "target": 5530,
        "excellency": 8571,
        "timeLimit": 148,
        "coins": 382,
        "kills": 36,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 43.9
        }
    },
    {
        "id": 58,
        "name": "LUNAR",
        "target": 5620,
        "excellency": 8711,
        "timeLimit": 149,
        "coins": 388,
        "kills": 37,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 43.9
        }
    },
    {
        "id": 59,
        "name": "COMET-2",
        "target": 5710,
        "excellency": 8850,
        "timeLimit": 149,
        "coins": 394,
        "kills": 37,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 43.9
        }
    },
    {
        "id": 60,
        "name": "BLAZE",
        "target": 5800,
        "excellency": 8990,
        "timeLimit": 150,
        "coins": 400,
        "kills": 38,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 43.9
        }
    },
    {
        "id": 61,
        "name": "FROST",
        "target": 5890,
        "excellency": 9129,
        "timeLimit": 150,
        "coins": 406,
        "kills": 38,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 39.2
        }
    },
    {
        "id": 62,
        "name": "EMBER",
        "target": 5980,
        "excellency": 9269,
        "timeLimit": 151,
        "coins": 412,
        "kills": 39,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 39.2
        }
    },
    {
        "id": 63,
        "name": "SPARK",
        "target": 6070,
        "excellency": 9408,
        "timeLimit": 151,
        "coins": 418,
        "kills": 39,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 39.2
        }
    },
    {
        "id": 64,
        "name": "ARC",
        "target": 6160,
        "excellency": 9548,
        "timeLimit": 152,
        "coins": 424,
        "kills": 40,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 39.2
        }
    },
    {
        "id": 65,
        "name": "NODE",
        "target": 6250,
        "excellency": 9687,
        "timeLimit": 152,
        "coins": 430,
        "kills": 40,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 39.2
        }
    },
    {
        "id": 66,
        "name": "LINK",
        "target": 6340,
        "excellency": 9827,
        "timeLimit": 153,
        "coins": 436,
        "kills": 41,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 34.4
        }
    },
    {
        "id": 67,
        "name": "BRIDGE",
        "target": 6430,
        "excellency": 9966,
        "timeLimit": 153,
        "coins": 442,
        "kills": 41,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 34.4
        }
    },
    {
        "id": 68,
        "name": "GATE",
        "target": 6520,
        "excellency": 10106,
        "timeLimit": 154,
        "coins": 448,
        "kills": 42,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 34.4
        }
    },
    {
        "id": 69,
        "name": "PORT",
        "target": 6610,
        "excellency": 10245,
        "timeLimit": 154,
        "coins": 454,
        "kills": 42,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 34.4
        }
    },
    {
        "id": 70,
        "name": "DOCK",
        "target": 6700,
        "excellency": 10385,
        "timeLimit": 155,
        "coins": 460,
        "kills": 43,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 34.4
        }
    },
    {
        "id": 71,
        "name": "HULL",
        "target": 6790,
        "excellency": 10524,
        "timeLimit": 155,
        "coins": 466,
        "kills": 43,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 29.7
        }
    },
    {
        "id": 72,
        "name": "WING",
        "target": 6880,
        "excellency": 10664,
        "timeLimit": 156,
        "coins": 472,
        "kills": 44,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 29.7
        }
    },
    {
        "id": 73,
        "name": "THRUST",
        "target": 6970,
        "excellency": 10803,
        "timeLimit": 156,
        "coins": 478,
        "kills": 44,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 29.7
        }
    },
    {
        "id": 74,
        "name": "NOSE",
        "target": 7060,
        "excellency": 10943,
        "timeLimit": 157,
        "coins": 484,
        "kills": 45,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 29.7
        }
    },
    {
        "id": 75,
        "name": "COCKPIT",
        "target": 7150,
        "excellency": 11082,
        "timeLimit": 157,
        "coins": 490,
        "kills": 45,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 29.7
        }
    },
    {
        "id": 76,
        "name": "RADOME",
        "target": 7240,
        "excellency": 11222,
        "timeLimit": 158,
        "coins": 496,
        "kills": 46,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 24.9
        }
    },
    {
        "id": 77,
        "name": "ARRAY",
        "target": 7330,
        "excellency": 11361,
        "timeLimit": 158,
        "coins": 502,
        "kills": 46,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 24.9
        }
    },
    {
        "id": 78,
        "name": "BEACON",
        "target": 7420,
        "excellency": 11501,
        "timeLimit": 159,
        "coins": 508,
        "kills": 47,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 24.9
        }
    },
    {
        "id": 79,
        "name": "TOWER",
        "target": 7510,
        "excellency": 11640,
        "timeLimit": 159,
        "coins": 514,
        "kills": 47,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 24.9
        }
    },
    {
        "id": 80,
        "name": "SPIKE",
        "target": 7600,
        "excellency": 11780,
        "timeLimit": 160,
        "coins": 520,
        "kills": 48,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 24.9
        }
    },
    {
        "id": 81,
        "name": "SHARD",
        "target": 7690,
        "excellency": 11919,
        "timeLimit": 160,
        "coins": 526,
        "kills": 48,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 20.2
        }
    },
    {
        "id": 82,
        "name": "CRYSTAL",
        "target": 7780,
        "excellency": 12059,
        "timeLimit": 161,
        "coins": 532,
        "kills": 49,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 20.2
        }
    },
    {
        "id": 83,
        "name": "ONYX",
        "target": 7870,
        "excellency": 12198,
        "timeLimit": 161,
        "coins": 538,
        "kills": 49,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 20.2
        }
    },
    {
        "id": 84,
        "name": "JADE",
        "target": 7960,
        "excellency": 12338,
        "timeLimit": 162,
        "coins": 544,
        "kills": 50,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 20.2
        }
    },
    {
        "id": 85,
        "name": "RUBY",
        "target": 8050,
        "excellency": 12477,
        "timeLimit": 162,
        "coins": 550,
        "kills": 50,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 20.2
        }
    },
    {
        "id": 86,
        "name": "COBALT",
        "target": 8140,
        "excellency": 12617,
        "timeLimit": 163,
        "coins": 556,
        "kills": 51,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 15.5
        }
    },
    {
        "id": 87,
        "name": "IRON",
        "target": 8230,
        "excellency": 12756,
        "timeLimit": 163,
        "coins": 562,
        "kills": 51,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 15.5
        }
    },
    {
        "id": 88,
        "name": "STEEL",
        "target": 8320,
        "excellency": 12896,
        "timeLimit": 164,
        "coins": 568,
        "kills": 52,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 15.5
        }
    },
    {
        "id": 89,
        "name": "CARBON",
        "target": 8410,
        "excellency": 13035,
        "timeLimit": 164,
        "coins": 574,
        "kills": 52,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 15.5
        }
    },
    {
        "id": 90,
        "name": "GRAPHENE",
        "target": 8500,
        "excellency": 13175,
        "timeLimit": 165,
        "coins": 580,
        "kills": 53,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 15.5
        }
    },
    {
        "id": 91,
        "name": "ALPHA",
        "target": 8590,
        "excellency": 13314,
        "timeLimit": 165,
        "coins": 586,
        "kills": 53,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 10.7
        }
    },
    {
        "id": 92,
        "name": "BETA",
        "target": 8680,
        "excellency": 13454,
        "timeLimit": 166,
        "coins": 592,
        "kills": 54,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 10.7
        }
    },
    {
        "id": 93,
        "name": "GAMMA",
        "target": 8770,
        "excellency": 13593,
        "timeLimit": 166,
        "coins": 598,
        "kills": 54,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 10.7
        }
    },
    {
        "id": 94,
        "name": "DELTA",
        "target": 8860,
        "excellency": 13733,
        "timeLimit": 167,
        "coins": 604,
        "kills": 55,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 10.7
        }
    },
    {
        "id": 95,
        "name": "EPSILON",
        "target": 8950,
        "excellency": 13872,
        "timeLimit": 167,
        "coins": 610,
        "kills": 55,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 10.7
        }
    },
    {
        "id": 96,
        "name": "ZETA",
        "target": 9040,
        "excellency": 14012,
        "timeLimit": 168,
        "coins": 616,
        "kills": 56,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 88,
            "y": 6.0
        }
    },
    {
        "id": 97,
        "name": "ETA",
        "target": 9130,
        "excellency": 14151,
        "timeLimit": 168,
        "coins": 622,
        "kills": 56,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 69,
            "y": 6.0
        }
    },
    {
        "id": 98,
        "name": "THETA",
        "target": 9220,
        "excellency": 14291,
        "timeLimit": 169,
        "coins": 628,
        "kills": 57,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 50,
            "y": 6.0
        }
    },
    {
        "id": 99,
        "name": "IOTA",
        "target": 9310,
        "excellency": 14430,
        "timeLimit": 169,
        "coins": 634,
        "kills": 57,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 31,
            "y": 6.0
        }
    },
    {
        "id": 100,
        "name": "OMEGA-X",
        "target": 9400,
        "excellency": 14570,
        "timeLimit": 170,
        "coins": 640,
        "kills": 58,
        "allowedTypes": [
            "basic",
            "fast",
            "shooter",
            "tank",
            "elite"
        ],
        "map": {
            "x": 12,
            "y": 6.0
        }
    },
    {
        "id": 101,
        "name": "SECTOR-101",
        "target": 9490,
        "excellency": 14709,
        "timeLimit": 130,
        "coins": 646,
        "kills": 22,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 78.0
        }
    },
    {
        "id": 102,
        "name": "DRIFT-102",
        "target": 9580,
        "excellency": 14849,
        "timeLimit": 130,
        "coins": 652,
        "kills": 22,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 78.0
        }
    },
    {
        "id": 103,
        "name": "PULSE-103",
        "target": 9670,
        "excellency": 14988,
        "timeLimit": 130,
        "coins": 658,
        "kills": 22,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 78.0
        }
    },
    {
        "id": 104,
        "name": "ECHO-104",
        "target": 9760,
        "excellency": 15128,
        "timeLimit": 130,
        "coins": 664,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 78.0
        }
    },
    {
        "id": 105,
        "name": "VOID-105",
        "target": 9850,
        "excellency": 15267,
        "timeLimit": 130,
        "coins": 670,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 78.0
        }
    },
    {
        "id": 106,
        "name": "FLARE-106",
        "target": 9940,
        "excellency": 15407,
        "timeLimit": 130,
        "coins": 676,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 78.0
        }
    },
    {
        "id": 107,
        "name": "ORBIT-107",
        "target": 10030,
        "excellency": 15546,
        "timeLimit": 130,
        "coins": 682,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 78.0
        }
    },
    {
        "id": 108,
        "name": "QUASAR-108",
        "target": 10120,
        "excellency": 15686,
        "timeLimit": 130,
        "coins": 688,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 78.0
        }
    },
    {
        "id": 109,
        "name": "NOVA-109",
        "target": 10210,
        "excellency": 15825,
        "timeLimit": 130,
        "coins": 694,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 78.0
        }
    },
    {
        "id": 110,
        "name": "RIDGE-110",
        "target": 10300,
        "excellency": 15965,
        "timeLimit": 131,
        "coins": 700,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 78.0
        }
    },
    {
        "id": 111,
        "name": "SPIRE-111",
        "target": 10390,
        "excellency": 16104,
        "timeLimit": 131,
        "coins": 706,
        "kills": 23,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 78.0
        }
    },
    {
        "id": 112,
        "name": "AETHER-112",
        "target": 10480,
        "excellency": 16244,
        "timeLimit": 131,
        "coins": 712,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 78.0
        }
    },
    {
        "id": 113,
        "name": "CORONA-113",
        "target": 10570,
        "excellency": 16383,
        "timeLimit": 131,
        "coins": 718,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 78.0
        }
    },
    {
        "id": 114,
        "name": "HELIX-114",
        "target": 10660,
        "excellency": 16523,
        "timeLimit": 131,
        "coins": 724,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 78.0
        }
    },
    {
        "id": 115,
        "name": "PRISM-115",
        "target": 10750,
        "excellency": 16662,
        "timeLimit": 131,
        "coins": 730,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 78.0
        }
    },
    {
        "id": 116,
        "name": "FORGE-116",
        "target": 10840,
        "excellency": 16802,
        "timeLimit": 131,
        "coins": 736,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 78.0
        }
    },
    {
        "id": 117,
        "name": "ABYSS-117",
        "target": 10930,
        "excellency": 16941,
        "timeLimit": 131,
        "coins": 742,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 78.0
        }
    },
    {
        "id": 118,
        "name": "SUMMIT-118",
        "target": 11020,
        "excellency": 17081,
        "timeLimit": 131,
        "coins": 748,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 78.0
        }
    },
    {
        "id": 119,
        "name": "VECTOR-119",
        "target": 11110,
        "excellency": 17220,
        "timeLimit": 131,
        "coins": 754,
        "kills": 24,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 78.0
        }
    },
    {
        "id": 120,
        "name": "OMEGA-120",
        "target": 11200,
        "excellency": 17360,
        "timeLimit": 132,
        "coins": 760,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 78.0
        }
    },
    {
        "id": 121,
        "name": "SECTOR-121",
        "target": 11290,
        "excellency": 17499,
        "timeLimit": 132,
        "coins": 766,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 78.0
        }
    },
    {
        "id": 122,
        "name": "DRIFT-122",
        "target": 11380,
        "excellency": 17639,
        "timeLimit": 132,
        "coins": 772,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 78.0
        }
    },
    {
        "id": 123,
        "name": "PULSE-123",
        "target": 11470,
        "excellency": 17778,
        "timeLimit": 132,
        "coins": 778,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 78.0
        }
    },
    {
        "id": 124,
        "name": "ECHO-124",
        "target": 11560,
        "excellency": 17918,
        "timeLimit": 132,
        "coins": 784,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 78.0
        }
    },
    {
        "id": 125,
        "name": "VOID-125",
        "target": 11650,
        "excellency": 18057,
        "timeLimit": 132,
        "coins": 790,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 78.0
        }
    },
    {
        "id": 126,
        "name": "FLARE-126",
        "target": 11740,
        "excellency": 18197,
        "timeLimit": 132,
        "coins": 796,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 73.5
        }
    },
    {
        "id": 127,
        "name": "ORBIT-127",
        "target": 11830,
        "excellency": 18336,
        "timeLimit": 132,
        "coins": 802,
        "kills": 25,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 73.5
        }
    },
    {
        "id": 128,
        "name": "QUASAR-128",
        "target": 11920,
        "excellency": 18476,
        "timeLimit": 132,
        "coins": 808,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 73.5
        }
    },
    {
        "id": 129,
        "name": "NOVA-129",
        "target": 12010,
        "excellency": 18615,
        "timeLimit": 132,
        "coins": 814,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 73.5
        }
    },
    {
        "id": 130,
        "name": "RIDGE-130",
        "target": 12100,
        "excellency": 18755,
        "timeLimit": 133,
        "coins": 820,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 73.5
        }
    },
    {
        "id": 131,
        "name": "SPIRE-131",
        "target": 12190,
        "excellency": 18894,
        "timeLimit": 133,
        "coins": 826,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 73.5
        }
    },
    {
        "id": 132,
        "name": "AETHER-132",
        "target": 12280,
        "excellency": 19034,
        "timeLimit": 133,
        "coins": 832,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 73.5
        }
    },
    {
        "id": 133,
        "name": "CORONA-133",
        "target": 12370,
        "excellency": 19173,
        "timeLimit": 133,
        "coins": 838,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 73.5
        }
    },
    {
        "id": 134,
        "name": "HELIX-134",
        "target": 12460,
        "excellency": 19313,
        "timeLimit": 133,
        "coins": 844,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 73.5
        }
    },
    {
        "id": 135,
        "name": "PRISM-135",
        "target": 12550,
        "excellency": 19452,
        "timeLimit": 133,
        "coins": 850,
        "kills": 26,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 73.5
        }
    },
    {
        "id": 136,
        "name": "FORGE-136",
        "target": 12640,
        "excellency": 19592,
        "timeLimit": 133,
        "coins": 856,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 73.5
        }
    },
    {
        "id": 137,
        "name": "ABYSS-137",
        "target": 12730,
        "excellency": 19731,
        "timeLimit": 133,
        "coins": 862,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 73.5
        }
    },
    {
        "id": 138,
        "name": "SUMMIT-138",
        "target": 12820,
        "excellency": 19871,
        "timeLimit": 133,
        "coins": 868,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 73.5
        }
    },
    {
        "id": 139,
        "name": "VECTOR-139",
        "target": 12910,
        "excellency": 20010,
        "timeLimit": 133,
        "coins": 874,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 73.5
        }
    },
    {
        "id": 140,
        "name": "OMEGA-140",
        "target": 13000,
        "excellency": 20150,
        "timeLimit": 134,
        "coins": 880,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 73.5
        }
    },
    {
        "id": 141,
        "name": "SECTOR-141",
        "target": 13090,
        "excellency": 20289,
        "timeLimit": 134,
        "coins": 886,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 73.5
        }
    },
    {
        "id": 142,
        "name": "DRIFT-142",
        "target": 13180,
        "excellency": 20429,
        "timeLimit": 134,
        "coins": 892,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 73.5
        }
    },
    {
        "id": 143,
        "name": "PULSE-143",
        "target": 13270,
        "excellency": 20568,
        "timeLimit": 134,
        "coins": 898,
        "kills": 27,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 73.5
        }
    },
    {
        "id": 144,
        "name": "ECHO-144",
        "target": 13360,
        "excellency": 20708,
        "timeLimit": 134,
        "coins": 904,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 73.5
        }
    },
    {
        "id": 145,
        "name": "VOID-145",
        "target": 13450,
        "excellency": 20847,
        "timeLimit": 134,
        "coins": 910,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 73.5
        }
    },
    {
        "id": 146,
        "name": "FLARE-146",
        "target": 13540,
        "excellency": 20987,
        "timeLimit": 134,
        "coins": 916,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 73.5
        }
    },
    {
        "id": 147,
        "name": "ORBIT-147",
        "target": 13630,
        "excellency": 21126,
        "timeLimit": 134,
        "coins": 922,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 73.5
        }
    },
    {
        "id": 148,
        "name": "QUASAR-148",
        "target": 13720,
        "excellency": 21266,
        "timeLimit": 134,
        "coins": 928,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 73.5
        }
    },
    {
        "id": 149,
        "name": "NOVA-149",
        "target": 13810,
        "excellency": 21405,
        "timeLimit": 134,
        "coins": 934,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 73.5
        }
    },
    {
        "id": 150,
        "name": "RIDGE-150",
        "target": 13900,
        "excellency": 21545,
        "timeLimit": 135,
        "coins": 940,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 73.5
        }
    },
    {
        "id": 151,
        "name": "SPIRE-151",
        "target": 13990,
        "excellency": 21684,
        "timeLimit": 135,
        "coins": 946,
        "kills": 28,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 69.0
        }
    },
    {
        "id": 152,
        "name": "AETHER-152",
        "target": 14080,
        "excellency": 21824,
        "timeLimit": 135,
        "coins": 952,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 69.0
        }
    },
    {
        "id": 153,
        "name": "CORONA-153",
        "target": 14170,
        "excellency": 21963,
        "timeLimit": 135,
        "coins": 958,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 69.0
        }
    },
    {
        "id": 154,
        "name": "HELIX-154",
        "target": 14260,
        "excellency": 22103,
        "timeLimit": 135,
        "coins": 964,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 69.0
        }
    },
    {
        "id": 155,
        "name": "PRISM-155",
        "target": 14350,
        "excellency": 22242,
        "timeLimit": 135,
        "coins": 970,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 69.0
        }
    },
    {
        "id": 156,
        "name": "FORGE-156",
        "target": 14440,
        "excellency": 22382,
        "timeLimit": 135,
        "coins": 976,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 69.0
        }
    },
    {
        "id": 157,
        "name": "ABYSS-157",
        "target": 14530,
        "excellency": 22521,
        "timeLimit": 135,
        "coins": 982,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 69.0
        }
    },
    {
        "id": 158,
        "name": "SUMMIT-158",
        "target": 14620,
        "excellency": 22661,
        "timeLimit": 135,
        "coins": 988,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 69.0
        }
    },
    {
        "id": 159,
        "name": "VECTOR-159",
        "target": 14710,
        "excellency": 22800,
        "timeLimit": 135,
        "coins": 994,
        "kills": 29,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 69.0
        }
    },
    {
        "id": 160,
        "name": "OMEGA-160",
        "target": 14800,
        "excellency": 22940,
        "timeLimit": 136,
        "coins": 1000,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 69.0
        }
    },
    {
        "id": 161,
        "name": "SECTOR-161",
        "target": 14890,
        "excellency": 23079,
        "timeLimit": 136,
        "coins": 1006,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 69.0
        }
    },
    {
        "id": 162,
        "name": "DRIFT-162",
        "target": 14980,
        "excellency": 23219,
        "timeLimit": 136,
        "coins": 1012,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 69.0
        }
    },
    {
        "id": 163,
        "name": "PULSE-163",
        "target": 15070,
        "excellency": 23358,
        "timeLimit": 136,
        "coins": 1018,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 69.0
        }
    },
    {
        "id": 164,
        "name": "ECHO-164",
        "target": 15160,
        "excellency": 23498,
        "timeLimit": 136,
        "coins": 1024,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 69.0
        }
    },
    {
        "id": 165,
        "name": "VOID-165",
        "target": 15250,
        "excellency": 23637,
        "timeLimit": 136,
        "coins": 1030,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 69.0
        }
    },
    {
        "id": 166,
        "name": "FLARE-166",
        "target": 15340,
        "excellency": 23777,
        "timeLimit": 136,
        "coins": 1036,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 69.0
        }
    },
    {
        "id": 167,
        "name": "ORBIT-167",
        "target": 15430,
        "excellency": 23916,
        "timeLimit": 136,
        "coins": 1042,
        "kills": 30,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 69.0
        }
    },
    {
        "id": 168,
        "name": "QUASAR-168",
        "target": 15520,
        "excellency": 24056,
        "timeLimit": 136,
        "coins": 1048,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 69.0
        }
    },
    {
        "id": 169,
        "name": "NOVA-169",
        "target": 15610,
        "excellency": 24195,
        "timeLimit": 136,
        "coins": 1054,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 69.0
        }
    },
    {
        "id": 170,
        "name": "RIDGE-170",
        "target": 15700,
        "excellency": 24335,
        "timeLimit": 137,
        "coins": 1060,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 69.0
        }
    },
    {
        "id": 171,
        "name": "SPIRE-171",
        "target": 15790,
        "excellency": 24474,
        "timeLimit": 137,
        "coins": 1066,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 69.0
        }
    },
    {
        "id": 172,
        "name": "AETHER-172",
        "target": 15880,
        "excellency": 24614,
        "timeLimit": 137,
        "coins": 1072,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 69.0
        }
    },
    {
        "id": 173,
        "name": "CORONA-173",
        "target": 15970,
        "excellency": 24753,
        "timeLimit": 137,
        "coins": 1078,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 69.0
        }
    },
    {
        "id": 174,
        "name": "HELIX-174",
        "target": 16060,
        "excellency": 24893,
        "timeLimit": 137,
        "coins": 1084,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 69.0
        }
    },
    {
        "id": 175,
        "name": "PRISM-175",
        "target": 16150,
        "excellency": 25032,
        "timeLimit": 137,
        "coins": 1090,
        "kills": 31,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 69.0
        }
    },
    {
        "id": 176,
        "name": "FORGE-176",
        "target": 16240,
        "excellency": 25172,
        "timeLimit": 137,
        "coins": 1096,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 64.5
        }
    },
    {
        "id": 177,
        "name": "ABYSS-177",
        "target": 16330,
        "excellency": 25311,
        "timeLimit": 137,
        "coins": 1102,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 64.5
        }
    },
    {
        "id": 178,
        "name": "SUMMIT-178",
        "target": 16420,
        "excellency": 25451,
        "timeLimit": 137,
        "coins": 1108,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 64.5
        }
    },
    {
        "id": 179,
        "name": "VECTOR-179",
        "target": 16510,
        "excellency": 25590,
        "timeLimit": 137,
        "coins": 1114,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 64.5
        }
    },
    {
        "id": 180,
        "name": "OMEGA-180",
        "target": 16600,
        "excellency": 25730,
        "timeLimit": 138,
        "coins": 1120,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 12,
            "y": 64.5
        }
    },
    {
        "id": 181,
        "name": "SECTOR-181",
        "target": 16690,
        "excellency": 25869,
        "timeLimit": 138,
        "coins": 1126,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 64.5
        }
    },
    {
        "id": 182,
        "name": "DRIFT-182",
        "target": 16780,
        "excellency": 26009,
        "timeLimit": 138,
        "coins": 1132,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 64.5
        }
    },
    {
        "id": 183,
        "name": "PULSE-183",
        "target": 16870,
        "excellency": 26148,
        "timeLimit": 138,
        "coins": 1138,
        "kills": 32,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 64.5
        }
    },
    {
        "id": 184,
        "name": "ECHO-184",
        "target": 16960,
        "excellency": 26288,
        "timeLimit": 138,
        "coins": 1144,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 64.5
        }
    },
    {
        "id": 185,
        "name": "VOID-185",
        "target": 17050,
        "excellency": 26427,
        "timeLimit": 138,
        "coins": 1150,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 31,
            "y": 64.5
        }
    },
    {
        "id": 186,
        "name": "FLARE-186",
        "target": 17140,
        "excellency": 26567,
        "timeLimit": 138,
        "coins": 1156,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 64.5
        }
    },
    {
        "id": 187,
        "name": "ORBIT-187",
        "target": 17230,
        "excellency": 26706,
        "timeLimit": 138,
        "coins": 1162,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 64.5
        }
    },
    {
        "id": 188,
        "name": "QUASAR-188",
        "target": 17320,
        "excellency": 26846,
        "timeLimit": 138,
        "coins": 1168,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 64.5
        }
    },
    {
        "id": 189,
        "name": "NOVA-189",
        "target": 17410,
        "excellency": 26985,
        "timeLimit": 138,
        "coins": 1174,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 64.5
        }
    },
    {
        "id": 190,
        "name": "RIDGE-190",
        "target": 17500,
        "excellency": 27125,
        "timeLimit": 139,
        "coins": 1180,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 50,
            "y": 64.5
        }
    },
    {
        "id": 191,
        "name": "SPIRE-191",
        "target": 17590,
        "excellency": 27264,
        "timeLimit": 139,
        "coins": 1186,
        "kills": 33,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 64.5
        }
    },
    {
        "id": 192,
        "name": "AETHER-192",
        "target": 17680,
        "excellency": 27404,
        "timeLimit": 139,
        "coins": 1192,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 64.5
        }
    },
    {
        "id": 193,
        "name": "CORONA-193",
        "target": 17770,
        "excellency": 27543,
        "timeLimit": 139,
        "coins": 1198,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 64.5
        }
    },
    {
        "id": 194,
        "name": "HELIX-194",
        "target": 17860,
        "excellency": 27683,
        "timeLimit": 139,
        "coins": 1204,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 64.5
        }
    },
    {
        "id": 195,
        "name": "PRISM-195",
        "target": 17950,
        "excellency": 27822,
        "timeLimit": 139,
        "coins": 1210,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 69,
            "y": 64.5
        }
    },
    {
        "id": 196,
        "name": "FORGE-196",
        "target": 18040,
        "excellency": 27962,
        "timeLimit": 139,
        "coins": 1216,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 64.5
        }
    },
    {
        "id": 197,
        "name": "ABYSS-197",
        "target": 18130,
        "excellency": 28101,
        "timeLimit": 139,
        "coins": 1222,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 64.5
        }
    },
    {
        "id": 198,
        "name": "SUMMIT-198",
        "target": 18220,
        "excellency": 28241,
        "timeLimit": 139,
        "coins": 1228,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 64.5
        }
    },
    {
        "id": 199,
        "name": "VECTOR-199",
        "target": 18310,
        "excellency": 28380,
        "timeLimit": 139,
        "coins": 1234,
        "kills": 34,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 64.5
        }
    },
    {
        "id": 200,
        "name": "OMEGA-200",
        "target": 18400,
        "excellency": 28520,
        "timeLimit": 140,
        "coins": 1240,
        "kills": 35,
        "allowedTypes": ['basic', 'fast'],
        "map": {
            "x": 88,
            "y": 64.5
        }
    },
    {
        "id": 201,
        "name": "SECTOR-201",
        "target": 18490,
        "excellency": 28659,
        "timeLimit": 140,
        "coins": 1246,
        "kills": 35,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 60.0
        }
    },
    {
        "id": 202,
        "name": "DRIFT-202",
        "target": 18580,
        "excellency": 28799,
        "timeLimit": 140,
        "coins": 1252,
        "kills": 35,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 60.0
        }
    },
    {
        "id": 203,
        "name": "PULSE-203",
        "target": 18670,
        "excellency": 28938,
        "timeLimit": 140,
        "coins": 1258,
        "kills": 35,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 60.0
        }
    },
    {
        "id": 204,
        "name": "ECHO-204",
        "target": 18760,
        "excellency": 29078,
        "timeLimit": 140,
        "coins": 1264,
        "kills": 35,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 60.0
        }
    },
    {
        "id": 205,
        "name": "VOID-205",
        "target": 18850,
        "excellency": 29217,
        "timeLimit": 140,
        "coins": 1270,
        "kills": 35,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 60.0
        }
    },
    {
        "id": 206,
        "name": "FLARE-206",
        "target": 18940,
        "excellency": 29357,
        "timeLimit": 140,
        "coins": 1276,
        "kills": 35,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 60.0
        }
    },
    {
        "id": 207,
        "name": "ORBIT-207",
        "target": 19030,
        "excellency": 29496,
        "timeLimit": 140,
        "coins": 1282,
        "kills": 35,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 60.0
        }
    },
    {
        "id": 208,
        "name": "QUASAR-208",
        "target": 19120,
        "excellency": 29636,
        "timeLimit": 140,
        "coins": 1288,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 60.0
        }
    },
    {
        "id": 209,
        "name": "NOVA-209",
        "target": 19210,
        "excellency": 29775,
        "timeLimit": 140,
        "coins": 1294,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 60.0
        }
    },
    {
        "id": 210,
        "name": "RIDGE-210",
        "target": 19300,
        "excellency": 29915,
        "timeLimit": 141,
        "coins": 1300,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 60.0
        }
    },
    {
        "id": 211,
        "name": "SPIRE-211",
        "target": 19390,
        "excellency": 30054,
        "timeLimit": 141,
        "coins": 1306,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 60.0
        }
    },
    {
        "id": 212,
        "name": "AETHER-212",
        "target": 19480,
        "excellency": 30194,
        "timeLimit": 141,
        "coins": 1312,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 60.0
        }
    },
    {
        "id": 213,
        "name": "CORONA-213",
        "target": 19570,
        "excellency": 30333,
        "timeLimit": 141,
        "coins": 1318,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 60.0
        }
    },
    {
        "id": 214,
        "name": "HELIX-214",
        "target": 19660,
        "excellency": 30473,
        "timeLimit": 141,
        "coins": 1324,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 60.0
        }
    },
    {
        "id": 215,
        "name": "PRISM-215",
        "target": 19750,
        "excellency": 30612,
        "timeLimit": 141,
        "coins": 1330,
        "kills": 36,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 60.0
        }
    },
    {
        "id": 216,
        "name": "FORGE-216",
        "target": 19840,
        "excellency": 30752,
        "timeLimit": 141,
        "coins": 1336,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 60.0
        }
    },
    {
        "id": 217,
        "name": "ABYSS-217",
        "target": 19930,
        "excellency": 30891,
        "timeLimit": 141,
        "coins": 1342,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 60.0
        }
    },
    {
        "id": 218,
        "name": "SUMMIT-218",
        "target": 20020,
        "excellency": 31031,
        "timeLimit": 141,
        "coins": 1348,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 60.0
        }
    },
    {
        "id": 219,
        "name": "VECTOR-219",
        "target": 20110,
        "excellency": 31170,
        "timeLimit": 141,
        "coins": 1354,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 60.0
        }
    },
    {
        "id": 220,
        "name": "OMEGA-220",
        "target": 20200,
        "excellency": 31310,
        "timeLimit": 142,
        "coins": 1360,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 60.0
        }
    },
    {
        "id": 221,
        "name": "SECTOR-221",
        "target": 20290,
        "excellency": 31449,
        "timeLimit": 142,
        "coins": 1366,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 60.0
        }
    },
    {
        "id": 222,
        "name": "DRIFT-222",
        "target": 20380,
        "excellency": 31589,
        "timeLimit": 142,
        "coins": 1372,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 60.0
        }
    },
    {
        "id": 223,
        "name": "PULSE-223",
        "target": 20470,
        "excellency": 31728,
        "timeLimit": 142,
        "coins": 1378,
        "kills": 37,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 60.0
        }
    },
    {
        "id": 224,
        "name": "ECHO-224",
        "target": 20560,
        "excellency": 31868,
        "timeLimit": 142,
        "coins": 1384,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 60.0
        }
    },
    {
        "id": 225,
        "name": "VOID-225",
        "target": 20650,
        "excellency": 32007,
        "timeLimit": 142,
        "coins": 1390,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 60.0
        }
    },
    {
        "id": 226,
        "name": "FLARE-226",
        "target": 20740,
        "excellency": 32147,
        "timeLimit": 142,
        "coins": 1396,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 55.5
        }
    },
    {
        "id": 227,
        "name": "ORBIT-227",
        "target": 20830,
        "excellency": 32286,
        "timeLimit": 142,
        "coins": 1402,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 55.5
        }
    },
    {
        "id": 228,
        "name": "QUASAR-228",
        "target": 20920,
        "excellency": 32426,
        "timeLimit": 142,
        "coins": 1408,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 55.5
        }
    },
    {
        "id": 229,
        "name": "NOVA-229",
        "target": 21010,
        "excellency": 32565,
        "timeLimit": 142,
        "coins": 1414,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 55.5
        }
    },
    {
        "id": 230,
        "name": "RIDGE-230",
        "target": 21100,
        "excellency": 32705,
        "timeLimit": 143,
        "coins": 1420,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 55.5
        }
    },
    {
        "id": 231,
        "name": "SPIRE-231",
        "target": 21190,
        "excellency": 32844,
        "timeLimit": 143,
        "coins": 1426,
        "kills": 38,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 55.5
        }
    },
    {
        "id": 232,
        "name": "AETHER-232",
        "target": 21280,
        "excellency": 32984,
        "timeLimit": 143,
        "coins": 1432,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 55.5
        }
    },
    {
        "id": 233,
        "name": "CORONA-233",
        "target": 21370,
        "excellency": 33123,
        "timeLimit": 143,
        "coins": 1438,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 55.5
        }
    },
    {
        "id": 234,
        "name": "HELIX-234",
        "target": 21460,
        "excellency": 33263,
        "timeLimit": 143,
        "coins": 1444,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 55.5
        }
    },
    {
        "id": 235,
        "name": "PRISM-235",
        "target": 21550,
        "excellency": 33402,
        "timeLimit": 143,
        "coins": 1450,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 55.5
        }
    },
    {
        "id": 236,
        "name": "FORGE-236",
        "target": 21640,
        "excellency": 33542,
        "timeLimit": 143,
        "coins": 1456,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 55.5
        }
    },
    {
        "id": 237,
        "name": "ABYSS-237",
        "target": 21730,
        "excellency": 33681,
        "timeLimit": 143,
        "coins": 1462,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 55.5
        }
    },
    {
        "id": 238,
        "name": "SUMMIT-238",
        "target": 21820,
        "excellency": 33821,
        "timeLimit": 143,
        "coins": 1468,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 55.5
        }
    },
    {
        "id": 239,
        "name": "VECTOR-239",
        "target": 21910,
        "excellency": 33960,
        "timeLimit": 143,
        "coins": 1474,
        "kills": 39,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 55.5
        }
    },
    {
        "id": 240,
        "name": "OMEGA-240",
        "target": 22000,
        "excellency": 34100,
        "timeLimit": 144,
        "coins": 1480,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 55.5
        }
    },
    {
        "id": 241,
        "name": "SECTOR-241",
        "target": 22090,
        "excellency": 34239,
        "timeLimit": 144,
        "coins": 1486,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 55.5
        }
    },
    {
        "id": 242,
        "name": "DRIFT-242",
        "target": 22180,
        "excellency": 34379,
        "timeLimit": 144,
        "coins": 1492,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 55.5
        }
    },
    {
        "id": 243,
        "name": "PULSE-243",
        "target": 22270,
        "excellency": 34518,
        "timeLimit": 144,
        "coins": 1498,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 55.5
        }
    },
    {
        "id": 244,
        "name": "ECHO-244",
        "target": 22360,
        "excellency": 34658,
        "timeLimit": 144,
        "coins": 1504,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 55.5
        }
    },
    {
        "id": 245,
        "name": "VOID-245",
        "target": 22450,
        "excellency": 34797,
        "timeLimit": 144,
        "coins": 1510,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 55.5
        }
    },
    {
        "id": 246,
        "name": "FLARE-246",
        "target": 22540,
        "excellency": 34937,
        "timeLimit": 144,
        "coins": 1516,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 55.5
        }
    },
    {
        "id": 247,
        "name": "ORBIT-247",
        "target": 22630,
        "excellency": 35076,
        "timeLimit": 144,
        "coins": 1522,
        "kills": 40,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 55.5
        }
    },
    {
        "id": 248,
        "name": "QUASAR-248",
        "target": 22720,
        "excellency": 35216,
        "timeLimit": 144,
        "coins": 1528,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 55.5
        }
    },
    {
        "id": 249,
        "name": "NOVA-249",
        "target": 22810,
        "excellency": 35355,
        "timeLimit": 144,
        "coins": 1534,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 55.5
        }
    },
    {
        "id": 250,
        "name": "RIDGE-250",
        "target": 22900,
        "excellency": 35495,
        "timeLimit": 145,
        "coins": 1540,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 55.5
        }
    },
    {
        "id": 251,
        "name": "SPIRE-251",
        "target": 22990,
        "excellency": 35634,
        "timeLimit": 145,
        "coins": 1546,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 51.0
        }
    },
    {
        "id": 252,
        "name": "AETHER-252",
        "target": 23080,
        "excellency": 35774,
        "timeLimit": 145,
        "coins": 1552,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 51.0
        }
    },
    {
        "id": 253,
        "name": "CORONA-253",
        "target": 23170,
        "excellency": 35913,
        "timeLimit": 145,
        "coins": 1558,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 51.0
        }
    },
    {
        "id": 254,
        "name": "HELIX-254",
        "target": 23260,
        "excellency": 36053,
        "timeLimit": 145,
        "coins": 1564,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 51.0
        }
    },
    {
        "id": 255,
        "name": "PRISM-255",
        "target": 23350,
        "excellency": 36192,
        "timeLimit": 145,
        "coins": 1570,
        "kills": 41,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 51.0
        }
    },
    {
        "id": 256,
        "name": "FORGE-256",
        "target": 23440,
        "excellency": 36332,
        "timeLimit": 145,
        "coins": 1576,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 51.0
        }
    },
    {
        "id": 257,
        "name": "ABYSS-257",
        "target": 23530,
        "excellency": 36471,
        "timeLimit": 145,
        "coins": 1582,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 51.0
        }
    },
    {
        "id": 258,
        "name": "SUMMIT-258",
        "target": 23620,
        "excellency": 36611,
        "timeLimit": 145,
        "coins": 1588,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 51.0
        }
    },
    {
        "id": 259,
        "name": "VECTOR-259",
        "target": 23710,
        "excellency": 36750,
        "timeLimit": 145,
        "coins": 1594,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 51.0
        }
    },
    {
        "id": 260,
        "name": "OMEGA-260",
        "target": 23800,
        "excellency": 36890,
        "timeLimit": 146,
        "coins": 1600,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 51.0
        }
    },
    {
        "id": 261,
        "name": "SECTOR-261",
        "target": 23890,
        "excellency": 37029,
        "timeLimit": 146,
        "coins": 1606,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 51.0
        }
    },
    {
        "id": 262,
        "name": "DRIFT-262",
        "target": 23980,
        "excellency": 37169,
        "timeLimit": 146,
        "coins": 1612,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 51.0
        }
    },
    {
        "id": 263,
        "name": "PULSE-263",
        "target": 24070,
        "excellency": 37308,
        "timeLimit": 146,
        "coins": 1618,
        "kills": 42,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 51.0
        }
    },
    {
        "id": 264,
        "name": "ECHO-264",
        "target": 24160,
        "excellency": 37448,
        "timeLimit": 146,
        "coins": 1624,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 51.0
        }
    },
    {
        "id": 265,
        "name": "VOID-265",
        "target": 24250,
        "excellency": 37587,
        "timeLimit": 146,
        "coins": 1630,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 51.0
        }
    },
    {
        "id": 266,
        "name": "FLARE-266",
        "target": 24340,
        "excellency": 37727,
        "timeLimit": 146,
        "coins": 1636,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 51.0
        }
    },
    {
        "id": 267,
        "name": "ORBIT-267",
        "target": 24430,
        "excellency": 37866,
        "timeLimit": 146,
        "coins": 1642,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 51.0
        }
    },
    {
        "id": 268,
        "name": "QUASAR-268",
        "target": 24520,
        "excellency": 38006,
        "timeLimit": 146,
        "coins": 1648,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 51.0
        }
    },
    {
        "id": 269,
        "name": "NOVA-269",
        "target": 24610,
        "excellency": 38145,
        "timeLimit": 146,
        "coins": 1654,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 51.0
        }
    },
    {
        "id": 270,
        "name": "RIDGE-270",
        "target": 24700,
        "excellency": 38285,
        "timeLimit": 147,
        "coins": 1660,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 51.0
        }
    },
    {
        "id": 271,
        "name": "SPIRE-271",
        "target": 24790,
        "excellency": 38424,
        "timeLimit": 147,
        "coins": 1666,
        "kills": 43,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 51.0
        }
    },
    {
        "id": 272,
        "name": "AETHER-272",
        "target": 24880,
        "excellency": 38564,
        "timeLimit": 147,
        "coins": 1672,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 51.0
        }
    },
    {
        "id": 273,
        "name": "CORONA-273",
        "target": 24970,
        "excellency": 38703,
        "timeLimit": 147,
        "coins": 1678,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 51.0
        }
    },
    {
        "id": 274,
        "name": "HELIX-274",
        "target": 25060,
        "excellency": 38843,
        "timeLimit": 147,
        "coins": 1684,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 51.0
        }
    },
    {
        "id": 275,
        "name": "PRISM-275",
        "target": 25150,
        "excellency": 38982,
        "timeLimit": 147,
        "coins": 1690,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 51.0
        }
    },
    {
        "id": 276,
        "name": "FORGE-276",
        "target": 25240,
        "excellency": 39122,
        "timeLimit": 147,
        "coins": 1696,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 46.5
        }
    },
    {
        "id": 277,
        "name": "ABYSS-277",
        "target": 25330,
        "excellency": 39261,
        "timeLimit": 147,
        "coins": 1702,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 46.5
        }
    },
    {
        "id": 278,
        "name": "SUMMIT-278",
        "target": 25420,
        "excellency": 39401,
        "timeLimit": 147,
        "coins": 1708,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 46.5
        }
    },
    {
        "id": 279,
        "name": "VECTOR-279",
        "target": 25510,
        "excellency": 39540,
        "timeLimit": 147,
        "coins": 1714,
        "kills": 44,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 46.5
        }
    },
    {
        "id": 280,
        "name": "OMEGA-280",
        "target": 25600,
        "excellency": 39680,
        "timeLimit": 148,
        "coins": 1720,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 12,
            "y": 46.5
        }
    },
    {
        "id": 281,
        "name": "SECTOR-281",
        "target": 25690,
        "excellency": 39819,
        "timeLimit": 148,
        "coins": 1726,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 46.5
        }
    },
    {
        "id": 282,
        "name": "DRIFT-282",
        "target": 25780,
        "excellency": 39959,
        "timeLimit": 148,
        "coins": 1732,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 46.5
        }
    },
    {
        "id": 283,
        "name": "PULSE-283",
        "target": 25870,
        "excellency": 40098,
        "timeLimit": 148,
        "coins": 1738,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 46.5
        }
    },
    {
        "id": 284,
        "name": "ECHO-284",
        "target": 25960,
        "excellency": 40238,
        "timeLimit": 148,
        "coins": 1744,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 46.5
        }
    },
    {
        "id": 285,
        "name": "VOID-285",
        "target": 26050,
        "excellency": 40377,
        "timeLimit": 148,
        "coins": 1750,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 31,
            "y": 46.5
        }
    },
    {
        "id": 286,
        "name": "FLARE-286",
        "target": 26140,
        "excellency": 40517,
        "timeLimit": 148,
        "coins": 1756,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 46.5
        }
    },
    {
        "id": 287,
        "name": "ORBIT-287",
        "target": 26230,
        "excellency": 40656,
        "timeLimit": 148,
        "coins": 1762,
        "kills": 45,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 46.5
        }
    },
    {
        "id": 288,
        "name": "QUASAR-288",
        "target": 26320,
        "excellency": 40796,
        "timeLimit": 148,
        "coins": 1768,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 46.5
        }
    },
    {
        "id": 289,
        "name": "NOVA-289",
        "target": 26410,
        "excellency": 40935,
        "timeLimit": 148,
        "coins": 1774,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 46.5
        }
    },
    {
        "id": 290,
        "name": "RIDGE-290",
        "target": 26500,
        "excellency": 41075,
        "timeLimit": 149,
        "coins": 1780,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 50,
            "y": 46.5
        }
    },
    {
        "id": 291,
        "name": "SPIRE-291",
        "target": 26590,
        "excellency": 41214,
        "timeLimit": 149,
        "coins": 1786,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 46.5
        }
    },
    {
        "id": 292,
        "name": "AETHER-292",
        "target": 26680,
        "excellency": 41354,
        "timeLimit": 149,
        "coins": 1792,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 46.5
        }
    },
    {
        "id": 293,
        "name": "CORONA-293",
        "target": 26770,
        "excellency": 41493,
        "timeLimit": 149,
        "coins": 1798,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 46.5
        }
    },
    {
        "id": 294,
        "name": "HELIX-294",
        "target": 26860,
        "excellency": 41633,
        "timeLimit": 149,
        "coins": 1804,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 46.5
        }
    },
    {
        "id": 295,
        "name": "PRISM-295",
        "target": 26950,
        "excellency": 41772,
        "timeLimit": 149,
        "coins": 1810,
        "kills": 46,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 69,
            "y": 46.5
        }
    },
    {
        "id": 296,
        "name": "FORGE-296",
        "target": 27040,
        "excellency": 41912,
        "timeLimit": 149,
        "coins": 1816,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 46.5
        }
    },
    {
        "id": 297,
        "name": "ABYSS-297",
        "target": 27130,
        "excellency": 42051,
        "timeLimit": 149,
        "coins": 1822,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 46.5
        }
    },
    {
        "id": 298,
        "name": "SUMMIT-298",
        "target": 27220,
        "excellency": 42191,
        "timeLimit": 149,
        "coins": 1828,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 46.5
        }
    },
    {
        "id": 299,
        "name": "VECTOR-299",
        "target": 27310,
        "excellency": 42330,
        "timeLimit": 149,
        "coins": 1834,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 46.5
        }
    },
    {
        "id": 300,
        "name": "OMEGA-300",
        "target": 27400,
        "excellency": 42470,
        "timeLimit": 150,
        "coins": 1840,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter'],
        "map": {
            "x": 88,
            "y": 46.5
        }
    },
    {
        "id": 301,
        "name": "SECTOR-301",
        "target": 27490,
        "excellency": 42609,
        "timeLimit": 150,
        "coins": 1846,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 42.0
        }
    },
    {
        "id": 302,
        "name": "DRIFT-302",
        "target": 27580,
        "excellency": 42749,
        "timeLimit": 150,
        "coins": 1852,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 42.0
        }
    },
    {
        "id": 303,
        "name": "PULSE-303",
        "target": 27670,
        "excellency": 42888,
        "timeLimit": 150,
        "coins": 1858,
        "kills": 47,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 42.0
        }
    },
    {
        "id": 304,
        "name": "ECHO-304",
        "target": 27760,
        "excellency": 43028,
        "timeLimit": 150,
        "coins": 1864,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 42.0
        }
    },
    {
        "id": 305,
        "name": "VOID-305",
        "target": 27850,
        "excellency": 43167,
        "timeLimit": 150,
        "coins": 1870,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 42.0
        }
    },
    {
        "id": 306,
        "name": "FLARE-306",
        "target": 27940,
        "excellency": 43307,
        "timeLimit": 150,
        "coins": 1876,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 42.0
        }
    },
    {
        "id": 307,
        "name": "ORBIT-307",
        "target": 28030,
        "excellency": 43446,
        "timeLimit": 150,
        "coins": 1882,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 42.0
        }
    },
    {
        "id": 308,
        "name": "QUASAR-308",
        "target": 28120,
        "excellency": 43586,
        "timeLimit": 150,
        "coins": 1888,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 42.0
        }
    },
    {
        "id": 309,
        "name": "NOVA-309",
        "target": 28210,
        "excellency": 43725,
        "timeLimit": 150,
        "coins": 1894,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 42.0
        }
    },
    {
        "id": 310,
        "name": "RIDGE-310",
        "target": 28300,
        "excellency": 43865,
        "timeLimit": 151,
        "coins": 1900,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 42.0
        }
    },
    {
        "id": 311,
        "name": "SPIRE-311",
        "target": 28390,
        "excellency": 44004,
        "timeLimit": 151,
        "coins": 1906,
        "kills": 48,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 42.0
        }
    },
    {
        "id": 312,
        "name": "AETHER-312",
        "target": 28480,
        "excellency": 44144,
        "timeLimit": 151,
        "coins": 1912,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 42.0
        }
    },
    {
        "id": 313,
        "name": "CORONA-313",
        "target": 28570,
        "excellency": 44283,
        "timeLimit": 151,
        "coins": 1918,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 42.0
        }
    },
    {
        "id": 314,
        "name": "HELIX-314",
        "target": 28660,
        "excellency": 44423,
        "timeLimit": 151,
        "coins": 1924,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 42.0
        }
    },
    {
        "id": 315,
        "name": "PRISM-315",
        "target": 28750,
        "excellency": 44562,
        "timeLimit": 151,
        "coins": 1930,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 42.0
        }
    },
    {
        "id": 316,
        "name": "FORGE-316",
        "target": 28840,
        "excellency": 44702,
        "timeLimit": 151,
        "coins": 1936,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 42.0
        }
    },
    {
        "id": 317,
        "name": "ABYSS-317",
        "target": 28930,
        "excellency": 44841,
        "timeLimit": 151,
        "coins": 1942,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 42.0
        }
    },
    {
        "id": 318,
        "name": "SUMMIT-318",
        "target": 29020,
        "excellency": 44981,
        "timeLimit": 151,
        "coins": 1948,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 42.0
        }
    },
    {
        "id": 319,
        "name": "VECTOR-319",
        "target": 29110,
        "excellency": 45120,
        "timeLimit": 151,
        "coins": 1954,
        "kills": 49,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 42.0
        }
    },
    {
        "id": 320,
        "name": "OMEGA-320",
        "target": 29200,
        "excellency": 45260,
        "timeLimit": 152,
        "coins": 1960,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 42.0
        }
    },
    {
        "id": 321,
        "name": "SECTOR-321",
        "target": 29290,
        "excellency": 45399,
        "timeLimit": 152,
        "coins": 1966,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 42.0
        }
    },
    {
        "id": 322,
        "name": "DRIFT-322",
        "target": 29380,
        "excellency": 45539,
        "timeLimit": 152,
        "coins": 1972,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 42.0
        }
    },
    {
        "id": 323,
        "name": "PULSE-323",
        "target": 29470,
        "excellency": 45678,
        "timeLimit": 152,
        "coins": 1978,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 42.0
        }
    },
    {
        "id": 324,
        "name": "ECHO-324",
        "target": 29560,
        "excellency": 45818,
        "timeLimit": 152,
        "coins": 1984,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 42.0
        }
    },
    {
        "id": 325,
        "name": "VOID-325",
        "target": 29650,
        "excellency": 45957,
        "timeLimit": 152,
        "coins": 1990,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 42.0
        }
    },
    {
        "id": 326,
        "name": "FLARE-326",
        "target": 29740,
        "excellency": 46097,
        "timeLimit": 152,
        "coins": 1996,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 37.5
        }
    },
    {
        "id": 327,
        "name": "ORBIT-327",
        "target": 29830,
        "excellency": 46236,
        "timeLimit": 152,
        "coins": 2002,
        "kills": 50,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 37.5
        }
    },
    {
        "id": 328,
        "name": "QUASAR-328",
        "target": 29920,
        "excellency": 46376,
        "timeLimit": 152,
        "coins": 2008,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 37.5
        }
    },
    {
        "id": 329,
        "name": "NOVA-329",
        "target": 30010,
        "excellency": 46515,
        "timeLimit": 152,
        "coins": 2014,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 37.5
        }
    },
    {
        "id": 330,
        "name": "RIDGE-330",
        "target": 30100,
        "excellency": 46655,
        "timeLimit": 153,
        "coins": 2020,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 37.5
        }
    },
    {
        "id": 331,
        "name": "SPIRE-331",
        "target": 30190,
        "excellency": 46794,
        "timeLimit": 153,
        "coins": 2026,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 37.5
        }
    },
    {
        "id": 332,
        "name": "AETHER-332",
        "target": 30280,
        "excellency": 46934,
        "timeLimit": 153,
        "coins": 2032,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 37.5
        }
    },
    {
        "id": 333,
        "name": "CORONA-333",
        "target": 30370,
        "excellency": 47073,
        "timeLimit": 153,
        "coins": 2038,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 37.5
        }
    },
    {
        "id": 334,
        "name": "HELIX-334",
        "target": 30460,
        "excellency": 47213,
        "timeLimit": 153,
        "coins": 2044,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 37.5
        }
    },
    {
        "id": 335,
        "name": "PRISM-335",
        "target": 30550,
        "excellency": 47352,
        "timeLimit": 153,
        "coins": 2050,
        "kills": 51,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 37.5
        }
    },
    {
        "id": 336,
        "name": "FORGE-336",
        "target": 30640,
        "excellency": 47492,
        "timeLimit": 153,
        "coins": 2056,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 37.5
        }
    },
    {
        "id": 337,
        "name": "ABYSS-337",
        "target": 30730,
        "excellency": 47631,
        "timeLimit": 153,
        "coins": 2062,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 37.5
        }
    },
    {
        "id": 338,
        "name": "SUMMIT-338",
        "target": 30820,
        "excellency": 47771,
        "timeLimit": 153,
        "coins": 2068,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 37.5
        }
    },
    {
        "id": 339,
        "name": "VECTOR-339",
        "target": 30910,
        "excellency": 47910,
        "timeLimit": 153,
        "coins": 2074,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 37.5
        }
    },
    {
        "id": 340,
        "name": "OMEGA-340",
        "target": 31000,
        "excellency": 48050,
        "timeLimit": 154,
        "coins": 2080,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 37.5
        }
    },
    {
        "id": 341,
        "name": "SECTOR-341",
        "target": 31090,
        "excellency": 48189,
        "timeLimit": 154,
        "coins": 2086,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 37.5
        }
    },
    {
        "id": 342,
        "name": "DRIFT-342",
        "target": 31180,
        "excellency": 48329,
        "timeLimit": 154,
        "coins": 2092,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 37.5
        }
    },
    {
        "id": 343,
        "name": "PULSE-343",
        "target": 31270,
        "excellency": 48468,
        "timeLimit": 154,
        "coins": 2098,
        "kills": 52,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 37.5
        }
    },
    {
        "id": 344,
        "name": "ECHO-344",
        "target": 31360,
        "excellency": 48608,
        "timeLimit": 154,
        "coins": 2104,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 37.5
        }
    },
    {
        "id": 345,
        "name": "VOID-345",
        "target": 31450,
        "excellency": 48747,
        "timeLimit": 154,
        "coins": 2110,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 37.5
        }
    },
    {
        "id": 346,
        "name": "FLARE-346",
        "target": 31540,
        "excellency": 48887,
        "timeLimit": 154,
        "coins": 2116,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 37.5
        }
    },
    {
        "id": 347,
        "name": "ORBIT-347",
        "target": 31630,
        "excellency": 49026,
        "timeLimit": 154,
        "coins": 2122,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 37.5
        }
    },
    {
        "id": 348,
        "name": "QUASAR-348",
        "target": 31720,
        "excellency": 49166,
        "timeLimit": 154,
        "coins": 2128,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 37.5
        }
    },
    {
        "id": 349,
        "name": "NOVA-349",
        "target": 31810,
        "excellency": 49305,
        "timeLimit": 154,
        "coins": 2134,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 37.5
        }
    },
    {
        "id": 350,
        "name": "RIDGE-350",
        "target": 31900,
        "excellency": 49445,
        "timeLimit": 155,
        "coins": 2140,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 37.5
        }
    },
    {
        "id": 351,
        "name": "SPIRE-351",
        "target": 31990,
        "excellency": 49584,
        "timeLimit": 155,
        "coins": 2146,
        "kills": 53,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 33.0
        }
    },
    {
        "id": 352,
        "name": "AETHER-352",
        "target": 32080,
        "excellency": 49724,
        "timeLimit": 155,
        "coins": 2152,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 33.0
        }
    },
    {
        "id": 353,
        "name": "CORONA-353",
        "target": 32170,
        "excellency": 49863,
        "timeLimit": 155,
        "coins": 2158,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 33.0
        }
    },
    {
        "id": 354,
        "name": "HELIX-354",
        "target": 32260,
        "excellency": 50003,
        "timeLimit": 155,
        "coins": 2164,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 33.0
        }
    },
    {
        "id": 355,
        "name": "PRISM-355",
        "target": 32350,
        "excellency": 50142,
        "timeLimit": 155,
        "coins": 2170,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 33.0
        }
    },
    {
        "id": 356,
        "name": "FORGE-356",
        "target": 32440,
        "excellency": 50282,
        "timeLimit": 155,
        "coins": 2176,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 33.0
        }
    },
    {
        "id": 357,
        "name": "ABYSS-357",
        "target": 32530,
        "excellency": 50421,
        "timeLimit": 155,
        "coins": 2182,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 33.0
        }
    },
    {
        "id": 358,
        "name": "SUMMIT-358",
        "target": 32620,
        "excellency": 50561,
        "timeLimit": 155,
        "coins": 2188,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 33.0
        }
    },
    {
        "id": 359,
        "name": "VECTOR-359",
        "target": 32710,
        "excellency": 50700,
        "timeLimit": 155,
        "coins": 2194,
        "kills": 54,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 33.0
        }
    },
    {
        "id": 360,
        "name": "OMEGA-360",
        "target": 32800,
        "excellency": 50840,
        "timeLimit": 156,
        "coins": 2200,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 33.0
        }
    },
    {
        "id": 361,
        "name": "SECTOR-361",
        "target": 32890,
        "excellency": 50979,
        "timeLimit": 156,
        "coins": 2206,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 33.0
        }
    },
    {
        "id": 362,
        "name": "DRIFT-362",
        "target": 32980,
        "excellency": 51119,
        "timeLimit": 156,
        "coins": 2212,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 33.0
        }
    },
    {
        "id": 363,
        "name": "PULSE-363",
        "target": 33070,
        "excellency": 51258,
        "timeLimit": 156,
        "coins": 2218,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 33.0
        }
    },
    {
        "id": 364,
        "name": "ECHO-364",
        "target": 33160,
        "excellency": 51398,
        "timeLimit": 156,
        "coins": 2224,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 33.0
        }
    },
    {
        "id": 365,
        "name": "VOID-365",
        "target": 33250,
        "excellency": 51537,
        "timeLimit": 156,
        "coins": 2230,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 33.0
        }
    },
    {
        "id": 366,
        "name": "FLARE-366",
        "target": 33340,
        "excellency": 51677,
        "timeLimit": 156,
        "coins": 2236,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 33.0
        }
    },
    {
        "id": 367,
        "name": "ORBIT-367",
        "target": 33430,
        "excellency": 51816,
        "timeLimit": 156,
        "coins": 2242,
        "kills": 55,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 33.0
        }
    },
    {
        "id": 368,
        "name": "QUASAR-368",
        "target": 33520,
        "excellency": 51956,
        "timeLimit": 156,
        "coins": 2248,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 33.0
        }
    },
    {
        "id": 369,
        "name": "NOVA-369",
        "target": 33610,
        "excellency": 52095,
        "timeLimit": 156,
        "coins": 2254,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 33.0
        }
    },
    {
        "id": 370,
        "name": "RIDGE-370",
        "target": 33700,
        "excellency": 52235,
        "timeLimit": 157,
        "coins": 2260,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 33.0
        }
    },
    {
        "id": 371,
        "name": "SPIRE-371",
        "target": 33790,
        "excellency": 52374,
        "timeLimit": 157,
        "coins": 2266,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 33.0
        }
    },
    {
        "id": 372,
        "name": "AETHER-372",
        "target": 33880,
        "excellency": 52514,
        "timeLimit": 157,
        "coins": 2272,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 33.0
        }
    },
    {
        "id": 373,
        "name": "CORONA-373",
        "target": 33970,
        "excellency": 52653,
        "timeLimit": 157,
        "coins": 2278,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 33.0
        }
    },
    {
        "id": 374,
        "name": "HELIX-374",
        "target": 34060,
        "excellency": 52793,
        "timeLimit": 157,
        "coins": 2284,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 33.0
        }
    },
    {
        "id": 375,
        "name": "PRISM-375",
        "target": 34150,
        "excellency": 52932,
        "timeLimit": 157,
        "coins": 2290,
        "kills": 56,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 33.0
        }
    },
    {
        "id": 376,
        "name": "FORGE-376",
        "target": 34240,
        "excellency": 53072,
        "timeLimit": 157,
        "coins": 2296,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 28.5
        }
    },
    {
        "id": 377,
        "name": "ABYSS-377",
        "target": 34330,
        "excellency": 53211,
        "timeLimit": 157,
        "coins": 2302,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 28.5
        }
    },
    {
        "id": 378,
        "name": "SUMMIT-378",
        "target": 34420,
        "excellency": 53351,
        "timeLimit": 157,
        "coins": 2308,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 28.5
        }
    },
    {
        "id": 379,
        "name": "VECTOR-379",
        "target": 34510,
        "excellency": 53490,
        "timeLimit": 157,
        "coins": 2314,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 28.5
        }
    },
    {
        "id": 380,
        "name": "OMEGA-380",
        "target": 34600,
        "excellency": 53630,
        "timeLimit": 158,
        "coins": 2320,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 12,
            "y": 28.5
        }
    },
    {
        "id": 381,
        "name": "SECTOR-381",
        "target": 34690,
        "excellency": 53769,
        "timeLimit": 158,
        "coins": 2326,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 28.5
        }
    },
    {
        "id": 382,
        "name": "DRIFT-382",
        "target": 34780,
        "excellency": 53909,
        "timeLimit": 158,
        "coins": 2332,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 28.5
        }
    },
    {
        "id": 383,
        "name": "PULSE-383",
        "target": 34870,
        "excellency": 54048,
        "timeLimit": 158,
        "coins": 2338,
        "kills": 57,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 28.5
        }
    },
    {
        "id": 384,
        "name": "ECHO-384",
        "target": 34960,
        "excellency": 54188,
        "timeLimit": 158,
        "coins": 2344,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 28.5
        }
    },
    {
        "id": 385,
        "name": "VOID-385",
        "target": 35050,
        "excellency": 54327,
        "timeLimit": 158,
        "coins": 2350,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 31,
            "y": 28.5
        }
    },
    {
        "id": 386,
        "name": "FLARE-386",
        "target": 35140,
        "excellency": 54467,
        "timeLimit": 158,
        "coins": 2356,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 28.5
        }
    },
    {
        "id": 387,
        "name": "ORBIT-387",
        "target": 35230,
        "excellency": 54606,
        "timeLimit": 158,
        "coins": 2362,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 28.5
        }
    },
    {
        "id": 388,
        "name": "QUASAR-388",
        "target": 35320,
        "excellency": 54746,
        "timeLimit": 158,
        "coins": 2368,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 28.5
        }
    },
    {
        "id": 389,
        "name": "NOVA-389",
        "target": 35410,
        "excellency": 54885,
        "timeLimit": 158,
        "coins": 2374,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 28.5
        }
    },
    {
        "id": 390,
        "name": "RIDGE-390",
        "target": 35500,
        "excellency": 55025,
        "timeLimit": 159,
        "coins": 2380,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 50,
            "y": 28.5
        }
    },
    {
        "id": 391,
        "name": "SPIRE-391",
        "target": 35590,
        "excellency": 55164,
        "timeLimit": 159,
        "coins": 2386,
        "kills": 58,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 28.5
        }
    },
    {
        "id": 392,
        "name": "AETHER-392",
        "target": 35680,
        "excellency": 55304,
        "timeLimit": 159,
        "coins": 2392,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 28.5
        }
    },
    {
        "id": 393,
        "name": "CORONA-393",
        "target": 35770,
        "excellency": 55443,
        "timeLimit": 159,
        "coins": 2398,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 28.5
        }
    },
    {
        "id": 394,
        "name": "HELIX-394",
        "target": 35860,
        "excellency": 55583,
        "timeLimit": 159,
        "coins": 2404,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 28.5
        }
    },
    {
        "id": 395,
        "name": "PRISM-395",
        "target": 35950,
        "excellency": 55722,
        "timeLimit": 159,
        "coins": 2410,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 69,
            "y": 28.5
        }
    },
    {
        "id": 396,
        "name": "FORGE-396",
        "target": 36040,
        "excellency": 55862,
        "timeLimit": 159,
        "coins": 2416,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 28.5
        }
    },
    {
        "id": 397,
        "name": "ABYSS-397",
        "target": 36130,
        "excellency": 56001,
        "timeLimit": 159,
        "coins": 2422,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 28.5
        }
    },
    {
        "id": 398,
        "name": "SUMMIT-398",
        "target": 36220,
        "excellency": 56141,
        "timeLimit": 159,
        "coins": 2428,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 28.5
        }
    },
    {
        "id": 399,
        "name": "VECTOR-399",
        "target": 36310,
        "excellency": 56280,
        "timeLimit": 159,
        "coins": 2434,
        "kills": 59,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 28.5
        }
    },
    {
        "id": 400,
        "name": "OMEGA-400",
        "target": 36400,
        "excellency": 56420,
        "timeLimit": 160,
        "coins": 2440,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank'],
        "map": {
            "x": 88,
            "y": 28.5
        }
    },
    {
        "id": 401,
        "name": "SECTOR-401",
        "target": 36490,
        "excellency": 56559,
        "timeLimit": 160,
        "coins": 2446,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 24.0
        }
    },
    {
        "id": 402,
        "name": "DRIFT-402",
        "target": 36580,
        "excellency": 56699,
        "timeLimit": 160,
        "coins": 2452,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 24.0
        }
    },
    {
        "id": 403,
        "name": "PULSE-403",
        "target": 36670,
        "excellency": 56838,
        "timeLimit": 160,
        "coins": 2458,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 24.0
        }
    },
    {
        "id": 404,
        "name": "ECHO-404",
        "target": 36760,
        "excellency": 56978,
        "timeLimit": 160,
        "coins": 2464,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 24.0
        }
    },
    {
        "id": 405,
        "name": "VOID-405",
        "target": 36850,
        "excellency": 57117,
        "timeLimit": 160,
        "coins": 2470,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 24.0
        }
    },
    {
        "id": 406,
        "name": "FLARE-406",
        "target": 36940,
        "excellency": 57257,
        "timeLimit": 160,
        "coins": 2476,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 24.0
        }
    },
    {
        "id": 407,
        "name": "ORBIT-407",
        "target": 37030,
        "excellency": 57396,
        "timeLimit": 160,
        "coins": 2482,
        "kills": 60,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 24.0
        }
    },
    {
        "id": 408,
        "name": "QUASAR-408",
        "target": 37120,
        "excellency": 57536,
        "timeLimit": 160,
        "coins": 2488,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 24.0
        }
    },
    {
        "id": 409,
        "name": "NOVA-409",
        "target": 37210,
        "excellency": 57675,
        "timeLimit": 160,
        "coins": 2494,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 24.0
        }
    },
    {
        "id": 410,
        "name": "RIDGE-410",
        "target": 37300,
        "excellency": 57815,
        "timeLimit": 161,
        "coins": 2500,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 24.0
        }
    },
    {
        "id": 411,
        "name": "SPIRE-411",
        "target": 37390,
        "excellency": 57954,
        "timeLimit": 161,
        "coins": 2506,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 24.0
        }
    },
    {
        "id": 412,
        "name": "AETHER-412",
        "target": 37480,
        "excellency": 58094,
        "timeLimit": 161,
        "coins": 2512,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 24.0
        }
    },
    {
        "id": 413,
        "name": "CORONA-413",
        "target": 37570,
        "excellency": 58233,
        "timeLimit": 161,
        "coins": 2518,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 24.0
        }
    },
    {
        "id": 414,
        "name": "HELIX-414",
        "target": 37660,
        "excellency": 58373,
        "timeLimit": 161,
        "coins": 2524,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 24.0
        }
    },
    {
        "id": 415,
        "name": "PRISM-415",
        "target": 37750,
        "excellency": 58512,
        "timeLimit": 161,
        "coins": 2530,
        "kills": 61,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 24.0
        }
    },
    {
        "id": 416,
        "name": "FORGE-416",
        "target": 37840,
        "excellency": 58652,
        "timeLimit": 161,
        "coins": 2536,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 24.0
        }
    },
    {
        "id": 417,
        "name": "ABYSS-417",
        "target": 37930,
        "excellency": 58791,
        "timeLimit": 161,
        "coins": 2542,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 24.0
        }
    },
    {
        "id": 418,
        "name": "SUMMIT-418",
        "target": 38020,
        "excellency": 58931,
        "timeLimit": 161,
        "coins": 2548,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 24.0
        }
    },
    {
        "id": 419,
        "name": "VECTOR-419",
        "target": 38110,
        "excellency": 59070,
        "timeLimit": 161,
        "coins": 2554,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 24.0
        }
    },
    {
        "id": 420,
        "name": "OMEGA-420",
        "target": 38200,
        "excellency": 59210,
        "timeLimit": 162,
        "coins": 2560,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 24.0
        }
    },
    {
        "id": 421,
        "name": "SECTOR-421",
        "target": 38290,
        "excellency": 59349,
        "timeLimit": 162,
        "coins": 2566,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 24.0
        }
    },
    {
        "id": 422,
        "name": "DRIFT-422",
        "target": 38380,
        "excellency": 59489,
        "timeLimit": 162,
        "coins": 2572,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 24.0
        }
    },
    {
        "id": 423,
        "name": "PULSE-423",
        "target": 38470,
        "excellency": 59628,
        "timeLimit": 162,
        "coins": 2578,
        "kills": 62,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 24.0
        }
    },
    {
        "id": 424,
        "name": "ECHO-424",
        "target": 38560,
        "excellency": 59768,
        "timeLimit": 162,
        "coins": 2584,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 24.0
        }
    },
    {
        "id": 425,
        "name": "VOID-425",
        "target": 38650,
        "excellency": 59907,
        "timeLimit": 162,
        "coins": 2590,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 24.0
        }
    },
    {
        "id": 426,
        "name": "FLARE-426",
        "target": 38740,
        "excellency": 60047,
        "timeLimit": 162,
        "coins": 2596,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 19.5
        }
    },
    {
        "id": 427,
        "name": "ORBIT-427",
        "target": 38830,
        "excellency": 60186,
        "timeLimit": 162,
        "coins": 2602,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 19.5
        }
    },
    {
        "id": 428,
        "name": "QUASAR-428",
        "target": 38920,
        "excellency": 60326,
        "timeLimit": 162,
        "coins": 2608,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 19.5
        }
    },
    {
        "id": 429,
        "name": "NOVA-429",
        "target": 39010,
        "excellency": 60465,
        "timeLimit": 162,
        "coins": 2614,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 19.5
        }
    },
    {
        "id": 430,
        "name": "RIDGE-430",
        "target": 39100,
        "excellency": 60605,
        "timeLimit": 163,
        "coins": 2620,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 19.5
        }
    },
    {
        "id": 431,
        "name": "SPIRE-431",
        "target": 39190,
        "excellency": 60744,
        "timeLimit": 163,
        "coins": 2626,
        "kills": 63,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 19.5
        }
    },
    {
        "id": 432,
        "name": "AETHER-432",
        "target": 39280,
        "excellency": 60884,
        "timeLimit": 163,
        "coins": 2632,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 19.5
        }
    },
    {
        "id": 433,
        "name": "CORONA-433",
        "target": 39370,
        "excellency": 61023,
        "timeLimit": 163,
        "coins": 2638,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 19.5
        }
    },
    {
        "id": 434,
        "name": "HELIX-434",
        "target": 39460,
        "excellency": 61163,
        "timeLimit": 163,
        "coins": 2644,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 19.5
        }
    },
    {
        "id": 435,
        "name": "PRISM-435",
        "target": 39550,
        "excellency": 61302,
        "timeLimit": 163,
        "coins": 2650,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 19.5
        }
    },
    {
        "id": 436,
        "name": "FORGE-436",
        "target": 39640,
        "excellency": 61442,
        "timeLimit": 163,
        "coins": 2656,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 19.5
        }
    },
    {
        "id": 437,
        "name": "ABYSS-437",
        "target": 39730,
        "excellency": 61581,
        "timeLimit": 163,
        "coins": 2662,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 19.5
        }
    },
    {
        "id": 438,
        "name": "SUMMIT-438",
        "target": 39820,
        "excellency": 61721,
        "timeLimit": 163,
        "coins": 2668,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 19.5
        }
    },
    {
        "id": 439,
        "name": "VECTOR-439",
        "target": 39910,
        "excellency": 61860,
        "timeLimit": 163,
        "coins": 2674,
        "kills": 64,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 19.5
        }
    },
    {
        "id": 440,
        "name": "OMEGA-440",
        "target": 40000,
        "excellency": 62000,
        "timeLimit": 164,
        "coins": 2680,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 19.5
        }
    },
    {
        "id": 441,
        "name": "SECTOR-441",
        "target": 40090,
        "excellency": 62139,
        "timeLimit": 164,
        "coins": 2686,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 19.5
        }
    },
    {
        "id": 442,
        "name": "DRIFT-442",
        "target": 40180,
        "excellency": 62279,
        "timeLimit": 164,
        "coins": 2692,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 19.5
        }
    },
    {
        "id": 443,
        "name": "PULSE-443",
        "target": 40270,
        "excellency": 62418,
        "timeLimit": 164,
        "coins": 2698,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 19.5
        }
    },
    {
        "id": 444,
        "name": "ECHO-444",
        "target": 40360,
        "excellency": 62558,
        "timeLimit": 164,
        "coins": 2704,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 19.5
        }
    },
    {
        "id": 445,
        "name": "VOID-445",
        "target": 40450,
        "excellency": 62697,
        "timeLimit": 164,
        "coins": 2710,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 19.5
        }
    },
    {
        "id": 446,
        "name": "FLARE-446",
        "target": 40540,
        "excellency": 62837,
        "timeLimit": 164,
        "coins": 2716,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 19.5
        }
    },
    {
        "id": 447,
        "name": "ORBIT-447",
        "target": 40630,
        "excellency": 62976,
        "timeLimit": 164,
        "coins": 2722,
        "kills": 65,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 19.5
        }
    },
    {
        "id": 448,
        "name": "QUASAR-448",
        "target": 40720,
        "excellency": 63116,
        "timeLimit": 164,
        "coins": 2728,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 19.5
        }
    },
    {
        "id": 449,
        "name": "NOVA-449",
        "target": 40810,
        "excellency": 63255,
        "timeLimit": 164,
        "coins": 2734,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 19.5
        }
    },
    {
        "id": 450,
        "name": "RIDGE-450",
        "target": 40900,
        "excellency": 63395,
        "timeLimit": 165,
        "coins": 2740,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 19.5
        }
    },
    {
        "id": 451,
        "name": "SPIRE-451",
        "target": 40990,
        "excellency": 63534,
        "timeLimit": 165,
        "coins": 2746,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 15.0
        }
    },
    {
        "id": 452,
        "name": "AETHER-452",
        "target": 41080,
        "excellency": 63674,
        "timeLimit": 165,
        "coins": 2752,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 15.0
        }
    },
    {
        "id": 453,
        "name": "CORONA-453",
        "target": 41170,
        "excellency": 63813,
        "timeLimit": 165,
        "coins": 2758,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 15.0
        }
    },
    {
        "id": 454,
        "name": "HELIX-454",
        "target": 41260,
        "excellency": 63953,
        "timeLimit": 165,
        "coins": 2764,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 15.0
        }
    },
    {
        "id": 455,
        "name": "PRISM-455",
        "target": 41350,
        "excellency": 64092,
        "timeLimit": 165,
        "coins": 2770,
        "kills": 66,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 15.0
        }
    },
    {
        "id": 456,
        "name": "FORGE-456",
        "target": 41440,
        "excellency": 64232,
        "timeLimit": 165,
        "coins": 2776,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 15.0
        }
    },
    {
        "id": 457,
        "name": "ABYSS-457",
        "target": 41530,
        "excellency": 64371,
        "timeLimit": 165,
        "coins": 2782,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 15.0
        }
    },
    {
        "id": 458,
        "name": "SUMMIT-458",
        "target": 41620,
        "excellency": 64511,
        "timeLimit": 165,
        "coins": 2788,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 15.0
        }
    },
    {
        "id": 459,
        "name": "VECTOR-459",
        "target": 41710,
        "excellency": 64650,
        "timeLimit": 165,
        "coins": 2794,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 15.0
        }
    },
    {
        "id": 460,
        "name": "OMEGA-460",
        "target": 41800,
        "excellency": 64790,
        "timeLimit": 166,
        "coins": 2800,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 15.0
        }
    },
    {
        "id": 461,
        "name": "SECTOR-461",
        "target": 41890,
        "excellency": 64929,
        "timeLimit": 166,
        "coins": 2806,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 15.0
        }
    },
    {
        "id": 462,
        "name": "DRIFT-462",
        "target": 41980,
        "excellency": 65069,
        "timeLimit": 166,
        "coins": 2812,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 15.0
        }
    },
    {
        "id": 463,
        "name": "PULSE-463",
        "target": 42070,
        "excellency": 65208,
        "timeLimit": 166,
        "coins": 2818,
        "kills": 67,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 15.0
        }
    },
    {
        "id": 464,
        "name": "ECHO-464",
        "target": 42160,
        "excellency": 65348,
        "timeLimit": 166,
        "coins": 2824,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 15.0
        }
    },
    {
        "id": 465,
        "name": "VOID-465",
        "target": 42250,
        "excellency": 65487,
        "timeLimit": 166,
        "coins": 2830,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 15.0
        }
    },
    {
        "id": 466,
        "name": "FLARE-466",
        "target": 42340,
        "excellency": 65627,
        "timeLimit": 166,
        "coins": 2836,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 15.0
        }
    },
    {
        "id": 467,
        "name": "ORBIT-467",
        "target": 42430,
        "excellency": 65766,
        "timeLimit": 166,
        "coins": 2842,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 15.0
        }
    },
    {
        "id": 468,
        "name": "QUASAR-468",
        "target": 42520,
        "excellency": 65906,
        "timeLimit": 166,
        "coins": 2848,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 15.0
        }
    },
    {
        "id": 469,
        "name": "NOVA-469",
        "target": 42610,
        "excellency": 66045,
        "timeLimit": 166,
        "coins": 2854,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 15.0
        }
    },
    {
        "id": 470,
        "name": "RIDGE-470",
        "target": 42700,
        "excellency": 66185,
        "timeLimit": 167,
        "coins": 2860,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 15.0
        }
    },
    {
        "id": 471,
        "name": "SPIRE-471",
        "target": 42790,
        "excellency": 66324,
        "timeLimit": 167,
        "coins": 2866,
        "kills": 68,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 15.0
        }
    },
    {
        "id": 472,
        "name": "AETHER-472",
        "target": 42880,
        "excellency": 66464,
        "timeLimit": 167,
        "coins": 2872,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 15.0
        }
    },
    {
        "id": 473,
        "name": "CORONA-473",
        "target": 42970,
        "excellency": 66603,
        "timeLimit": 167,
        "coins": 2878,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 15.0
        }
    },
    {
        "id": 474,
        "name": "HELIX-474",
        "target": 43060,
        "excellency": 66743,
        "timeLimit": 167,
        "coins": 2884,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 15.0
        }
    },
    {
        "id": 475,
        "name": "PRISM-475",
        "target": 43150,
        "excellency": 66882,
        "timeLimit": 167,
        "coins": 2890,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 15.0
        }
    },
    {
        "id": 476,
        "name": "FORGE-476",
        "target": 43240,
        "excellency": 67022,
        "timeLimit": 167,
        "coins": 2896,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 10.5
        }
    },
    {
        "id": 477,
        "name": "ABYSS-477",
        "target": 43330,
        "excellency": 67161,
        "timeLimit": 167,
        "coins": 2902,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 10.5
        }
    },
    {
        "id": 478,
        "name": "SUMMIT-478",
        "target": 43420,
        "excellency": 67301,
        "timeLimit": 167,
        "coins": 2908,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 10.5
        }
    },
    {
        "id": 479,
        "name": "VECTOR-479",
        "target": 43510,
        "excellency": 67440,
        "timeLimit": 167,
        "coins": 2914,
        "kills": 69,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 10.5
        }
    },
    {
        "id": 480,
        "name": "OMEGA-480",
        "target": 43600,
        "excellency": 67580,
        "timeLimit": 168,
        "coins": 2920,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 12,
            "y": 10.5
        }
    },
    {
        "id": 481,
        "name": "SECTOR-481",
        "target": 43690,
        "excellency": 67719,
        "timeLimit": 168,
        "coins": 2926,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 10.5
        }
    },
    {
        "id": 482,
        "name": "DRIFT-482",
        "target": 43780,
        "excellency": 67859,
        "timeLimit": 168,
        "coins": 2932,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 10.5
        }
    },
    {
        "id": 483,
        "name": "PULSE-483",
        "target": 43870,
        "excellency": 67998,
        "timeLimit": 168,
        "coins": 2938,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 10.5
        }
    },
    {
        "id": 484,
        "name": "ECHO-484",
        "target": 43960,
        "excellency": 68138,
        "timeLimit": 168,
        "coins": 2944,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 10.5
        }
    },
    {
        "id": 485,
        "name": "VOID-485",
        "target": 44050,
        "excellency": 68277,
        "timeLimit": 168,
        "coins": 2950,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 31,
            "y": 10.5
        }
    },
    {
        "id": 486,
        "name": "FLARE-486",
        "target": 44140,
        "excellency": 68417,
        "timeLimit": 168,
        "coins": 2956,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 10.5
        }
    },
    {
        "id": 487,
        "name": "ORBIT-487",
        "target": 44230,
        "excellency": 68556,
        "timeLimit": 168,
        "coins": 2962,
        "kills": 70,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 10.5
        }
    },
    {
        "id": 488,
        "name": "QUASAR-488",
        "target": 44320,
        "excellency": 68696,
        "timeLimit": 168,
        "coins": 2968,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 10.5
        }
    },
    {
        "id": 489,
        "name": "NOVA-489",
        "target": 44410,
        "excellency": 68835,
        "timeLimit": 168,
        "coins": 2974,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 10.5
        }
    },
    {
        "id": 490,
        "name": "RIDGE-490",
        "target": 44500,
        "excellency": 68975,
        "timeLimit": 169,
        "coins": 2980,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 50,
            "y": 10.5
        }
    },
    {
        "id": 491,
        "name": "SPIRE-491",
        "target": 44590,
        "excellency": 69114,
        "timeLimit": 169,
        "coins": 2986,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 10.5
        }
    },
    {
        "id": 492,
        "name": "AETHER-492",
        "target": 44680,
        "excellency": 69254,
        "timeLimit": 169,
        "coins": 2992,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 10.5
        }
    },
    {
        "id": 493,
        "name": "CORONA-493",
        "target": 44770,
        "excellency": 69393,
        "timeLimit": 169,
        "coins": 2998,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 10.5
        }
    },
    {
        "id": 494,
        "name": "HELIX-494",
        "target": 44860,
        "excellency": 69533,
        "timeLimit": 169,
        "coins": 3004,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 10.5
        }
    },
    {
        "id": 495,
        "name": "PRISM-495",
        "target": 44950,
        "excellency": 69672,
        "timeLimit": 169,
        "coins": 3010,
        "kills": 71,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 69,
            "y": 10.5
        }
    },
    {
        "id": 496,
        "name": "FORGE-496",
        "target": 45040,
        "excellency": 69812,
        "timeLimit": 169,
        "coins": 3016,
        "kills": 72,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 10.5
        }
    },
    {
        "id": 497,
        "name": "ABYSS-497",
        "target": 45130,
        "excellency": 69951,
        "timeLimit": 169,
        "coins": 3022,
        "kills": 72,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 10.5
        }
    },
    {
        "id": 498,
        "name": "SUMMIT-498",
        "target": 45220,
        "excellency": 70091,
        "timeLimit": 169,
        "coins": 3028,
        "kills": 72,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 10.5
        }
    },
    {
        "id": 499,
        "name": "VECTOR-499",
        "target": 45310,
        "excellency": 70230,
        "timeLimit": 169,
        "coins": 3034,
        "kills": 72,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 10.5
        }
    },
    {
        "id": 500,
        "name": "OMEGA-500",
        "target": 45400,
        "excellency": 70370,
        "timeLimit": 170,
        "coins": 3040,
        "kills": 72,
        "allowedTypes": ['basic', 'fast', 'shooter', 'tank', 'elite'],
        "map": {
            "x": 88,
            "y": 10.5
        }
    }
];

function getAdventureLevel(id) {
    return ADVENTURE_LEVELS.find(function (l) { return l.id === id; }) || null;
}

function calculateStars(score, livesLeft, def) {
    if (!def || livesLeft <= 0) return 0;
    if (score < def.target) return 0;
    if (score >= def.excellency || livesLeft >= 3) return 3;
    if (score >= Math.floor(def.excellency * 0.75) || livesLeft >= 2) return 2;
    return 1;
}

function loadAdventureProgress() {
    try {
        const raw = localStorage.getItem("spaceStrikeAdventure");
        if (!raw) return { levels: {} };
        const data = JSON.parse(raw);
        if (!data.levels) data.levels = {};
        return data;
    } catch (e) {
        return { levels: {} };
    }
}

function saveAdventureProgress(data) {
    try { localStorage.setItem("spaceStrikeAdventure", JSON.stringify(data)); } catch (e) {}
}

function setLevelStars(levelId, stars) {
    const data = loadAdventureProgress();
    if (!data.levels) data.levels = {};
    const key = String(levelId);
    const prev = Number(data.levels[key] || 0);
    data.levels[key] = Math.max(prev, Math.max(0, Math.min(3, stars)));
    saveAdventureProgress(data);
    return data.levels[key];
}

function isAdventureLevelUnlocked(id, progress) {
    if (id <= 1) return true;
    return Number((progress.levels || {})[String(id - 1)] || 0) >= 1;
}

if (typeof window !== "undefined") {
    window.SpaceStrikeLevels = {
        ADVENTURE_LEVELS: ADVENTURE_LEVELS,
        getAdventureLevel: getAdventureLevel,
        calculateStars: calculateStars,
        loadAdventureProgress: loadAdventureProgress,
        saveAdventureProgress: saveAdventureProgress,
        setLevelStars: setLevelStars,
        isUnlocked: isAdventureLevelUnlocked
    };
}
