export enum CommonLayerNames {
    Emissive = "emissive",
    TransparentEmissive = "transparentEmissive",
    Tail = "tail",
    Transparent_Emissive = "transparent_emissive",
    Emissive2 = "emissive2",
    Flame = "flame",
    Glow = "glow",
}

//texturename, model name and poser name will all be solved programmatically
export interface ResolverLayer {
    name: string | CommonLayerNames;
    textureName: string;
    isEmissive?: boolean;
    isTranslucent?: boolean;
    framerate?: number;
    loops: boolean;
    numberOfFrames?: number;
}

export interface ResolverData {
    layers: ResolverLayer[];
    variationForAspectChoice?: {
        aspect: string;
        choice: string;
    };
}