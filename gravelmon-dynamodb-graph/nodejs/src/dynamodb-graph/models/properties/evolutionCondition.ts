import { ResourceLocation } from "../minecraft/resourceLocation";
import { PokemonIdentifier } from "../../nodes/pokemon/pokemonNode";
import { TimeRange } from "./time";

export enum EvolutionConditionType {
    LEVEL,
    TIME,
    RATIO,
    HAS_MOVE,
    HELD_ITEM,
    PROPERTY,
    FRIENDSHIP,
    PARTY_MEMBER,
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
    value: any;
    type: EvolutionConditionType;

    constructor(name: string, type: EvolutionConditionType, condition: string, value: any) {
        this.name = name;
        this.type = type;
        this.condition = condition;
        this.value = value;
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
}

export class RatioCondition extends EvolutionCondition {
    constructor(value: StatRatio) {
        super("attack_defence_ratio", EvolutionConditionType.RATIO, "ratio", value);
    }
}

export class HasMoveCondition extends EvolutionCondition {
    constructor(value: string) {
        super("has_move", EvolutionConditionType.HAS_MOVE, "move", value);
    }
}

export class HeldItemCondition extends EvolutionCondition {
    constructor(value: ResourceLocation) {
        super("held_item", EvolutionConditionType.HELD_ITEM, "itemCondition", value);
    }
}

export abstract class PropertyCondition extends EvolutionCondition {
    property: string;
    constructor(property: string, value: any) {
        super("properties", EvolutionConditionType.PROPERTY, "target", value);
        this.property = property;
    }
}

export class GenderCondition extends PropertyCondition {
    constructor(value: Gender) {
        super("gender=", value);
    }
}

export class FriendshipCondition extends EvolutionCondition {
    constructor(value: number) {
        super("friendship", EvolutionConditionType.FRIENDSHIP, "amount", value);
    }
}

export abstract class PartyMemberCondition extends EvolutionCondition {
    property: string;
    constructor(property: string, value: any) {
        super("party_member", EvolutionConditionType.PARTY_MEMBER, "target", value);
        this.property = property;
    }
}

export class PartyMemberPokemonCondition extends PartyMemberCondition {
    constructor(value: PokemonIdentifier) {
        super("", value);
    }
}

export class PartyMemberTypeCondition extends PartyMemberCondition {
    constructor(value: string) {
        super("type=", value);
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
