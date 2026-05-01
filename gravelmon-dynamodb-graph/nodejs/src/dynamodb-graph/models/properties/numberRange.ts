export class NumberRange {
    min: number;
    max: number;

    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    static fromFlat(flatRange: number) {
        return new NumberRange(flatRange, flatRange);
    }

    serialize(): any {
        return {
            min: this.min,
            max: this.max
        }
    }

    static deserialize(data: any): NumberRange {
        if (typeof data === "object" && "min" in data && "max" in data) {
            return new NumberRange(data.min, data.max);
        } else {
            throw new Error(`Invalid NumberRange format: ${JSON.stringify(data)}`);
        }
    }
}