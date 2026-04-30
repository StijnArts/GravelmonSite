import { PoseType } from "../../models/assets/posing/poseType";
import { ConditionalAnimation } from "../../models/assets/posing/posingFileData";
import { PK, DynamoNode } from "../../service/dynamoNodes";

export const AnimationEntity = "Animation";

export type Animation = PK | ConditionalAnimation | string

type PrimaryPoseType = PoseType | "BattleAnimation" | "Other";

class AnimationNode extends DynamoNode {
    primaryPoseType?: PrimaryPoseType;
    constructor(name: string, primaryPoseType: PrimaryPoseType) {
        super(AnimationEntity, "animations");
        this.primaryPoseType = primaryPoseType;
        this.SK = "Animation#" + name + "";
    }
}

export function createAnimationNode(name: string, primaryPoseType: PrimaryPoseType = "Other"): AnimationNode {
    return new AnimationNode(name, primaryPoseType);
}