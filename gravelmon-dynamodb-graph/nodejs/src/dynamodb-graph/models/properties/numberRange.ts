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
}