import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamo';
import { BiomeEntity, BiomeTagEntity, DoesNotSpawnInBiomeEdgeType, SpawnsInBiomeEdgeType } from '../minecraft/biome';
import { DoesNotSpawnInStructureEdgeType, SpawnsInStructureEdgeType, StructureEntity, StructureTagEntity } from '../minecraft/structure';
import { SpawnCondition } from './spawnCondition';

export const SpawnPresetEntity = "SpawnPreset";

class SpawnPresetNode extends DynamoNode {
    condition?: SpawnCondition;
    antiCondition?: SpawnCondition;

    constructor(name: string, condition?: SpawnCondition, antiCondition?: SpawnCondition) {
        super(SpawnPresetEntity, name);
        this.condition = condition;
        this.antiCondition = antiCondition;
    }
}

export function createSpawnPresetNode(name: string, condition?: SpawnCondition, antiCondition?: SpawnCondition): SpawnPresetNode {
    return new SpawnPresetNode(name, condition, antiCondition);
}

export function createSpawnPresetDoesNotSpawnInBiomeEdge(spawnPresetName: string, biomeName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnPresetEntity, spawnPresetName), DoesNotSpawnInBiomeEdgeType, BiomeEntity, biomeName);
}

export function createSpawnPresetDoesNotSpawnInBiomeTagEdge(spawnPresetName: string, biomeTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnPresetEntity, spawnPresetName), DoesNotSpawnInBiomeEdgeType, BiomeTagEntity, biomeTagName);
}

export function createSpawnPresetSpawnsInStructureEdge(spawnPresetName: string, StructureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnPresetEntity, spawnPresetName), SpawnsInStructureEdgeType, StructureEntity, StructureName);
}

export function createSpawnPresetSpawnsInStructureTagEdge(spawnPresetName: string, StructureTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnPresetEntity, spawnPresetName), SpawnsInStructureEdgeType, StructureTagEntity, StructureTagName);
}

export function createSpawnPresetDoesNotSpawnInStructureEdge(spawnPresetName: string, StructureName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnPresetEntity, spawnPresetName), DoesNotSpawnInStructureEdgeType, StructureEntity, StructureName);
}

export function createSpawnPresetDoesNotSpawnInStructureTagEdge(spawnPresetName: string, StructureTagName: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SpawnPresetEntity, spawnPresetName), DoesNotSpawnInStructureEdgeType, StructureTagEntity, StructureTagName);
}