package drai.dev.data.migration.dto.assets;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import drai.dev.data.migration.dto.assets.posing.*;

import javax.annotation.*;

public record AnimationDTO(String name, String primaryPoseType) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.addProperty("name", name);
        json.addProperty("primaryPoseType", primaryPoseType);
        return json;
    }

    public record Animation(@Nullable String PK, @Nullable PosingFileDataDTO.ConditionalAnimation conditionalAnimation) implements JsonSerializable {
        public Animation {
            if(PK == null && conditionalAnimation == null) throw new IllegalArgumentException("Must have PK or conditionalAnimation");
        }

        public JsonElement toJson() {
            var json = new JsonObject();
            if(PK != null) {
                json.addProperty("PK", PK);
                return json;
            } else {
                assert conditionalAnimation != null;
                json.add("conditionalAnimation", conditionalAnimation.toJson());
                return json;
            }
        }
    }
}
