import { DynamoNode, DynamoEdge, getNodePK, getPkName } from '../../service/dynamoNodes';
import { AbilityEntity } from '../battle/abilityNode';
import { BehaviourOptions } from '../../models/behaviour/behaviour';
import { HasLabelEdgeType, LabelEntity } from '../properties/labelNode';
import { EggGroupEntity, InEggGroupEdgeType } from '../properties/eggGroupNode';
import { ExperienceGroupEntity, InExperienceGroupEdgeType } from '../properties/experienceGroupNode';
import { Stats } from '../../models/properties/stats';
import { TypeEntity } from '../battle/typeNode';
import { MoveSet } from '../../models/battle/moveset';

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

export function createPokemonPrimaryTypeEdge(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false): PokemonTypeEdge {
    return new PrimaryTypeEdge(pokemonName, typeName, isRebalanced);
}

export function createPokemonSecondaryTypeEdge(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false): PokemonTypeEdge {
    return new SecondaryTypeEdge(pokemonName, typeName, isRebalanced);
}

//edges pointing towards pokemon from other nodes, used to easily query all related nodes of a pokemon
export function createPokemonHasLabelEdge(pokemonName: PokemonIdentifier, labelName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(LabelEntity, labelName), HasLabelEdgeType, PokemonEntity, pokemonName.toPK());
}

export function createPokemonInEggGroupEdge(pokemonName: PokemonIdentifier, eggGroupName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(EggGroupEntity, eggGroupName), InEggGroupEdgeType, PokemonEntity, pokemonName.toPK());
}

export function createPokemonInExperienceGroupEdge(pokemonName: PokemonIdentifier, experienceGroupName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(ExperienceGroupEntity, experienceGroupName), InExperienceGroupEdgeType, PokemonEntity, pokemonName.toPK());
}

export function createPokemonHasAbilityEdge(
            pokemonName: PokemonIdentifier, abilityName: string,
            isHidden: boolean = false, isPlaceholder: boolean = false, isRebalanced: boolean = false
        ): DynamoEdge {
    return new PokemonHasAbilityEdge(pokemonName, abilityName, isHidden, isPlaceholder, isRebalanced);
}

export class PokemonIdentifier {
    game: string;
    pokemon: string;
    formName?: string;
    constructor(game: string, pokemon: string, formName?: string | string[]) {
        this.game = game;
        this.pokemon = pokemon;
        if(Array.isArray(formName)) {
            this.formName = formName.join("-");
        } else {
            this.formName = formName;
        }
    }

    toPK(): string {
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
    rebalancedStats?: Stats;
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
    behaviourOptions: BehaviourOptions;

    //references to related nodes
    primaryType: string;
    secondaryType: string;

    aspects: string[];
    labels: string[];
    eggGroups: string[];
    experienceGroup: string;
    gameIntroducedIn: string;
    abilities: {
        name: string;
        isHidden: boolean;
        isRebalance: boolean;
        isPlaceholder: boolean;
    }[]
    forms: PokemonIdentifier[];

    moveSet: MoveSet;
    placeholderMoveSet?: MoveSet;
    rebalancedMoveSet?: MoveSet;
}

export class PokemonNode extends DynamoNode {
    pokemonData: PokemonData;
    
    constructor(pokemonData: PokemonData) {
        super(PokemonEntity, pokemonData.pokemonIdentifier.toPK());
        this.pokemonData = pokemonData;
    }
}

//points towards pokemon from type, used to easily query all pokemon of a type
abstract class PokemonTypeEdge extends DynamoEdge {
    isRebalanced: boolean;

    constructor(pokemonName: PokemonIdentifier, typeName: string, relationship: PokemonTypeRelationship, isRebalanced: boolean = false) {
        super(
            getNodePK(TypeEntity, typeName), 
        relationship,
        PokemonEntity, 
        pokemonName.toPK());
        this.isRebalanced = isRebalanced;
    }
}

class PokemonHasAbilityEdge extends DynamoEdge {
    isHidden: boolean;
    isPlaceholder: boolean;
    isRebalanced: boolean;
    
    constructor(pokemonName: PokemonIdentifier, abilityName: string, isHidden: boolean = false, isPlaceholder: boolean = false, isRebalanced: boolean = false) {
        super(getNodePK(AbilityEntity, abilityName), 
        HasAbilityEdgeType, PokemonEntity, 
        pokemonName.toPK());
        this.isHidden = isHidden;
        this.isPlaceholder = isPlaceholder;
        this.isRebalanced = isRebalanced;
    }
}

class PrimaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.PrimaryType, isRebalanced);
    }
}

class SecondaryTypeEdge extends PokemonTypeEdge {
    constructor(pokemonName: PokemonIdentifier, typeName: string, isRebalanced: boolean = false) {
        super(pokemonName, typeName, PokemonTypeRelationship.SecondaryType, isRebalanced);
    }
}

export function getPokemonIdentifier(game: string, pokemon: string, formName?: string | string[]): PokemonIdentifier {
    return new PokemonIdentifier(game, pokemon, formName);
}