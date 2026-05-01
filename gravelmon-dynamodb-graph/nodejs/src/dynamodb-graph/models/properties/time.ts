import { NumberRange } from "./numberRange";

export enum Time {
    Day = "day",
    Night = "night",
    Dawn = "dawn",
    Dusk = "dusk"
}

export type TimeRange =
    | { type: "time"; value: Time }
    | { type: "range"; value: NumberRange }
    | { type: "list"; value: TimeRange[] };

export function serializeTimeRange(value: TimeRange): any {
    switch (value.type) {
        case "time": return value.value;
        case "range": return value.value.serialize();
        case "list": return value.value.map(serializeTimeRange);
    }
}

export function isTimeRange(value: any): value is TimeRange {
    return (
        value &&
        typeof value === "object" &&
        "type" in value &&
        ["time", "range", "list"].includes(value.type)
    );
}

export function deserializeTimeRange(value: any): TimeRange {
    if (!value) {
        throw new Error("Invalid TimeRange: value is null/undefined");
    }

    if (Array.isArray(value)) {
        return {
            type: "list",
            value: value.map(deserializeTimeRange)
        };
    }

    if (typeof value === "object" && "min" in value && "max" in value) {
        return {
            type: "range",
            value: NumberRange.deserialize(value)
        };
    }

    if (typeof value === "string") {
        if (!Object.values(Time).includes(value as Time)) {
            throw new Error(`Invalid Time value: ${value}`);
        }

        return {
            type: "time",
            value: value as Time
        };
    }

    throw new Error(`Unknown TimeRange format: ${JSON.stringify(value)}`);
}