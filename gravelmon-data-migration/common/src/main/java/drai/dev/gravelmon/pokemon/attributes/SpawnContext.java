package drai.dev.gravelmon.pokemon.attributes;

public enum SpawnContext {
    GROUNDED("grounded"),
    SEAFLOOR("seafloor"),
    SUBMERGED("submerged"),
    SURFACE("surface"),
    FISHING("fishing");
    private String name;
    SpawnContext(String name){
        this.name = name;
    }

    public String getName() {
        return name;
    }


}
