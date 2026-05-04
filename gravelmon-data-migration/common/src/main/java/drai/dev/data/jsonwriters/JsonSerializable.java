package drai.dev.data.jsonwriters;

import com.google.gson.*;

public interface JsonSerializable {
    JsonElement toJson();

    public default Gson getJsonMapper(){
        return new GsonBuilder().setPrettyPrinting().create();
    }
}
