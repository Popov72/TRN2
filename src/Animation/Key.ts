interface KeyData {
    "position": any,
    "quaternion": any,
}

export default class Key {

    public data: Array<KeyData>;

    constructor(public time: number, public boundingBox: any) {
        this.data = [];
    }

    public addData(pos: any, rot: any): void {
        this.data.push({
            "position": 	pos,
            "quaternion":   rot,
        });
    }
}
