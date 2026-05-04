package drai.dev.data.migration.dto.pokemon;

import com.cobblemon.mod.common.entity.*;
import com.google.gson.*;
import drai.dev.data.attributes.assets.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.service.*;
import org.apache.commons.lang3.*;

import javax.annotation.*;
import java.util.*;

public record PokemonDTO(PokemonData pokemonData) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("pokemonData", pokemonData.toJson());
        return json;
    }

    public record PokemonIdentifier(String game, String name, String form) implements JsonSerializable {

        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("game", game);
            json.addProperty("name", name);
            json.addProperty("form", form);
            return json;
        }
    }

    public record Hitbox(double width, double height, Optional<Boolean> fixed) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("width", width);
            json.addProperty("height", height);
            fixed.ifPresent(value -> json.addProperty("fixed", value));
            return json;
        }
    }

    public record Stats(int hp, int attack, int defence, int specialAttack, int specialDefence,
                        int speed) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("hp", hp);
            json.addProperty("attack", attack);
            json.addProperty("defence", defence);
            json.addProperty("specialAttack", specialAttack);
            json.addProperty("specialDefence", specialDefence);
            json.addProperty("speed", speed);
            return json;
        }
    }

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
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("pokemonIdentifier", pokemonIdentifier.toJson());
            json.add("baseStats", baseStats.toJson());
            json.add("evYield", evYield.toJson());
            json.addProperty("heightInMeters", heightInMeters);
            json.addProperty("weightInKg", weightInKg);
            json.addProperty("catchRate", catchRate);
            json.addProperty("maleRatio", maleRatio);
            json.addProperty("baseExperience", baseExperience);
            json.addProperty("baseFriendship", baseFriendship);
            json.addProperty("eggCycles", eggCycles);
            if (pokedexEntry != null) json.addProperty("pokedexEntry", pokedexEntry);
            json.add("hitbox", hitbox.toJson());
            json.addProperty("baseScale", baseScale);
            json.addProperty("cannotDynamax", cannotDynamax);
            json.addProperty("dropAmount", dropAmount);
            json.add("behaviourOptions", behaviourOptions.toJson());
            return json;
        }
    }

    public record BehaviourOptions(
            @Nullable BehaviourMovementOptions movement,
            @Nullable BehaviourAquaticOptions aquatic,
            @Nullable BehaviourSleepOptions sleep,
            @Nullable BehaviourHerdingOptions herd,
            @Nullable BehaviourRidingOptions riding
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            if (movement != null) json.add("movement", movement.toJson());
            if (aquatic != null) json.add("aquatic", aquatic.toJson());
            if (sleep != null) json.add("sleep", sleep.toJson());
            if (herd != null) json.add("herd", herd.toJson());
            if (riding != null) json.add("riding", riding.toJson());
            return json;
        }
    }

    public record BehaviourMovementOptions(
            Optional<Boolean> canLookAround,
            Optional<Boolean> looksAtEntities,
            Optional<Boolean> canWalk,
            Optional<Double> stepHeight,
            Optional<Boolean> canFly,
            Optional<Boolean> canWalkOnWater,
            Optional<Boolean> canWalkOnLava,
            Optional<Double> walkSpeed,
            Optional<Double> flySpeedHorizontal,
            Optional<Double> wanderChance,
            Optional<Double> wanderSpeed
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            canLookAround.ifPresent(value -> json.addProperty("canLookAround", value));
            looksAtEntities.ifPresent(value -> json.addProperty("looksAtEntities", value));
            canWalk.ifPresent(value -> json.addProperty("canWalk", value));
            stepHeight.ifPresent(value -> json.addProperty("stepHeight", value));
            canFly.ifPresent(value -> json.addProperty("canFly", value));
            canWalkOnWater.ifPresent(value -> json.addProperty("canWalkOnWater", value));
            canWalkOnLava.ifPresent(value -> json.addProperty("canWalkOnLava", value));
            walkSpeed.ifPresent(value -> json.addProperty("walkSpeed", value));
            flySpeedHorizontal.ifPresent(value -> json.addProperty("flySpeedHorizontal", value));
            wanderChance.ifPresent(value -> json.addProperty("wanderChance", value));
            wanderSpeed.ifPresent(value -> json.addProperty("wanderSpeed", value));
            return json;
        }
    }

    public record BehaviourAquaticOptions(
            Optional<Boolean> avoidsLand,
            Optional<Boolean> canSwimInWater,
            Optional<Boolean> canSwimInLava,
            Optional<Boolean> canBreatheUnderwater,
            Optional<Boolean> canBreatheUnderlava,
            Optional<Boolean> hurtByLava,
            Optional<Double> swimSpeed
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            avoidsLand.ifPresent(value -> json.addProperty("avoidsLand", value));
            canSwimInWater.ifPresent(value -> json.addProperty("canSwimInWater", value));
            canSwimInLava.ifPresent(value -> json.addProperty("canSwimInLava", value));
            canBreatheUnderwater.ifPresent(value -> json.addProperty("canBreatheUnderwater", value));
            canBreatheUnderlava.ifPresent(value -> json.addProperty("canBreatheUnderlava", value));
            hurtByLava.ifPresent(value -> json.addProperty("hurtByLava", value));
            swimSpeed.ifPresent(value -> json.addProperty("swimSpeed", value));
            return json;
        }
    }

    public enum SleepDepth implements JsonSerializable {
        Normal("normal"),
        Comatose("comatose");

        private final String name;

        SleepDepth(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }

        @Override
        public JsonElement toJson() {
            return new JsonPrimitive(name);
        }
    }

    public record BehaviourSleepOptions(
            Optional<Boolean> canSleep,
            Optional<Boolean> willSleepOnBed,
            Optional<IntegerRange> sleepLightLevel,
            Optional<Double> drowsyChance,
            @Nullable SleepDepth depth,
            @Nullable List<EvolutionConditionDTO.TimeRangeDTO> times,
            @Nullable List<String> biomes
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            canSleep.ifPresent(value -> json.addProperty("canSleep", value));
            willSleepOnBed.ifPresent(value -> json.addProperty("willSleepOnBed", value));
            sleepLightLevel.ifPresent(value -> json.add("sleepLightLevel", MigrationUtil.rangeToJson(value)));
            drowsyChance.ifPresent(value -> json.addProperty("drowsyChance", value));
            if (depth != null) json.add("depth", depth.toJson());
            if (times != null) json.add("times", MigrationUtil.listToJsonArray(times, EvolutionConditionDTO.TimeRangeDTO::toJson));
            if (biomes != null) json.add("biomes", MigrationUtil.listToJsonArray(biomes, JsonPrimitive::new));
            return json;
        }
    }

    public record HerdData(
            int tier,
            PokemonIdentifier leaderEntityType
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("tier", tier);
            json.add("leaderEntityType", leaderEntityType.toJson());
            return json;
        }
    }

    public record BehaviourHerdingOptions(
            int maxHerdSize,
            List<HerdData> herdData
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("maxHerdSize", maxHerdSize);
            json.add("herdData", MigrationUtil.listToJsonArray(herdData, HerdData::toJson));
            return json;
        }
    }

    public record CombatBehaviourOptions(
            Optional<Boolean> willDefendOwner,
            Optional<Boolean> willDefendSelf,
            Optional<Boolean> willFlee
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            willDefendOwner.ifPresent(value -> json.addProperty("willDefendOwner", value));
            willDefendSelf.ifPresent(value -> json.addProperty("willDefendSelf", value));
            willFlee.ifPresent(value -> json.addProperty("willFlee", value));
            return json;
        }
    }

    public record RidingStats(
            IntegerRange ACCELERATION,
            IntegerRange JUMP,
            IntegerRange SKILL,
            IntegerRange SPEED,
            IntegerRange STAMINA
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("ACCELERATION", MigrationUtil.rangeToJson(ACCELERATION));
            json.add("JUMP", MigrationUtil.rangeToJson(JUMP));
            json.add("SKILL", MigrationUtil.rangeToJson(SKILL));
            json.add("SPEED", MigrationUtil.rangeToJson(SPEED));
            json.add("STAMINA", MigrationUtil.rangeToJson(STAMINA));
            return json;
        }
    }

    public record RideSound(
            Optional<Boolean> muffleEnabled,
            String pitchExpression,
            Optional<Boolean> playForNonPassengers,
            Optional<Boolean> playForPassengers,
            String soundPK,
            String volumeExpression,
            Optional<Boolean> submerged
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            muffleEnabled.ifPresent(value -> json.addProperty("muffleEnabled", value));
            json.addProperty("pitchExpression", pitchExpression);
            playForNonPassengers.ifPresent(value -> json.addProperty("playForNonPassengers", value));
            playForPassengers.ifPresent(value -> json.addProperty("playForPassengers", value));
            json.addProperty("soundPK", soundPK);
            json.addProperty("volumeExpression", volumeExpression);
            submerged.ifPresent(value -> json.addProperty("submerged", value));
            return json;
        }
    }

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

    public record RidingBehaviour(
            RidingKey key,
            RidingStats stats,
            RideSound rideSounds
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("key", key.name());
            json.add("stats", stats.toJson());
            json.add("rideSounds", rideSounds.toJson());
            return json;
        }
    }

    public record BehaviourRidingOptions(
            @Nullable RidingBehaviour airRidingBehaviour,
            @Nullable RidingBehaviour landRidingBehaviour,
            @Nullable RidingBehaviour liquidRidingBehaviour,
            List<Seat> seats
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            if (airRidingBehaviour != null) json.add("airRidingBehaviour", airRidingBehaviour.toJson());
            if (landRidingBehaviour != null) json.add("landRidingBehaviour", landRidingBehaviour.toJson());
            if (liquidRidingBehaviour != null) json.add("liquidRidingBehaviour", liquidRidingBehaviour.toJson());
            json.add("seats", MigrationUtil.listToJsonArray(seats, Seat::toJson));
            return json;
        }
    }

    public record Seat(Vector3 offset, List<SeatPoseOffset> seatPoseOffsets) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("offset", offset.toJson());
            json.add("seatPoseOffsets", MigrationUtil.listToJsonArray(seatPoseOffsets, SeatPoseOffset::toJson));
            return json;
        }
    }

    public record SeatPoseOffset(Vector3 offset, List<PoseType> poseTypes) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("offset", offset.toJson());
            json.add("poseTypes", MigrationUtil.listToJsonArray(poseTypes, poseType -> new JsonPrimitive(poseType.name())));
            return json;
        }
    }
}
