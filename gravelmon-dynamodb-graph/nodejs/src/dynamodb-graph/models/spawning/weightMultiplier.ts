import { SK } from "../../service/dynamoNodes";

export interface SpawnWeightMultiplier {
    multiplier: number;
    conditionSK?: SK;
    anticonditionSK?: SK;
}