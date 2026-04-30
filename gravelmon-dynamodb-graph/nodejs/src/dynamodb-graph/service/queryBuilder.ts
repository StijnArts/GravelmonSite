export type SkCondition =
    | { eq: string }
    | { beginsWith: string }
    | { between: { start: string; end: string } }
    | { ge: string }
    | { le: string }
    | { gt: string }
    | { lt: string };

export class KeyConditionBuilder {
    private conditions: string[] = [];
    private attributeValues: Record<string, any> = {};
    private attributeNames: Record<string, string> = {};
    private valueCounter = 0;
    private nameCounter = 0;

    private getValuePlaceholder(value: any): string {
        const placeholder = `:val${this.valueCounter++}`;
        this.attributeValues[placeholder] = value;
        return placeholder;
    }

    private getNamePlaceholder(name: string): string {
        const placeholder = `#name${this.nameCounter++}`;
        this.attributeNames[placeholder] = name;
        return placeholder;
    }

    equals(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} = ${valPlaceholder}`);
        return this;
    }

    beginsWith(attribute: string, value: string): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`begins_with(${attrName}, ${valPlaceholder})`);
        return this;
    }

    between(attribute: string, start: any, end: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const startPlaceholder = this.getValuePlaceholder(start);
        const endPlaceholder = this.getValuePlaceholder(end);
        this.conditions.push(`${attrName} BETWEEN ${startPlaceholder} AND ${endPlaceholder}`);
        return this;
    }

    greaterThan(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} > ${valPlaceholder}`);
        return this;
    }

    greaterThanOrEqual(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} >= ${valPlaceholder}`);
        return this;
    }

    lessThan(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} < ${valPlaceholder}`);
        return this;
    }

    lessThanOrEqual(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} <= ${valPlaceholder}`);
        return this;
    }

    build(): { expression: string; values: Record<string, any>; names: Record<string, string> } {
        if (this.conditions.length === 0) {
            throw new Error("At least one condition must be added");
        }
        return {
            expression: this.conditions.join(" AND "),
            values: this.attributeValues,
            names: this.attributeNames,
        };
    }
}

export class FilterBuilder {
    private conditions: string[] = [];
    private attributeValues: Record<string, any> = {};
    private attributeNames: Record<string, string> = {};
    private valueCounter = 0;
    private nameCounter = 0;

    private getValuePlaceholder(value: any): string {
        const placeholder = `:val${this.valueCounter++}`;
        this.attributeValues[placeholder] = value;
        return placeholder;
    }

    private getNamePlaceholder(name: string): string {
        const placeholder = `#name${this.nameCounter++}`;
        this.attributeNames[placeholder] = name;
        return placeholder;
    }

    equals(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} = ${valPlaceholder}`);
        return this;
    }

    notEquals(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} <> ${valPlaceholder}`);
        return this;
    }

    beginsWith(attribute: string, value: string): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`begins_with(${attrName}, ${valPlaceholder})`);
        return this;
    }

    between(attribute: string, start: any, end: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const startPlaceholder = this.getValuePlaceholder(start);
        const endPlaceholder = this.getValuePlaceholder(end);
        this.conditions.push(`${attrName} BETWEEN ${startPlaceholder} AND ${endPlaceholder}`);
        return this;
    }

    greaterThan(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} > ${valPlaceholder}`);
        return this;
    }

    greaterThanOrEqual(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} >= ${valPlaceholder}`);
        return this;
    }

    lessThan(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} < ${valPlaceholder}`);
        return this;
    }

    lessThanOrEqual(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`${attrName} <= ${valPlaceholder}`);
        return this;
    }

    contains(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.conditions.push(`contains(${attrName}, ${valPlaceholder})`);
        return this;
    }

    attributeExists(attribute: string): this {
        const attrName = this.getNamePlaceholder(attribute);
        this.conditions.push(`attribute_exists(${attrName})`);
        return this;
    }

    attributeNotExists(attribute: string): this {
        const attrName = this.getNamePlaceholder(attribute);
        this.conditions.push(`attribute_not_exists(${attrName})`);
        return this;
    }

    build(): { expression: string; values: Record<string, any>; names: Record<string, string> } {
        if (this.conditions.length === 0) {
            throw new Error("At least one condition must be added");
        }
        return {
            expression: this.conditions.join(" AND "),
            values: this.attributeValues,
            names: this.attributeNames,
        };
    }

    buildOptional(): { expression?: string; values?: Record<string, any>; names?: Record<string, string> } {
        if (this.conditions.length === 0) {
            return {};
        }
        return this.build();
    }
}

export class UpdateBuilder {
    private setExpressions: string[] = [];
    private removeExpressions: string[] = [];
    private attributeValues: Record<string, any> = {};
    private attributeNames: Record<string, string> = {};
    private valueCounter = 0;
    private nameCounter = 0;

    private getValuePlaceholder(value: any): string {
        const placeholder = `:val${this.valueCounter++}`;
        this.attributeValues[placeholder] = value;
        return placeholder;
    }

    private getNamePlaceholder(name: string): string {
        const placeholder = `#name${this.nameCounter++}`;
        this.attributeNames[placeholder] = name;
        return placeholder;
    }

    set(attribute: string, value: any): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.setExpressions.push(`${attrName} = ${valPlaceholder}`);
        return this;
    }

    increment(attribute: string, value: number = 1): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.setExpressions.push(`${attrName} = ${attrName} + ${valPlaceholder}`);
        return this;
    }

    decrement(attribute: string, value: number = 1): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(value);
        this.setExpressions.push(`${attrName} = ${attrName} - ${valPlaceholder}`);
        return this;
    }

    remove(attribute: string): this {
        const attrName = this.getNamePlaceholder(attribute);
        this.removeExpressions.push(attrName);
        return this;
    }

    appendToList(attribute: string, values: any[]): this {
        const attrName = this.getNamePlaceholder(attribute);
        const valPlaceholder = this.getValuePlaceholder(values);
        this.setExpressions.push(`${attrName} = list_append(${attrName}, ${valPlaceholder})`);
        return this;
    }

    build(): { expression: string; values: Record<string, any>; names: Record<string, string> } {
        const expressions: string[] = [];

        if (this.setExpressions.length > 0) {
            expressions.push(`SET ${this.setExpressions.join(", ")}`);
        }

        if (this.removeExpressions.length > 0) {
            expressions.push(`REMOVE ${this.removeExpressions.join(", ")}`);
        }

        if (expressions.length === 0) {
            throw new Error("At least one SET or REMOVE operation must be added");
        }

        return {
            expression: expressions.join(" "),
            values: this.attributeValues,
            names: this.attributeNames,
        };
    }
}

// Generic Deserializer System
export type Deserializer<T> = (data: Record<string, any>) => T;
