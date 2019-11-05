import jQuery from "jquery";

import { CutScene } from "./CutScene";
import IGameData from "../Player/IGameData";
/*
*
** Heavily based on http://www.inwebson.com/html5/custom-html5-video-controls-with-jquery/ by Kenny
*
*/
export default class CutSceneControl {

    protected _gameData: IGameData;
    protected _cutscene: CutScene;
    protected _volumeDrag: boolean;
    protected _timeDrag: boolean;
    protected _paused: boolean;
    protected _pausedSave: boolean;
    protected _ended: boolean;

    constructor(cutscene: CutScene, gameData: IGameData) {
        this._gameData = gameData;
        this._cutscene = cutscene;
        this._volumeDrag = false;
        this._timeDrag = false;
        this._paused = false;
        this._pausedSave = false;
        this._ended = false;
    }

    public init() {
        return fetch('/resources/template/cccontrol.html').then((response) => {
            return response.text().then((html) => {
                jQuery(document.body).append(html);
            });
        });
    }

    public bindEvents(): void {
        // Handle showing/clicking on big button to start replay
        jQuery(document.body)
            .append('<div id="init"></div>')
            .on('click', ((obj) => () => {
                jQuery('#init').remove();
                jQuery('.btnPlay').addClass('paused');
                obj.off('click');
                obj.on('click', ((ctrl: CutSceneControl) => {
                    return function(e: any) {
                        if (e.which == 1) {
                            ctrl.playPause();
                        }
                        return false;
                    };
                })(this));
                this._gameData.play.play();
            })(jQuery(document.body)));

        jQuery('#init').fadeIn(200);

        // Visibility of the control bar
        jQuery('.control')
            .hover(() => {
                jQuery('.control').stop().animate({ 'bottom': 0 }, 500);
                jQuery('.caption').stop().animate({ 'top': 0 }, 500);
            }, () => {
                if (!this._volumeDrag && !this._timeDrag) {
                    jQuery('.control').stop().animate({ 'bottom': -45 }, 500);
                    jQuery('.caption').stop().animate({ 'top': -45 }, 500);
                }
            }).on('click', function(e) { e.stopPropagation(); return false; });

        // Set video properties
        jQuery('.current').text(this.timeFormat(0));
        jQuery('.duration').text(this.timeFormat(this._cutscene.duration));

        this.updateVolume(0, 0.7);

        // Play button clicked
        jQuery('.btnPlay').on('click', this.playPause.bind(this));

        // Stop button clicked
        jQuery('.btnStop').on('click', () => {
            jQuery('.btnPlay').removeClass('paused');
            this.updatebar((jQuery('.progress') as any).offset().left);
            if (!this._paused || this._ended) {
                this.playPause();
            }
            this._cutscene.reset();
            return false;
        });

        // Fullscreen button clicked
        jQuery('.btnFS').on('click', function() {
            if (document.fullscreenElement != null) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            } else if (document.body.requestFullscreen) {
                document.body.requestFullscreen();
            }
            return false;
        });

        // When video timebar is clicked
        jQuery('.progress').on('mousedown', (function(ctrl: CutSceneControl) {
            return function(e: any) {
                ctrl._timeDrag = true;
                ctrl._cutscene.stopSound();
                ctrl._pausedSave = ctrl._paused;
                if (!ctrl._paused) {
                    ctrl._gameData.update = false;
                    ctrl._paused = true;
                }
                ctrl.updatebar(e.pageX);
                return false;
            };
        })(this));

        jQuery(document).on('mouseup', (function(ctrl: CutSceneControl) {
            return function(e: any) {
                if (ctrl._timeDrag) {
                    ctrl._timeDrag = false;
                    ctrl.updatebar(e.pageX);
                    if (ctrl._ended) {
                        ctrl._ended = false;
                    }
                    ctrl._paused = ctrl._pausedSave;
                    if (!ctrl._paused) {
                        ctrl._cutscene.startSound();
                        ctrl._gameData.update = true;
                    }
                }
            };
        })(this));

        jQuery(document).on('mousemove', (function(ctrl: CutSceneControl) {
            return function(e: any) {
                if (ctrl._timeDrag) {
                    ctrl.updatebar(e.pageX);
                }
            };
        })(this));

