import { SK } from "../../dynamoNodes";

export interface SpawnWeightMultiplier {
    multiplier: number;
    conditionSK?: SK;
    anticonditionSK?: SK;
}