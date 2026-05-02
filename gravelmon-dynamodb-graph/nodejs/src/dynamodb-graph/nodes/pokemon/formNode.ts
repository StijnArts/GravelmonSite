import {DynamoEdge, getNodePK, getPkName} from '../../service/dynamoNodes';
import { GenderDifferenceNode as GenderDifference } from '../../models/assets/genderDifference';
import {
    deserializePokemonData,
    HasAbilityEdgeType,
    PokemonData,
    PokemonIdentifier,
    PokemonNode,
    PokemonTypeRelationship
} from './pokemonNode';
import { AspectEntity, HasAspectEdgeType } from '../properties/aspectNode';
import {HasLabelEdgeType, LabelEntity} from "../properties/labelNode";
import {TypeEntity} from "../battle/typeNode";
import {AbilityEntity, AbilityIdentifier} from "../battle/abilityNode";
import {NumberRange} from "../../models/properties/numberRange";
import {ItemEntity} from "../minecraft/itemNode";
import {ResourceLocation} from "../../models/minecraft/resourceLocation";
import { EvolutionIdentifier } from './evolutionNode';
import {deserializeResolverData, ResolverData, serializeResolverData} from '../../models/assets/resolverData';
import {deserializePosingData, PosingData, serializePosingData} from '../../models/assets/posing/posingFileData';
import {deserializeSpawnData, serializeSpawnData, SpawnData as SpawnData} from '../../models/spawning/spawnData';
import { deserializerRegistry } from '../../service/deserializerRegistry';

export const FormEntity = "Form";

export const IsFormOfEdgeType = "IsFormOf";
export const DropsItemEdgeType = "DropsItem";

export function createFormNode(pokemonData: PokemonData, formData: FormData, lastEdited: number = Date.now()): FormNode {
    return new FormNode(pokemonData, formData, lastEdited);
}

export function createFormPrimaryTypeEdge(formName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false, lastEdited: number = Date.now()): FormTypeEdge {
    return new FormPrimaryTypeEdge(formName, typeName, isRebalanced, lastEdited);
}

export function createFormSecondaryTypeEdge(formName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false, lastEdited: number = Date.now()): FormTypeEdge {
    return new FormSecondaryTypeEdge(formName, typeName, isRebalanced, lastEdited);
}

export function createFormHasAspectEdge(formName: PokemonIdentifier, aspectName: string, lastEdited: number = Date.now()): DynamoEdge {
    return new DynamoEdge(getNodePK(AspectEntity, aspectName), HasAspectEdgeType, FormEntity, formName.toString(), lastEdited);
}

export function createFormHasLabelEdge(formName: PokemonIdentifier, labelName: string, lastEdited: number = Date.now()): DynamoEdge {
    return new DynamoEdge(getNodePK(LabelEntity, labelName), HasLabelEdgeType, FormEntity, formName.toString(), lastEdited);
}

export function createFormHasAbilityEdge(
            formName: PokemonIdentifier, abilityName: AbilityIdentifier,
            isHidden: boolean = false, isPlaceholder: boolean = false, isRebalanced: boolean = false, lastEdited: number = Date.now()
        ): DynamoEdge {
    return new FormHasAbilityEdge(formName, abilityName, isHidden, isPlaceholder, isRebalanced, lastEdited);
}

export function createFormDropsItemEdge(formName: PokemonIdentifier, itemName: ResourceLocation, dropChance: number, quantityRange: NumberRange, lastEdited: number = Date.now()): FormDropsItemEdge {
    return new FormDropsItemEdge(formName, itemName, dropChance, quantityRange, lastEdited);
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
    static version = 1;

    constructor(
        pokemonData: PokemonData,
        formData: FormData,
        lastEdited: number = Date.now(),
    ) 
    {
        super(pokemonData, lastEdited, FormNode.version);
        this.PK = getNodePK(FormEntity, this.name);
        this.entityType = FormEntity;
        this.formData = formData;
    }

    static deserialize(data: Record<string, any>): PokemonNode {
        const pokemonData = deserializePokemonData(data.pokemonData);
        const formData = deserializeFormData(data.formData);
        return new FormNode(pokemonData, formData, data.lastEdited);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            formData: serializeFormData(this.formData)
        }
    }
}

