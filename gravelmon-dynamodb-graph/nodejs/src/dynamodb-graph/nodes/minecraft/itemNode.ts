import { DynamoNode } from '../../service/dynamoNodes';
import { ResourceLocation } from '../../models/minecraft/resourceLocation';
import { deserializerRegistry } from '../../service/deserializerRegistry';

export const ItemEntity = "Item";

export class ItemNode extends DynamoNode {
    resourceLocation: ResourceLocation;
    s3TextureLocation?: string;
    isPlaceable: boolean = false;
    inBattleEffect?: string;
    constructor(resourceLocation: ResourceLocation, isPlaceable: boolean, s3TextureLocation?: string, inBattleEffect?: string) {
        super(ItemEntity, resourceLocation.toString());
        this.resourceLocation = resourceLocation;
        this.s3TextureLocation = s3TextureLocation;
        this.isPlaceable = isPlaceable;
        this.inBattleEffect = inBattleEffect;
    }

    static deserialize(data: Record<string, any>): ItemNode {
        if(!data.resourceLocation) {
            throw new Error("Invalid data for deserializing ItemNode: missing resourceLocation");
        }
        return new ItemNode(ResourceLocation.deserialize(data.resourceLocation), data.isPlaceable, data.s3TextureLocation, data.inBattleEffect);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            resourceLocation: this.resourceLocation.serialize(),
            isPlaceable: this.isPlaceable,
            s3TextureLocation: this.s3TextureLocation,
            inBattleEffect: this.inBattleEffect
        }   
    }
}

export function createItemNode(resourceLocation: ResourceLocation, isPlaceable: boolean = false,
    s3TextureLocation: string = "", inBattleEffect: string = ""): ItemNode {
    return new ItemNode(resourceLocation, isPlaceable, s3TextureLocation, inBattleEffect);
}

deserializerRegistry.register(ItemEntity, ItemNode.deserialize);