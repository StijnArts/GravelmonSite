package drai.dev.data.migration.dto.spawning;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.pokemon.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;
import org.apache.commons.lang3.*;

import javax.annotation.*;
import java.util.*;

public record SpawnDataDTO(
        IntegerRange levelRange,
        SpawnType spawnType,
        double spawnWeight,
        SpawnablePositionType spawnablePositionTypes,
        SpawnBucket spawnBucket,

        Optional<Double> moonPhaseMultiplier,
        Optional<Double> weightMultiplier,

        Optional<Integer> maxHerdSize,
        Optional<Integer> minDistanceBetweenSpawns,

        @Nullable SpawnPresetDTO.SpawnConditionOptions condition,
        @Nullable SpawnPresetDTO.SpawnConditionOptions antiCondition,

        List<HerdSpawnEntry> herdSpawnEntries,

        List<ResourceLocation> preferredBlocks,
        List<ResourceLocation> requiredBlocks) implements JsonSerializable {

    @Override
    public JsonElement toJson() {
        var json = new JsonObject();

        json.add("levelRange", MigrationUtil.rangeToJson(levelRange));
        json.addProperty("spawnType", spawnType.getName());
        json.addProperty("spawnWeight", spawnWeight);
        json.addProperty("spawnablePositionTypes", spawnablePositionTypes.getName());
        json.addProperty("spawnBucket", spawnBucket.getName());

        moonPhaseMultiplier.ifPresent(value -> json.addProperty("moonPhaseMultiplier", value));
        weightMultiplier.ifPresent(value -> json.addProperty("weightMultiplier", value));

        maxHerdSize.ifPresent(value -> json.addProperty("maxHerdSize", value));
        minDistanceBetweenSpawns.ifPresent(value -> json.addProperty("minDistanceBetweenSpawns", value));

        if (condition != null) json.add("condition", condition.toJson());
        if (antiCondition != null) json.add("antiCondition", antiCondition.toJson());

        json.add("herdSpawnEntries", MigrationUtil.listToJsonArray(herdSpawnEntries, HerdSpawnEntry::toJson));
        json.add("preferredBlocks", MigrationUtil.listToJsonArray(preferredBlocks, MigrationUtil::resourceLocationToJson));
        json.add("requiredBlocks", MigrationUtil.listToJsonArray(requiredBlocks, MigrationUtil::resourceLocationToJson));

        return json;
    }

    public enum SpawnType {
        Pokemon("pokemon"),
        Pokemon_Herd("pokemon-herd");

        private final String name;

        SpawnType(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public record HerdSpawnEntry(
            PokemonDTO.PokemonIdentifier pokemonIdentifier,
            IntegerRange levelRange,
            double weight,
            Optional<Integer> maxTimes,
            Optional<Boolean> isLeader,
            IntegerRange levelRangeOffset
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("pokemonIdentifier", pokemonIdentifier.toJson());
            json.add("levelRange", MigrationUtil.rangeToJson(levelRange));
            json.addProperty("weight", weight);
            maxTimes.ifPresent(value -> json.addProperty("maxTimes", value));
            isLeader.ifPresent(value -> json.addProperty("isLeader", value));
            json.add("levelRangeOffset", MigrationUtil.rangeToJson(levelRangeOffset));
            return json;
        }
    }

    public enum SpawnablePositionType {
        Grounded("grounded"),
        Submerged("submerged"),
        Surface("surface"),
        Fishing("fishing");

        private final String name;

        SpawnablePositionType(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public enum SpawnBucket {
        COMMON("common"),
        UNCOMMON("uncommon"),
        RARE("rare"),
        ULTRA_RARE("ultra-rare");

        private final String name;

        SpawnBucket(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }
}
