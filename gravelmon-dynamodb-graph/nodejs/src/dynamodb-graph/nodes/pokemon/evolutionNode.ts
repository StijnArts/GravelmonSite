import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { MoveEntity, MoveIdentifier } from '../battle/moveNode';
import { FormEntity } from './formNode';
import { ItemEntity } from '../minecraft/itemNode';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';
import { PokemonIdentifier } from './pokemonNode';
import { EvolutionCondition } from '../../models/properties/evolutionCondition';

const EvolutionEntity = "Evolution";

const NeedsToHoldEdgeType = "NeedsToHold"
const UseOnEdgeType = "UseOn"
const LearnsUponEvolvingEdgeType = "LearnsUponEvolving"

export function createEvolutionNode(source: PokemonIdentifier, result: PokemonIdentifier, evolutionOptions: EvolutionOptions) : EvolutionNode {
    return new EvolutionNode(new EvolutionIdentifier(source, result), evolutionOptions)
}

//edges pointing towards evolution from other nodes, used to easily query all related nodes of an evolution
export function createEvolutionNeedsToHoldItemEdge(evolutionName : string, itemResourceLocation : ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(ItemEntity, itemResourceLocation.toString()), 
        NeedsToHoldEdgeType, evolutionName, EvolutionEntity
    );
}

export function createEvolutionUseItemOnEdge(evolutionName : string, itemResourceLocation : ResourceLocation) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(ItemEntity, itemResourceLocation.toString()), 
        UseOnEdgeType, evolutionName, EvolutionEntity
    );
}

export function createEvolutionLearnsMoveUponEvolvingEdge(evolutionName : string, moveName : MoveIdentifier) : DynamoEdge {
    return new DynamoEdge(
        getNodePK(MoveEntity, moveName.toString()), 
        LearnsUponEvolvingEdgeType, evolutionName, EvolutionEntity
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
    needsToHoldItem?: ResourceLocation;
    useItemOn?: ResourceLocation;
    evolvesFromForm?: PokemonIdentifier;
    evolvesIntoForm?: PokemonIdentifier;
    shedsIntoForm?: PokemonIdentifier;
    learnsMoveUponEvolving?: MoveIdentifier;
}

export class EvolutionIdentifier {
    source: PokemonIdentifier;
    result: PokemonIdentifier;

    constructor(source: PokemonIdentifier, result: PokemonIdentifier) {
        this.source = source;
        this.result = result;
    }

    toString(): string {
        return `${this.source.toString()}_${this.result.toString()}`;
    }

    static fromString(identifier: string): EvolutionIdentifier {
        const [sourceStr, resultStr] = identifier.split("_");
        return new EvolutionIdentifier(PokemonIdentifier.fromString(sourceStr), PokemonIdentifier.fromString(resultStr));
    }

    serialize(): any {
        return {
            source: this.source.serialize(),
            result: this.result.serialize()
        }
    }

    static deserialize(data: any): EvolutionIdentifier {
        return new EvolutionIdentifier(PokemonIdentifier.deserialize(data.source), PokemonIdentifier.deserialize(data.result));
    }
}

class EvolutionNode extends DynamoNode {
    evolutionIdentifier: EvolutionIdentifier;
    evolutionType: EvolutionType;
    consumesHeldItem?: boolean;
    isOptional?: boolean;
    evolutionConditions: EvolutionCondition[];

    constructor(evolutionIdentifier: EvolutionIdentifier, evolutionOptions: EvolutionOptions) {
        super(EvolutionEntity, evolutionIdentifier.toString());
        this.evolutionIdentifier = evolutionIdentifier;
        this.evolutionType = evolutionOptions.evolutionType;
        this.consumesHeldItem = evolutionOptions.consumesHeldItem;
        this.isOptional = evolutionOptions.isOptional;
        this.evolutionConditions = evolutionOptions.evolutionConditions;
    }

    serialize(): any {
        return {
            ...super.serialize(),
            evolutionIdentifier: this.evolutionIdentifier.serialize(),
            evolutionType: this.evolutionType,
            consumesHeldItem: this.consumesHeldItem,
            isOptional: this.isOptional,
            evolutionConditions: this.evolutionConditions.map(condition => condition.serialize())
        }
    }
}