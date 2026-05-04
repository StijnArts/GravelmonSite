package drai.dev.data.migration.dto.spawning;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.pokemon.*;
import drai.dev.data.migration.service.*;
import net.minecraft.resources.*;
import org.apache.commons.lang3.*;

import javax.annotation.*;
import java.util.*;

public record SpawnPresetDTO(SpawnPresetOptions spawnPresetOptions) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var jsonObject = new JsonObject();
        jsonObject.add("spawnPresetOptions", spawnPresetOptions.toJson());
        return jsonObject;
    }

    public record SpawnPresetOptions(
            ResourceLocation name,
            @Nullable SpawnConditionOptions condition,
            @Nullable SpawnConditionOptions antiCondition
    ) implements JsonSerializable {
        public SpawnPresetOptions {
            Objects.requireNonNull(name, "name cannot be null");
            if(condition == null && antiCondition == null) {
                throw new IllegalArgumentException("condition and antiCondition cannot both be null");
            }
        }

        @Override
        public JsonElement toJson() {
            var jsonObject = new JsonObject();
            jsonObject.addProperty("name", name.toString());
            if (condition != null) {
                jsonObject.add("condition", condition.toJson());
            }
            if (antiCondition != null) {
                jsonObject.add("antiCondition", antiCondition.toJson());
            }
            return jsonObject;
        }
    }

    public enum LabelMode {
        ANY,
        ALL
    }

    public record SpawnConditionOptions(
            @Nullable List<String> dimensions,
            @Nullable IntegerRange moonPhase,
            Optional<Boolean> canSeeSky,

            Optional<Integer> minY,
            Optional<Integer> minX,
            Optional<Integer> minZ,
            Optional<Integer> maxY,
            Optional<Integer> maxX,
            Optional<Integer> maxZ,

            Optional<Integer> minLight,
            Optional<Integer> maxLight,
            Optional<Integer> minSkyLight,
            Optional<Integer> maxSkyLight,

            @Nullable EvolutionConditionDTO.TimeRangeDTO timeRange,
            Optional<Boolean> isRaining,
            Optional<Boolean> isThundering,
            Optional<Boolean> isSlimeChunk,
            @Nullable List<String> labels,
            @Nullable LabelMode labelMode,

            Optional<Integer> minWidth,
            Optional<Integer> maxWidth,
            Optional<Integer> minLength,
            Optional<Integer> maxLength,

            @Nullable List<ResourceLocation> neededNearbyBlocks,
            @Nullable List<ResourceLocation> neededBaseBlocks,
            @Nullable List<ResourceLocation> doesNotSpawnInBiomes,
            @Nullable List<ResourceLocation> spawnsInBiomes,
            @Nullable List<ResourceLocation> doesNotSpawnInStructures,
            @Nullable List<ResourceLocation> spawnsInStructures,

            Optional<Integer> minDepth,
            Optional<Integer> maxDepth,
            Optional<Boolean> fluidIsSource,
            @Nullable ResourceLocation fluid,

            Optional<Integer> minLureLevel,
            Optional<Integer> maxLureLevel,
            @Nullable ResourceLocation bobber,
            @Nullable ResourceLocation bait
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var jsonObject = new JsonObject();
            if (dimensions != null) jsonObject.add("dimensions", MigrationUtil.listToJsonArray(dimensions, JsonPrimitive::new));
            if (moonPhase != null) jsonObject.add("moonPhase", MigrationUtil.rangeToJson(moonPhase));
            canSeeSky.ifPresent(value -> jsonObject.addProperty("canSeeSky", value));

            minY.ifPresent(value -> jsonObject.addProperty("minY", value));
            minX.ifPresent(value -> jsonObject.addProperty("minX", value));
            minZ.ifPresent(value -> jsonObject.addProperty("minZ", value));
            maxY.ifPresent(value -> jsonObject.addProperty("maxY", value));
            maxX.ifPresent(value -> jsonObject.addProperty("maxX", value));
            maxZ.ifPresent(value -> jsonObject.addProperty("maxZ", value));

            minLight.ifPresent(value -> jsonObject.addProperty("minLight", value));
            maxLight.ifPresent(value -> jsonObject.addProperty("maxLight", value));
            minSkyLight.ifPresent(value -> jsonObject.addProperty("minSkyLight", value));
            maxSkyLight.ifPresent(value -> jsonObject.addProperty("maxSkyLight", value));

            if (timeRange != null) jsonObject.add("timeRange", timeRange.toJson());
            isRaining.ifPresent(value -> jsonObject.addProperty("isRaining", value));
            isThundering.ifPresent(value -> jsonObject.addProperty("isThundering", value));
            isSlimeChunk.ifPresent(value -> jsonObject.addProperty("isSlimeChunk", value));
            if (labels != null) jsonObject.add("labels", MigrationUtil.listToJsonArray(labels, JsonPrimitive::new));
            if (labelMode != null) jsonObject.addProperty("labelMode", labelMode.name());

            minWidth.ifPresent(value -> jsonObject.addProperty("minWidth", value));
            maxWidth.ifPresent(value -> jsonObject.addProperty("maxWidth", value));
            minLength.ifPresent(value -> jsonObject.addProperty("minLength", value));
            maxLength.ifPresent(value -> jsonObject.addProperty("maxLength", value));

            if (neededNearbyBlocks != null) jsonObject.add("neededNearbyBlocks", MigrationUtil.listToJsonArray(neededNearbyBlocks, MigrationUtil::resourceLocationToJson));
            if (neededBaseBlocks != null) jsonObject.add("neededBaseBlocks", MigrationUtil.listToJsonArray(neededBaseBlocks, MigrationUtil::resourceLocationToJson));
            if (doesNotSpawnInBiomes != null) jsonObject.add("doesNotSpawnInBiomes", MigrationUtil.listToJsonArray(doesNotSpawnInBiomes, MigrationUtil::resourceLocationToJson));
            if (spawnsInBiomes != null) jsonObject.add("spawnsInBiomes", MigrationUtil.listToJsonArray(spawnsInBiomes, MigrationUtil::resourceLocationToJson));
            if (doesNotSpawnInStructures != null) jsonObject.add("doesNotSpawnInStructures", MigrationUtil.listToJsonArray(doesNotSpawnInStructures, MigrationUtil::resourceLocationToJson));
            if (spawnsInStructures != null) jsonObject.add("spawnsInStructures", MigrationUtil.listToJsonArray(spawnsInStructures, MigrationUtil::resourceLocationToJson));

            minDepth.ifPresent(value -> jsonObject.addProperty("minDepth", value));
            maxDepth.ifPresent(value -> jsonObject.addProperty("maxDepth", value));
            fluidIsSource.ifPresent(value -> jsonObject.addProperty("fluidIsSource", value));
            if (fluid != null) jsonObject.addProperty("fluid", fluid.toString());

            minLureLevel.ifPresent(value -> jsonObject.addProperty("minLureLevel", value));
            maxLureLevel.ifPresent(value -> jsonObject.addProperty("maxLureLevel", value));
            if (bobber != null) jsonObject.addProperty("bobber", bobber.toString());
            if (bait != null) jsonObject.addProperty("bait", bait.toString());

            return jsonObject;
        }
    }
}
