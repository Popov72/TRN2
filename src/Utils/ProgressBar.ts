export class ProgressBar {

    protected elem: JQuery<any>;

    constructor(domElement: Element) {
        let html: any;

        jQuery.ajax({
            type: "GET",
            url: '/resources/template/progressbar.html',
            dataType: "html",
            cache: false,
            async: false
        }).done(function(data) { html = data; });

        this.elem = jQuery(html);

        this.elem.appendTo(domElement);
    }

    public show(): void {
        this.elem.css('display', 'block');
    }

    public hide(): void {
        this.elem.css('display', 'none');
    }

    public setMessage(message: string): void {
        this.elem.find('.message').html(message);
    }

    public showStart(callback: any): void {
        this.elem.find('.message').css('display', 'none');
        this.elem.find('.progressbar').css('display', 'none');

        this.elem.find('.start').css('display', 'block');
        this.elem.find('.start').attr('class', 'start enabled');

        this.elem.find('.start').on('click', callback);
    }

}
