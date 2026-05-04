package drai.dev.data.migration.dto.pokemon;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.battle.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;
import org.apache.commons.lang3.*;
import org.apache.tinkerpop.shaded.jackson.annotation.*;

import java.util.*;

public abstract class EvolutionConditionDTO implements JsonSerializable {

    @Override
    public JsonElement toJson() {
        JsonObject json = new JsonObject();
        json.addProperty("name", getName());
        json.addProperty("type", getType().name());
        json.addProperty("condition", getCondition());
        
        return json;
    }

    public enum Time {
        Day("day"),
        Night("night"),
        Dawn("dawn"),
        Dusk("dusk");

        private final String name;

        Time(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
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
    public sealed interface TimeRangeDTO extends JsonSerializable
            permits SingleTime, RangeTime, ListTime {
    }

    public record SingleTime(Time value) implements TimeRangeDTO {
        @Override
        public JsonElement toJson() {
            JsonObject json = new JsonObject();
            json.addProperty("type", "time");
            if (value != null) {
                json.addProperty("value", value.getName());
            }
            return json;
        }
    }

    public record RangeTime(IntegerRange value) implements TimeRangeDTO {
        @Override
        public JsonElement toJson() {
            JsonObject json = new JsonObject();
            json.addProperty("type", "range");
            if (value != null) {
                json.add("value", MigrationUtil.rangeToJson(value));
            }
            return json;
        }
    }

    public record ListTime(List<TimeRangeDTO> value) implements TimeRangeDTO {
        @Override
        public JsonElement toJson() {
            JsonObject json = new JsonObject();
            json.addProperty("type", "list");
            if (value != null) {
                json.add("value", MigrationUtil.listToJsonArray(value, TimeRangeDTO::toJson));
            }
            return json;
        }
    }

    private String name;
    private EvolutionDTO.EvolutionConditionType type;
    private String condition;

    public EvolutionConditionDTO(String name, EvolutionDTO.EvolutionConditionType type, String condition) {
        this.name = name;
        this.type = type;
        this.condition = condition;
    }

    public String getName() {
        return name;
    }

    public EvolutionDTO.EvolutionConditionType getType() {
        return type;
    }

    public String getCondition() {
        return condition;
    }

    public static class LevelConditionDTO extends EvolutionConditionDTO {

        private int value;

        public LevelConditionDTO(int value) {
            super("level", EvolutionDTO.EvolutionConditionType.LEVEL, "minLevel");
            this.value = value;
        }

        public int getValue() {
            return value;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            json.addProperty("value", value);
            return json;
        }
    }

    public static class TimeConditionDTO extends EvolutionConditionDTO {

        private TimeRangeDTO value;

        public TimeConditionDTO(TimeRangeDTO value) {
            super("time_range", EvolutionDTO.EvolutionConditionType.TIME, "range");
            this.value = value;
        }

        public TimeRangeDTO getValue() {
            return value;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            if (value != null) {
                json.add("value", value.toJson());
            }
            return json;
        }
    }

    public static class RatioConditionDTO extends EvolutionConditionDTO {

        private EvolutionDTO.StatRatio value;

        public RatioConditionDTO(EvolutionDTO.StatRatio value) {
            super("attack_defence_ratio", EvolutionDTO.EvolutionConditionType.RATIO, "ratio");
            this.value = value;
        }

        public EvolutionDTO.StatRatio getValue() {
            return value;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            if (value != null) {
                json.addProperty("value", value.name());
            }
            return json;
        }
    }

    public static class HasMoveConditionDTO extends EvolutionConditionDTO {

        private MoveDTO.MoveIdentifier move;

        public HasMoveConditionDTO(MoveDTO.MoveIdentifier move) {
            super("has_move", EvolutionDTO.EvolutionConditionType.HAS_MOVE, "move");
            this.move = move;
        }

        public MoveDTO.MoveIdentifier getMove() {
            return move;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            if (move != null) {
                json.add("move", move.toJson());
            }
            return json;
        }
    }

    public static class HeldItemConditionDTO extends EvolutionConditionDTO {

        private ResourceLocation value;

        public HeldItemConditionDTO(ResourceLocation value) {
            super("held_item", EvolutionDTO.EvolutionConditionType.HELD_ITEM, "itemCondition");
            this.value = value;
        }

        public ResourceLocation getValue() {
            return value;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            if (value != null) {
                json.addProperty("value", value.toString());
            }
            return json;
        }
    }

    public abstract static class PropertyConditionDTO<T> extends EvolutionConditionDTO {

        private String property;
        protected T value;

        public PropertyConditionDTO(EvolutionDTO.EvolutionConditionType type, String property, T value) {
            super("properties", type, "target");
            this.property = property;
            this.value = value;
        }

        public String getProperty() {
            return property;
        }

        public T getValue() {
            return value;
        }
    }

    public static class GenderConditionDTO extends PropertyConditionDTO<EvolutionDTO.Gender> {

        public GenderConditionDTO(EvolutionDTO.Gender value) {
            super(EvolutionDTO.EvolutionConditionType.GENDER, "gender=", value);
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            if (value != null) {
                json.addProperty("value", value.toString());
            }
            return json;
        }
    }

    public static class FriendshipConditionDTO extends EvolutionConditionDTO {

        private int value;

        public FriendshipConditionDTO(int value) {
            super("friendship", EvolutionDTO.EvolutionConditionType.FRIENDSHIP, "amount");
            this.value = value;
        }

        public int getValue() {
            return value;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            json.addProperty("value", value);
            return json;
        }
    }

    public static abstract class PartyMemberConditionDTO<T> extends EvolutionConditionDTO {

        private String property;
        protected T value;

        public PartyMemberConditionDTO(EvolutionDTO.EvolutionConditionType type, String property, T value) {
            super("party_member", type, "target");
            this.property = property;
            this.value = value;
        }

        public String getProperty() {
            return property;
        }

        public T getValue() {
            return value;
        }
    }

    public static class PartyMemberPokemonConditionDTO extends PartyMemberConditionDTO<PokemonDTO.PokemonIdentifier> {

        public PartyMemberPokemonConditionDTO(PokemonDTO.PokemonIdentifier value) {
            super(EvolutionDTO.EvolutionConditionType.PARTY_MEMBER, "", value);
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            json.add("value", value.toJson());
            return json;
        }
    }

    public static class PartyMemberTypeConditionDTO extends PartyMemberConditionDTO<String> {

        public PartyMemberTypeConditionDTO(String value) {
            super(EvolutionDTO.EvolutionConditionType.PARTY_MEMBER_OF_TYPE, "type=", value);
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            json.addProperty("value", value);
            return json;
        }
    }

    public static class BiomeConditionDTO extends EvolutionConditionDTO {

        private final ResourceLocation value;

        public BiomeConditionDTO(ResourceLocation value) {
            super("biome", EvolutionDTO.EvolutionConditionType.BIOME, "biomeCondition");
            this.value = value;
        }

        public ResourceLocation getValue() {
            return value;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            if (value != null) {
                json.add("value", MigrationUtil.resourceLocationToJson(value));
            }
            return json;
        }
    }

    public static class RainingConditionDTO extends EvolutionConditionDTO {

        private final boolean isRaining;

        public RainingConditionDTO(boolean isRaining) {
            super("weather", EvolutionDTO.EvolutionConditionType.WEATHER, "isRaining");
            this.isRaining = isRaining;
        }

        public boolean isRaining() {
            return isRaining;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            json.addProperty("isRaining", isRaining);
            return json;
        }
    }

    public static class ThunderConditionDTO extends EvolutionConditionDTO {

        private final boolean isThundering;

        public ThunderConditionDTO(boolean isThundering) {
            super("weather", EvolutionDTO.EvolutionConditionType.WEATHER, "isThundering");
            this.isThundering = isThundering;
        }

        public boolean isThundering() {
            return isThundering;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            json.addProperty("isThundering", isThundering);
            return json;
        }
    }

    public static class BlocksTraveledConditionDTO extends EvolutionConditionDTO {

        private final int value;

        public BlocksTraveledConditionDTO(int value) {
            super("blocks_traveled", EvolutionDTO.EvolutionConditionType.BLOCKS_TRAVELED, "amount");
            this.value = value;
        }

        public int getValue() {
            return value;
        }

        @Override
        public JsonElement toJson() {
            var json = (JsonObject)super.toJson();
            json.addProperty("value", value);
            return json;
        }
    }
}
