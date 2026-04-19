import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamo';
import { MoveEntity } from '../battle/move/move';
import { FormEntity } from '../form';
import { ItemEntity } from '../minecraft/item';
import { ResourceLocation } from '../minecraft/resourceLocation';
import { PokemonIdentifier } from '../pokemon';
import { EvolutionCondition } from './evolutionCondition';

const EvolutionEntity = "Evolution";

const NeedsToHoldEdgeType = "NeedsToHold"
const UseOnEdgeType = "UseOn"
const EvolvesFromEdgeType = "EvolvesFrom"
const EvolvesIntoEdgeType = "EvolvesInto"
const ShedsEdgeType = "Sheds"
const LearnsUponEvolvingEdgeType = "LearnsUponEvolving"

export function createEvolutionNode(source: PokemonIdentifier, result: PokemonIdentifier, evolutionOptions: EvolutionOptions) : EvolutionNode {
    return new EvolutionNode(source, result, evolutionOptions)
}

export function createEvolutionNeedsToHoldEdge(evolutionName : string, itemResourceLocation : ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(evolutionName, EvolutionEntity), 
        NeedsToHoldEdgeType, ItemEntity, itemResourceLocation.toString()
    );
}

export function createEvolutionUseOnEdge(evolutionName : string, itemResourceLocation : ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(evolutionName, EvolutionEntity), 
        UseOnEdgeType, ItemEntity, itemResourceLocation.toString()
    );
}

export function createEvolutionEvolvesFromEdge(evolutionName : string, sourcePokemon : PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(evolutionName, EvolutionEntity), 
        EvolvesFromEdgeType, FormEntity, sourcePokemon.toString()
    ); 
}

export function createEvolutionEvolvesIntoEdge(evolutionName : string, resultPokemon : PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(evolutionName, EvolutionEntity), 
        EvolvesIntoEdgeType, FormEntity, resultPokemon.toString()
    ); 
}

export function createEvolutionShedsEdge(evolutionName : string, resultPokemon : PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(evolutionName, EvolutionEntity), 
        ShedsEdgeType, FormEntity, resultPokemon.toString()
    ); 
}

export function createEvolutionLearnsUponEvolvingEdge(evolutionName : string, moveName : string) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(evolutionName, EvolutionEntity), 
        LearnsUponEvolvingEdgeType, MoveEntity, moveName
    ); 
}

export enum EvolutionType {
    LevelUp = "level_up",
    ItemInteract = "item_interact",
    Trade = "trade"
}

export interface EvolutionOptions {
    evolutionType: EvolutionType;
    consumesHeldItem?: boolean;
    isOptional?: boolean;
    evolutionConditions: EvolutionCondition[]
}

class EvolutionNode extends DynamoNode {
    evolutionType: EvolutionType;
    consumesHeldItem?: boolean;
    isOptional?: boolean;
    evolutionConditions: EvolutionCondition[]
    constructor(source: PokemonIdentifier, result: PokemonIdentifier, evolutionOptions: EvolutionOptions) {
        super(EvolutionEntity, `${source.toString()}_${result.toString()}`);
        this.evolutionType = evolutionOptions.evolutionType;
        this.consumesHeldItem = evolutionOptions.consumesHeldItem;
        this.isOptional = evolutionOptions.isOptional;
        this.evolutionConditions = evolutionOptions.evolutionConditions;
    }
}