package drai.dev.data.migration.dto.assets.posing;

import com.cobblemon.mod.common.entity.*;
import drai.dev.data.attributes.assets.*;
import drai.dev.data.migration.dto.assets.*;
import org.apache.commons.lang3.*;

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
    public record TransformedPart(Optional<Boolean> isVisible, Optional<Vector3> rotation, Optional<Vector3> position, String part) {}
    public record Quirk(Optional<Double> loopTimes, Optional<Range<Double>> occurrenceRange, String animation, Optional<Boolean> isPrimary) {}
    public record PoseAnimation(String name, Optional<Boolean> isBattle, Optional<Boolean> isTouchingWater,
                                Optional<Boolean> isUnderwater, Optional<String> conditionExpression,
                                Optional<Boolean> allPoseTypes, PoseType poseType, Optional<List<TransformedPart>> transformedParts,
                                Optional<List<Quirk>> quirks, Optional<List<NamedAnimation>> namedAnimations, List<AnimationDTO.Animation> animations, Optional<Integer> transformTicks, Optional<Integer> transformToTicks) {
        public PoseAnimation {
            if(name == null) throw new IllegalArgumentException("Name cannot be null");
            if(animations == null) throw new IllegalArgumentException("Animations cannot be null");
        }
    }
}

