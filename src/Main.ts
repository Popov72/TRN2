import TR4CutSceneDecoder from "./Loading/TR4CutScene/TR4CutSceneDecoder";

import { IScene } from "./Proxy/IScene";

import Browser from "./Utils/Browser";
import { ProgressBar } from "./Utils/ProgressBar";

import MasterLoader from "./Loading/MasterLoader";
import Play from "./Player/Play";

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
	switch(event.which) {
		case 72: // H
			jQuery("#help").css('display', jQuery('#help').css('display') == 'block' ? 'none' : 'block');
			break;
		case 13: // Enter
			jQuery("#panel").css('display', jQuery('#panel').css('display') == 'block' ? 'none' : 'block');
			jQuery("#stats").css('display', jQuery('#stats').css('display') == 'block' ? 'none' : 'block');
			break;
		case 36: // Home
            let qgame = Browser.QueryString.trgame, 
                prm = '';
			
			if (qgame) {
				prm = '?trgame=' + qgame;
            }
            
            document.location.href = 'index.html' + prm;
			break;
	}
});

function loadAndPlayLevel(level: string | any) {
    const progressbar = new ProgressBar(document.getElementById('container') as Element);

    progressbar.show();

    MasterLoader.loadLevel(level).then( (res) => {
        if (!showTiles) {
            const play = new Play(document.getElementById('container') as Element);
            (window as any).play = play;
            fetch('/resources/template/help.html').then( (response) => {
                response.text().then( (html) => {
                    jQuery(html).appendTo(document.body);
                });
            });
            if (Browser.QueryString.autostart == '1') {
                progressbar.hide();
                play.start(res[0], res[1]);
            } else {
                progressbar.showStart(function() { 
                    progressbar.hide(); 
                    play.start(res[0], res[1]);
                });
            }
        } else {
            progressbar.hide();
        }
    });
}

function handleFileSelect(evt: Event) {

	function readFile(idx: number) {
		const f = files[idx-1];
		const freader = new FileReader();
		freader.onload = ( (theFile) => {
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

/*
let parser = new TR4CutSceneDecoder("/resources/level/tr4/cutseq.pak");

(async () => {
    await parser.parse();
    console.log(parser.layout);
    for (let i = 0; i < parser.layout.cutscenes.length; ++i)
        console.log('#' + (i+1) + '\n', JSON.stringify(parser.layout.cutscenes[i]));
})();
*/
