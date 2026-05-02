package drai.dev.data.migration.dto.pokemon;

public record PokemonDTO() {
    public record PokemonIdentifier(String game, String name, String form) {}
}
