package drai.dev.gravelmon.pokemon.attributes;

import org.apache.commons.lang3.*;

import java.util.*;

public class BiomeSpawnCondition extends SpawnCondition {
    private final List<Biome> biomes = new ArrayList<>();

    public BiomeSpawnCondition(List<Biome> biomes) {
        super(SpawnConditionType.BIOMES, "");
        this.biomes.addAll(biomes);
    }

    public List<Biome> getBiomes() {
        return biomes;
    }

    @Override
    public String toString() {
        return "Biomes: ["+ StringUtils.capitalize(String.join(",\n", biomes.stream().map(biome -> biome.getAsIdentifier().toString()).toArray(String[]::new)))+"]";
    }
}
