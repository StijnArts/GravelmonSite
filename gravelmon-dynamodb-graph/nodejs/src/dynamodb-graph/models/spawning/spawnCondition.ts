import { deserializerRegistry } from "../../service/deserializerRegistry";
import { ResourceLocation } from "../minecraft/resourceLocation";
import { NumberRange } from "../properties/numberRange";
import { deserializeTimeRange, serializeTimeRange, TimeRange } from "../properties/time";

export enum LabelMode {
    ANY, ALL
}

export interface SpawnConditionOptions {
    dimensions?: string[];
    moonPhase?: NumberRange;
    canSeeSky?: boolean;
    minY?: number;
    minX?: number;
    minZ?: number;
    maxY?: number;
    maxX?: number;
    maxZ?: number;
    minLight?: number;
    maxLight?: number;
    minSkyLight?: number;
    maxSkyLight?: number;
    timeRange?: TimeRange;
    isRaining?: boolean;
    isThundering?: boolean;
    isSlimeChunk?: boolean;
    labels?: string[];
    labelMode?: LabelMode;

    minWidth?: number;
    maxWidth?: number;
    minLength?: number;
    maxLength?: number;

    neededNearbyBlocks?: ResourceLocation[];
    neededBaseBlocks?: ResourceLocation[];
    doesNotSpawnInBiomes?: ResourceLocation[];
    spawnsInBiomes?: ResourceLocation[];
    doesNotSpawnInStructures?: ResourceLocation[];
    spawnsInStructures?: ResourceLocation[];

    minDepth?: number;
    maxDepth?: number;
    fluidIsSource?: boolean;
    fluid?: ResourceLocation;

    minLureLevel?: number;
    maxLureLevel?: number;
    bobber?: ResourceLocation;
    bait?: ResourceLocation;
}

export class SpawnCondition {
    spawnConditionOptions: SpawnConditionOptions;

    constructor(options: SpawnConditionOptions) {
        this.spawnConditionOptions = options;
    }

    serialize(): any {
        return {
            spawnConditionOptions: {
                dimension: this.spawnConditionOptions.dimensions,
                moonPhase: this.spawnConditionOptions.moonPhase ? this.spawnConditionOptions.moonPhase.serialize() : undefined,
                canSeeSky: this.spawnConditionOptions.canSeeSky,
                minY: this.spawnConditionOptions.minY,
                minX: this.spawnConditionOptions.minX,
                minZ: this.spawnConditionOptions.minZ,
                maxY: this.spawnConditionOptions.maxY,
                maxX: this.spawnConditionOptions.maxX,
                maxZ: this.spawnConditionOptions.maxZ,
                minLight: this.spawnConditionOptions.minLight,
                maxLight: this.spawnConditionOptions.maxLight,
                minSkyLight: this.spawnConditionOptions.minSkyLight,
                maxSkyLight: this.spawnConditionOptions.maxSkyLight,
                timeRange: this.spawnConditionOptions.timeRange ? serializeTimeRange(this.spawnConditionOptions.timeRange) : undefined,
                isRaining: this.spawnConditionOptions.isRaining,
                isThundering: this.spawnConditionOptions.isThundering,
                isSlimeChunk: this.spawnConditionOptions.isSlimeChunk,
                labels: this.spawnConditionOptions.labels,
                labelMode: this.spawnConditionOptions.labelMode,

                minWidth: this.spawnConditionOptions.minWidth,
                maxWidth: this.spawnConditionOptions.maxWidth,
                minLength: this.spawnConditionOptions.minLength,
                maxLength: this.spawnConditionOptions.maxLength,

                neededNearbyBlocks: this.spawnConditionOptions.neededNearbyBlocks ? this.spawnConditionOptions.neededNearbyBlocks.map(item => item.serialize()) : undefined,
                neededBaseBlocks: this.spawnConditionOptions.neededBaseBlocks ? this.spawnConditionOptions.neededBaseBlocks.map(item => item.serialize()) : undefined,
                doesNotSpawnInBiomes: this.spawnConditionOptions.doesNotSpawnInBiomes ? this.spawnConditionOptions.doesNotSpawnInBiomes.map(item => item.serialize()) : undefined,
                spawnsInBiomes: this.spawnConditionOptions.spawnsInBiomes ? this.spawnConditionOptions.spawnsInBiomes.map(item => item.serialize()) : undefined,
                doesNotSpawnInStructures: this.spawnConditionOptions.doesNotSpawnInStructures ? this.spawnConditionOptions.doesNotSpawnInStructures.map(item => item.serialize()) : undefined,
                spawnsInStructures: this.spawnConditionOptions.spawnsInStructures ? this.spawnConditionOptions.spawnsInStructures.map(item => item.serialize()) : undefined,
                minDepth: this.spawnConditionOptions.minDepth,
                maxDepth: this.spawnConditionOptions.maxDepth,
                fluidIsSource: this.spawnConditionOptions.fluidIsSource,
                fluid: this.spawnConditionOptions.fluid ? this.spawnConditionOptions.fluid.serialize() : undefined,
                minLureLevel: this.spawnConditionOptions.minLureLevel,
                maxLureLevel: this.spawnConditionOptions.maxLureLevel,
                bobber: this.spawnConditionOptions.bobber ? this.spawnConditionOptions.bobber.serialize() : undefined,
                bait: this.spawnConditionOptions.bait ? this.spawnConditionOptions.bait.serialize() : undefined
            }
        }
    }

