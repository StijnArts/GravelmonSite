package drai.dev.data.migration.dto.battle;

import drai.dev.data.jsonwriters.*;
import com.google.gson.*;

import javax.annotation.*;
import java.util.*;

public record FieldEffectDTO(FieldEffectData fieldEffectData, @Nullable FieldEffectData rebalancedFieldEffectData,
                             List<String> fieldEffectLabels) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("fieldEffectData", fieldEffectData.toJson());
        json.add("rebalancedFieldEffectData", rebalancedFieldEffectData != null ? rebalancedFieldEffectData.toJson() : JsonNull.INSTANCE);
        var labelsArray = new JsonArray();
        fieldEffectLabels.forEach(labelsArray::add);
        json.add("fieldEffectLabels", labelsArray);
        return json;
    }

    public record FieldEffectIdentifier(String game, String name) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("game", game);
            json.addProperty("name", name);
            return json;
        }
    }

    public record FieldEffectData(FieldEffectIdentifier identifier, int durationInTurns,
                                  MoveDTO.MoveRange fieldEffectRange,
                                  @Nullable String description) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.add("identifier", identifier.toJson());
            json.addProperty("durationInTurns", durationInTurns);
            json.addProperty("fieldEffectRange", fieldEffectRange.name());
            if(description != null && !description.isBlank()) json.addProperty("description",description);
            return json;
        }
    }
}

