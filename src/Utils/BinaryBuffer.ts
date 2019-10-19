export default class BinaryBuffer {

    protected urlList: Array<string>;
    protected bufferList: Array<any>;
    protected loadCount: number;

    constructor(urlList: Array<string>) {
        this.urlList = urlList;
        this.bufferList = new Array();
        this.loadCount = 0;
    }

    protected _loadBuffer(url: string, index: number, resolve: any): void {
        const request = new XMLHttpRequest();

        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onerror = () => {
            console.log('BinaryBuffer: XHR error', request.status, request.statusText);
            if (++this.loadCount == this.urlList.length) {
                resolve(this.bufferList);
            }
        }

        request.onreadystatechange = () => {
            if (request.readyState != 4) return;

            if (request.status != 200) {
    	   		console.log('Could not read a binary file. ', request.status, request.statusText);
                if (++this.loadCount == this.urlList.length) {
                    resolve(this.bufferList);
                }
            } else {
                this.bufferList[index] = request.response;
                if (++this.loadCount == this.urlList.length) {
                    resolve(this.bufferList);
                }
            }
        }

    	request.send();
    }

    public load(): Promise<Array<any>> {
        return new Promise(( resolve, reject ) => {
            for (let i = 0; i < this.urlList.length; ++i) {
                this._loadBuffer(this.urlList[i], i, resolve);
            }
        });
    }
}
