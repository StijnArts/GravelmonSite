import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { MoveEntity, MoveIdentifier } from '../battle/moveNode';
import { ItemEntity } from '../minecraft/itemNode';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';
import { PokemonIdentifier } from './pokemonNode';
import { EvolutionCondition } from '../../models/properties/evolutionCondition';
import {deserializerRegistry} from "../../service/deserializerRegistry";

export const EvolutionEntity = "Evolution";

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
    requiresItemUsedOn?: ResourceLocation;
    evolvesFromForm: PokemonIdentifier;
    evolvesIntoForm: PokemonIdentifier;
    shedsIntoForm?: PokemonIdentifier;
    learnsMovesUponEvolving?: MoveIdentifier[];
}

export class EvolutionNode extends DynamoNode {
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
                identifier: this.evolutionOptions.identifier.serialize(),
                evolutionType: this.evolutionOptions.evolutionType,
                consumesHeldItem: this.evolutionOptions.consumesHeldItem,
                isOptional: this.evolutionOptions.isOptional,
                evolutionConditions: this.evolutionOptions.evolutionConditions.map(condition => condition.serialize()),
                needsToHoldItem: this.evolutionOptions.needsToHoldItem?.serialize(),
                useItemOn: this.evolutionOptions.requiresItemUsedOn?.serialize(),
                evolvesFromForm: this.evolutionOptions.evolvesFromForm.serialize(),
                evolvesIntoForm: this.evolutionOptions.evolvesIntoForm.serialize(),
                shedsIntoForm: this.evolutionOptions.shedsIntoForm?.serialize(),
                learnsMoveUponEvolving: this.evolutionOptions.learnsMovesUponEvolving ? 
                    this.evolutionOptions.learnsMovesUponEvolving?.map(move => move.serialize()) 
                    : undefined
            }
        }
    }

    static deserialize(data: any): EvolutionNode {
        const options = data.evolutionOptions;

        if (!options?.identifier?.source || !options?.identifier?.result) {
            throw new Error(
                "Invalid data for deserializing EvolutionNode: missing evolutionIdentifier or source or result"
            );
        }
        const evolutionIdentifier = EvolutionIdentifier.deserialize(options.identifier);
        const evolutionOptions: EvolutionOptions = {
            identifier: evolutionIdentifier,
            evolutionType: options.evolutionType,
            consumesHeldItem: options.consumesHeldItem,
            isOptional: options.isOptional,
            evolutionConditions: Array.isArray(options.evolutionConditions) ?
                options.evolutionConditions.map((condition: any) => EvolutionCondition.deserialize(condition))
                : [],
            needsToHoldItem: options.needsToHoldItem ? ResourceLocation.deserialize(options.needsToHoldItem) : undefined,
            requiresItemUsedOn: options.useItemOn ? ResourceLocation.deserialize(options.useItemOn) : undefined,
            evolvesFromForm: PokemonIdentifier.deserialize(options.evolvesFromForm),
            evolvesIntoForm: PokemonIdentifier.deserialize(options.evolvesIntoForm),
            shedsIntoForm: options.shedsIntoForm ? PokemonIdentifier.deserialize(options.shedsIntoForm) : undefined,
            learnsMovesUponEvolving: options.learnsMoveUponEvolving ? options.learnsMoveUponEvolving.map((move:any)  => MoveIdentifier.deserialize(move)) : undefined
        }
        return new EvolutionNode(evolutionOptions);
    }
}

deserializerRegistry.register(EvolutionEntity, EvolutionNode.deserialize);