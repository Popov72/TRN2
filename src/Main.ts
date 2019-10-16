import { RawLevel } from "./Loading/LevelLoader";
import LevelConverter from "./Loading/LevelConverter";

import TR4CutSceneDecoder from "./Loading/TR4CutScene/TR4CutSceneDecoder";

import Browser from "./Utils/Browser";
import { IScene } from "./Proxy/IScene";
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

jQuery(window).on('resize', function() {
	setContainerDimensions();
})

jQuery(window).on('load', setContainerDimensions);

function handleFileSelect(evt: Event) {

	function readFile(idx: number) {
		const f = files[idx-1];
		const freader = new FileReader();
		freader.onload = ( (theFile) => {
			return function(e: any) {
                const progressbar = new ProgressBar(document.getElementById('container') as Element);
                MasterLoader.loadLevel({
                    "data":         e.target.result,
                    "name":         theFile.name,
                    "showTiles":    showTiles,
                }, progressbar, (level: RawLevel, scene: IScene) => {
                    jQuery('#files').css('display', 'none');
                    const play = new Play(document.getElementById('container') as Element);
                    (window as any).play = play;
                    if (Browser.QueryString.autostart == '1') {
                        progressbar.hide();
                        play.start(level, scene);
                    } else {
                        progressbar.showStart(function() { progressbar.hide(); play.start(level, scene); });
                    }
                });
			};
		})(f);
		freader.readAsArrayBuffer(f);
	}

	let files = (evt.target! as any).files as Array<any>;
	
	readFile(1);
}

if (Browser.QueryString.level) {
	let html: any;
	jQuery.ajax({
		type: "GET",
		url: '/resources/template/help.html',
		dataType: "html",
		cache: false,
		async: false
	}).done(function(data) { html = data; });

	jQuery(html).appendTo(document.body);

	const progressbar = new ProgressBar(document.getElementById('container') as Element);
          
    MasterLoader.loadLevel('/resources/level/' + Browser.QueryString.level, progressbar, (level: RawLevel, scene: IScene) => {
        const play = new Play(document.getElementById('container' ) as Element);
        (window as any).play = play;
		if (Browser.QueryString.autostart == '1') {
			progressbar.hide();
			play.start(level, scene);
		} else {
            progressbar.showStart(() => { progressbar.hide(); play.start(level, scene); });
		}
	});
} else {
    jQuery('body').prepend('<input type="file" id="files" multiple="multiple" _style="display: none" />');

    document.getElementById("files")!.style.display = "block";
    document.getElementById("files")!.addEventListener("change", handleFileSelect, false);
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
