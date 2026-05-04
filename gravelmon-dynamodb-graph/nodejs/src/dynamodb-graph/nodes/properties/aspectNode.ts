import { deserializerRegistry } from '../../service/deserializerRegistry';
import { DynamoNode } from '../../service/dynamoNodes';
import {Time} from "../../models/properties/time";

export const AspectEntity = "Aspect";
export const HasAspectEdgeType = "HasAspect";

export enum AspectType {
    Flag,
    Choice
}

export function createFlagAspectNode(name: string, defaultValue: boolean = false, isPrimaryAspect: boolean = true, introducedByGame: string, lastEdited: number = Date.now()): AspectNode {
    return new FlagAspectNode(name, defaultValue, isPrimaryAspect, introducedByGame, lastEdited);
}

export function createChoiceAspectNode(name: string, choices: string[], defaultValue: string | "random" = "random", isPrimaryAspect: boolean = false, introducedByGame: string, lastEdited: number = Date.now()): AspectNode {
    return new ChoiceAspectNode(name, choices, defaultValue, isPrimaryAspect, introducedByGame, lastEdited);
}

abstract class AspectNode extends DynamoNode {
    aspectType: AspectType;
    isAspect: boolean = true;
    defaultOption?: boolean | "random" | string;
    /** Indicates that this aspect governs the form of the pokemon (e.g. Galarian vs Hisuian)
    non primary aspects include female form, gigantamax form, mega form etc. It is possible for a pokemon to have multiple primary aspects*/
    isPrimaryAspect: boolean;
    introducedByGame: string;
    static version = 1;
    
    protected constructor(name: string, aspectType: AspectType, defaultValue: boolean | "random" | string, isPrimaryAspect: boolean, introducedByGame: string, lastEdited: number = Date.now()) {
        super(AspectEntity+aspectType, name, AspectNode.version, lastEdited);
        this.aspectType = aspectType;
        this.defaultOption = defaultValue;
        this.isPrimaryAspect = isPrimaryAspect;
        this.introducedByGame = introducedByGame;
    }

    static deserialize(data: Record<string, any>): AspectNode {
        if (
            data.aspectType === undefined ||
            data.defaultOption === undefined ||
            data.isPrimaryAspect === undefined ||
            data.introducedByGame === undefined
        ) {
            throw new Error("Invalid data for deserializing AspectNode: missing required properties");
        }
        const aspectType: AspectType = data.aspectType;
        const defaultOption: boolean | "random" | string = data.defaultOption;
        const isPrimaryAspect: boolean = data.isPrimaryAspect;
        const introducedByGame: string = data.introducedByGame;
        const name: string = data.name;
        if(aspectType === AspectType.Flag) {
            return new FlagAspectNode(name, defaultOption as boolean, isPrimaryAspect, introducedByGame, data.lastEdited);
        } else if(aspectType === AspectType.Choice) {
            if(!data.choices) {
                throw new Error("Invalid data for deserializing ChoiceAspectNode: missing choices property");
            }
            const choices: string[] = data.choices;
            return new ChoiceAspectNode(name, choices, defaultOption as string, isPrimaryAspect, introducedByGame, data.lastEdited);
        } else {
            throw new Error("Invalid aspect type for deserializing AspectNode");
        }
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            aspectType: this.aspectType,
            isAspect: this.isAspect,
            defaultOption: this.defaultOption,
            isPrimaryAspect: this.isPrimaryAspect,
            introducedByGame: this.introducedByGame
        }
    }
}

export class FlagAspectNode extends AspectNode {
    constructor(name: string, defaultValue: boolean = false, isPrimaryAspect: boolean = true, introducedByGame: string, lastEdited: number = Date.now()) {
        super(name, AspectType.Flag, defaultValue, isPrimaryAspect, introducedByGame, lastEdited);
    }
}

export class ChoiceAspectNode extends AspectNode {
    choices: string[];
    constructor(name: string, choices: string[], defaultValue: string | "random" = "random", isPrimaryAspect: boolean = false, introducedByGame: string, lastEdited: number = Date.now()) {
        super(name, AspectType.Choice, defaultValue, isPrimaryAspect, introducedByGame, lastEdited);
        this.choices = choices;
    }

    static deserialize(data: Record<string, any>): ChoiceAspectNode {
        if(!data.choices) {
            throw new Error("Invalid data for deserializing ChoiceAspectNode: missing choices property");
        }
        const choices: string[] = data.choices;
        return new ChoiceAspectNode(data.name, choices, data.defaultOption, data.isPrimaryAspect, data.introducedByGame, data.lastEdited);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            choices: this.choices
        }
    }
}

deserializerRegistry.register(AspectEntity + AspectType.Flag, AspectNode.deserialize);
deserializerRegistry.register(AspectEntity + AspectType.Choice, AspectNode.deserialize);