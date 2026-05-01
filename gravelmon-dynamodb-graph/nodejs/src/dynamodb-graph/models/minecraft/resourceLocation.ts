export class ResourceLocation {
    namespace: string;
    path: string;
    constructor(namespace: string, path: string) {
        this.namespace = namespace;
        this.path = path;
    }

    toString(): string {
        return `${this.namespace}:${this.path}`;
    }

    static fromString(location: string): ResourceLocation {
        const [namespace, path] = location.split(":");
        return new ResourceLocation(namespace, path);
    }
}