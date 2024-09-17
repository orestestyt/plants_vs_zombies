import './App.css'
import {Cell, Game} from "./types.ts";
import {useState} from "react";

function App() {
    const [game, setGame] = useState(createMap())

    function onClick() {
        const gameCopy = JSON.parse(JSON.stringify(game));
        setGame(gameUpdate(gameCopy));
    }

    return (
        <div>
            <DisplayGame game={game}/>
            <button onClick={onClick} style={{width: '100px', height: '100px'}}>
                Next Round
            </button>
        </div>
    )
}

//returns true if shoot zombie
function damageZombie(game: Game, y, i) {
    const zombie = game.map[y][i]
    if (zombie?.type !== "Zombies") {
        return false;
    }
    zombie.hp--
    if (zombie.hp === 0)
        game.map[y][i] = undefined
    return true;
}

function gameUpdate(game: Game) {
    //Zombie attacks
    const coordinatesZ = filter(game, (cell) => cell?.type == "Zombies")
    console.log(coordinatesZ)
    for (const {x, y} of coordinatesZ) {
        if (game.map[y][x - 1]?.type == "N-shooter" || game.map[y][x - 1]?.type == "S-shooter") {
            game.map[y][x - 1] = undefined
        }
        //Zombie moves
        else if (x > 0) {
            game.map[y][x - 1] = game.map[y][x];
            game.map[y][x] = undefined;
        } else if (x == 0)
            alert("GG N00B")
    }
    //Zombie spawns
    for (const [spawnRound, spawnRow, hp] of game.zombies) {
        if (spawnRound !== game.round) continue
        game.map[spawnRow][7] = {
            type: "Zombies",
            hp: hp
        }
    }
    //Plants shoots
    const coordinatesN = filter(game, (cell) => cell?.type == "N-shooter")
    const coordanitesS = filter(game, (cell) => cell?.type == "S-shooter")
    for (const {x, y, obj} of coordinatesN) {
        for (let j = 0; j < obj.sps; j++) {
            for (let i = x + 1; i < 8; i++) {
                if (damageZombie(game, y, i))
                    break;
            }
        }
    }
    for (const {x, y} of coordanitesS) {
        for (let i = x + 1, j = y + 1; i < 8 && j < 5; i++, j++) {
            if (damageZombie(game, j, i))
                break;
        }
        for (let i = x + 1, j = y - 1; i < 8 && j >= 0; i++, j--) {
            if (damageZombie(game, j, i))
                break;
        }
        for (let i = x + 1; i < 8; i++) {
            if (damageZombie(game, y, i))
                break;
        }
    }
    game.round++
    return game
}

function filter(game: Game, predicate: (cell: Cell) => boolean) {
    const result = []
    for (let x = 7; x >= 0; x--) {
        for (let y = 0; y <= 4; y++) {
            if (predicate(game.map[y][x]))
                result.push({x, y, obj: game.map[y][x]})
        }
    }
    return result
}

function createMap() {
    const plants = [
        '2       ',
        '  S     ',
        '21  S   ',
        '13      ',
        '2 3     '];
    const map = []
    for (const plantsRow of plants) {
        const plantsForPlanting = plantsRow.split("")
        const row = [];
        for (let i = 0; i < plantsForPlanting.length; i++) {
            const plant = plantsForPlanting[i];
            if (plant === " ") row[i] = undefined
            else if (plant === "S") row[i] = {
                type: "S-shooter"
            };
            else row[i] = {
                    type: "N-shooter",
                    sps: +plant,
                }
        }
        map.push(row)
    }
    const zombies = [[0, 4, 28], [1, 1, 6], [2, 0, 10], [2, 4, 15], [3, 2, 16], [3, 3, 13]] as [number, number, number][]
    const firstRound: Game = {map, zombies, round: 0}
    return firstRound
}

function DisplayGame(props) {
    console.log(props)
    const map2 = props.game.map.map((row, y) =>
        row.map((cell, x) => {
                if (cell?.type === "Zombies")
                    return <div className={"grid-item Zombies"} key={`${y}-${x}`}>{cell.hp}</div>
                else if (cell?.type === "S-shooter")
                    return <div className={"grid-item S-shooter"} key={`${y}-${x}`}>{"S-shooter"}</div>
                else if (cell?.type === "N-shooter")
                    return <div className={"grid-item N-shooter"} key={`${y}-${x}`}>{cell.sps}</div>
                else
                return <div className={"grid-item"} key={`${y}-${x}`}></div>
            }
        )).flat()

    return (
        <div className={"grid-container"}>
            {map2}
            <div style={{color: 'aqua'}}>
                {props.game.round} </div>
        </div>
    )
}

export default App

