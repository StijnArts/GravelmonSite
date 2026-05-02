package drai.dev.data.migration.dto.battle;

import java.util.*;

public record TypeDTO(String name, List<String> resists, List<String> immunities, List<String> weaknesses, List<String> introducedByGames) {
}
