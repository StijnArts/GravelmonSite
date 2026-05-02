package drai.dev.data.migration.dto.battle;

import drai.dev.data.migration.dto.pokemon.*;
import net.minecraft.resources.*;

import java.util.*;

public record MechanicDTO(String name, Optional<String> description, Optional<List<ResourceLocation>> usesItems, Optional<List<PokemonDTO.PokemonIdentifier>> affectsForms) {
}
