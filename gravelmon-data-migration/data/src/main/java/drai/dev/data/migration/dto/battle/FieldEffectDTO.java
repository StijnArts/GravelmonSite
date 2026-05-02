package drai.dev.data.migration.dto.battle;

import java.util.*;

public record FieldEffectDTO(FieldEffectData fieldEffectData, Optional<FieldEffectData> rebalancedFieldEffectData, List<String> fieldEffectLabels) {
    public record FieldEffectIdentifier(String game, String name) {}

    public record FieldEffectData(FieldEffectIdentifier identifier, int durationInTurns, MoveDTO.MoveRange fieldEffectRange, Optional<String> description) {

    }
}
