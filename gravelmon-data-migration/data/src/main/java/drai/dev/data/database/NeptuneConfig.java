package drai.dev.data.database;

/**
 * Configuration class for Neptune database connection
 * Load these values from environment variables or configuration files
 */
public class NeptuneConfig {
    public static final String ENDPOINT = System.getenv("NEPTUNE_ENDPOINT") != null 
            ? System.getenv("NEPTUNE_ENDPOINT") 
            : "localhost";
    
    public static final int PORT = System.getenv("NEPTUNE_PORT") != null 
            ? Integer.parseInt(System.getenv("NEPTUNE_PORT")) 
            : 8182;
    
    public static final boolean USE_SSL = System.getenv("NEPTUNE_USE_SSL") != null 
            ? Boolean.parseBoolean(System.getenv("NEPTUNE_USE_SSL")) 
            : false;
    
    public static final int CONNECTION_TIMEOUT = 30000; // 30 seconds
    public static final int REQUEST_TIMEOUT = 60000;    // 60 seconds
}
