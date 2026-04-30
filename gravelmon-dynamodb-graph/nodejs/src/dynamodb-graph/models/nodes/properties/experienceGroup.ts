import { DynamoNode } from '../../dynamoNodes';

export const ExperienceGroupEntity = "ExperienceGroup";
export const InExperienceGroupEdgeType = "InExperienceGroup";

export function createExperienceGroupNode(name: string): DynamoNode {
    return new DynamoNode(ExperienceGroupEntity, name);
}