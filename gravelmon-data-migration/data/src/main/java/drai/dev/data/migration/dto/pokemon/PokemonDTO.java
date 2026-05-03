package drai.dev.data.migration.dto.pokemon;

import com.cobblemon.mod.common.entity.*;
import drai.dev.data.attributes.assets.*;
import kotlin.ranges.*;

import javax.annotation.*;
import java.util.*;

public record PokemonDTO(PokemonData pokemonData) {
    public record PokemonIdentifier(String game, String name, String form) {}
    public record Hitbox(double width, double height, Optional<Boolean> fixed) {}
    public record Stats(int hp, int attack, int defence, int specialAttack, int specialDefence, int speed) {}

    public record PokemonData(
            PokemonIdentifier pokemonIdentifier,
            Stats baseStats,
            Stats evYield,
            double heightInMeters,
            double weightInKg,
            int catchRate,
            double maleRatio,
            int baseExperience,
            int baseFriendship,
            int eggCycles,
            String pokedexEntry,
            Hitbox hitbox,
            double baseScale,
            boolean cannotDynamax,
            int dropAmount,
            BehaviourOptions behaviourOptions
    ) {}

    public record BehaviourOptions(
            @Nullable BehaviourMovementOptions movement,
            @Nullable BehaviourAquaticOptions aquatic,
            @Nullable BehaviourSleepOptions sleep,
            @Nullable BehaviourHerdingOptions herd,
            @Nullable BehaviourRidingOptions riding
    ) {}

    public record BehaviourMovementOptions(
            Optional<Boolean> canLookAround,
            Optional<Boolean> looksAtEntities,
            Optional<Boolean> canWalk,
            OptionalDouble stepHeight,
            Optional<Boolean> canFly,
            Optional<Boolean> canWalkOnWater,
            Optional<Boolean> canWalkOnLava,
            OptionalDouble walkSpeed,
            OptionalDouble flySpeedHorizontal,
            OptionalDouble wanderChance,
            OptionalDouble wanderSpeed
    ) {}

    public record BehaviourAquaticOptions(
            Optional<Boolean> avoidsLand,
            Optional<Boolean> canSwimInWater,
            Optional<Boolean> canSwimInLava,
            Optional<Boolean> canBreatheUnderwater,
            Optional<Boolean> canBreatheUnderlava,
            Optional<Boolean> hurtByLava,
            OptionalDouble swimSpeed
    ) {}

    public enum SleepDepth {
        Normal("normal"),
        Comatose("comatose");

        private final String name;
        SleepDepth(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public record BehaviourSleepOptions(
            Optional<Boolean> canSleep,
            Optional<Boolean> willSleepOnBed,
            Optional<IntRange> sleepLightLevel,
            OptionalDouble drowsyChance,
            @Nullable SleepDepth depth,
            @Nullable List<EvolutionConditionDTO.TimeRangeDTO> times,
            @Nullable List<String> biomes
    ) {}

    public record HerdData(
            int tier,
            PokemonIdentifier leaderEntityType
    ) {}

    public record BehaviourHerdingOptions(
            int maxHerdSize,
            List<HerdData> herdData
    ) {}

    public record CombatBehaviourOptions(
            Optional<Boolean> willDefendOwner,
            Optional<Boolean> willDefendSelf,
            Optional<Boolean> willFlee
    ) {}

    public enum RidingKey {
        STANDARD,
        VEHICLE,
        BOAT,
        SUBMARINE,
        DOLPHIN,
        BIRD,
        JET,
        UFO,
        ROCKET
    }

    public record RidingStats(
            IntRange ACCELERATION,
            IntRange JUMP,
            IntRange SKILL,
            IntRange SPEED,
            IntRange STAMINA
    ) {}

    public record RideSound(
            Optional<Boolean> muffleEnabled,
            String pitchExpression,
            Optional<Boolean> playForNonPassengers,
            Optional<Boolean> playForPassengers,
            String soundPK,
            String volumeExpression,
            Optional<Boolean> submerged
    ) {}

    public record RidingBehaviour(
            RidingKey key,
            RidingStats stats,
            RideSound rideSounds
    ) {}

    public record BehaviourRidingOptions(
            @Nullable RidingBehaviour airRidingBehaviour,
            @Nullable RidingBehaviour landRidingBehaviour,
            @Nullable RidingBehaviour liquidRidingBehaviour,
            List<Seat> seats
    ) {}

    public record Seat(Vector3 offset, List<SeatPoseOffset> seatPoseOffsets) {}
    public record SeatPoseOffset(Vector3 offset, List<PoseType> poseTypes) {}
}
