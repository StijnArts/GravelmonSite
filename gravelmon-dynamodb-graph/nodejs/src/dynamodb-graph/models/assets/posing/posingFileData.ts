import {SK} from '../../../service/dynamoNodes';
import {PokemonIdentifier} from "../../../nodes/pokemon/pokemonNode";
import {deserializeVector, serializeVector, Vector} from "../../properties/vector";
import {PoseType} from "./poseType";
import {NumberRange} from "../../properties/numberRange";
import {Animation, deserializeAnimation, serializeAnimation} from '../../../nodes/assets/animationNode';

export const PosingDataEntity = "PosingData";

export const PosingForAspectEdgeType = "PosingForAspect";
export const PosingForFormEdgeType = "PosingForForm";
export const OverridesPosingDataEdgeType = "Overrides";

export enum NamedAnimationTypes {
    Cry = "cry",
    Recoil = "recoil",
    Status = "status",
    Special = "special",
    Physical = "Physical",
    Faint = "faint",
    AirSpecial = "air_special",
    AirPhysical = "air_physical",
    AirStatus = "air_status",
}

export interface NamedAnimation {
    animationExpression: string;
    name: NamedAnimationTypes;
    animation: SK;
}

export interface ConditionalAnimation {
    conditionExpression: string;
    name: NamedAnimationTypes;
    animation: SK;
}

export interface TransformedPart {
    isVisible?: boolean
    rotation?: Vector;
    position?: Vector;
    part: string;
}

export interface Quirk {
    loopTimes?: number;
    occurrenceRange: NumberRange;
    curveExpression: string;
    animation: SK;
    isPrimary?: boolean;
}

export interface PoseAnimation {
    name: string;
    isBattle?: boolean;
    isTouchingWater?: boolean;
    isUnderWater?: boolean;
    conditionExpression?: string;
    allPoseTypes?: boolean;
    pose: PoseType
    transformedParts?: TransformedPart[];
    quirks?: Quirk[];
    namedAnimations?: NamedAnimation[];
    animations: Animation[]
    transformTicks?: number;
    transformToTicks?: number;
}

function serializePoseAnimation(poseAnimation: PoseAnimation) {
    return {
        name: poseAnimation.name,
        isBattle: poseAnimation.isBattle,
        isTouchingWater: poseAnimation.isTouchingWater,
        isUnderWater: poseAnimation.isUnderWater,
        conditionExpression: poseAnimation.conditionExpression,
        allPoseTypes: poseAnimation.allPoseTypes,
        pose: poseAnimation.pose,
        transformedParts: poseAnimation.transformedParts ?
            poseAnimation.transformedParts.map(transformedPart => ({
                isVisible: transformedPart.isVisible,
                rotation: transformedPart.rotation ? serializeVector(transformedPart.rotation) : undefined,
                position: transformedPart.position ? serializeVector(transformedPart.position) : undefined,
                part: transformedPart.part,
            })) : undefined,
        quirks: poseAnimation.quirks ? poseAnimation.quirks.map(quirk => ({
            loopTimes: quirk.loopTimes,
            occurrenceRange: quirk.occurrenceRange.serialize(),
            curveExpression: quirk.curveExpression,
            animation: quirk.animation,
            isPrimary: quirk.isPrimary,
        })) : undefined,
        namedAnimations: poseAnimation.namedAnimations ?
            poseAnimation.namedAnimations.map(namedAnimation => ({
                animationExpression: namedAnimation.animationExpression,
                name: namedAnimation.name,
                animation: namedAnimation.animation,
            })) : undefined,
        animations: poseAnimation.animations ?
            poseAnimation.animations.map(animation => serializeAnimation(animation))
            : undefined,
        transformTicks: poseAnimation.transformTicks,
        transformToTicks: poseAnimation.transformToTicks,
    }
}

function deserializePoseAnimation(data: any): PoseAnimation {
    return {
        name: data.name,
        isBattle: data.isBattle,
        isTouchingWater: data.isTouchingWater,
        isUnderWater: data.isUnderWater,
        conditionExpression: data.conditionExpression,
        allPoseTypes: data.allPoseTypes,
        pose: data.pose,
        transformedParts: data.transformedParts
            ? data.transformedParts.map((tp: any) => ({
                isVisible: tp.isVisible,
                rotation: tp.rotation ? deserializeVector(tp.rotation) : undefined,
                position: tp.position ? deserializeVector(tp.position) : undefined,
                part: tp.part,
            }))
            : undefined,
        quirks: data.quirks
            ? data.quirks.map((q: any) => ({
                loopTimes: q.loopTimes,
                occurrenceRange: NumberRange.deserialize(q.occurrenceRange),
                curveExpression: q.curveExpression,
                animation: q.animation, // assuming already correct type (string / PK)
                isPrimary: q.isPrimary,
            }))
            : undefined,
        namedAnimations: data.namedAnimations
            ? data.namedAnimations.map((na: any) => ({
                animationExpression: na.animationExpression,
                name: na.name,
                animation: na.animation,
            }))
            : undefined,
        animations: data.animations
            ? data.animations.map((a: any) => deserializeAnimation(a))
            : undefined,
        transformTicks: data.transformTicks,
        transformToTicks: data.transformToTicks,
    };
}

