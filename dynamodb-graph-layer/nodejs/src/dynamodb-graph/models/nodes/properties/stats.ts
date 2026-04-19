export class stats {
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
}