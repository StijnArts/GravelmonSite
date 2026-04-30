import { DynamoEdge, DynamoNode, getNodePK } from '../../dynamoNodes';
import {BehaviourEntity} from "../behaviour/behaviour";

export const SoundEntity = "Sound";

export const SoundUsedByEdgeType = "UsedBy";

class SoundNode extends DynamoNode {
    s3Location?: string;
    madeBy: string;
    constructor(name: string, madeBy: string, s3Location?: string) {
        super(SoundEntity, name);
        this.s3Location = s3Location;
        this.madeBy = madeBy;
    }
}

export function createSoundNode(name: string, madeBy: string = "Unknown", s3Location?: string): SoundNode {
    return new SoundNode(name, madeBy, s3Location);
}

export function createSoundUsedByBehaviourEdge(soundName: string, user: string): DynamoEdge {
    return new DynamoEdge(getNodePK(SoundEntity, soundName), SoundUsedByEdgeType, BehaviourEntity, user);
}