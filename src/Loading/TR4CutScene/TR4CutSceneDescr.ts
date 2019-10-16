import { LevelLoader } from "../LevelLoader";

export const bitMasks: Array<number> = [
    0xffc0, 0xff80, 0xff00, 0xfe00, 0xfc00, 0xf800, 0xf000, 0xe000, 0xc000, 0x8000
];

export const Header = [

    'uncompSize', 'uint32',

    '_', function(dataStream: any, struct: any) { LevelLoader.unzip(dataStream, struct, 0); return ''; },

    'signature', ['', 'uint8', 8],

    'directory', ['', [
        'offset', 'uint32',
        'size', 'uint32'
    ], 30]

];

export const Cutscene = [

    'numActors', 'uint16',
    'numFrames', 'uint16',
    'originX', 'int32',
    'originY', 'int32',
    'originZ', 'int32',
    'audioTrackIndex', 'int32',
    'cameraDataOffset', 'uint32',

    'actors', ['', [
        'dataOffset', 'uint32',
        'slotNumber', 'uint16',
        'numNodes', 'uint16'
    ], 'numActors' ],

    'camera', [
        'targetHeader', [
            'startPosX', 'int16',
            'startPosY', 'int16',
            'startPosZ', 'int16',
            'bitsSizes', 'uint16',
            'numValuesX', 'uint16',
            'numValuesY', 'uint16',
            'numValuesZ', 'uint16'
        ],
        'cameraHeader', [
            'startPosX', 'int16',
            'startPosY', 'int16',
            'startPosZ', 'int16',
            'bitsSizes', 'uint16',
            'numValuesX', 'uint16',
            'numValuesY', 'uint16',
            'numValuesZ', 'uint16'
        ]
    ]

];

export var PositionHeader = [

    'positionHeader', [
        'startPosX', 'int16',
        'startPosY', 'int16',
        'startPosZ', 'int16',
        'bitsSizes', 'uint16',
        'numValuesX', 'uint16',
        'numValuesY', 'uint16',
        'numValuesZ', 'uint16'
    ]

];

export var RotationHeaders = [

    'rotationHeaders', ['', [
        'startRotX', 'int16',
        'startRotY', 'int16',
        'startRotZ', 'int16',
        'bitsSizes', 'uint16',
        'numValuesX', 'uint16',
        'numValuesY', 'uint16',
        'numValuesZ', 'uint16'
    ], 0]

];

export const CutsceneMap = [

    { "file": "joby1a.tr4",     "description": "Lara pulling out shovel and starting to dig",                                       "type": "in_level",     "audio": "081_dig" },
    { "file": "joby1a.tr4",     "description": "Lara standing and putting shovel away",                                             "type": "in_level",     "audio": "" },
    { "file": "joby1a.tr4",     "description": "Lara kneeling, reading inscription then standing",                                  "type": "in_level",     "audio": "084_inscrip" },
    { "file": "joby3a.tr4",     "description": "Bad guy fighting scorpion, Lara killing scorpion, bad guy giving keys to Lara",     "type": "in_level",     "audio": "097_scorpion" },
    { "file": "angkor1.tr4",    "description": "Young Lara getting backpack",                                                       "type": "in_level",     "audio": "074_backpack" },
    { "file": "angkor1.tr4",    "description": "Young Lara appearing from behind Von Croy at level start",                          "type": "in_level",     "audio": "085_intro" },
    { "file": "ang_race.tr4",   "description": "Young Lara winning race",                                                           "type": "in_level",     "audio": "089_larawon" },
    { "file": "ang_race.tr4",   "description": "Von Croy winning race",                                                             "type": "in_level",     "audio": "078_croywon" },
    { "file": "ang_race.tr4",   "description": "Revealing Iris, Von Croy getting trapped and Young Lara going for help",            "type": "",             "audio": "082_finale" },
    { "file": "libend.tr4",     "description": "Lara reading scroll and running away when Von Croy and bad guys coming",            "type": "",             "audio": "090_libend" },
    { "file": "highstrt.tr4",   "description": "Lara coming back to Aziz, destroying of the beast",                                 "type": "",             "audio": "077_crocgod" },
    { "file": "karnak1.tr4",    "description": "Lara arriving in jeep",                                                             "type": "start_level",  "audio": "086_jeepA" },
    { "file": "hall.tr4",       "description": "Von Croy and bad guys coming in car / jeeps",                                       "type": "",             "audio": "087_jeepB" },
    { "file": "settomb2.tr4",   "description": "Lara pulling Ankh off Seth's Tomb",                                                 "type": "in_level",     "audio": "096_sarcoph" },
    { "file": "citnew.tr4",     "description": "Lara meeting Von Croy and 4 dogs",                                                  "type": "",             "audio": "080_crypt2" },
    { "file": "citnew.tr4",     "description": "Lara freeing Jean-Yves bound to a pole",                                            "type": "",             "audio": "079_crypt1" },
    { "file": "alexhub.tr4",    "description": "First meeting with Jean-Yves",                                                      "type": "in_level",     "audio": "091_minilib1" },
    { "file": "alexhub.tr4",    "description": "Second meeting with Jean-Yves",                                                     "type": "in_level",     "audio": "092_minilib2" },
    { "file": "alexhub.tr4",    "description": "Third meeting with Jean-Yves",                                                      "type": "in_level",     "audio": "093_minilib3" },
    { "file": "alexhub.tr4",    "description": "Fourth meeting with Jean-Yves",                                                     "type": "in_level",     "audio": "094_minilib4" },
    { "file": "alexhub2.tr4",   "description": "Lara using pole and hook to get keys",                                              "type": "in_level",     "audio": "088_key" },
    { "file": "palaces2.tr4",   "description": "Lara approaching and sitting on throne",                                            "type": "in_level",     "audio": "098_throne" },
    { "file": "joby5b.tr4",     "description": "Lara activating Horus in light shaft",                                              "type": "in_level",     "audio": "083_horus" },
    { "file": "lowstrt.tr4",    "description": "Lara speaking with injured bad guy to get code",                                    "type": "",             "audio": "099_whouse" },
    { "file": "highstrt.tr4",   "description": "First dialog with Aziz",                                                            "type": "",             "audio": "075_captain1" },
    { "file": "highstrt.tr4",   "description": "Second dialog with Aziz",                                                           "type": "",             "audio": "076_captain2" },
    { "file": "joby5c.tr4",     "description": "Lara riding up from the light shaft and sealing it",                                "type": "in_level",     "audio": "095_phildoor" },
    { "file": "title.tr4",      "description": "Lara revealing hidden golden skull",                                                "type": "in_level",     "audio": "" },
    { "file": "title.tr4",      "description": "Lara crossing falling wooden bridge ",                                              "type": "in_level",     "audio": "" },
    { "file": "title.tr4",      "description": "Lara fighting Mummy",                                                               "type": "in_level",     "audio": "" },

];
