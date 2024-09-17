interface Sshooter {
    type: "S-shooter"
}

interface Shooter {
    type: "N-shooter"
    sps: number
}

interface Zombies {
    type: "Zombies"
    hp: number
}

export interface Game {
    map: Cell[][]
    zombies: [number, number, number][]
    round: number
}

export type Cell = Sshooter | Shooter | Zombies | undefined