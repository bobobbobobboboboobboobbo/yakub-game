class Player {
    constructor() {
        this.x = 50; this.y = 300;
        this.hp = 100;
        this.monstersCollected = 0;
        this.hasDisabledReactor = false;
    }
}

class GeorgeDroid {
    constructor() {
        this.x = 600; this.y = 200;
        this.hp = 500;
        this.isVulnerable = false;
    }
}

class Kirkinator {
    constructor() {
        this.x = 100; this.y = 300;
        this.name = "General Kirkinator";
    }
    help() {
        return "The Kirkinator provides cover fire!";
    }
}
