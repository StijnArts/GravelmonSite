import { vector } from '../properties/vector';
import { PoseType } from '../assets/poseType';

export type SeatPoseOffsets = {
    offset: vector;
    poseTypes: PoseType[];
}
export type Seat = {
    offset: vector;
    poseOffsets: SeatPoseOffsets[];
}