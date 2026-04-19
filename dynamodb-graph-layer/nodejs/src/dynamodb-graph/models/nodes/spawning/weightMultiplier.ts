import { SK } from "../../dynamo";

export interface SpawnWeightMultiplier {
    multiplier: number;
    conditionSK?: SK;
    anticonditionSK?: SK;
}