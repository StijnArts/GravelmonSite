import { PK } from "../../dynamoNodes";
import { NumberRange } from "../properties/numberRange";
import { Seat } from "./seat";

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
    PlayForPassengers?: boolean;
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