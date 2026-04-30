import { PokemonIdentifier } from '../../nodes/pokemon/pokemonNode';
import { NumberRange } from '../properties/numberRange';
import { RidingBehaviourOptions } from './riding';
import { TimeRange } from '../properties/time';

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
    riding?: RidingBehaviourOptions;
}

export interface HerdData {
    tier: number;
    leaderEntityType: PokemonIdentifier;
}