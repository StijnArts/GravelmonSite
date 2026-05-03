package drai.dev.data.migration.dto.spawning;

import drai.dev.data.migration.dto.pokemon.*;
import drai.dev.gravelmon.pokemon.attributes.*;
import kotlin.ranges.*;
import net.minecraft.resources.*;

import java.util.*;

public record SpawnPresetDTO(SpawnPresetOptions spawnPresetOptions) {
    public record SpawnPresetOptions(
            ResourceLocation name,
            SpawnCondition condition,
            SpawnCondition antiCondition
    ) {}

    public enum LabelMode {
        ANY,
        ALL
    }

    public record SpawnConditionOptions(

            List<String> dimensions,
            IntRange moonPhase,
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

            EvolutionConditionDTO.TimeRangeDTO timeRange,
            Optional<Boolean> isRaining,
            Optional<Boolean> isThundering,
            Optional<Boolean> isSlimeChunk,

            List<String> labels,
            LabelMode labelMode,

            Optional<Integer> minWidth,
            Optional<Integer> maxWidth,
            Optional<Integer> minLength,
            Optional<Integer> maxLength,

            List<ResourceLocation> neededNearbyBlocks,
            List<ResourceLocation> neededBaseBlocks,
            List<ResourceLocation> doesNotSpawnInBiomes,
            List<ResourceLocation> spawnsInBiomes,
            List<ResourceLocation> doesNotSpawnInStructures,
            List<ResourceLocation> spawnsInStructures,

            Optional<Integer> minDepth,
            Optional<Integer> maxDepth,
            Optional<Boolean> fluidIsSource,
            ResourceLocation fluid,

            Optional<Integer> minLureLevel,
            Optional<Integer> maxLureLevel,
            ResourceLocation bobber,
            ResourceLocation bait
    ) {}
}
