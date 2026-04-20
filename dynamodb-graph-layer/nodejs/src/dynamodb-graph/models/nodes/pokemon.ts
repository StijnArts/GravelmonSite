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

export function createPokemonPrimaryTypeEdge(pokemonName: string, typeName: string): PokemonTypeEdge {
    return new PrimaryTypeEdge(pokemonName, typeName);
}

export function createPokemonSecondaryTypeEdge(pokemonName: string, typeName: string): PokemonTypeEdge {
    return new SecondaryTypeEdge(pokemonName, typeName);
}

export function createPokemonPerformsBehaviourEdge(pokemonName: string, behaviourName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName), PerformsBehaviourEdgeType, BehaviourEntity, behaviourName);
}

export function createPokemonHasLabelEdge(pokemonName: string, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName), HasLabelEdgeType, LabelEntity, labelName);
}

export function createPokemonInEggGroupEdge(pokemonName: string, eggGroupName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName), InEggGroupEdgeType, EggGroupEntity, eggGroupName);
}

export function createPokemonInExperienceGroupEdge(pokemonName: string, experienceGroupName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName), InExperienceGroupEdgeType, ExperienceGroupEntity, experienceGroupName);
}

export function createPokemonMoveSetOfEdge(pokemonName: string, moveSetName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName), MoveSetOfEdgeType, MoveSetEntity, moveSetName);
}

export function createPokemonHasFormEdge(pokemonName: string, formName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PokemonEntity, pokemonName), HasFormEdgeType, FormEntity, formName);
}

export function createPokemonHasAbilityEdge(
            pokemonName: string, abilityName: string, 
            isHidden: boolean = false, isPlaceholder: boolean = false
        ): DynamoEdge {
    return new PokemonHasAbilityEdge(pokemonName, abilityName, isHidden, isPlaceholder);
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

export class PokemonNode extends DynamoNode {
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
    
constructor(
    name: string, 
    baseStats: Stats, 
    evYield: Stats, 
    heightInMeters: number, 
    weightInKg: number, 
    catchRate: number, 
    maleRatio: number, 
    baseExperience: number, 
    baseFriendship: number, 
    eggCycles: number, 
    hitbox: Hitbox, 
    baseScale: number = 1.0, 
    cannotDynamax: boolean = false, 
    pokedexEntry: string = "") {
        super(PokemonEntity, name);
        this.baseStats = baseStats;
        this.evYield = evYield;
        this.heightInMeters = heightInMeters;
        this.weightInKg = weightInKg;
        this.catchRate = catchRate;
        this.maleRatio = maleRatio;
        this.baseExperience = baseExperience;
        this.baseFriendship = baseFriendship;
        this.eggCycles = eggCycles;
        this.hitbox = hitbox;
        this.baseScale = baseScale;
        this.cannotDynamax = cannotDynamax;
        this.pokedexEntry = pokedexEntry;
    }
}

abstract class PokemonTypeEdge extends DynamoEdge {
    constructor(pokemonName: string, typeName: string, relationship: PokemonTypeRelationship, isReverseEdge: boolean = false) {
        super(
            getNodePK(isReverseEdge? TypeEntity : PokemonEntity, pokemonName), 
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
        super(getNodePK(isReverseEdge? AbilityEntity : PokemonEntity, pokemonName), 
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