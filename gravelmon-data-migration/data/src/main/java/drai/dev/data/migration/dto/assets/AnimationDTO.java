package drai.dev.data.migration.dto.assets;

import com.google.gson.*;
import drai.dev.data.migration.dto.assets.posing.*;

import java.util.*;

public record AnimationDTO(String name, String primaryPoseType) {
    public record Animation(Optional<String> PK, Optional<PosingFileDataDTO.ConditionalAnimation> conditionalAnimation) {
        public Animation {
            if(PK.isEmpty() && conditionalAnimation.isEmpty()) throw new IllegalArgumentException("Must have PK or conditionalAnimation");
        }

        public JsonElement toJson() {
            if(PK.isPresent()) return new JsonPrimitive(PK.get());
            if(conditionalAnimation.isPresent()) return new GsonBuilder().setPrettyPrinting().create().toJsonTree(conditionalAnimation.get()).getAsJsonObject();
            throw new IllegalStateException("No PK or conditionalAnimation");
        }
    }
}
