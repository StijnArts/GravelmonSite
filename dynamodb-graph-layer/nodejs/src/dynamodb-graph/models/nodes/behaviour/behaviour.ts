import { DynamoEdge, DynamoNode, getPkName } from '../../dynamo';
import { PokemonIdentifier, PokemonEntity } from '../pokemon';
import { getNodePK } from '../../dynamo';
import { NumberRange } from '../properties/numberRange';
import { RidingBehaviourOptions } from './riding';
import { FormEntity } from '../form';

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

export function createToleratedLeaderEdge(behaviourName: string, leader: string, tier: number): DynamoEdge {
    return new ToleratedLeaderEdge(behaviourName, leader, tier);
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

    constructor(pokemon: string, leader: string, tier: number, isReverseEdge: boolean = false) {
        super(getNodePK(isReverseEdge ? ToleratedLeaderEdge.getEntityType(PokemonIdentifier.fromString(leader)) : BehaviourEntity, pokemon),
            ToleratedLeaderEdgeType, 
            isReverseEdge ? BehaviourEntity : ToleratedLeaderEdge.getEntityType(PokemonIdentifier.fromString(leader)), 
            leader,
            isReverseEdge);
        this.tier = tier;
    }

    static getEntityType(leader: PokemonIdentifier): string {
        if (leader.isForm()) {
            return FormEntity;
        }
        return PokemonEntity;
    }

    reverseEdge(): DynamoEdge {
        return new ToleratedLeaderEdge(getPkName(this.Target), getPkName(this.PK), this.tier, !this.isReverseEdge());
    }
}