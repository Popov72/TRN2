import Browser from "./Browser";
import BinaryBuffer from "./BinaryBuffer";

export default class Utils {

    public static toHexString32(n: number) {
        if (n < 0) {
            n = 0xFFFFFFFF + n + 1;
        }

        return "0x" + ("00000000" + n.toString(16).toUpperCase()).substr(-8);
    }

    public static toHexString16(n: number) {
        if (n < 0) {
            n = 0xFFFF + n + 1;
        }

        return "0x" + ("0000" + n.toString(16).toUpperCase()).substr(-4);
    }

    public static toHexString8(n: number) {
        if (n < 0) {
            n = 0xFF + n + 1;
        }

        return "0x" + ("00" + n.toString(16).toUpperCase()).substr(-2);
    }

    public static flattenArray(a: Array<any> | null) {
        if (!a) { return; }
        let res = [];
        for (let i = 0; i < a.length; ++i) {
            res.push(a[i]);
        }
        return res;
    }

    public static flatten(obj: any, fpath: string) {

        function flatten_sub(o: any, parts: Array<string>, p: number) {
            if (!o) { return; }
            for (; p < parts.length - 1; ++p) {
                o = o[parts[p]];
                if (Array.isArray(o)) {
                    for (let i = 0; i < o.length; ++i) {
                        flatten_sub(o[i], parts, p + 1);
                    }
                    return;
                }
            }
            if (!o) { return; }
            if (Array.isArray(o[parts[p]])) {
                for (let i = 0; i < o[parts[p]].length; ++i) {
                    o[parts[p]][i] = Utils.flattenArray(o[parts[p]][i]);
                }
            } else {
                o[parts[p]] = Utils.flattenArray(o[parts[p]]);
            }
        }

        flatten_sub(obj, fpath.split('.'), 0);
    }

    public static objSize(o: object) {
        return Object.keys(o).length;
    }

    public static async saveData(filename: string, data: any): Promise<void> {
        const blob = await (await fetch(data)).blob();
        const url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = filename + '.png';
        a.click();
        setTimeout(function() { URL.revokeObjectURL(url); }, 4E4); // 40s
    }

    public static convertToPng(imgData: ImageData) {
        let canvas = document.createElement("canvas");

        canvas.width = imgData.width;
        canvas.height = imgData.height;

        const context: any = canvas.getContext('2d');

        context.putImageData(imgData, 0, 0);

        return canvas.toDataURL('image/png');
    }

    public static domNodeToJSon(node: Node): any {
        let children: any = {};

        const attrs = (node as any).attributes;
        if (attrs && attrs.length > 0) {
            const attr: any = {};
            children.__attributes = attr;
            for (let i = 0; i < attrs.length; i++) {
                const at = attrs[i];
                attr[at.nodeName] = at.nodeValue;
            }
        }

        const childNodes = node.childNodes;
        if (childNodes) {
            let textVal = '', hasRealChild = false;
            for (let i = 0; i < childNodes.length; i++) {
                const child = childNodes[i],
                      cname = child.nodeName;
                switch (child.nodeType) {
                    case 1:
                        hasRealChild = true;
                        if (children[cname]) {
                            if (!Array.isArray(children[cname])) {
                                children[cname] = [children[cname]];
                            }
                            children[cname].push(Utils.domNodeToJSon(child));
                        } else {
                            children[cname] = Utils.domNodeToJSon(child);
                        }
                        break;
                    case 3:
                        if (child.nodeValue) {
                            textVal += child.nodeValue;
                        }
                        break;
                }
            }
            textVal = textVal.replace(/[ \r\n\t]/g, '').replace(' ', '');
            if (textVal !== '') {
                if (children.__attributes == undefined && !hasRealChild) {
                    children = textVal;
                } else {
                    children.__value = textVal;
                }
            } else if (children.__attributes == undefined && !hasRealChild) {
                children = null;
            }
        }

        return children;
    }

    public static startSound(sound: any): void {
        if (sound == null) { return; }

        sound.start ? sound.start(0) : sound.noteOn ? sound.noteOn(0) : '';
    }

    public static async loadSoundAsync(filepath: string) {
        if (!filepath || !Browser.AudioContext) {
            return Promise.resolve(null);
        }

        const binaryBuffer = new BinaryBuffer([filepath]),
              pbinBuff = binaryBuffer.load();

        return pbinBuff.then((bufferList) => {
            if (bufferList != null && bufferList.length > 0) {
                return (new Promise((resolve, reject) =>
                    Browser.AudioContext.decodeAudioData(
                        bufferList[0],
                        (buffer: any) => {
                            const ret: any = {
                                code: 0
                            };
                            if (!buffer) {
                                ret.code = -1;
                            } else {
                                ret.sound = Browser.AudioContext.createBufferSource();
                                ret.sound.buffer = buffer;
                            }
                            resolve(ret);
                        }
                    )
                ));
            } else {
                console.log('Error when loading sound async. path=', filepath);
                return Promise.resolve(null);
            }
        });
    }

    public static lerp(a: number, b: number, t: number): number {
        if (t <= 0.0) { return a; }
        if (t >= 1.0) { return b; }

        return a + (b - a) * t;
    }

}
