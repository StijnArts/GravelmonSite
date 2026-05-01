import {DynamoEdge, getNodePK} from '../../service/dynamoNodes';
import { GenderDifferenceNode as GenderDifference } from '../../models/assets/genderDifference';
import {
    HasAbilityEdgeType,
    PokemonData,
    PokemonIdentifier,
    PokemonNode,
    PokemonTypeRelationship
} from './pokemonNode';
import { AspectEntity, HasAspectEdgeType } from '../properties/aspectNode';
import {HasLabelEdgeType, LabelEntity} from "../properties/labelNode";
import {TypeEntity} from "../battle/typeNode";
import {AbilityEntity} from "../battle/abilityNode";
import {NumberRange} from "../../models/properties/numberRange";
import {ItemEntity} from "../minecraft/itemNode";
import {ResourceLocation} from "../../models/minecraft/resourceLocation";
import { EvolutionIdentifier } from './evolutionNode';
import { ResolverData } from '../../models/assets/resolverData';
import { PosingData } from '../../models/assets/posing/posingFileData';
import { SpawnDataNode as SpawnData } from '../../models/spawning/spawnData';

export const FormEntity = "Form";

export const IsFormOfEdgeType = "IsFormOf";
export const DropsItemEdgeType = "DropsItem";

export function createFormNode(pokemonData: PokemonData, formData: FormData): FormNode {
    return new FormNode(pokemonData, formData);
}

export function createFormPrimaryTypeEdge(formName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false): FormTypeEdge {
    return new PrimaryTypeEdge(formName, typeName, isRebalanced);
}

export function createFormSecondaryTypeEdge(formName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false): FormTypeEdge {
    return new SecondaryTypeEdge(formName, typeName, isRebalanced);
}

export function createFormHasAspectEdge(formName: PokemonIdentifier, aspectName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(AspectEntity, aspectName), HasAspectEdgeType, FormEntity, formName.toPK());
}

export function createFormHasLabelEdge(formName: PokemonIdentifier, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(LabelEntity, labelName), HasLabelEdgeType, FormEntity, formName.toPK());
}

export function createFormHasAbilityEdge(
            formName: PokemonIdentifier, abilityName: string,
            isHidden: boolean = false, isPlaceholder: boolean = false, isRebalanced: boolean = false
        ): DynamoEdge {
    return new FormHasAbilityEdge(formName, abilityName, isHidden, isPlaceholder, isRebalanced);
}

export function createFormDropsItemEdge(formName: PokemonIdentifier, itemName: ResourceLocation, dropChance: number, quantityRange: NumberRange): FormDropsItemEdge {
    return new FormDropsItemEdge(formName, itemName, dropChance, quantityRange);
}

export interface LightingData {
    lightLevel: number;
    liquidGlowMode: undefined | "LAND"
}

export interface FormData {
    genderDifference?: GenderDifference;
    lightingData?: LightingData;
    evolutions?: EvolutionIdentifier[];
    isFormOf: PokemonIdentifier;
    affectedByMechanics?: string[];
    resolverData?: ResolverData;
    posingData?: PosingData;
    aspects: string[];
    spawnData?: SpawnData[];
}

export class FormNode extends PokemonNode {
    formData: FormData;

    constructor(
        pokemonData: PokemonData,
        formData: FormData
    ) 
    {
        super(pokemonData);
        this.PK = getNodePK(FormEntity, this.name);
        this.entityType = FormEntity;
        this.formData = formData;
    }
}

abstract class FormTypeEdge extends DynamoEdge {
    isRebalanced: boolean;

    constructor(pokemonName: PokemonIdentifier, typeName: string, relationship: PokemonTypeRelationship, isRebalanced: boolean = false) {
        super(
            getNodePK(TypeEntity, typeName), 
        relationship,
        FormEntity, 
        pokemonName.toPK());
        this.isRebalanced = isRebalanced;
    }
}

class FormDropsItemEdge extends DynamoEdge {
    dropChance: number;
    quantityRange: NumberRange;

    constructor(formName: PokemonIdentifier, itemName: ResourceLocation, dropChance: number, quantityRange: NumberRange) {
        super(getNodePK(ItemEntity, itemName.toString()),
            DropsItemEdgeType, FormEntity,
            formName.toPK());
        this.dropChance = dropChance;
        this.quantityRange = quantityRange;
    }
}

class PrimaryTypeEdge extends FormTypeEdge {
    constructor(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.PrimaryType, isRebalanced);
    }
}

class SecondaryTypeEdge extends FormTypeEdge {
    constructor(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.SecondaryType, isRebalanced);
    }
}

class FormHasAbilityEdge extends DynamoEdge {
    isHidden: boolean;
    isPlaceholder: boolean;
    isRebalanced: boolean;
    
    constructor(pokemonName: PokemonIdentifier, abilityName: string, isHidden: boolean = false, isPlaceholder: boolean = false, isRebalanced: boolean = false) {
        super(getNodePK(AbilityEntity, abilityName), 
        HasAbilityEdgeType, FormEntity, 
        pokemonName.toPK());
        this.isHidden = isHidden;
        this.isPlaceholder = isPlaceholder;
        this.isRebalanced = isRebalanced;
    }
}