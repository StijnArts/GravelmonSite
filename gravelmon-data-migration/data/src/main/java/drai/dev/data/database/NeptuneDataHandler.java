package drai.dev.data.database;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.apache.tinkerpop.gremlin.driver.Client;
import org.apache.tinkerpop.gremlin.driver.Cluster;
import org.apache.tinkerpop.gremlin.driver.ResultSet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * Handles all interactions with AWS Neptune graph database
 * for storing Gravelmon Pokemon data and relationships
 */
public class NeptuneDataHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(NeptuneDataHandler.class);
    
    private Cluster cluster;
    private Client client;
    private final String neptuneEndpoint;
    private final int neptunePort;
    private final boolean useSSL;

    /**
     * Constructor with default settings
     * @param neptuneEndpoint The Neptune cluster endpoint
     */
    public NeptuneDataHandler(String neptuneEndpoint) {
        this(neptuneEndpoint, 8182, true);
    }
    
    /**
     * Constructor with custom settings
     * @param neptuneEndpoint The Neptune cluster endpoint
     * @param neptunePort The Neptune port
     * @param useSSL Whether to use SSL/TLS
     */
    public NeptuneDataHandler(String neptuneEndpoint, int neptunePort, boolean useSSL) {
        this.neptuneEndpoint = neptuneEndpoint;
        this.neptunePort = neptunePort;
        this.useSSL = useSSL;
    }
    
    /**
     * Initializes the connection to Neptune
     * Should be called before any database operations
     */
    public void connect() {
        try {
            this.cluster = Cluster.build()
                    .addContactPoint(neptuneEndpoint)
                    .port(neptunePort)
                    .enableSsl(useSSL)
                    .create();
            
            this.client = cluster.connect();
            LOGGER.info("Successfully connected to Neptune at {}:{}", neptuneEndpoint, neptunePort);
        } catch (Exception e) {
            LOGGER.error("Failed to connect to Neptune", e);
            throw new RuntimeException("Could not establish Neptune connection", e);
        }
    }

    /**
     * Executes a raw Gremlin query
     */
    private ResultSet executeQuery(String gremlinQuery) {
        try {
            LOGGER.trace("Executing query: {}", gremlinQuery);
            return client.submit(gremlinQuery);
        } catch (Exception e) {
            LOGGER.error("Error executing Gremlin query", e);
            throw new RuntimeException("Failed to execute Gremlin query", e);
        }
    }
    
    /**
     * Executes a query asynchronously
     */
    public CompletableFuture<ResultSet> executeQueryAsync(String gremlinQuery) {
        try {
            LOGGER.trace("Executing async query: {}", gremlinQuery);
            return client.submitAsync(gremlinQuery);
        } catch (Exception e) {
            LOGGER.error("Error executing async Gremlin query", e);
            CompletableFuture<ResultSet> future = new CompletableFuture<>();
            future.completeExceptionally(new RuntimeException("Failed to execute async Gremlin query", e));
            return future;
        }
    }
    
    /**
     * Closes the database connection
     * Should be called when the application shuts down
     */
    public void close() {
        try {
            if (client != null) {
                client.close();
            }
            if (cluster != null) {
                cluster.close();
            }
            LOGGER.info("Neptune connection closed");
        } catch (Exception e) {
            LOGGER.error("Error closing Neptune connection", e);
        }
    }
    
    /**
     * Utility method to escape single quotes in values
     */
    private String escapeSingleQuotes(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("'", "\\'");
    }
    
    /**
     * Checks if the Neptune connection is active
     */
    public boolean isConnected() {
        return client != null && cluster != null;
    }
}
