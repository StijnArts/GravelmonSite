export type Vector = {
    x: number;
    y: number;
    z: number;
}

export function serializeVector(vector: Vector): Record<string, any> {
    return {
        x: vector.x,
        y: vector.y,
        z: vector.z
    };
}

export function deserializeVector(data: any): Vector {
    return {
        x: data.x,
        y: data.y,
        z: data.z
    };
}