import { DynamoNode } from '../../dynamo';

export const ExperienceGroupEntity = "ExperienceGroup";

export function createExperienceGroupNode(name: string): DynamoNode {
    return new DynamoNode(ExperienceGroupEntity, name);
}