export var Commands: any = {
	ANIMCMD_POSITIONREF3: 		1,
	ANIMCMD_POSITIONREF2: 		2,
	ANIMCMD_SLAVEANIM: 			3,
	ANIMCMD_DEATHANIM: 			4,
	ANIMCMD_PLAYSOUNDONFRAME: 	5,
	ANIMCMD_MISCACTIONONFRAME: 	6
};

Commands.numParams = {
	1:	3,
	2:	2,
	3:	0,
	4:	0,
	5: 	2,
	6: 	2
};

Commands.Misc = {
	ANIMCMD_MISC_REVERTCAMERA:                      0,
	ANIMCMD_MISC_SHAKESCREEN_SOFT:                  1,
	ANIMCMD_MISC_UNK6:                              2,
	ANIMCMD_MISC_MAKEBUBBLE:                        3,
	ANIMCMD_MISC_UNK7:                              4,
	ANIMCMD_MISC_UNK13:                             5,
	ANIMCMD_MISC_UNK14:                             6,
	ANIMCMD_MISC_SHAKESCREEN_HARD:                  7,
	ANIMCMD_MISC_GETCROWBAR:                        8,
	ANIMCMD_MISC_REACTIVATEACTIONKEY:               12,
	ANIMCMD_MISC_COLORFLASH:                        13,
	ANIMCMD_MISC_GETRIGHTGUN:                       14,
	ANIMCMD_MISC_GETLEFTGUN:                        15,
	ANIMCMD_MISC_FIRERIGHTGUN:                      16,
	ANIMCMD_MISC_FIRELEFTGUN:                       17,
	ANIMCMD_MISC_MESHSWAP1:                         18,
	ANIMCMD_MISC_MESHSWAP2:                         19,
	ANIMCMD_MISC_MESHSWAP3:							20,
	ANIMCMD_MISC_UNK3:                              21,
	ANIMCMD_MISC_UNK4:                              22,
	ANIMCMD_MISC_HIDEOBJECT:                        23,
	ANIMCMD_MISC_SHOWOBJECT:                        24,
	ANIMCMD_MISC_RESETHAIR:                       26,
	ANIMCMD_MISC_ADDITIONALSOUND1:                  -32736,
	ANIMCMD_MISC_PLAYSTEPSOUND:                     32,
	ANIMCMD_MISC_GETWATERSKIN:                      43,
	ANIMCMD_MISC_PUTBACKWATERSKIN:                  44,
	ANIMCMD_MISC_ADDITIONALSOUND2:                  16416
};
