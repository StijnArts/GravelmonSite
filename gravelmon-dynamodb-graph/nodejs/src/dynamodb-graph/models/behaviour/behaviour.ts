import { PokemonIdentifier } from '../../nodes/pokemon/pokemonNode';
import { NumberRange } from '../properties/numberRange';
import { deserializeRidingBehaviourOptions, RidingBehaviourOptions as BehaviourRidingOptions, serializeRidingBehaviourOptions } from './riding';
import { deserializeTimeRange, serializeTimeRange, TimeRange } from '../properties/time';

export enum SleepDepth {
    Normal = "normal",
    Comatose = "comatose"
}

export interface BehaviourMovementOptions {
    canLookAround?: boolean;
    looksAtEntities?: boolean;
    canWalk?: boolean;
    stepHeight?: number; //not used yet
    canFly?: boolean;
    canWalkOnWater?: boolean;
    canWalkOnLava?: boolean;
    walkSpeed?: number;
    flySpeedHorizontal?: number;
    wanderChance?: number;
    wanderSpeed?: number;
}

export interface BehaviourAquaticOptions {
    avoidsLand?: boolean;
    canSwimInWater?: boolean;
    canSwimInLava?: boolean;
    canBreatheUnderwater?: boolean;
    canBreatheUnderlava?: boolean;
    hurtByLava?: boolean;
    swimSpeed?: number;
}

export interface BehaviourSleepOptions {
    canSleep?: boolean;
    willSleepOnBed?: boolean;
    sleepLightLevel?: NumberRange;
    drowsyChance?: number;
    depth?: SleepDepth;
    times?: TimeRange[];
    biomes?: string[];
}

export interface HerdData {
    tier: number;
    leaderEntityType: PokemonIdentifier;
}

export interface BehaviorHerdingOptions {
    maxHerdSize: number;
    herdData: HerdData[];
}

export interface CombatBehaviourOptions {
    willDefendOwner?: boolean;
    willDefendSelf?: boolean;
    willFlee?: boolean;
}

export interface BehaviourOptions {
    movement?: BehaviourMovementOptions;
    aquatic?: BehaviourAquaticOptions;
    sleep?: BehaviourSleepOptions;
    herd?: BehaviorHerdingOptions;
    riding?: BehaviourRidingOptions;
}

export function serializeBehaviourOptions(options: BehaviourOptions): any {
    return {
        movement: options.movement ? {
            ...options.movement
        } : undefined,
        aquatic: options.aquatic ? {
            ...options.aquatic
        } : undefined,
        sleep: options.sleep ? { 
            canSleep: options.sleep?.canSleep,
            willSleepOnBed: options.sleep?.willSleepOnBed,
            sleepLightLevel: options.sleep?.sleepLightLevel ? options.sleep.sleepLightLevel.serialize() : undefined,
            drowsyChance: options.sleep?.drowsyChance,
            depth: options.sleep?.depth,
            times: options.sleep?.times ? options.sleep.times.map((t) => serializeTimeRange(t)) : undefined,
            biomes: options.sleep?.biomes
        }: undefined,
        herd: options.herd ? {
            maxHerdSize: options.herd?.maxHerdSize,
            herdData: options.herd?.herdData.map(h => ({ 
                tier: h.tier,
                leaderEntityType: h.leaderEntityType.serialize()
             })) 
        } : undefined,
        riding: options.riding ? serializeRidingBehaviourOptions(options.riding) : undefined
    }
}

export function deserializeBehaviourOptions(data: any): BehaviourOptions {
    return {
        movement: data.movement ? {
            ...data.movement
        } : undefined,
        aquatic: data.aquatic ? {
            ...data.aquatic
        } : undefined,
        sleep: data.sleep ? {
            canSleep: data.sleep.canSleep,
            willSleepOnBed: data.sleep.willSleepOnBed,
            sleepLightLevel: data.sleep.sleepLightLevel ? NumberRange.deserialize(data.sleep.sleepLightLevel) : undefined,
            drowsyChance: data.sleep.drowsyChance,
            depth: data.sleep.depth,
            times: data.sleep.times ? data.sleep.times.map((t: any) => deserializeTimeRange(t)) : undefined,
            biomes: data.sleep.biomes
        } : undefined,
        herd: data.herd ? {
            maxHerdSize: data.herd.maxHerdSize,
            herdData: data.herd.herdData.map((h: any) => ({
                tier: h.tier,
                leaderEntityType: PokemonIdentifier.deserialize(h.leaderEntityType)
            }))
        } : undefined,
        riding: data.riding ? deserializeRidingBehaviourOptions(data.riding) : undefined
    }
}