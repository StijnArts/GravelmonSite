import { DynamoNode } from '../../dynamoNodes';

export const AspectEntity = "Aspect";
export const HasAspectEdgeType = "HasAspect";

export enum AspectType {
    Flag,
    Choice
}

export function createFlagAspectNode(name: string, defaultValue: boolean = false, isPrimaryAspect: boolean = true): AspectNode {
    return new FlagAspectNode(name, defaultValue, isPrimaryAspect);
}

export function createChoiceAspectNode(name: string, choices: string[], defaultValue: string | "random" = "random", isPrimaryAspect: boolean = false): AspectNode {
    return new ChoiceAspectNode(name, choices, defaultValue, isPrimaryAspect);
}

abstract class AspectNode extends DynamoNode {
    aspectType: AspectType;
    isAspect: boolean = true;
    default: boolean | "random" | string;
    isPrimaryAspect: boolean; //Indicates that this aspect governs the form of the pokemon (e.g. Galarian vs Hisuian)
    //non primary aspects include female form, gigantamax form, mega form etc.
    constructor(name: string, aspectType: AspectType, defaultValue: boolean | "random" | string, isPrimaryAspect: boolean) {
        super(AspectEntity, name);
        this.aspectType = aspectType;
        this.default = defaultValue;
        this.isPrimaryAspect = isPrimaryAspect;
    }
}

class FlagAspectNode extends AspectNode {
    constructor(name: string, defaultValue: boolean = false, isPrimaryAspect: boolean = true) {
        super(name, AspectType.Flag, defaultValue, isPrimaryAspect);
    }
}

class ChoiceAspectNode extends AspectNode {
    choices: string[];
    constructor(name: string, choices: string[], defaultValue: string | "random" = "random", isPrimaryAspect: boolean = false) {
        super(name, AspectType.Choice, defaultValue, isPrimaryAspect);
        this.choices = choices;
    }
}