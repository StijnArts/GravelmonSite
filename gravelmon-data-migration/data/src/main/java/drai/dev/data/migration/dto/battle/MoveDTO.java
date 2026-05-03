package drai.dev.data.migration.dto.battle;

import kotlin.*;

import javax.annotation.*;
import java.util.*;

public record MoveDTO(MoveIdentifier moveIdentifier, MoveData moveData, @Nullable MoveData rebalancedMoveData, List<String> moveLabels) {
    public record MoveIdentifier(String game, String name) {
    }

    public record MoveType(String type, boolean isRebalanced) {
    }

    public enum MoveCategory {
        Physical,
        Special,
        Status;
    }

    public enum MoveRange {
        SingleTarget,
        Self,
        SingleAlly,
        AllPokemon,
        AllAllies,
        AllOpponents,
        RandomOpponent,
        EntireField,
        OpponentSide,
        UserSide,
        Varies
    }

    public record MoveData(
            Pair<MoveType, MoveType> moveTypes,
            int powerPoints,
            int basePower,
            int priority,
            int accuracy,
            MoveRange moveRange,
            MoveCategory moveCategory,
            @Nullable String description,
            @Nullable String zMoveEffect,
            Map<String, Integer> typeGemCost,
            @Nullable List<String> associatedWeathers,
            @Nullable List<String> associatedTerrain,
            @Nullable List<String> associatedFieldEffects
    ) {
    }
}
