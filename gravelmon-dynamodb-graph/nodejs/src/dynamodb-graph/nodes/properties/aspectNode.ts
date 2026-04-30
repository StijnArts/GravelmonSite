import { DynamoNode } from '../../service/dynamoNodes';

export const AspectEntity = "Aspect";
export const HasAspectEdgeType = "HasAspect";

export enum AspectType {
    Flag,
    Choice
}

export function createFlagAspectNode(name: string, defaultValue: boolean = false, isPrimaryAspect: boolean = true, introducedByGame: string): AspectNode {
    return new FlagAspectNode(name, defaultValue, isPrimaryAspect, introducedByGame);
}

export function createChoiceAspectNode(name: string, choices: string[], defaultValue: string | "random" = "random", isPrimaryAspect: boolean = false, introducedByGame: string): AspectNode {
    return new ChoiceAspectNode(name, choices, defaultValue, isPrimaryAspect, introducedByGame);
}

abstract class AspectNode extends DynamoNode {
    aspectType: AspectType;
    isAspect: boolean = true;
    default: boolean | "random" | string;
    /** Indicates that this aspect governs the form of the pokemon (e.g. Galarian vs Hisuian)
    non primary aspects include female form, gigantamax form, mega form etc. It is possible for a pokemon to have multiple primary aspects*/
    isPrimaryAspect: boolean;
    introducedByGame: string;
    
    constructor(name: string, aspectType: AspectType, defaultValue: boolean | "random" | string, isPrimaryAspect: boolean, introducedByGame: string) {
        super(AspectEntity, name);
        this.aspectType = aspectType;
        this.default = defaultValue;
        this.isPrimaryAspect = isPrimaryAspect;
        this.introducedByGame = introducedByGame;
    }
}

class FlagAspectNode extends AspectNode {
    constructor(name: string, defaultValue: boolean = false, isPrimaryAspect: boolean = true, introducedByGame: string) {
        super(name, AspectType.Flag, defaultValue, isPrimaryAspect, introducedByGame);
    }
}

class ChoiceAspectNode extends AspectNode {
    choices: string[];
    constructor(name: string, choices: string[], defaultValue: string | "random" = "random", isPrimaryAspect: boolean = false, introducedByGame: string) {
        super(name, AspectType.Choice, defaultValue, isPrimaryAspect, introducedByGame);
        this.choices = choices;
    }
}