        // Sound button clicked
        jQuery('.sound').click(((obj) => () => {
            this._cutscene.muted = !this._cutscene.muted;
            obj.toggleClass('muted');
            if (this._cutscene.muted) {
                jQuery('.volumeBar').css('width', 0);
            } else {
                jQuery('.volumeBar').css('width', (this._cutscene.volume * 100) + '%');
            }
            return false;
        })(jQuery('.sound')));

        // Volume bar event
        jQuery('.volume').on('mousedown', (function(ctrl: CutSceneControl) {
            return function(e: any) {
                ctrl._volumeDrag = true;
                ctrl._cutscene.muted = false;
                jQuery('.sound').removeClass('muted');
                ctrl.updateVolume(e.pageX, 0);
                e.stopPropagation();
                return false;
            };
        })(this)).on('click', function(e) { return false; });

        jQuery(document).on('mouseup', (function(ctrl: CutSceneControl) {
            return function(e: any) {
                if (ctrl._volumeDrag) {
                    ctrl._volumeDrag = false;
                    ctrl.updateVolume(e.pageX, 0);
                }
        };
        })(this));

        jQuery(document).on('mousemove', (function(ctrl: CutSceneControl) {
            return function(e: any) {
                if (ctrl._volumeDrag) {
                    ctrl.updateVolume(e.pageX, 0);
                }
            };
        })(this));

        jQuery('.control').css('display', 'block');
    }

    public updateTime(currentTime: number): void {
        const maxduration = this._cutscene.duration,
              perc = 100 * currentTime / maxduration;

        jQuery('.timeBar').css('width', perc + '%');
        jQuery('.current').text(this.timeFormat(currentTime));
    }

    public finished(): void {
        this.updateTime(this._cutscene.duration);
        jQuery('.btnPlay').removeClass('paused');
        this._ended = this._paused = true;
    }

    protected playPause() {
        if (this._paused || this._ended) {
            if (this._ended) {
                this.updatebar((jQuery('.progress') as any).offset().left);
                this._cutscene.reset();
                this._ended = false;
            }
            jQuery('.btnPlay').addClass('paused');
            this._gameData.update = true;
            this._paused = false;
            this._cutscene.startSound();
        } else {
            jQuery('.btnPlay').removeClass('paused');
            this._gameData.update = false;
            this._paused = true;
            this._cutscene.stopSound();
        }

        return false;
    }

    protected updatebar(x: number): void {
        const progress: any = jQuery('.progress');

        // calculate drag position
        // and update video currenttime
        // as well as progress bar

        const maxduration = this._cutscene.duration;
        const position = x - progress.offset().left;

        let percentage = 100 * position / progress.width();

        if (percentage > 100) {
            percentage = 100;
        }

        if (percentage < 0) {
            percentage = 0;
        }

        const newTime = maxduration * percentage / 100;

        this._cutscene.currentTime = newTime;
    }

    protected updateVolume(x: number, vol: number): void {
        const volume: any = jQuery('.volume');

        let percentage: number;

        // if volume have been specified then direct update volume
        if (vol) {
            percentage = vol * 100;
        }
        else {
            const position = x - volume.offset().left;
            percentage = 100 * position / volume.width();
        }

        if (percentage > 100) {
            percentage = 100;
        }

        if (percentage < 0) {
            percentage = 0;
        }

        // update volume bar and video volume
        jQuery('.volumeBar').css('width', percentage + '%');

        this._cutscene.volume = percentage / 100;

        // change sound icon based on volume
        if (percentage == 0) {
            jQuery('.sound').removeClass('sound2').addClass('muted');
        } else if (percentage > 50) {
            jQuery('.sound').removeClass('muted').addClass('sound2');
        } else {
            jQuery('.sound').removeClass('muted').removeClass('sound2');
        }
    }

    // Time format converter - 00:00
    protected timeFormat(seconds: number): string {
        const min = Math.floor(seconds / 60),
              m = min < 10 ? "0" + min : "" + min,
              s = Math.floor(seconds - min * 60) < 10 ? "0" + Math.floor(seconds - min * 60) : "" + Math.floor(seconds - min * 60);

        return m + ":" + s;
    }

}
