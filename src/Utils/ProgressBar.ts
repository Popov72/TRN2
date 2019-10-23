export class ProgressBar {

    protected _elem:        JQuery<any>;
    protected _show:        boolean;
    protected _showStart:   boolean;
    protected _callback:    any;

    constructor(domElement: Element) {
        this._elem = jQuery('');
        this._show = false;
        this._showStart = false;

        fetch('/resources/template/progressbar.html').then((response) => {
            response.text().then((html) => {
                this._elem = jQuery(html);
                this._elem.appendTo(domElement);
                this._setState();
            });
        });
    }

    public show(): void {
        this._show = true;
        this._elem.css('display', 'block');
    }

    public hide(): void {
        this._show = false;
        this._elem.css('display', 'none');
    }

    public showStart(callback: any): void {
        this._showStart = true;
        this._callback = callback;

        this._elem.find('.message').css('display', 'none');
        this._elem.find('.progressbar').css('display', 'none');

        this._elem.find('.start').css('display', 'block');
        this._elem.find('.start').attr('class', 'start enabled');

        this._elem.find('.start').on('click', callback);
    }

    protected _setState(): void {
        this._elem.css('display', this._show ? 'block' : 'none');
        if (this._showStart) {
            this.showStart(this._callback);
        }
    }

}
