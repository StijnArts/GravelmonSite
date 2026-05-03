package drai.dev.data.migration.dto.pokemon;

import drai.dev.data.migration.dto.battle.*;
import kotlin.ranges.*;
import net.minecraft.resources.*;
import org.apache.tinkerpop.shaded.jackson.annotation.*;

import java.util.*;

public abstract class EvolutionConditionDTO {

    public enum Time {
        Day("day"),
        Night("night"),
        Dawn("dawn"),
        Dusk("dusk");

        private final String name;
        Time(String name) {
            this.name = name;
        }
        public String getName() { return name; }
    }

    @JsonTypeInfo(
            use = JsonTypeInfo.Id.NAME,
            property = "type"
    )
    @JsonSubTypes({
            @JsonSubTypes.Type(value = SingleTime.class, name = "time"),
            @JsonSubTypes.Type(value = RangeTime.class, name = "range"),
            @JsonSubTypes.Type(value = ListTime.class, name = "list")
    })
    public sealed interface TimeRangeDTO
            permits SingleTime, RangeTime, ListTime {
    }

    public record SingleTime(Time value) implements TimeRangeDTO {
    }

    public record RangeTime(IntRange value) implements TimeRangeDTO {
    }

    public record ListTime(List<TimeRangeDTO> value) implements TimeRangeDTO {
    }

    private String name;
    private EvolutionDTO.EvolutionConditionType type;
    private String condition;

    public EvolutionConditionDTO(String name, EvolutionDTO.EvolutionConditionType type, String condition) {
        this.name = name;
        this.type = type;
        this.condition = condition;
    }

    public String getName() { return name; }
    public EvolutionDTO.EvolutionConditionType getType() { return type; }
    public String getCondition() { return condition; }

    public static class TimeConditionDTO extends EvolutionConditionDTO {

        private TimeRangeDTO value;

        public TimeConditionDTO(TimeRangeDTO value) {
            super("time_range", EvolutionDTO.EvolutionConditionType.TIME, "range");
            this.value = value;
        }

        public TimeRangeDTO getValue() { return value; }
    }

    public static class RatioConditionDTO extends EvolutionConditionDTO {

        private EvolutionDTO.StatRatio value;

        public RatioConditionDTO(EvolutionDTO.StatRatio value) {
            super("attack_defence_ratio", EvolutionDTO.EvolutionConditionType.RATIO, "ratio");
            this.value = value;
        }

        public EvolutionDTO.StatRatio getValue() { return value; }
    }

    public static class HasMoveConditionDTO extends EvolutionConditionDTO {

        private MoveDTO.MoveIdentifier move;

        public HasMoveConditionDTO(MoveDTO.MoveIdentifier move) {
            super("has_move", EvolutionDTO.EvolutionConditionType.HAS_MOVE, "move");
            this.move = move;
        }

        public MoveDTO.MoveIdentifier getMove() { return move; }
    }

    public static class HeldItemConditionDTO extends EvolutionConditionDTO {

        private ResourceLocation value;

        public HeldItemConditionDTO(ResourceLocation value) {
            super("held_item", EvolutionDTO.EvolutionConditionType.HELD_ITEM, "itemCondition");
            this.value = value;
        }

        public ResourceLocation getValue() { return value; }
    }

    public abstract class PropertyConditionDTO extends EvolutionConditionDTO {

        private String property;
        private Object value;

        public PropertyConditionDTO(EvolutionDTO.EvolutionConditionType type, String property, Object value) {
            super("properties", type, "target");
            this.property = property;
            this.value = value;
        }

        public String getProperty() { return property; }
        public Object getValue() { return value; }
    }

    public class GenderConditionDTO extends PropertyConditionDTO {

        public GenderConditionDTO(EvolutionDTO.Gender value) {
            super(EvolutionDTO.EvolutionConditionType.GENDER, "gender=", value);
        }
    }

    public class FriendshipConditionDTO extends EvolutionConditionDTO {

        private int value;

        public FriendshipConditionDTO(int value) {
            super("friendship", EvolutionDTO.EvolutionConditionType.FRIENDSHIP, "amount");
            this.value = value;
        }

        public int getValue() { return value; }
    }

    public abstract class PartyMemberConditionDTO extends EvolutionConditionDTO {

        private String property;
        private Object value;

        public PartyMemberConditionDTO(EvolutionDTO.EvolutionConditionType type, String property, Object value) {
            super("party_member", type, "target");
            this.property = property;
            this.value = value;
        }

        public String getProperty() { return property; }
        public Object getValue() { return value; }
    }

    public class PartyMemberPokemonConditionDTO extends PartyMemberConditionDTO {

        public PartyMemberPokemonConditionDTO(PokemonDTO.PokemonIdentifier value) {
            super(EvolutionDTO.EvolutionConditionType.PARTY_MEMBER, "", value);
        }
    }

    public class PartyMemberTypeConditionDTO extends PartyMemberConditionDTO {

        public PartyMemberTypeConditionDTO(String value) {
            super(EvolutionDTO.EvolutionConditionType.PARTY_MEMBER_OF_TYPE, "type=", value);
        }
    }

    public class BiomeConditionDTO extends EvolutionConditionDTO {

        private ResourceLocation value;

        public BiomeConditionDTO(ResourceLocation value) {
            super("biome", EvolutionDTO.EvolutionConditionType.BIOME, "biomeCondition");
            this.value = value;
        }

        public ResourceLocation getValue() { return value; }
    }

    public class RainingConditionDTO extends EvolutionConditionDTO {

        private boolean isRaining;

        public RainingConditionDTO(boolean isRaining) {
            super("weather", EvolutionDTO.EvolutionConditionType.WEATHER, "isRaining");
            this.isRaining = isRaining;
        }

        public boolean isRaining() { return isRaining; }
    }

    public class ThunderConditionDTO extends EvolutionConditionDTO {

        private boolean isThundering;

        public ThunderConditionDTO(boolean isThundering) {
            super("weather", EvolutionDTO.EvolutionConditionType.WEATHER, "isThundering");
            this.isThundering = isThundering;
        }

        public boolean isThundering() { return isThundering; }
    }

    public class BlocksTraveledConditionDTO extends EvolutionConditionDTO {

        private int value;

        public BlocksTraveledConditionDTO(int value) {
            super("blocks_traveled", EvolutionDTO.EvolutionConditionType.BLOCKS_TRAVELED, "amount");
            this.value = value;
        }

        public int getValue() { return value; }
    }
}
