import { PK } from "../../dynamoNodes";
import { ResourceLocation } from "../minecraft/resourceLocation";
import { NumberRange } from "../properties/numberRange";
import { TimeRange } from "../properties/time";

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

    minDepth?: number;
    maxDepth?: number;
    fluidIsSource?: boolean;
    fluid?: ResourceLocation;

    minLureLevel?: number;
    maxLureLevel?: number;
    bobber?: ResourceLocation;
    bait?: ResourceLocation;

    constructor(options: SpawnConditionOptions) {
        this.dimensions = options.dimensions;
        this.moonPhase = options.moonPhase;
        this.canSeeSky = options.canSeeSky;
        this.minY = options.minY;
        this.minX = options.minX;
        this.minZ = options.minZ;
        this.maxY = options.maxY;
        this.maxX = options.maxX;
        this.maxZ = options.maxZ;
        this.minLight = options.minLight;
        this.maxLight = options.maxLight;
        this.minSkyLight = options.minSkyLight;
        this.maxSkyLight = options.maxSkyLight;
        this.timeRange = options.timeRange;
        this.isRaining = options.isRaining;
        this.isThundering = options.isThundering;
        this.isSlimeChunk = options.isSlimeChunk;
        this.labels = options.labels;
        this.labelMode = options.labelMode;

        this.minWidth = options.minWidth;
        this.maxWidth = options.maxWidth;
        this.minLength = options.minLength;
        this.maxLength = options.maxLength;
        this.neededNearbyBlocks = options.neededNearbyBlocks;
        this.neededBaseBlocks = options.neededBaseBlocks;

        this.minDepth = options.minDepth;
        this.maxDepth = options.maxDepth;
        this.fluidIsSource = options.fluidIsSource;
        this.fluid = options.fluid;

        this.minLureLevel = options.minLureLevel;
        this.maxLureLevel = options.maxLureLevel;
        this.bobber = options.bobber;
        this.bait = options.bait;
    }
}