export function serializeFormData(formData: FormData): any {
    return {
        genderDifference: formData.genderDifference ? {
            hasGenderedTexture: formData.genderDifference.hasGenderedTexture,
            hasGenderedModel: formData.genderDifference.hasGenderedModel,
            hasGenderedAnimation: formData.genderDifference.hasGenderedAnimation
        } : undefined,
        lightingData: formData.lightingData ? {
            lightLevel: formData.lightingData.lightLevel,
            liquidGlowMode: formData.lightingData.liquidGlowMode
        } : undefined,
        evolutions: formData.evolutions?.map(evolution => evolution.serialize()),
        isFormOf: formData.isFormOf.serialize(),
        affectedByMechanics: formData.affectedByMechanics,
        resolverData: formData.resolverData ? serializeResolverData(formData.resolverData) : undefined,
        posingData: formData.posingData ? serializePosingData(formData.posingData) : undefined,
        aspects: formData.aspects,
        spawnData: formData.spawnData ? formData.spawnData.map(serializeSpawnData) : undefined
    };
}

export function deserializeFormData(data: any): FormData {
    return {
        genderDifference: data.genderDifference ? {
            hasGenderedTexture: data.genderDifference.hasGenderedTexture,
            hasGenderedModel: data.genderDifference.hasGenderedModel,
            hasGenderedAnimation: data.genderDifference.hasGenderedAnimation
        } : undefined,
        lightingData: data.lightingData ? {
            lightLevel: data.lightingData.lightLevel,
            liquidGlowMode: data.lightingData.liquidGlowMode
        } : undefined,
        evolutions: data.evolutions?.map((evolution: any) => EvolutionIdentifier.deserialize(evolution)),
        isFormOf: PokemonIdentifier.deserialize(data.isFormOf ),
        affectedByMechanics: data.affectedByMechanics,
        resolverData: deserializeResolverData(data.resolverData),
        posingData: deserializePosingData(data.posingData),
        aspects: data.aspects,
        spawnData: data.spawnData ? data.spawnData.map(deserializeSpawnData) : undefined
    };
}

export class FormDropsItemEdge extends DynamoEdge {
    dropChance: number;
    quantityRange: NumberRange;
    droppingPokemon: PokemonIdentifier;
    droppedItem: ResourceLocation;
    static version = 1;

    constructor(formName: PokemonIdentifier, itemName: ResourceLocation, dropChance: number, quantityRange: NumberRange, lastEdited: number = Date.now()) {
        super(getNodePK(ItemEntity, itemName.toString()),
            DropsItemEdgeType, FormEntity,
            formName.toString(), FormDropsItemEdge.version, lastEdited);
        this.dropChance = dropChance;
        this.quantityRange = quantityRange;
        this.droppingPokemon = formName;
        this.droppedItem = itemName;
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            dropChance: this.dropChance,
            quantityRange: this.quantityRange.serialize(),
            droppingPokemon: this.droppingPokemon.serialize(),
            droppedItem: this.droppedItem.serialize()
        }
    }

    public static deserialize(data: Record<string, any>): FormDropsItemEdge {
        return new FormDropsItemEdge(
            PokemonIdentifier.deserialize(data.droppingPokemon),
            ResourceLocation.deserialize(data.droppedItem),
            data.dropChance,
            NumberRange.deserialize(data.quantityRange),
            data.lastEdited
        );
    }
}

abstract class FormTypeEdge extends DynamoEdge {
    isRebalanced: boolean;
    static version = 1;

    constructor(pokemonName: PokemonIdentifier, typeName: string, relationship: FormTypeRelationship, isRebalanced: boolean = false, lastEdited: number = Date.now()) {
        super(
            getNodePK(TypeEntity, typeName), 
        relationship,
        FormEntity, 
        pokemonName.toString(), FormTypeEdge.version, lastEdited);
        this.isRebalanced = isRebalanced;
    }
    
