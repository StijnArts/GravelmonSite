import { DynamoNode, DynamoEdge, getNodePK, getPkName } from '../dynamo';
import { AbilityEntity } from './battle/ability';
import { BehaviourEntity } from './behaviour/behaviour';
import { HasLabelEdgeType, LabelEntity } from './label';
import { EggGroupEntity, InEggGroupEdgeType } from './properties/eggGroup';
import { ExperienceGroupEntity, InExperienceGroupEdgeType } from './properties/experienceGroup';
import { Stats } from './properties/stats';
import { TypeEntity } from './battle/type';
import { FormEntity } from './form';
import { MoveSetEntity, MoveSetOfEdgeType } from "./battle/move/moveset";

export const PokemonEntity = "Pokemon";

export const PerformsBehaviourEdgeType = "PerformsBehaviour";
export const HasAbilityEdgeType = "HasAbility";
export const HasFormEdgeType = "HasForm";

export enum PokemonTypeRelationship {
    PrimaryType = "PrimaryType",
    SecondaryType = "SecondaryType"
}

export function createPokemonNode(pokemonData: PokemonData) {
    return new PokemonNode(pokemonData);
}

export function createPokemonPrimaryTypeEdge(pokemonName: PokemonIdentifier, typeName: string): PokemonTypeEdge {
    return new PrimaryTypeEdge(pokemonName.toString(), typeName);
}

export function createPokemonSecondaryTypeEdge(pokemonName: PokemonIdentifier, typeName: string): PokemonTypeEdge {
    return new SecondaryTypeEdge(pokemonName.toString(), typeName);
}

export function createPokemonPerformsBehaviourEdge(pokemonName: PokemonIdentifier, behaviourName: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName.toString()), PerformsBehaviourEdgeType, BehaviourEntity, behaviourName.toString());
}

export function createPokemonHasLabelEdge(pokemonName: PokemonIdentifier, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName.toString()), HasLabelEdgeType, LabelEntity, labelName);
}

export function createPokemonInEggGroupEdge(pokemonName: PokemonIdentifier, eggGroupName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName.toString()), InEggGroupEdgeType, EggGroupEntity, eggGroupName);
}

export function createPokemonInExperienceGroupEdge(pokemonName: PokemonIdentifier, experienceGroupName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName.toString()), InExperienceGroupEdgeType, ExperienceGroupEntity, experienceGroupName);
}

export function createPokemonMoveSetOfEdge(pokemonName: PokemonIdentifier, moveSetName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName.toString()), MoveSetOfEdgeType, MoveSetEntity, moveSetName);
}

export function createPokemonHasFormEdge(pokemonName: PokemonIdentifier, formName: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName.toString()), HasFormEdgeType, FormEntity, formName.toString());
}

export function createPokemonHasAbilityEdge(
            pokemonName: PokemonIdentifier, abilityName: string,
            isHidden: boolean = false, isPlaceholder: boolean = false
        ): DynamoEdge {
    return new PokemonHasAbilityEdge(pokemonName.toString(), abilityName, isHidden, isPlaceholder);
}

export class PokemonIdentifier {
    game: string;
    pokemon: string;
    formName?: string;
    constructor(game: string, pokemon: string, formName?: string) {
        this.game = game;
        this.pokemon = pokemon;
        this.formName = formName;
    }

    toString(): string {
        const formSuffix = this.formName ? `#${this.formName}` : "";
        return `${this.game}#${this.pokemon}${formSuffix}`;
    }

    static fromString(identifier: string): PokemonIdentifier {
        const [game, pokemonWithForm] = identifier.split("#");
        const [pokemon, formName] = pokemonWithForm.split("#");
        return new PokemonIdentifier(game, pokemon, formName);
    }

    isForm(): boolean {
        return !!this.formName;
    }
}

export class Hitbox {
    width: number;
    height: number;
    fixed?: boolean;

    constructor(width: number, height: number, fixed: boolean = false) {
        this.width = width;
        this.height = height;
        this.fixed = fixed;
    }
}

export interface PokemonData {
    pokemonIdentifier: PokemonIdentifier;
    baseStats: Stats;
    evYield: Stats;
    heightInMeters: number;
    weightInKg: number;
    catchRate: number;
    maleRatio: number;
    baseExperience: number;
    baseFriendship: number;
    eggCycles: number;
    pokedexEntry: string;
    hitbox: Hitbox;
    baseScale: number;
    cannotDynamax: boolean;
    dropAmount: number;
}

export class PokemonNode extends DynamoNode {
    pokemonData: PokemonData;
    
    constructor(pokemonData: PokemonData) {
        super(PokemonEntity, pokemonData.pokemonIdentifier.toString());
        this.pokemonData = pokemonData;
    }
}

abstract class PokemonTypeEdge extends DynamoEdge {
    constructor(pokemonName: string, typeName: string, relationship: PokemonTypeRelationship, isReverseEdge: boolean = false) {
        super(
            getNodePK(isReverseEdge? TypeEntity : PokemonEntity, pokemonName.toString()), 
        relationship,
        isReverseEdge? PokemonEntity : TypeEntity, 
        typeName, isReverseEdge);
    }

    reverseEdge(): PokemonTypeEdge {
        const pokemonName = getPkName(this.PK);
        const typeName = getPkName(this.Target);
        switch (this.entityType) {
            case PokemonTypeRelationship.PrimaryType:
                return new PrimaryTypeEdge(pokemonName, typeName, !this.isReverseEdge());
            case PokemonTypeRelationship.SecondaryType:
                return new SecondaryTypeEdge(pokemonName, typeName, !this.isReverseEdge());
            default:
                throw new Error(`Unknown Pokemon-Type relationship: ${this.entityType}`);
        }
    }
}

class PokemonHasAbilityEdge extends DynamoEdge {
    isHidden: boolean;
    isPlaceholder: boolean;
    
    constructor(pokemonName: string, abilityName: string, isHidden: boolean = false, isPlaceholder: boolean = false, isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge? AbilityEntity : PokemonEntity, pokemonName.toString()), 
        HasAbilityEdgeType, isReverseEdge? PokemonEntity : AbilityEntity, 
        abilityName, isReverseEdge);
        this.isHidden = isHidden;
        this.isPlaceholder = isPlaceholder;
    }

    reverseEdge(): PokemonHasAbilityEdge {
        return new PokemonHasAbilityEdge(getPkName(this.Target), getPkName(this.PK), this.isHidden, this.isPlaceholder, !this.isReverseEdge());
    }
}

class PrimaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: string, typeName: string, isReverseEdge: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.PrimaryType, isReverseEdge);
    }
}

class SecondaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: string, typeName: string, isReverseEdge: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.SecondaryType, isReverseEdge);
    }
}

export function getPokemonIdentifier(game: string, pokemon: string, formName?: string): PokemonIdentifier {
    return new PokemonIdentifier(game, pokemon, formName);
}