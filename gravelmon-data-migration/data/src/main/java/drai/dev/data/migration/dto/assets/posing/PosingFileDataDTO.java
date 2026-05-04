package drai.dev.data.migration.dto.assets.posing;

import com.cobblemon.mod.common.entity.*;
import com.google.gson.*;
import drai.dev.data.attributes.assets.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.assets.*;
import drai.dev.data.migration.dto.pokemon.*;
import drai.dev.data.migration.service.*;
import org.apache.commons.lang3.*;

import javax.annotation.*;
import java.util.*;

import static drai.dev.data.migration.service.MigrationUtil.rangeToJson;

public record PosingFileDataDTO(PosingFileOptions posingFileOptions) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("posingFileOptions", posingFileOptions.toJson());
        return json;
    }

    public enum NamedAnimationTypes {
        CRY("cry"),
        RECOIL("recoil"),
        STATUS("status"),
        SPECIAL("special"),
        PHYSICAL("Physical"),
        FAINT("faint"),
        AIR_SPECIAL("air_special"),
        AIR_PHYSICAL("air_physical"),
        AIR_STATUS("air_status");

        private final String name;

        NamedAnimationTypes(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public record NamedAnimation(String animationExpression, NamedAnimationTypes name,
                                 String animation) implements JsonSerializable {
        public NamedAnimation {
            if (animationExpression == null) throw new IllegalArgumentException("Animation expression cannot be null");
            if (animation == null) throw new IllegalArgumentException("Animation cannot be null");
        }


        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("animationExpression", animationExpression);
            json.addProperty("name", name.getName());
            json.addProperty("animation", animation);
            return json;
        }
    }

    public record ConditionalAnimation(String conditionExpression, NamedAnimationTypes name,
                                       String animation) implements JsonSerializable {

        public ConditionalAnimation {
            if (conditionExpression == null) throw new IllegalArgumentException("Condition expression cannot be null");
            if (animation == null) throw new IllegalArgumentException("Animation cannot be null");
        }

        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("conditionExpression", conditionExpression);
            json.addProperty("name", name.getName());
            json.addProperty("animation", animation);
            return json;
        }
    }

    public record TransformedPart(Optional<Boolean> isVisible, @Nullable Vector3 rotation, @Nullable Vector3 position,
                                  String part) implements JsonSerializable {
        public TransformedPart {
            if (part == null) throw new IllegalArgumentException("Part cannot be null");
        }

        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            isVisible.ifPresent(value -> json.addProperty("isVisible", value));
            if (rotation != null) json.add("rotation", rotation.toJson());
            if (position != null) json.add("position", position.toJson());
            json.addProperty("part", part);
            return json;
        }
    }

    public record Quirk(Optional<Double> loopTimes, @Nullable DoubleRange occurrenceRange, String animation,
                        Optional<Boolean> isPrimary) implements JsonSerializable {
        public Quirk {
            if (animation == null) throw new IllegalArgumentException("Animation cannot be null");
        }

        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            loopTimes.ifPresent(value -> json.addProperty("loopTimes", value));
            if (occurrenceRange != null) {
                json.add("occurrenceRange", rangeToJson(occurrenceRange));
            }
            json.addProperty("animation", animation);
            isPrimary.ifPresent(value -> json.addProperty("isPrimary", value));
            return json;
        }
    }

    public record PoseAnimation(String name, Optional<Boolean> isBattle,
                                Optional<Boolean> isTouchingWater,
                                Optional<Boolean> isUnderwater,
                                @Nullable String conditionExpression,
                                Optional<Boolean> allPoseTypes,
                                PoseType poseType,
                                @Nullable List<TransformedPart> transformedParts,
                                @Nullable List<Quirk> quirks,
                                @Nullable List<NamedAnimation> namedAnimations,
                                List<AnimationDTO.Animation> animations,
                                Optional<Integer> transformTicks,
                                Optional<Integer> transformToTicks
    ) implements JsonSerializable {
        public PoseAnimation {
            if (name == null) throw new IllegalArgumentException("Name cannot be null");
            if (animations == null) throw new IllegalArgumentException("Animations cannot be null");
        }

        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("name", name);
            isBattle.ifPresent(value -> json.addProperty("isBattle", value));
            isTouchingWater.ifPresent(value -> json.addProperty("isTouchingWater", value));
            isUnderwater.ifPresent(value -> json.addProperty("isUnderwater", value));
            if (conditionExpression != null) json.addProperty("conditionExpression", conditionExpression);
            allPoseTypes.ifPresent(value -> json.addProperty("allPoseTypes", value));
            json.addProperty("poseType", poseType.toString());
            if (transformedParts != null)
                json.add("transformedParts", MigrationUtil.listToJsonArray(transformedParts, TransformedPart::toJson));
            if (quirks != null) json.add("quirks", MigrationUtil.listToJsonArray(quirks, Quirk::toJson));
            if (namedAnimations != null)
                json.add("namedAnimations", MigrationUtil.listToJsonArray(namedAnimations, NamedAnimation::toJson));
            json.add("animations", MigrationUtil.listToJsonArray(animations, AnimationDTO.Animation::toJson));
            transformTicks.ifPresent(value -> json.addProperty("transformTicks", value));
            transformToTicks.ifPresent(value -> json.addProperty("transformToTicks", value));
            return json;

        }
    }

    public record CameraOffset(
            Vector3 firstPersonCameraOffset,
            Vector3 thirdPersonCameraOffset,
            Vector3 thirdPersonCameraOffsetNoViewBobbing,
            String seatName
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            if (firstPersonCameraOffset != null) json.add("firstPersonCameraOffset", firstPersonCameraOffset.toJson());
            if (thirdPersonCameraOffset != null) json.add("thirdPersonCameraOffset", thirdPersonCameraOffset.toJson());
            if (thirdPersonCameraOffsetNoViewBobbing != null)
                json.add("thirdPersonCameraOffsetNoViewBobbing", thirdPersonCameraOffsetNoViewBobbing.toJson());
            json.addProperty("seatName", seatName);
            return json;
        }
    }

    public record PosingFileOptions(
            double profileScale,
            Vector3 profileCoords,
            double portraitScale,
            Vector3 portraitCoords,

            @Nullable String headBone,
            String rootBone,

            @Nullable List<CameraOffset> cameraOffsets,

            List<PoseAnimation> poseAnimations,
            @Nullable List<NamedAnimation> globalAnimations,

            @Nullable PokemonDTO.PokemonIdentifier overridesPosingData
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("profileScale", profileScale);
            json.add("profileCoords", profileCoords.toJson());
            json.addProperty("portraitScale", portraitScale);
            json.add("portraitCoords", portraitCoords.toJson());
            if (headBone != null) json.addProperty("headBone", headBone);
            json.addProperty("rootBone", rootBone);
            if (cameraOffsets != null)
                json.add("cameraOffsets", MigrationUtil.listToJsonArray(cameraOffsets, CameraOffset::toJson));
            json.add("poseAnimations", MigrationUtil.listToJsonArray(poseAnimations, PoseAnimation::toJson));
            if (globalAnimations != null)
                json.add("globalAnimations", MigrationUtil.listToJsonArray(globalAnimations, NamedAnimation::toJson));
            if (overridesPosingData != null) json.add("overridesPosingData", overridesPosingData.toJson());
            return json;
        }
    }

    public record PosingData(
            PosingFileOptions posingFileOptions
    ) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("posingFileOptions", posingFileOptions.toJson());
            return json;
        }
    }
}

