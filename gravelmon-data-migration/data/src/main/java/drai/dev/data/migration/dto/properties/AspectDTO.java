package drai.dev.data.migration.dto.properties;

import java.util.*;

public abstract class AspectDTO {
    public enum AspectType {
        FLAG,
        CHOICE
    }
    public sealed interface DefaultOption
            permits BooleanOption, StringOption {
    }
    public record BooleanOption(boolean value) implements DefaultOption {}
    public record StringOption(String value) implements DefaultOption {}

    private String name;
    private AspectType aspectType;
    private boolean isAspect = true;
    private DefaultOption defaultOption;
    private boolean isPrimaryAspect;
    private String introducedByGame;
    private long lastEdited;

    protected AspectDTO(
            String name,
            AspectType aspectType,
            DefaultOption defaultOption,
            boolean isPrimaryAspect,
            String introducedByGame,
            long lastEdited
    ) {
        this.name = name;
        this.aspectType = aspectType;
        this.defaultOption = defaultOption;
        this.isPrimaryAspect = isPrimaryAspect;
        this.introducedByGame = introducedByGame;
        this.lastEdited = lastEdited;
    }

    public AspectType getAspectType() { return aspectType; }
    public boolean isAspect() { return isAspect; }
    public DefaultOption getDefaultOption() { return defaultOption; }
    public boolean isPrimaryAspect() { return isPrimaryAspect; }
    public String getIntroducedByGame() { return introducedByGame; }
    public long getLastEdited() { return lastEdited; }

    public static class FlagAspectDTO extends AspectDTO {

        private boolean defaultValue;

        public FlagAspectDTO(
                String name,
                boolean defaultValue,
                boolean isPrimaryAspect,
                String introducedByGame,
                long lastEdited
        ) {
            super(
                    name,
                    AspectType.FLAG,
                    new BooleanOption(defaultValue),
                    isPrimaryAspect,
                    introducedByGame,
                    lastEdited
            );
            this.defaultValue = defaultValue;
        }

        public boolean getDefaultValue() {
            return defaultValue;
        }
    }

    public class ChoiceAspectDTO extends AspectDTO {

        private List<String> choices;
        private DefaultOption defaultValue; // or "random"

        public ChoiceAspectDTO(
                String name,
                List<String> choices,
                DefaultOption defaultValue,
                boolean isPrimaryAspect,
                String introducedByGame,
                long lastEdited
        ) {
            super(
                    name,
                    AspectType.CHOICE,
                    defaultValue,
                    isPrimaryAspect,
                    introducedByGame,
                    lastEdited
            );
            this.choices = choices;
        }
    }
}
