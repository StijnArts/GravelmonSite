package drai.dev.gravelmon.pokemon.attributes;

public enum SpawnConditionType {
    BIOMES("biomes", "biome"),
    CANSEESKY("canSeeSky","boolean"),
    MAXY("maxY","int"),
    MINY("minY", "int"),
    TIMERANGE("timeRange","timeRange"),
    MIN_LURE_LEVEL("minLureLevel","lureLevel"),
    MAX_LURE_LEVEL("maxLureLevel","lureLevel"),
    BAIT("bait","berry"),
    IS_RAINING("isRaining", "boolean"),
    MOONPHASE("moonPhase", "moonPhase"),
    MAX_LIGHT("maxLight", "boolean"),
    IS_THUNDERING("isThundering", "boolean");

    private final String name;
    private final String valueType;

    SpawnConditionType(String name, String valueType){
        this.name = name;
        this.valueType = valueType;
    }

    @Override
    public String toString() {
        return name+"= ";
    }

    public String getName() {
        return name;
    }

    public String getValueType() {
        return valueType;
    }
}
