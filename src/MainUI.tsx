import * as React from "react";
import * as ReactDOM from "react-dom";

import jQuery from "jquery";

import Browser from "./Utils/Browser";
import { ProgressBar } from "./Utils/ProgressBar";

import { CutScene } from "./Behaviour/CutScene";
import MasterLoader from "./Loading/MasterLoader";
import Play from "./Player/Play";
import { ConfigManager } from "./ConfigManager";

import { Game } from "./UI/test2";

const showTiles = false;

function setContainerDimensions() {
    if (!showTiles) {
        jQuery('#container').width(window.innerWidth);
        jQuery('#container').height(window.innerHeight);
    }
}

jQuery(window).on('resize', setContainerDimensions);
jQuery(window).on('load', setContainerDimensions);

jQuery(document).on('keydown', function(event) {
    //console.log(event.which)
    switch (event.which) {
        case 72: // H
            jQuery("#help").css('display', jQuery('#help').css('display') == 'block' ? 'none' : 'block');
            break;
        case 13: // Enter
            jQuery("#panel").css('display', jQuery('#panel').css('display') == 'block' ? 'none' : 'block');
            jQuery("#stats").css('display', jQuery('#stats').css('display') == 'block' ? 'none' : 'block');
            break;
        case 36: // Home
            let qgame = Browser.QueryString.trgame, qengine = Browser.QueryString.engine,
                prm = '?';

            if (qengine) {
                prm += 'engine=' + qengine;
            }

            if (qgame) {
                prm += '&trgame=' + qgame;
            }

            document.location.href = '/index.html' + prm;
            break;
    }
});

function loadAndPlayLevel(level: string | any) {
    const progressbar = new ProgressBar(document.getElementById('container') as Element);

    progressbar.show();

    fetch('/resources/level/TRLevels.xml').then((response) => {
        response.text().then((txt) => {
            const confMgr = new ConfigManager(jQuery.parseXML(txt));

            MasterLoader.loadLevel(level, confMgr).then((res) => {
                if (!showTiles) {
                    const play = new Play(document.getElementById('container') as Element);
                    (window as any).play = play;
                    fetch('/resources/template/help.html').then((response) => {
                        response.text().then((html) => {
                            jQuery(html).appendTo(document.body);
                        });
                    });
                    if (Browser.QueryString.autostart == '1') {
                        play.initialize(res[0], res[1]).then(() => {
                            progressbar.hide();
                            play.play();
                        });
                    } else {
                        play.initialize(res[0], res[1]).then(() => {
                            if (play.gameData.isCutscene) {
                                const idTimer = setInterval(() => {
                                    if (play.gameData.sceneRender.allMeshesReady) {
                                        clearInterval(idTimer);
                                        progressbar.hide();
                                        play.play(true, true);
                                        play.play(true, false); // we need a 2nd call to display the particle systems in Babylon...
                                        const bhvCutScene = (play.gameData.bhvMgr.getBehaviour("CutScene") as Array<CutScene>)[0] as CutScene;
                                        bhvCutScene.showController();
                                    }
                                }, 10);
                            } else {
                                progressbar.showStart(function() {
                                    progressbar.hide();
                                    play.play();
                                });
                            }
                        });
                    }
                } else {
                    progressbar.hide();
                }
            });
        });
    });
}

function handleFileSelect(evt: Event) {

    function readFile(idx: number) {
        const f = files[idx - 1];
        const freader = new FileReader();
        freader.onload = ((theFile) => {
            return function(e: any) {
                jQuery('#files').css('display', 'none');

                loadAndPlayLevel({
                    "data":         e.target.result,
                    "name":         theFile.name,
                    "showTiles":    showTiles,
                });
            };
        })(f);
        freader.readAsArrayBuffer(f);
    }

    let files = (evt.target! as any).files as Array<any>;

    readFile(1);
}

if (Browser.QueryString.level) {
    loadAndPlayLevel('/resources/level/' + Browser.QueryString.level);
} else {
    jQuery('body').prepend('<input type="file" id="files" multiple="multiple" _style="display: none" />');

    jQuery('#files').css('display', 'block');
    jQuery('#files').on('change', handleFileSelect);
}

// ========================================

ReactDOM.render(
    <>
    <Game />
    <Game />
    </>
    ,
    document.getElementById('root')
);
