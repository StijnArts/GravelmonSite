package drai.dev.data.migration.dto.battle;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.service.*;
import kotlin.*;

import javax.annotation.*;
import java.util.*;

public record MoveDTO(MoveIdentifier moveIdentifier, MoveData moveData, @Nullable MoveData rebalancedMoveData,
                      List<String> moveLabels) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("moveIdentifier", moveIdentifier.toJson());
        json.add("moveData", moveData.toJson());
        if(rebalancedMoveData != null) json.add("rebalancedMoveData", rebalancedMoveData.toJson());
        var labelsArray = new JsonArray();
        moveLabels.forEach(labelsArray::add);
        json.add("moveLabels", labelsArray);
        return json;
    }

    public record MoveIdentifier(String game, String name) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("game", game);
            json.addProperty("name", name);
            return json;
        }
    }

    public record MoveType(String type, boolean isRebalanced) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("type", type);
            json.addProperty("isRebalanced", isRebalanced);
            return json;
        }
    }

    public enum MoveCategory implements JsonSerializable {
        Physical,
        Special,
        Status;

        @Override
        public JsonElement toJson() {
            return new JsonPrimitive(this.name());
        }
    }

    public enum MoveRange implements JsonSerializable {
        SingleTarget,
        Self,
        SingleAlly,
        AllPokemon,
        AllAllies,
        AllOpponents,
        RandomOpponent,
        EntireField,
        OpponentSide,
        UserSide,
        Varies;

        @Override
        public JsonElement toJson() {
            return new JsonPrimitive(this.name());
        }
    }

    public record MoveData(
            Pair<MoveType, MoveType> moveTypes,
            int powerPoints,
            int basePower,
            int priority,
            int accuracy,
            MoveRange moveRange,
            MoveCategory moveCategory,
            @Nullable String description,
            @Nullable String zMoveEffect,
            Map<String, Integer> typeGemCost,
            @Nullable List<String> associatedWeathers,
            @Nullable List<String> associatedTerrain,
            @Nullable List<String> associatedFieldEffects
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            var moveTypesJson = new JsonArray();
            moveTypesJson.add(moveTypes.getFirst().toJson());
            moveTypesJson.add(moveTypes.getSecond().toJson());
            json.add("moveTypes", moveTypesJson);
            json.addProperty("powerPoints", powerPoints);
            json.addProperty("basePower", basePower);
            json.addProperty("priority", priority);
            json.addProperty("accuracy", accuracy);
            json.add("moveRange", moveRange.toJson());
            json.add("moveCategory", moveCategory.toJson());
            if(description != null && !description.isBlank()) json.addProperty("description", description);
            if(zMoveEffect != null && !zMoveEffect.isBlank()) json.addProperty("zMoveEffect", zMoveEffect);

            json.add("typeGemCost", MigrationUtil.mapToJsonArray(typeGemCost, JsonPrimitive::new, JsonPrimitive::new));

            if (associatedWeathers != null)
                json.add("associatedWeathers", MigrationUtil.listToJsonArray(associatedWeathers, JsonPrimitive::new));

            if (associatedTerrain != null)
                json.add("associatedTerrain", MigrationUtil.listToJsonArray(associatedTerrain, JsonPrimitive::new));

            if (associatedFieldEffects != null)
                json.add("associatedFieldEffects", MigrationUtil.listToJsonArray(associatedFieldEffects, JsonPrimitive::new));

            return json;
        }
    }
}
