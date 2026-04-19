export class GenderDifferenceNode {
    hasGenderedTexture: boolean;
    hasGenderedModel: boolean;
    hasGenderedAnimation: boolean;
    constructor(hasGenderedTexture: boolean = false, hasGenderedModel: boolean = false, hasGenderedAnimation: boolean = false) {
        this.hasGenderedTexture = hasGenderedTexture;
        this.hasGenderedModel = hasGenderedModel;
        this.hasGenderedAnimation = hasGenderedAnimation;
    }
}