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

function serializeResolverLayer(layer: ResolverLayer) {
    return {
        name: layer.name,
        textureName: layer.textureName,
        isEmissive: layer.isEmissive,
        isTranslucent: layer.isTranslucent,
        framerate: layer.framerate,
        loops: layer.loops,
        numberOfFrames: layer.numberOfFrames
    }
}

function deserializeResolverLayer(data: any) : ResolverLayer {
    return {
        name: data.name,
        textureName: data.textureName,
        isEmissive: data.isEmissive,
        isTranslucent: data.isTranslucent,
        framerate: data.framerate,
        loops: data.loops,
        numberOfFrames: data.numberOfFrames
    }
}

export function serializeResolverData(resolverData: ResolverData) {
    return {
        layers: resolverData.layers.map(layer => serializeResolverLayer(layer)),
        variationForAspectChoice: resolverData.variationForAspectChoice ? {
            aspect: resolverData.variationForAspectChoice.aspect,
            choice: resolverData.variationForAspectChoice.choice
        } : undefined
    }
}

export function deserializeResolverData(data: any) : ResolverData {
    return {
        layers: data.layers.map((layer: any) => deserializeResolverLayer(layer)),
        variationForAspectChoice: data.variationForAspectChoice ? {
            aspect: data.variationForAspectChoice.aspect,
            choice: data.variationForAspectChoice.choice
        } : undefined
    }
}