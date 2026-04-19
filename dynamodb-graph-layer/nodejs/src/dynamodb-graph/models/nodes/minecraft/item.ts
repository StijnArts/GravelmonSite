import { DynamoNode } from '../../dynamo';
import { ResourceLocation } from './resourceLocation';

export const ItemEntity = "Item";

class ItemNode extends DynamoNode {
    resourceLocation: ResourceLocation;
    s3TextureLocation?: string;
    isPlaceable?: boolean;
    constructor(resourceLocation: ResourceLocation, isPlaceable: boolean, s3TextureLocation?: string) {
        super(ItemEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
        this.s3TextureLocation = s3TextureLocation;
        this.isPlaceable = isPlaceable;
    }
}

export function createItemNode(resourceLocation: ResourceLocation, 
    s3TextureLocation?: string, isPlaceable: boolean = false): ItemNode {
    return new ItemNode(resourceLocation, isPlaceable, s3TextureLocation);
}