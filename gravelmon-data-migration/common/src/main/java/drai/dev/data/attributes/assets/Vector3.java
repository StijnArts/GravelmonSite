package drai.dev.data.attributes.assets;

import com.google.gson.*;
import drai.dev.data.jsonwriters.*;

public class Vector3 implements JsonSerializable {
    public double x, y, z;

    public Vector3(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public void multiply(double factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
    }

    public JsonElement getJsonArray() {
        var coordsArray = new JsonArray();
        coordsArray.add(x);
        coordsArray.add(y);
        coordsArray.add(z);
        return coordsArray;
    }

    public void divide(double factor) {
        this.x /= factor;
        this.y /= factor;
        this.z /= factor;
    }

    @Override
    public JsonElement toJson() {
        var jsonObject = new JsonObject();
        jsonObject.addProperty("x", x);
        jsonObject.addProperty("y", y);
        jsonObject.addProperty("z", z);
        return jsonObject;
    }
}
