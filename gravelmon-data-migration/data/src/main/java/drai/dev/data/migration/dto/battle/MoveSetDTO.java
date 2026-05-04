package drai.dev.data.migration.dto.battle;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.service.*;

import javax.annotation.*;
import java.util.*;

public record MoveSetDTO(List<LevelUpEntry> levelUpMoves, List<MoveSetEntry> teachMoves, List<MoveSetEntry> eggMoves,
                         List<MoveSetEntry> legacyMoves) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("levelUpMoves", MigrationUtil.listToJsonArray(levelUpMoves, LevelUpEntry::toJson));
        json.add("teachMoves", MigrationUtil.listToJsonArray(teachMoves, MoveSetEntry::toJson));
        json.add("eggMoves", MigrationUtil.listToJsonArray(eggMoves, MoveSetEntry::toJson));
        json.add("legacyMoves", MigrationUtil.listToJsonArray(legacyMoves, MoveSetEntry::toJson));
        return json;
    }

    public enum MoveSetLearnType {
        LevelUp("LevelUp"),
        Teach("Teach"),
        Egg("Egg"),
        Legacy("Legacy");

        private final String name;

        MoveSetLearnType(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public record MoveSetEntry(MoveDTO.MoveIdentifier moveName, MoveDTO.MoveCategory category, int basePower,
                               int accuracy, String type,
                               Optional<Integer> rebalancedBasePower, Optional<Integer> rebalancedAccuracy,
                               @Nullable String rebalancedType) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("moveName", moveName.toJson());
            json.add("category", category.toJson());
            json.addProperty("basePower", basePower);
            json.addProperty("accuracy", accuracy);
            json.addProperty("type", type);
            rebalancedBasePower.ifPresent(integer -> json.addProperty("rebalancedBasePower", integer));
            rebalancedAccuracy.ifPresent(integer -> json.addProperty("rebalancedAccuracy", integer));
            if (rebalancedType != null) json.addProperty("rebalancedType", rebalancedType);
            return json;
        }
    }

    public record LevelUpEntry(List<MoveSetEntry> moves, int level) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("moves", MigrationUtil.listToJsonArray(moves, MoveSetEntry::toJson));
            json.addProperty("level", level);
            return json;
        }
    }
}
