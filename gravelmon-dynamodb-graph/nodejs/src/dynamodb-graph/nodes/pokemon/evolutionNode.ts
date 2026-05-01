import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { MoveEntity, MoveIdentifier } from '../battle/moveNode';
import { FormEntity } from './formNode';
import { ItemEntity } from '../minecraft/itemNode';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';
import { PokemonIdentifier } from './pokemonNode';
import { EvolutionCondition } from '../../models/properties/evolutionCondition';
import {deserializerRegistry} from "../../service/deserializerRegistry";

const EvolutionEntity = "Evolution";

const NeedsToHoldEdgeType = "NeedsToHold"
const UseOnEdgeType = "UseOn"
const LearnsUponEvolvingEdgeType = "LearnsUponEvolving"

export function createEvolutionNode(evolutionOptions: EvolutionOptions, lastEdited: number = Date.now()) : EvolutionNode {
    return new EvolutionNode(evolutionOptions, lastEdited)
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

export interface EvolutionOptions {
    identifier: EvolutionIdentifier;
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

class EvolutionNode extends DynamoNode {
    evolutionOptions: EvolutionOptions;
    static version = 1;

    constructor(evolutionOptions: EvolutionOptions, lastEdited: number = Date.now()) {
        super(EvolutionEntity, evolutionOptions.identifier.toString(), EvolutionNode.version, lastEdited);
        this.evolutionOptions = evolutionOptions;
    }

    serialize(): any {
        return {
            ...super.serialize(),
            evolutionOptions: {
                evolutionIdentifier: this.evolutionOptions.identifier.serialize(),
                evolutionType: this.evolutionOptions.evolutionType,
                consumesHeldItem: this.evolutionOptions.consumesHeldItem,
                isOptional: this.evolutionOptions.isOptional,
                evolutionConditions: this.evolutionOptions.evolutionConditions.map(condition => condition.serialize()),
                needsToHoldItem: this.evolutionOptions.needsToHoldItem?.serialize(),
                useItemOn: this.evolutionOptions.useItemOn?.serialize(),
                evolvesFromForm: this.evolutionOptions.evolvesFromForm?.serialize(),
                evolvesIntoForm: this.evolutionOptions.evolvesIntoForm?.serialize(),
                shedsIntoForm: this.evolutionOptions.shedsIntoForm?.serialize(),
                learnsMoveUponEvolving: this.evolutionOptions.learnsMoveUponEvolving?.serialize()
            }
        }
    }

    static deserialize(data: any): EvolutionNode {
        if(!data.evolutionIdentifier || !data.evolutionIdentifier.source || !data.evolutionIdentifier.result) {
            throw new Error("Invalid data for deserializing EvolutionNode: missing evolutionIdentifier or source or result");
        }
        const evolutionIdentifier = EvolutionIdentifier.deserialize(data.evolutionIdentifier);
        const evolutionOptions: EvolutionOptions = {
            identifier: evolutionIdentifier,
            evolutionType: data.evolutionType,
            consumesHeldItem: data.consumesHeldItem,
            isOptional: data.isOptional,
            evolutionConditions: Array.isArray(data.evolutionConditions) ?
                data.evolutionConditions.map((condition: any) => EvolutionCondition.deserialize(condition))
                : [],
            needsToHoldItem: data.needsToHoldItem ? ResourceLocation.deserialize(data.needsToHoldItem) : undefined,
            useItemOn: data.useItemOn ? ResourceLocation.deserialize(data.useItemOn) : undefined,
            evolvesFromForm: data.evolvesFromForm ? PokemonIdentifier.deserialize(data.evolvesFromForm) : undefined,
            evolvesIntoForm: data.evolvesIntoForm ? PokemonIdentifier.deserialize(data.evolvesIntoForm) : undefined,
            shedsIntoForm: data.shedsIntoForm ? PokemonIdentifier.deserialize(data.shedsIntoForm) : undefined,
            learnsMoveUponEvolving: data.learnsMoveUponEvolving ? MoveIdentifier.deserialize(data.learnsMoveUponEvolving) : undefined
        }
        return new EvolutionNode(evolutionOptions);
    }
}

deserializerRegistry.register(EvolutionEntity, EvolutionNode.deserialize);