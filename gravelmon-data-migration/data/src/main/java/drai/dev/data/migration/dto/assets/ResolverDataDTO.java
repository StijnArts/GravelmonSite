package drai.dev.data.migration.dto.assets;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;
import kotlin.*;

import javax.annotation.*;
import java.util.*;

public record ResolverDataDTO(List<ResolverLayer> layers,
                              @Nullable Pair<String, String> variationForAspectChoice) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        var layersArray = new JsonArray();
        for (ResolverLayer layer : layers) {
            layersArray.add(layer.toJson());
        }
        json.add("layers", layersArray);
        if (variationForAspectChoice != null) {
            var variationForAspectChoiceJson = new JsonObject();
            variationForAspectChoiceJson.addProperty("first", variationForAspectChoice.getFirst());
            variationForAspectChoiceJson.addProperty("second", variationForAspectChoice.getSecond());
            json.add("variationForAspectChoice", variationForAspectChoiceJson);
        }
        return json;
    }

    public enum CommonLayerNames {
        Emissive("emissive"),
        TransparentEmissive("transparentEmissive"),
        Tail("tail"),
        Transparent_Emissive("transparent_emissive"),
        Emissive2("emissive2"),
        Flame("flame"),
        Glow("glow");

        public final String name;

        CommonLayerNames(String name) {
            this.name = name;
        }

        public String getName() {
            return name;
        }
    }

    public record ResolverLayer(String name, String textureName, Optional<Boolean> isEmissive,
                                Optional<Boolean> isTranslucent,
                                Optional<Integer> framerate, boolean loops,
                                Optional<Integer> numberOfFrames) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("name", name);
            json.addProperty("textureName", textureName);
            isEmissive.ifPresent(value -> json.addProperty("isEmissive", value));
            isTranslucent.ifPresent(value -> json.addProperty("isTranslucent", value));
            framerate.ifPresent(value -> json.addProperty("framerate", value));
            json.addProperty("loops", loops);
            numberOfFrames.ifPresent(value -> json.addProperty("numberOfFrames", value));
            return json;
        }
    }
}