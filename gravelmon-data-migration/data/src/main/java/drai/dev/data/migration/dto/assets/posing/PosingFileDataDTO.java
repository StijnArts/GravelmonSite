package drai.dev.data.migration.dto.assets.posing;

import com.cobblemon.mod.common.entity.*;
import drai.dev.data.attributes.assets.*;
import drai.dev.data.migration.dto.assets.*;
import org.apache.commons.lang3.*;

import javax.annotation.*;
import java.util.*;

public record PosingFileDataDTO() {
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

    public record NamedAnimation(String animationExpression, NamedAnimationTypes name, String animation) {}
    public record ConditionalAnimation(String conditionExpression, NamedAnimationTypes name, String animation) {}
    public record TransformedPart(Optional<Boolean> isVisible, @Nullable Vector3 rotation, @Nullable Vector3 position, String part) {}
    public record Quirk(OptionalDouble loopTimes, @Nullable DoubleRange occurrenceRange, String animation, Optional<Boolean> isPrimary) {}
    public record PoseAnimation(String name, Optional<Boolean> isBattle, Optional<Boolean> isTouchingWater,
                                Optional<Boolean> isUnderwater, @Nullable String conditionExpression,
                                Optional<Boolean> allPoseTypes, PoseType poseType, @Nullable List<TransformedPart> transformedParts,
                                @Nullable List<Quirk> quirks, @Nullable List<NamedAnimation> namedAnimations,
                                List<AnimationDTO.Animation> animations, OptionalInt transformTicks, OptionalInt transformToTicks) {
        public PoseAnimation {
            if(name == null) throw new IllegalArgumentException("Name cannot be null");
            if(animations == null) throw new IllegalArgumentException("Animations cannot be null");
        }
    }
}

