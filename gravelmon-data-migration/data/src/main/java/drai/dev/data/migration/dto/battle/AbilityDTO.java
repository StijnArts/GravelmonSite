package drai.dev.data.migration.dto.battle;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;

import javax.annotation.*;

public record AbilityDTO(AbilityIdentifier identifier, @Nullable String description, @Nullable String rebalancedDescription) implements JsonSerializable {
    @Override
    public JsonElement toJson() {
        var json = new JsonObject();
        json.add("identifier", identifier.toJson());
        json.addProperty("description", description);
        json.addProperty("rebalancedDescription", rebalancedDescription);
        return json;
    }

    public record AbilityIdentifier(String game, String name) implements JsonSerializable {
        @Override
        public JsonElement toJson() {
            var json = new JsonObject();
            json.addProperty("game", game);
            json.addProperty("name", name);
            return json;
        }
    }
}
