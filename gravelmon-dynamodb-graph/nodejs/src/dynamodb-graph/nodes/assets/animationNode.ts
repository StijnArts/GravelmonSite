import { PoseType } from "../../models/assets/posing/poseType";
import { ConditionalAnimation } from "../../models/assets/posing/posingFileData";
import { deserializerRegistry } from "../../service/deserializerRegistry";
import { PK, DynamoNode } from "../../service/dynamoNodes";

export const AnimationEntity = "Animation";

export type Animation = PK | ConditionalAnimation | string

export function serializeAnimation(animation: Animation): any {
    if (isConditionalAnimation(animation)) {
        return {
            conditionExpression: animation.conditionExpression,
            name: animation.name,
            animation: animation.animation
        }
    } else return animation;
}

export function deserializeAnimation(data: any): Animation {
    if (typeof data === "string") {
        return data;
    }

    if (isConditionalAnimation(data)) {
        return {
            conditionExpression: data.conditionExpression,
            name: data.name,
            animation: data.animation
        };
    }

    throw new Error(`Invalid Animation data: ${JSON.stringify(data)}`);
}

function isConditionalAnimation(value: any): value is ConditionalAnimation {
    return (
        value &&
        typeof value === "object" &&
        typeof value.conditionExpression === "string" &&
        typeof value.name === "string" &&
        typeof value.animation === "string"
    );
}

type PrimaryPoseType = PoseType | "BattleAnimation" | "Other";

class AnimationNode extends DynamoNode {
    primaryPoseType?: PrimaryPoseType;
    constructor(name: string, primaryPoseType: PrimaryPoseType) {
        super(AnimationEntity, "animations");
        this.primaryPoseType = primaryPoseType;
        this.SK = "Animation#" + name + "";
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            primaryPoseType: this.primaryPoseType
        }
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        return new AnimationNode(data.SK.replace("Animation#", ""), data.primaryPoseType);
    }
}

export function createAnimationNode(name: string, primaryPoseType: PrimaryPoseType = "Other"): AnimationNode {
    return new AnimationNode(name, primaryPoseType);
}

deserializerRegistry.register(AnimationEntity, AnimationNode.deserialize);