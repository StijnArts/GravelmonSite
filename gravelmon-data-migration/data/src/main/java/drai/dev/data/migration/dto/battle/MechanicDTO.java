package drai.dev.data.migration.dto.battle;

import drai.dev.data.migration.dto.pokemon.*;
import net.minecraft.resources.*;

import javax.annotation.*;
import java.util.*;

public record MechanicDTO(String name, @Nullable String description, @Nullable List<ResourceLocation> usesItems, @Nullable List<PokemonDTO.PokemonIdentifier> affectsForms) {
}
