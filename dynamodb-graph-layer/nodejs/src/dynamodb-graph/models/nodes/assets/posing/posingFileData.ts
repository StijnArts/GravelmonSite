import {DynamoEdge, DynamoNode, getNodePK, SK} from '../../../dynamo';
import {PokemonIdentifier} from "../../pokemon";
import {AspectEntity} from "../../properties/aspect";
import {FormEntity} from "../../form";
import {Vector} from "../../properties/vector";
import {PoseType} from "./poseType";
import {NumberRange} from "../../properties/numberRange";
import {Animation} from "./animation";

export const PosingDataEntity = "PosingData";

export const PosingForAspectEdgeType = "PosingForAspect";
export const PosingForFormEdgeType = "PosingForForm";
export const OverridesPosingDataEdgeType = "Overrides";

export function createPosingForAspectEdge(pokemonIdentifier: PokemonIdentifier, aspect: string): DynamoEdge {
    return new DynamoEdge(getNodePK(PosingDataEntity, pokemonIdentifier.toString()), PosingForAspectEdgeType, AspectEntity, aspect);
}

export function createPosingForFormEdge(pokemonIdentifier: PokemonIdentifier, formIdentifier: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(PosingDataEntity, pokemonIdentifier.toString()), PosingForFormEdgeType, FormEntity, formIdentifier.toString());
}

export function createPosingDataOverridesPosingDataEdge(pokemonIdentifier: PokemonIdentifier, overriddenPosingData: PokemonIdentifier): DynamoEdge {
    return new DynamoEdge(getNodePK(PosingDataEntity, pokemonIdentifier.toString()), OverridesPosingDataEdgeType, PosingDataEntity, overriddenPosingData.toString());
}

export function createPosingDataNode(name: PokemonIdentifier, posingFileOptions: PosingFileOptions): PosingDataNode {
    return new PosingDataNode(name, posingFileOptions);
}

export interface Quirk {
    loopTimes?: number;
    occurrenceRange: NumberRange;
    curveExpression: string;
    animation: SK;
    isPrimary?: boolean;
}

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

export interface PoseAnimation{
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

}

class PosingDataNode extends DynamoNode {
    //texturename, model name and poser name will all be solved programmatically
    posingFileOptions: PosingFileOptions;
    constructor(name: PokemonIdentifier, posingFileOptions: PosingFileOptions) {
        super(PosingDataEntity, name.toString());
        this.posingFileOptions = posingFileOptions;
    }
}