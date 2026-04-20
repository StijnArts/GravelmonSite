import { Vector } from '../properties/vector';
import { PoseType } from '../assets/posing/poseType';

export type SeatPoseOffsets = {
    offset: Vector;
    poseTypes: PoseType[];
}
export type Seat = {
    offset: Vector;
    poseOffsets: SeatPoseOffsets[];
}