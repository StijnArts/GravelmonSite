import { ResourceLocation } from "../minecraft/resourceLocation";
import { PokemonIdentifier } from "../../nodes/pokemon/pokemonNode";
import { deserializeTimeRange, isTimeRange, serializeTimeRange, TimeRange } from "./time";
import { MoveIdentifier } from "../../nodes";

export enum EvolutionConditionType {
    LEVEL,
    TIME,
    RATIO,
    HAS_MOVE,
    HELD_ITEM,
    PROPERTY,
    GENDER,
    FRIENDSHIP,
    PARTY_MEMBER,
    PARTY_MEMBER_OF_TYPE,
    BIOME,
    WEATHER,
    BLOCKS_TRAVELED,
}

export enum StatRatio {
    DEFENCE_HIGHER,
    ATTACK_HIGHER,
    EQUAL
}

export enum Gender {
    MALE = "male",
    FEMALE = "female"
}

export abstract class EvolutionCondition {
    name: string;
    condition: string;
    value: string | number | boolean | ResourceLocation | TimeRange | StatRatio | Gender | PokemonIdentifier | MoveIdentifier;
    type: EvolutionConditionType;

    constructor(name: string, type: EvolutionConditionType, condition: string, value: any) {
        this.name = name;
        this.type = type;
        this.condition = condition;
        this.value = value;
    }

    serialize(): Record<string, any> {
        return {
            name: this.name,
            type: this.type,
            condition: this.condition,
            value: this.serializeValue()
        }
    }

    private serializeValue(): any {
        if (this.value instanceof ResourceLocation) {
            return this.value.serialize();
        }
        if (this.value instanceof PokemonIdentifier) {
            return this.value.serialize();
        }
        if (this.value instanceof MoveIdentifier) {
            return this.value.serialize();
        }
        if (isTimeRange(this.value)) {
            return serializeTimeRange(this.value);
        }
        return this.value;
    }

    private static deserializeValue(type: EvolutionConditionType, value: any): any {
        if (type === EvolutionConditionType.HELD_ITEM) {
            return ResourceLocation.deserialize(value);
        } else if (type === EvolutionConditionType.PARTY_MEMBER) {
            return PokemonIdentifier.deserialize(value);
        } else if (type === EvolutionConditionType.TIME) {
            return deserializeTimeRange(value);
        }
        return value;
    }

    static deserialize(data: any): EvolutionCondition {
        const evolutionConditionData = { 
            name: data.name,
            type: data.type,
            condition: data.condition,
            value: this.deserializeValue(data.type, data.value) 
        };

        switch (evolutionConditionData.type) {
            case EvolutionConditionType.LEVEL:
                return new LevelCondition(evolutionConditionData.value as number);
            case EvolutionConditionType.TIME:
                return new TimeCondition(evolutionConditionData.value as TimeRange);
            case EvolutionConditionType.RATIO:
                return new RatioCondition(evolutionConditionData.value as StatRatio);
            case EvolutionConditionType.HAS_MOVE:
                return new HasMoveCondition(MoveIdentifier.deserialize(evolutionConditionData.value));
            case EvolutionConditionType.HELD_ITEM:
                return new HeldItemCondition(ResourceLocation.deserialize(evolutionConditionData.value));
            case EvolutionConditionType.FRIENDSHIP:
                return new FriendshipCondition(evolutionConditionData.value as number);
            case EvolutionConditionType.GENDER:
                return new GenderCondition(evolutionConditionData.value as Gender);
            case EvolutionConditionType.PARTY_MEMBER:
                return new PartyMemberPokemonCondition(PokemonIdentifier.deserialize(evolutionConditionData.value));  
            case EvolutionConditionType.PARTY_MEMBER_OF_TYPE:
                return new PartyMemberTypeCondition(evolutionConditionData.value as string);
            case EvolutionConditionType.BIOME:
                return new BiomeCondition(evolutionConditionData.value as ResourceLocation);
            case EvolutionConditionType.WEATHER:
                const { isRaining, isThundering } = evolutionConditionData.value as { isRaining: boolean, isThundering: boolean };
                return isRaining ? new RainingCondition(true) : new ThunderCondition(isThundering);
            case EvolutionConditionType.BLOCKS_TRAVELED:
                return new BlocksTraveledCondition(evolutionConditionData.value as number);
            default:
                throw new Error(`Unsupported EvolutionConditionType: ${evolutionConditionData.type}`);
        }
    }
}