    static deserialize(data: any): SpawnCondition {
        const options: SpawnConditionOptions = {
            dimensions: data.spawnConditionOptions.dimension,
            moonPhase: data.spawnConditionOptions.moonPhase ? NumberRange.deserialize(data.spawnConditionOptions.moonPhase) : undefined,
            canSeeSky: data.spawnConditionOptions.canSeeSky,
            minY: data.spawnConditionOptions.minY,
            minX: data.spawnConditionOptions.minX,
            minZ: data.spawnConditionOptions.minZ,
            maxY: data.spawnConditionOptions.maxY,
            maxX: data.spawnConditionOptions.maxX,
            maxZ: data.spawnConditionOptions.maxZ,
            minLight: data.spawnConditionOptions.minLight,
            maxLight: data.spawnConditionOptions.maxLight,
            minSkyLight: data.spawnConditionOptions.minSkyLight,
            maxSkyLight: data.spawnConditionOptions.maxSkyLight,
            timeRange: data.spawnConditionOptions.timeRange ? deserializeTimeRange(data.spawnConditionOptions.timeRange) : undefined,
            isRaining: data.spawnConditionOptions.isRaining,
            isThundering: data.spawnConditionOptions.isThundering,
            isSlimeChunk: data.spawnConditionOptions.isSlimeChunk,
            labels: data.spawnConditionOptions.labels,
            labelMode: data.spawnConditionOptions.labelMode,

            minWidth: data.spawnConditionOptions.minWidth,
            maxWidth: data.spawnConditionOptions.maxWidth,
            minLength: data.spawnConditionOptions.minLength,
            maxLength: data.spawnConditionOptions.maxLength,

            neededNearbyBlocks: data.spawnConditionOptions.neededNearbyBlocks ? data.spawnConditionOptions.neededNearbyBlocks.map((item: any) => ResourceLocation.deserialize(item)) : undefined,
            neededBaseBlocks: data.spawnConditionOptions.neededBaseBlocks ? data.spawnConditionOptions.neededBaseBlocks.map((item: any) => ResourceLocation.deserialize(item)) : undefined,
            doesNotSpawnInBiomes: data.spawnConditionOptions.doesNotSpawnInBiomes ? data.spawnConditionOptions.doesNotSpawnInBiomes.map((item: any) => ResourceLocation.deserialize(item)) : undefined,
            spawnsInBiomes: data.spawnConditionOptions.spawnsInBiomes ? data.spawnConditionOptions.spawnsInBiomes.map((item: any) => ResourceLocation.deserialize(item)) : undefined,
            doesNotSpawnInStructures: data.spawnConditionOptions.doesNotSpawnInStructures ? data.spawnConditionOptions.doesNotSpawnInStructures.map((item: any) => ResourceLocation.deserialize(item)) : undefined,
            spawnsInStructures: data.spawnConditionOptions.spawnsInStructures ? data.spawnConditionOptions.spawnsInStructures.map((item: any) => ResourceLocation.deserialize(item)) : undefined,
            minDepth: data.spawnConditionOptions.minDepth,
            maxDepth: data.spawnConditionOptions.maxDepth,
            fluidIsSource: data.spawnConditionOptions.fluidIsSource,
            fluid: data.spawnConditionOptions.fluid ? ResourceLocation.deserialize(data.spawnConditionOptions.fluid) : undefined,
            minLureLevel: data.spawnConditionOptions.minLureLevel,
            maxLureLevel: data.spawnConditionOptions.maxLureLevel,
            bobber: data.spawnConditionOptions.bobber ? ResourceLocation.deserialize(data.spawnConditionOptions.bobber) : undefined,
            bait: data.spawnConditionOptions.bait ? ResourceLocation.deserialize(data.spawnConditionOptions.bait) : undefined
        };

        return new SpawnCondition(options);
    }
}