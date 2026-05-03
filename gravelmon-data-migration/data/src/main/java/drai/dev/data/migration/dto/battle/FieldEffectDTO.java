package drai.dev.data.migration.dto.battle;

import javax.annotation.*;
import java.util.*;

public record FieldEffectDTO(FieldEffectData fieldEffectData, @Nullable FieldEffectData rebalancedFieldEffectData, List<String> fieldEffectLabels) {
    public record FieldEffectIdentifier(String game, String name) {}

    public record FieldEffectData(FieldEffectIdentifier identifier, int durationInTurns, MoveDTO.MoveRange fieldEffectRange, @Nullable String description) {

    }
}
