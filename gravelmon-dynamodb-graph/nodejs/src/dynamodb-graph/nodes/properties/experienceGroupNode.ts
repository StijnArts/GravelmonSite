import { DynamoNode } from '../../service/dynamoNodes';

export const ExperienceGroupEntity = "ExperienceGroup";
export const InExperienceGroupEdgeType = "InExperienceGroup";

const version = 1;

export function createExperienceGroupNode(name: string, lastEdited: number = Date.now()): DynamoNode {
    return new DynamoNode(ExperienceGroupEntity, name, version, lastEdited);
}