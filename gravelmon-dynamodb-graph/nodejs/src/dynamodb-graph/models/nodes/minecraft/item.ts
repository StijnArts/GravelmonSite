import { DynamoNode } from '../../dynamoNodes';
import { ResourceLocation } from './resourceLocation';

export const ItemEntity = "Item";

class ItemNode extends DynamoNode {
    resourceLocation: ResourceLocation;
    s3TextureLocation?: string;
    isPlaceable: boolean;
    inBattleEffect?: string;
    constructor(resourceLocation: ResourceLocation, isPlaceable: boolean, s3TextureLocation?: string, inBattleEffect?: string) {
        super(ItemEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
        this.s3TextureLocation = s3TextureLocation;
        this.isPlaceable = isPlaceable;
        this.inBattleEffect = inBattleEffect;
    }
}

export function createItemNode(resourceLocation: ResourceLocation, isPlaceable: boolean = false,
    s3TextureLocation: string = "", inBattleEffect: string = ""): ItemNode {
    return new ItemNode(resourceLocation, isPlaceable, s3TextureLocation, inBattleEffect);
}