import { PK } from "../../service/dynamoNodes";
import { NumberRange } from "../properties/numberRange";
import { deserializeSeat, Seat, serializeSeat } from "./seat";

export enum RidingKey {
    Standard,
    Vehicle,
    Boat,
    Submarine,
    Dolphin,
    Bird,
    Jet,
    UFO,
    Rocket
}

export type RidingStats = {
    ACCELERATION: NumberRange;
    JUMP: NumberRange;
    SKILL: NumberRange;
    SPEED: NumberRange;
    STAMINA: NumberRange;
}

export type RideSound = {
    muffleEnabled?: boolean;
    pitchExpression: string;
    playForNonPassengers?: boolean;
    playForPassengers?: boolean;
    SoundPK: PK;
    volumeExpression: string;
    submerged?: boolean;
}

export type RidingBehaviour = {
    key: RidingKey;
    stats: RidingStats;
    rideSounds: RideSound
}

export interface RidingBehaviourOptions {
    airRidingBehaviour?: RidingBehaviour
    landRidingBehaviour?: RidingBehaviour
    liquidRidingBehaviour?: RidingBehaviour
    seats: Seat[];
}

function serializeRidingBehaviour(behaviour: RidingBehaviour): any {
    return {
        key: behaviour.key,
        stats: serializeRidingStats(behaviour.stats),
        rideSounds: {
            muffleEnabled: behaviour.rideSounds.muffleEnabled,
            pitchExpression: behaviour.rideSounds.pitchExpression,
            playForNonPassengers: behaviour.rideSounds.playForNonPassengers,
            playForPassengers: behaviour.rideSounds.playForPassengers,
            SoundPK: behaviour.rideSounds.SoundPK,
            volumeExpression: behaviour.rideSounds.volumeExpression,
            submerged: behaviour.rideSounds.submerged
        }
    };
}

function deserializeRidingBehaviour(data: any): RidingBehaviour {
    return {
        key: data.key,
        stats: deserializeRidingStats(data.stats),
        rideSounds: {
            muffleEnabled: data.rideSounds.muffleEnabled,
            pitchExpression: data.rideSounds.pitchExpression,
            playForNonPassengers: data.rideSounds.playForNonPassengers,
            playForPassengers: data.rideSounds.playForPassengers,
            SoundPK: data.rideSounds.SoundPK,
            volumeExpression: data.rideSounds.volumeExpression,
            submerged: data.rideSounds.submerged
        }
    };
}

export function serializeRidingBehaviourOptions(options: RidingBehaviourOptions): any {
    return {
        airRidingBehaviour: options.airRidingBehaviour ? serializeRidingBehaviour(options.airRidingBehaviour) : undefined,
        landRidingBehaviour: options.landRidingBehaviour ? serializeRidingBehaviour(options.landRidingBehaviour) : undefined,
        liquidRidingBehaviour: options.liquidRidingBehaviour ? serializeRidingBehaviour(options.liquidRidingBehaviour) : undefined,
        seats: options.seats.map(seat => serializeSeat(seat))
    };
}

function serializeRidingStats(stats: RidingStats): any {
    return {
        ACCELERATION: stats.ACCELERATION.serialize(),
        JUMP: stats.JUMP.serialize(),
        SKILL: stats.SKILL.serialize(),
        SPEED: stats.SPEED.serialize(),
        STAMINA: stats.STAMINA.serialize()
    };
}

function deserializeRidingStats(data: any): RidingStats {
    return {
        ACCELERATION: new NumberRange(data.ACCELERATION.min, data.ACCELERATION.max),
        JUMP: new NumberRange(data.JUMP.min, data.JUMP.max),
        SKILL: new NumberRange(data.SKILL.min, data.SKILL.max),
        SPEED: new NumberRange(data.SPEED.min, data.SPEED.max),
        STAMINA: new NumberRange(data.STAMINA.min, data.STAMINA.max)
    }
}

export function deserializeRidingBehaviourOptions(data: any): RidingBehaviourOptions {
    return {
        airRidingBehaviour: data.airRidingBehaviour ? deserializeRidingBehaviour(data.airRidingBehaviour) : undefined,
        landRidingBehaviour: data.landRidingBehaviour ? deserializeRidingBehaviour(data.landRidingBehaviour) : undefined,
        liquidRidingBehaviour: data.liquidRidingBehaviour ? deserializeRidingBehaviour(data.liquidRidingBehaviour) : undefined,
        seats: data.seats.map((seatData: any) => deserializeSeat(seatData))
    }
}