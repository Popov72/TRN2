import jQuery from "jquery";

export class ConfigManager {

    protected _root:        any;
    protected _levelname:   string;
    protected _trversion:   string;

    constructor(xmlConf: XMLDocument) {
        this._root = jQuery(xmlConf);
        this._levelname = "";
        this._trversion = "";
    }

    get trversion(): string {
        return this._trversion;
    }

    set trversion(tv: string) {
        this._trversion = tv;
    }

    get levelName(): string {
        return this._levelname;
    }

    set levelName(levelname: string) {
        this._levelname = levelname;
    }

    globalParam(path: string, getnode: boolean = false): string | any {
        const node: any = this._root.find('game[id="' + this.trversion + '"] > global ' + path);
        return getnode ? node : (node.length > 0 ? node.text() : null);
    }

    globalColor(path: string): any {
        const r = this.globalParam(path + ' > r');
        const g = this.globalParam(path + ' > g');
        const b = this.globalParam(path + ' > b');

        return r != null && g != null && b != null ? { r: r / 255, g: g / 255, b: b / 255 } : null;
    }

    param(path: string, checkinglobal: boolean = false, getnode: boolean = false): string | any {
        let node: any = this._levelname ? this._root.find('game[id="' + this.trversion + '"] > levels > level[id="' + this._levelname + '"] ' + path) : null;
        if ((!node || node.length == 0) && checkinglobal) {
            node = this._root.find('game[id="' + this.trversion + '"] > global ' + path);
        }
        return getnode ? node : (node.length > 0 ? node.text() : null);
    }

    color(path: string, checkinglobal: boolean = false): any {
        const r = this.param(path + ' > r', checkinglobal);
        const g = this.param(path + ' > g', checkinglobal);
        const b = this.param(path + ' > b', checkinglobal);

        return r != null && g != null && b != null ? { r: r / 255, g: g / 255, b: b / 255 } : null;
    }

    vector3(path: string, checkinglobal: boolean = false): any {
        const x = this.param(path + ' > x', checkinglobal);
        const y = this.param(path + ' > y', checkinglobal);
        const z = this.param(path + ' > z', checkinglobal);

        return x != null && y != null && z != null ? { x: parseFloat(x), y: parseFloat(y), z: parseFloat(z) } : null;
    }

    float(path: string, checkinglobal: boolean = false, defvalue: number = -Infinity): number {
        const v = this.param(path, checkinglobal);

        return v != null ? parseFloat(v) : defvalue;
    }

    number(path: string, checkinglobal: boolean = false, defvalue: number = -Infinity): number {
        const v = this.param(path, checkinglobal);

        return v != null ? parseInt(v) : defvalue;
    }

    boolean(path: string, checkinglobal: boolean = false, defvalue: boolean = false): boolean {
        const v = this.param(path, checkinglobal);

        return v != null ? v == 'true' : defvalue;
    }
}
