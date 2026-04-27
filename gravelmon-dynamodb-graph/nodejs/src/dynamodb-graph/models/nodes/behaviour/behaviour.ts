import { DynamoEdge, DynamoNode, getPkName } from '../../dynamo';
import { PokemonIdentifier, PokemonEntity } from '../pokemon';
import { getNodePK } from '../../dynamo';
import { NumberRange } from '../properties/numberRange';
import { RidingBehaviourOptions } from './riding';
import { FormEntity } from '../form';
import { TimeRange } from '../properties/time';

export const BehaviourEntity = "Behaviour";

export enum SleepDepth {
    Normal = "normal",
    Comatose = "comatose"
}

export const ToleratedLeaderEdgeType = "ToleratedLeader";
export const CanSleepDuringEdgeType = "CanSleepDuring";
export const SeatOffsetEdgeType = "SeatOffset";

export function createBehaviourNode(pokemon: PokemonIdentifier, options: BehaviourOptions = {}): DynamoNode {
    return new BehaviourNode(pokemon.toString(), options);
}

export function createToleratedLeaderFormEdge(behaviourName: string, leader: PokemonIdentifier, tier: number): DynamoEdge {
    return new ToleratedLeaderEdge(behaviourName, leader.toString(), FormEntity, tier);
}

export function createToleratedLeaderPokemonEdge(behaviourName: string, leader: PokemonIdentifier, tier: number): DynamoEdge {
    return new ToleratedLeaderEdge(behaviourName, leader.toString(), PokemonEntity, tier);
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
    leaderEntityType: string;

    constructor(source: string, target: string, targetEntityType: string, tier: number, isReverseEdge: boolean = false) {
        super(
            getNodePK(
                isReverseEdge ? 
                targetEntityType :
                BehaviourEntity, source),
            ToleratedLeaderEdgeType, 
            isReverseEdge ? BehaviourEntity : targetEntityType, 
            target,
            isReverseEdge);
        this.tier = tier;
        this.leaderEntityType = targetEntityType;
    }

    static getEntityType(leader: PokemonIdentifier): string {
        if (leader.isForm()) {
            return FormEntity;
        }
        return PokemonEntity;
    }

    reverseEdge(): DynamoEdge {
        return new ToleratedLeaderEdge(
            getPkName(this.Target), getPkName(this.PK), 
            this.leaderEntityType, this.tier, !this.isReverseEdge()
        );
    }
}