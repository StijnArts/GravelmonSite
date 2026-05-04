package drai.dev.data.migration.dto.properties;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;

import java.util.*;

public abstract class AspectDTO implements JsonSerializable {
    public enum AspectType {
        FLAG,
        CHOICE
    }

    public sealed interface DefaultOption
            permits BooleanOption, StringOption {
        JsonElement toJson();
    }

    public record BooleanOption(boolean value) implements DefaultOption {
        @Override
        public JsonElement toJson() {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("value", value);
            return jsonObject;
        }
    }

    public record StringOption(String value) implements DefaultOption {
        @Override
        public JsonElement toJson() {
            JsonObject jsonObject = new JsonObject();
            Optional.ofNullable(value).ifPresent(v -> jsonObject.addProperty("value", v));
            return jsonObject;
        }
    }

    private final String name;
    private final AspectType aspectType;
    private final boolean isPrimaryAspect;
    private final String introducedByGame;
    private final long lastEdited;

    protected AspectDTO(
            String name,
            AspectType aspectType,
            boolean isPrimaryAspect,
            String introducedByGame,
            long lastEdited
    ) {
        this.name = name;
        this.aspectType = aspectType;
        this.isPrimaryAspect = isPrimaryAspect;
        this.introducedByGame = introducedByGame;
        this.lastEdited = lastEdited;
    }

    @Override
    public JsonElement toJson() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("name", name);
        jsonObject.addProperty("aspectType", aspectType.name());
        jsonObject.addProperty("isAspect", true);
        jsonObject.addProperty("isPrimaryAspect", isPrimaryAspect);
        jsonObject.addProperty("introducedByGame", introducedByGame);
        jsonObject.addProperty("lastEdited", lastEdited);
        return jsonObject;
    }

    public static class FlagAspectDTO extends AspectDTO {
        public FlagAspectDTO(
                String name,
                boolean defaultValue,
                boolean isPrimaryAspect,
                String introducedByGame,
                long lastEdited
        ) {
            super(
                    name,
                    AspectType.FLAG,
                    isPrimaryAspect,
                    introducedByGame,
                    lastEdited
            );
        }

        @Override
        public JsonElement toJson() {
            return super.toJson();
        }
    }

    public class ChoiceAspectDTO extends AspectDTO {

        private List<String> choices;
        private DefaultOption defaultValue; // or "random"

        public ChoiceAspectDTO(
                String name,
                List<String> choices,
                DefaultOption defaultValue,
                boolean isPrimaryAspect,
                String introducedByGame,
                long lastEdited
        ) {
            super(
                    name,
                    AspectType.CHOICE,
                    isPrimaryAspect,
                    introducedByGame,
                    lastEdited
            );
            this.choices = choices;
            this.defaultValue = defaultValue;
        }

        @Override
        public JsonElement toJson() {
            JsonObject jsonObject = (JsonObject) super.toJson();
            Optional.ofNullable(choices).ifPresent(c -> {
                jsonObject.add("choices", getJsonMapper().toJsonTree(c));
            });
            Optional.ofNullable(defaultValue).ifPresent(d -> jsonObject.add("defaultValue", d.toJson()));
            return jsonObject;
        }
    }
}