export class LevelCondition extends EvolutionCondition {
    constructor(value: number) {
        super("level", EvolutionConditionType.LEVEL, "minLevel", value);
    }
}

export class TimeCondition extends EvolutionCondition {
    constructor(value: TimeRange) {
        super("time_range", EvolutionConditionType.TIME, "range", value);
    }

    serialize(): Record<string, any> {
        return {
            name: this.name,
            type: this.type,
            condition: this.condition,
            value: serializeTimeRange(this.value as TimeRange)
        }
    }
}

export class RatioCondition extends EvolutionCondition {
    constructor(value: StatRatio) {
        super("attack_defence_ratio", EvolutionConditionType.RATIO, "ratio", value);
    }
}

export class HasMoveCondition extends EvolutionCondition {
    constructor(value: MoveIdentifier) {
        super("has_move", EvolutionConditionType.HAS_MOVE, "move", value);
    }
}

export class HeldItemCondition extends EvolutionCondition {
    constructor(value: ResourceLocation) {
        super("held_item", EvolutionConditionType.HELD_ITEM, "itemCondition", value);
    }

    serialize(): Record<string, any> {
        return {
            name: this.name,
            type: this.type,
            condition: this.condition,
            value: this.value instanceof ResourceLocation ? this.value.serialize() : this.value
        }
    }
}

export abstract class PropertyCondition extends EvolutionCondition {
    property: string;
    constructor(evolutionConditionType: EvolutionConditionType, property: string, value: any) {
        super("properties", evolutionConditionType, "target", value);
        this.property = property;
    }

    serialize(): Record<string, any> {
        return {
            name: this.name,
            type: this.type,
            property: this.property,
            condition: this.condition,
            value: this.value instanceof ResourceLocation ? this.value.serialize() : this.value
        }
    }
}

export class GenderCondition extends PropertyCondition {
    constructor(value: Gender) {
        super(EvolutionConditionType.GENDER, "gender=", value);
    }
}

export class FriendshipCondition extends EvolutionCondition {
    constructor(value: number) {
        super("friendship", EvolutionConditionType.FRIENDSHIP, "amount", value);
    }
}

export abstract class PartyMemberCondition extends EvolutionCondition {
    property: string;
    constructor(evolutionConditionType: EvolutionConditionType,property: string, value: any) {
        super("party_member", evolutionConditionType, "target", value);
        this.property = property;
    }
}

export class PartyMemberPokemonCondition extends PartyMemberCondition {
    constructor(value: PokemonIdentifier) {
        super(EvolutionConditionType.PARTY_MEMBER, "", value);
    }
}

export class PartyMemberTypeCondition extends PartyMemberCondition {
    constructor(value: string) {
        super(EvolutionConditionType.PARTY_MEMBER_OF_TYPE, "type=", value);
    }
}

export class BiomeCondition extends EvolutionCondition {
    constructor(value: ResourceLocation) {
        super("biome", EvolutionConditionType.BIOME, "biomeCondition", value);
    }
}

export class RainingCondition extends EvolutionCondition {
    constructor(value: boolean) {
        super("weather", EvolutionConditionType.WEATHER, "isRaining", value);
    }
}

export class ThunderCondition extends EvolutionCondition {
    constructor(value: boolean) {
        super("weather", EvolutionConditionType.WEATHER, "isThundering", value);
    }
}

export class BlocksTraveledCondition extends EvolutionCondition {
    constructor(value: number) {
        super("blocks_traveled", EvolutionConditionType.BLOCKS_TRAVELED, "amount", value);
    }
}