export interface CameraOffset {
    firstPersonCameraOffset: Vector;
    thirdPersonCameraOffset: Vector;
    thirdPersonCameraOffsetNoViewBobbing: Vector;
    seatName: string;
}

export interface PosingFileOptions {
    profileScale: number;
    profileCoords: Vector;
    portraitScale: number;
    portraitCoords: Vector;
    headBone?: string;
    rootBone: string;
    cameraOffsets?: CameraOffset[];
    poseAnimations: PoseAnimation[];
    globalAnimations?: NamedAnimation[];
    overridesPosingData?: PokemonIdentifier;
}

export interface PosingData {
    posingFileOptions: PosingFileOptions;
}

export function serializePosingData(data: PosingData): Record<string, any> {
    return {
        posingFileOptions: {
            profileScale: data.posingFileOptions.profileScale,
            profileCoords: serializeVector(data.posingFileOptions.profileCoords),
            portraitScale: data.posingFileOptions.portraitScale,
            portraitCoords: serializeVector(data.posingFileOptions.portraitCoords),
            headBone: data.posingFileOptions.headBone,
            rootBone: data.posingFileOptions.rootBone,
            cameraOffsets: data.posingFileOptions.cameraOffsets ? data.posingFileOptions.cameraOffsets.map(cameraOffset => ({
                firstPersonCameraOffset: serializeVector(cameraOffset.firstPersonCameraOffset),
                thirdPersonCameraOffset: serializeVector(cameraOffset.thirdPersonCameraOffset),
                thirdPersonCameraOffsetNoViewBobbing: serializeVector(cameraOffset.thirdPersonCameraOffsetNoViewBobbing),
                seatName: cameraOffset.seatName,
            })) : undefined,
            poseAnimations: data.posingFileOptions.poseAnimations ?
                data.posingFileOptions.poseAnimations.map(poseAnimation => serializePoseAnimation(poseAnimation))
                : undefined,
            globalAnimations: data.posingFileOptions.globalAnimations ? data.posingFileOptions.globalAnimations.map(globalAnimation => ({
                animationExpression: globalAnimation.animationExpression,
                name: globalAnimation.name,
                animation: globalAnimation.animation,
            })) : undefined,
            overridesPosingData: data.posingFileOptions.overridesPosingData?.serialize(),
        }
    }
}

export function deserializePosingData(data: any): PosingData {
    const opts = data.posingFileOptions;

    if (!opts || typeof opts !== "object") {
        throw new Error("Invalid PosingData: missing posingFileOptions");
    }

    return {
        posingFileOptions: {
            profileScale: opts.profileScale,
            profileCoords: deserializeVector(opts.profileCoords),
            portraitScale: opts.portraitScale,
            portraitCoords: deserializeVector(opts.portraitCoords),
            headBone: opts.headBone,
            rootBone: opts.rootBone,

            cameraOffsets: opts.cameraOffsets
                ? opts.cameraOffsets.map((co: any) => ({
                    firstPersonCameraOffset: deserializeVector(co.firstPersonCameraOffset),
                    thirdPersonCameraOffset: deserializeVector(co.thirdPersonCameraOffset),
                    thirdPersonCameraOffsetNoViewBobbing: deserializeVector(
                        co.thirdPersonCameraOffsetNoViewBobbing
                    ),
                    seatName: co.seatName,
                }))
                : undefined,

            poseAnimations: opts.poseAnimations
                ? opts.poseAnimations.map((pa: any) =>
                    deserializePoseAnimation(pa)
                )
                : undefined,

            globalAnimations: opts.globalAnimations
                ? opts.globalAnimations.map((ga: any) => ({
                    animationExpression: ga.animationExpression,
                    name: ga.name,
                    animation: deserializeAnimation(ga.animation),
                }))
                : undefined,

            overridesPosingData: opts.overridesPosingData
                ? PokemonIdentifier.deserialize(opts.overridesPosingData)
                : undefined,
        },
    };
}