package drai.dev.untitled.neoforge;

import drai.dev.untitled.Untitled;
import net.neoforged.fml.common.Mod;

@Mod(Untitled.MOD_ID)
public final class UntitledNeoForge {
    public UntitledNeoForge() {
        // Run our common setup.
        Untitled.init();
    }
}
