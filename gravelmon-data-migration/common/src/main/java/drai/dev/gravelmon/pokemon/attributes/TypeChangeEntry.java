package drai.dev.gravelmon.pokemon.attributes;

public class TypeChangeEntry {
    String from;
    String to;

    public TypeChangeEntry(String from, String to) {
        this.from = from;
        this.to = to;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }
}