        public serialize(): Record<string, any> {
            return {
                ...super.serialize(),
                isRebalanced: this.isRebalanced
            }
        }
    
        static deserialize(data: Record<string, any>): FormTypeEdge {
            const relationship = data.entityType as FormTypeRelationship;
            const pokemonName = PokemonIdentifier.deserialize(data.target);
            const typeName = getPkName(data.PK);
            const isRebalanced = data.isRebalanced || false;
            if(relationship === FormTypeRelationship.PrimaryType) {
                return new FormPrimaryTypeEdge(pokemonName, typeName, isRebalanced, data.lastEdited);
            } else if(relationship === FormTypeRelationship.SecondaryType) {
                return new FormSecondaryTypeEdge(pokemonName, typeName, isRebalanced, data.lastEdited);
            } else {
                throw new Error(`Unknown PokemonTypeRelationship: ${relationship}`);
            }
        }
}

export class FormPrimaryTypeEdge extends FormTypeEdge {
    constructor(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false, lastEdited: number = Date.now()) {
        super(pokemonName, typeName, FormTypeRelationship.PrimaryType, isRebalanced, lastEdited);
    }
}

export class FormSecondaryTypeEdge extends FormTypeEdge {
    constructor(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false, lastEdited: number = Date.now()) {
        super(pokemonName, typeName, FormTypeRelationship.SecondaryType, isRebalanced, lastEdited);
    }
}

export class FormHasAbilityEdge extends DynamoEdge {
    isHidden: boolean;
    isPlaceholder: boolean;
    isRebalanced: boolean;
    static version = 1;
    recipient: PokemonIdentifier;
    abilityIdentifier: AbilityIdentifier;
    
    constructor(pokemonName: PokemonIdentifier,
                abilityIdentifier: AbilityIdentifier, isHidden: boolean = false, isPlaceholder: boolean = false,
                isRebalanced: boolean = false, lastEdited: number = Date.now()) {
        super(getNodePK(AbilityEntity, abilityIdentifier.toString()),
        FormHasAbilityEdgeType, FormEntity, 
        pokemonName.toString(), FormHasAbilityEdge.version, lastEdited);
        this.isHidden = isHidden;
        this.isPlaceholder = isPlaceholder;
        this.isRebalanced = isRebalanced;
        this.recipient = pokemonName;
        this.abilityIdentifier = abilityIdentifier;
    }
    
        public serialize(): Record<string, any> {
            return {
                ...super.serialize(),
                isHidden: this.isHidden,
                isPlaceholder: this.isPlaceholder,
                isRebalanced: this.isRebalanced,
                recipient: this.recipient.serialize(),
                abilityIdentifier: this.abilityIdentifier.serialize()
            }
        }
    
        static deserialize(data: Record<string, any>): FormHasAbilityEdge {
            const edge = new FormHasAbilityEdge(
                PokemonIdentifier.deserialize(data.recipient),
                AbilityIdentifier.deserialize(data.abilityIdentifier),
                data.isHidden,
                data.isPlaceholder,
                data.isRebalanced,
                data.lastEdited
            );
            return edge;
        }
}
export const FormHasAbilityEdgeType = "FormHasAbility";

export enum FormTypeRelationship {
    PrimaryType = "FormPrimaryType",
    SecondaryType = "FormSecondaryType"
}

deserializerRegistry.register(FormHasAbilityEdgeType, FormHasAbilityEdge.deserialize);
deserializerRegistry.register(FormTypeRelationship.PrimaryType, FormTypeEdge.deserialize);
deserializerRegistry.register(FormTypeRelationship.SecondaryType, FormTypeEdge.deserialize);
deserializerRegistry.register(FormEntity, FormNode.deserialize);
deserializerRegistry.register(DropsItemEdgeType, FormDropsItemEdge.deserialize);