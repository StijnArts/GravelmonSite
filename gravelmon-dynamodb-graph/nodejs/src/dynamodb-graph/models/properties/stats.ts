export class Stats {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    placeholder?: boolean;

    constructor(hp: number, attack: number, defense: number, specialAttack: number, specialDefense: number, speed: number, placeholder: boolean = false) {
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
        this.speed = speed;
        this.placeholder = placeholder;
    }

    public getTotal(): number {
        return this.hp + this.attack + this.defense + this.specialAttack + this.specialDefense + this.speed;
    }

    public serialize(): Record<string, any> {
        return {
            hp: this.hp,
            attack: this.attack,
            defense: this.defense,
            specialAttack: this.specialAttack,
            specialDefense: this.specialDefense,
            speed: this.speed,
            placeholder: this.placeholder
        }
    }

    public static deserialize(data: any): Stats {
        return new Stats(
            data.hp,
            data.attack,
            data.defense,
            data.specialAttack,
            data.specialDefense,
            data.speed,
            data.placeholder || false
        );
    }
}