import { DynamoEdge, DynamoNode } from '../../dynamo';
import { PokemonIdentifier } from '../pokemon';
import { getNodePK } from '../../dynamo';
import { NumberRange } from '../properties/numberRange';
import { RidingBehaviourOptions } from './riding';

export const BehaviourEntity = "Behaviour";
export enum Time {
    Day ="day",
    Night = "night",
    Dawn = "dawn",
    Dusk = "dusk"
}

export enum SleepDepth {
    Normal = "normal",
    Comatose = "comatose"
}

type SleepTime = Time | NumberRange | SleepTime[];

export const ToleratedLeaderEdgeType = "ToleratedLeader";
export const CanSleepDuringEdgeType = "CanSleepDuring";
export const SeatOffsetEdgeType = "SeatOffset";

export function createBehaviourNode(pokemon: PokemonIdentifier, options: BehaviourOptions = {}): DynamoNode {
    return new BehaviourNode(pokemon.toString(), options);
}

export function createToleratedLeaderEdge(behaviourName: string, leader: PokemonIdentifier, tier: number): DynamoEdge {
    return new ToleratedLeaderEdge(behaviourName, leader.toString(), tier);
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
    times?: SleepTime[];
    biomes?: string[];
}

export interface BehaviourSocialOptions {
    maxHerdSize?: number;
    willDefendOwner?: boolean;
    willDefendSelf?: boolean;
    willFlee?: boolean;
}

export interface BehaviourOptions {
    movement?: BehaviourMovementOptions;
    aquatic?: BehaviourAquaticOptions;
    sleep?: BehaviourSleepOptions;
    social?: BehaviourSocialOptions;
    riding?: RidingBehaviourOptions;
}

class BehaviourNode extends DynamoNode {
    behaviourOptions: BehaviourOptions;

    constructor(name: string, options: BehaviourOptions = {}) {
        super(BehaviourEntity, name);
        this.behaviourOptions = options;
    }
}

class ToleratedLeaderEdge extends DynamoEdge {
    tier: number;

    constructor(pokemon: string, leader: string, tier: number) {
        super(getNodePK(BehaviourEntity, pokemon), ToleratedLeaderEdgeType, BehaviourEntity, leader);
        this.tier = tier;
    }
}