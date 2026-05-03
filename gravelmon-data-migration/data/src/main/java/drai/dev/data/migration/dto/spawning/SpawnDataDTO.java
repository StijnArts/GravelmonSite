package drai.dev.data.migration.dto.spawning;

import drai.dev.data.migration.dto.pokemon.*;
import drai.dev.gravelmon.pokemon.attributes.*;
import kotlin.ranges.*;
import net.minecraft.resources.*;

import javax.annotation.*;
import java.util.*;

public record SpawnDataDTO() {
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
            IntRange levelRange,
            double weight,
            Optional<Integer> maxTimes,
            Optional<Boolean> isLeader,
            IntRange levelRangeOffset
    ) {}

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

    public record SpawnData(
            IntRange levelRange,
            SpawnType spawnType,
            double spawnWeight,
            SpawnablePositionType spawnablePositionTypes,
            SpawnBucket spawnBucket,

            OptionalDouble moonPhaseMultiplier,
            OptionalDouble weightMultiplier,

            Optional<Integer> maxHerdSize,
            Optional<Integer> minDistanceBetweenSpawns,

            SpawnCondition condition,
            @Nullable SpawnCondition antiCondition,

            List<HerdSpawnEntry> herdSpawnEntries,

            List<ResourceLocation> preferredBlocks,
            List<ResourceLocation> requiredBlocks
    ) {}
}
