import { NumberRange } from "./numberRange";

export enum Time {
    Day ="day",
    Night = "night",
    Dawn = "dawn",
    Dusk = "dusk"
}
export type TimeRange = Time | NumberRange | TimeRange[];