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

    serialize(): any {
        return {
                    namespace: this.namespace,
                    path: this.path
                }
    }

    static deserialize(data: any): ResourceLocation {
        if (typeof data === "object" && "namespace" in data && "path" in data) {
            return new ResourceLocation(data.namespace, data.path);
        } else {
            throw new Error(`Invalid ResourceLocation format: ${JSON.stringify(data)}`);
        }
    }
}