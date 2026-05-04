package drai.dev.data.migration.service;

import drai.dev.data.jsonwriters.*;

import java.io.*;
import java.net.*;
import java.net.http.*;

import static drai.dev.data.migration.service.MigrationUtil.*;

public class GravelmonWebAppMigrationService {

    private static final String ENV_ENDPOINT = "MIGRATION_ENDPOINT_URL";
    private static final String ENV_SECRET = "MIGRATION_SECRET";

    private final HttpClient httpClient;
    private final String endpointUrl;
    private final String secret;

    public GravelmonWebAppMigrationService(String endpointUrl) {
        this.httpClient = HttpClient.newHttpClient();

        this.endpointUrl = getEnvOrThrow(ENV_ENDPOINT);
        this.secret = getEnvOrThrow(ENV_SECRET);
    }

    public void migrate() {

    }

    private <T extends JsonSerializable> HttpResponse<String> sendDto(T dto, String endpoint) throws IOException, InterruptedException {
        var gson = dto.getJsonMapper();
        String json = gson.toJson(dto.toJson());

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endpointUrl+"/"+endpoint))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        return httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
