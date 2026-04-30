import { DynamoEdge, DynamoNode, getNodePK } from '../../service/dynamoNodes';
import { BiomeEntity, BiomeTagEntity, DoesNotSpawnInBiomeEdgeType, SpawnsInBiomeEdgeType } from '../minecraft/biomeNode';
import { DoesNotSpawnInStructureEdgeType, SpawnsInStructureEdgeType, StructureEntity, StructureTagEntity } from '../minecraft/structureNode';
import { SpawnCondition } from '../../models/spawning/spawnCondition';

export const SpawnPresetEntity = "SpawnPreset";

export interface SpawnPresetOptions {
    condition?: SpawnCondition;
    antiCondition?: SpawnCondition;
}

class SpawnPresetNode extends DynamoNode {
    spawnPresetOptions: SpawnPresetOptions;

    constructor(name: string, spawnPresetOptions: SpawnPresetOptions) {
        super(SpawnPresetEntity, name);
        this.spawnPresetOptions = spawnPresetOptions;
    }
}

// Note: The edges between spawn presets and biomes/structures are stored in the opposite direction of the edges between spawn data and biomes/structures,
// since it is more intuitive to traverse from biomes/structures to spawn presets than the other way around.
export function createSpawnPresetNode(name: string, spawnPresetOptions: SpawnPresetOptions): SpawnPresetNode {
    return new SpawnPresetNode(name, spawnPresetOptions);
}

export function createSpawnPresetDoesNotSpawnInBiomeEdge(spawnPresetName: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeEntity, biomeName), DoesNotSpawnInBiomeEdgeType, SpawnPresetEntity, spawnPresetName);
}

export function createSpawnPresetDoesNotSpawnInBiomeTagEdge(spawnPresetName: string, biomeTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName), DoesNotSpawnInBiomeEdgeType, SpawnPresetEntity, spawnPresetName);
}

export function createSpawnPresetSpawnsInBiomeEdge(spawnPresetName: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeEntity, biomeName), SpawnsInBiomeEdgeType, SpawnPresetEntity, spawnPresetName);
}

export function createSpawnPresetSpawnsInBiomeTagEdge(spawnPresetName: string, biomeTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(BiomeTagEntity, biomeTagName), SpawnsInBiomeEdgeType, SpawnPresetEntity, spawnPresetName);
}

export function createSpawnPresetSpawnsInStructureEdge(spawnPresetName: string, StructureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName), SpawnsInStructureEdgeType, SpawnPresetEntity, spawnPresetName);
}

export function createSpawnPresetSpawnsInStructureTagEdge(spawnPresetName: string, StructureTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName), SpawnsInStructureEdgeType, SpawnPresetEntity, spawnPresetName);
}

export function createSpawnPresetDoesNotSpawnInStructureEdge(spawnPresetName: string, StructureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureEntity, StructureName), DoesNotSpawnInStructureEdgeType, SpawnPresetEntity, spawnPresetName);
}

export function createSpawnPresetDoesNotSpawnInStructureTagEdge(spawnPresetName: string, StructureTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(StructureTagEntity, StructureTagName), DoesNotSpawnInStructureEdgeType, SpawnPresetEntity, spawnPresetName);
}