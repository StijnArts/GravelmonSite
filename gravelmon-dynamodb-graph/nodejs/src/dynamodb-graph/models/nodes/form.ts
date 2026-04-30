import {DynamoEdge, getNodePK, getPkName} from '../dynamo';
import { GenderDifferenceNode as GenderDifference } from './assets/genderDifference';
import {
    HasAbilityEdgeType,
    PerformsBehaviourEdgeType,
    PokemonData,
    PokemonEntity,
    PokemonIdentifier,
    PokemonNode,
    PokemonTypeRelationship
} from './pokemon';
import { AspectEntity, HasAspectEdgeType } from './properties/aspect';
import {HasLabelEdgeType, LabelEntity} from "./label";
import {BehaviourEntity} from "./behaviour/behaviour";
import {TypeEntity} from "./battle/type";
import {MoveSetEntity, MoveSetOfEdgeType, RebalancedMoveSetOfEdgeType} from "./battle/move/moveset";
import {AbilityEntity} from "./battle/ability";
import {NumberRange} from "./properties/numberRange";
import {ItemEntity} from "./minecraft/item";
import {ResourceLocation} from "./minecraft/resourceLocation";

export const FormEntity = "Form";

export const IsFormOfEdgeType = "IsFormOf";
export const DropsItemEdgeType = "DropsItem";

export function createFormNode(pokemonData: PokemonData, genderDifference?: GenderDifference, lightingData?: LightingData): FormNode {
    return new FormNode(pokemonData, genderDifference, lightingData);
}

export function createFormPrimaryTypeEdge(formName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false): FormTypeEdge {
    return new PrimaryTypeEdge(formName.toString(), typeName, isRebalanced);
}

export function createFormSecondaryTypeEdge(formName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false): FormTypeEdge {
    return new SecondaryTypeEdge(formName.toString(), typeName, isRebalanced);
}

export function createFormHasAspectEdge(formName: PokemonIdentifier, aspectName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, formName.toString()), HasAspectEdgeType, AspectEntity, aspectName);
}

export function createFormHasLabelEdge(formName: PokemonIdentifier, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, formName.toString()), HasLabelEdgeType, LabelEntity, labelName);
}

export function createFormPerformsBehaviourEdge(formName: PokemonIdentifier, behaviourName: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, formName.toString()), PerformsBehaviourEdgeType, BehaviourEntity, behaviourName.toString());
}

export function createFormMoveSetOfEdge(formName: PokemonIdentifier, moveSetName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, formName.toString()), MoveSetOfEdgeType, MoveSetEntity, moveSetName);
}

export function createFormRebalancedMoveSetOfEdge(formName: PokemonIdentifier, moveSetName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, formName.toString()), RebalancedMoveSetOfEdgeType, MoveSetEntity, moveSetName);
}

export function createFormIsFormOfPokemonEdge(formName: PokemonIdentifier, pokemonName: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, formName.toString()), IsFormOfEdgeType, PokemonEntity, pokemonName.toString());
}

export function createFormHasAbilityEdge(
    formName: PokemonIdentifier, abilityName: string,
    isHidden: boolean = false, isPlaceholder: boolean = false, isRebalanced: boolean = false
): DynamoEdge {
    return new FormHasAbilityEdge(formName.toString(), abilityName, isHidden, isPlaceholder, isRebalanced);
}

export function createFormDropsItemEdge(formName: PokemonIdentifier, itemName: ResourceLocation, dropChance: number, quantityRange: NumberRange): FormDropsItemEdge {
    return new FormDropsItemEdge(formName.toString(), itemName.toString(), dropChance, quantityRange);
}

export interface LightingData {
    lightLevel: number;
    liquidGlowMode: undefined | "LAND"
}

export class FormNode extends PokemonNode {
    genderDifference?: GenderDifference;
    lightingData?: LightingData;
    constructor(
        pokemonData: PokemonData,
        genderDifference?: GenderDifference,
        lightingData?: LightingData
    ) 
    {
        super(pokemonData);
        this.PK = getNodePK(FormEntity, this.name);
        this.entityType = FormEntity;
        this.genderDifference = genderDifference;
        this.lightingData = lightingData;
    }
}

abstract class FormTypeEdge extends DynamoEdge {
    constructor(formName: string, typeName: string, relationship: PokemonTypeRelationship, isReverseEdge: boolean = false) {
        super(
            getNodePK(isReverseEdge? TypeEntity : FormEntity, formName.toString()),
            relationship,
            isReverseEdge? FormEntity : TypeEntity,
            typeName, isReverseEdge);
    }

    reverseEdge(): FormTypeEdge {
        const formName = getPkName(this.PK);
        const typeName = getPkName(this.Target);
        switch (this.entityType) {
            case PokemonTypeRelationship.PrimaryType:
                return new PrimaryTypeEdge(formName, typeName, !this.isReverseEdge());
            case PokemonTypeRelationship.SecondaryType:
                return new SecondaryTypeEdge(formName, typeName, !this.isReverseEdge());
            default:
                throw new Error(`Unknown Form-Type relationship: ${this.entityType}`);
        }
    }
}

class FormDropsItemEdge extends DynamoEdge {
    dropChance: number;
    quantityRange: NumberRange;

    constructor(formName: string, abilityName: string, dropChance: number, quantityRange: NumberRange, isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge? ItemEntity : FormEntity, formName.toString()),
            DropsItemEdgeType, isReverseEdge? FormEntity : ItemEntity,
            abilityName, isReverseEdge);
        this.dropChance = dropChance;
        this.quantityRange = quantityRange;
    }

    reverseEdge(): FormDropsItemEdge {
        return new FormDropsItemEdge(getPkName(this.Target), getPkName(this.PK), this.dropChance, this.quantityRange, !this.isReverseEdge());
    }
}

class PrimaryTypeEdge extends FormTypeEdge {
    constructor(pokemonName: string, typeName: string, isReverseEdge: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.PrimaryType, isReverseEdge);
    }
}

class SecondaryTypeEdge extends FormTypeEdge {
    constructor(pokemonName: string, typeName: string, isReverseEdge: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.SecondaryType, isReverseEdge);
    }
}

class FormHasAbilityEdge extends DynamoEdge {
    isHidden: boolean;
    isPlaceholder: boolean;

    constructor(formName: string, abilityName: string, isHidden: boolean = false, isPlaceholder: boolean = false, isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge? AbilityEntity : FormEntity, formName.toString()),
            HasAbilityEdgeType, isReverseEdge? FormEntity : AbilityEntity,
            abilityName, isReverseEdge);
        this.isHidden = isHidden;
        this.isPlaceholder = isPlaceholder;
    }

    reverseEdge(): FormHasAbilityEdge {
        return new FormHasAbilityEdge(getPkName(this.Target), getPkName(this.PK), this.isHidden, this.isPlaceholder, !this.isReverseEdge());
    }
}