import {DynamoEdge, DynamoNode, getNodePK} from '../../service/dynamoNodes';
import {ResourceLocation} from "../../models/minecraft/resourceLocation";
import {ItemEntity} from "../minecraft/itemNode";
import {PokemonIdentifier} from "../pokemon/pokemonNode";
import {FormEntity} from "../pokemon/formNode";
import {deserializerRegistry} from "../../service/deserializerRegistry";

export const MechanicEntity = "Mechanic";

export const UsesItemEdgeType = "UsesItem";
export const AffectsFormEdgeType = "AffectsForm";

export class MechanicNode extends DynamoNode {
    description?: string;
    usesItems?: ResourceLocation[];
    affectsForms?: PokemonIdentifier[];

    constructor(name: string, description?: string, usesItems?: ResourceLocation[], affectsForms?: PokemonIdentifier[]) {
        super(MechanicEntity, name);
        this.description = description;
        this.usesItems = usesItems;
        this.affectsForms = affectsForms;
    }

    static deserialize(data: Record<string, any>): DynamoNode {
        return new MechanicNode(data.name, data.description,
            data.usesItems ? data.usesItems.map((item: any)=>ResourceLocation.deserialize(item)) : undefined,
            data.affectsForms ? data.affectsForms.map((item: any)=>PokemonIdentifier.deserialize(item)) : undefined);
    }

    public serialize(): Record<string, any> {
        return {
            ...super.serialize(),
            description: this.description ? this.description : undefined,
            usesItems: this.usesItems ? this.usesItems.map((item)=> item.serialize()) : undefined,
            affectsForms: this.affectsForms ? this.affectsForms.map((item)=> item.serialize()) : undefined
        }
    }
}

export function createMechanicNode(name: string, description?: string, usesItems?: ResourceLocation[], affectsForms?: PokemonIdentifier[]): MechanicNode {
    return new MechanicNode(name, description, usesItems, affectsForms);
}

//This is not supposed to point towards the mega evolution in case of the mega evolution mechanic, but the base form
export function createMechanicAffectsFormEdge(mechanicName: string, pokemonIdentifier: PokemonIdentifier) : DynamoEdge {
    return new DynamoEdge(getNodePK(FormEntity, pokemonIdentifier.toString()), AffectsFormEdgeType, MechanicEntity, mechanicName);
}

export function createMechanicUsesItemEdge(mechanicName: string, item: ResourceLocation) : DynamoEdge {
    return new DynamoEdge(getNodePK(ItemEntity, item.toString()), AffectsFormEdgeType, MechanicEntity, mechanicName);
}

deserializerRegistry.register(MechanicEntity, MechanicNode.deserialize);