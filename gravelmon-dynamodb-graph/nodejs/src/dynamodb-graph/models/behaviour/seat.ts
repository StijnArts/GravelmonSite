import { deserializeVector, serializeVector, Vector } from '../properties/vector';
import { PoseType } from '../assets/posing/poseType';

export type SeatPoseOffsets = {
    offset: Vector;
    poseTypes: PoseType[];
}
export type Seat = {
    offset: Vector;
    poseOffsets: SeatPoseOffsets[];
}

export function serializeSeat(seat: Seat): Record<string, any> {
    return {
        offset: serializeVector(seat.offset),
        poseOffsets: seat.poseOffsets.map(po => ({
            offset: serializeVector(po.offset),
            poseTypes: po.poseTypes
        }))
    };
}

export function deserializeSeat(data: any): Seat {
    return {
        offset: deserializeVector(data.offset),
        poseOffsets: data.poseOffsets.map((po: any) => ({
            offset: deserializeVector(po.offset),
            poseTypes: po.poseTypes
        }))
    };
}