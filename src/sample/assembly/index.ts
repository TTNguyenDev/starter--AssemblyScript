import { context, RNG, ContractPromiseBatch, PersistentVector, PersistentMap, u128 } from "near-sdk-as";

enum GameState {
    Created,
    Joined,
    Ended
}

@nearBindgen
export class Roulette {
    gameId: u32;
    player: string;
    guess: bool; //1 ~ odd and 0 ~ even
    initialAmount: u128;
    betAmount: u128;
    gameState: GameState;
    winner: string;

    constructor() {
        const rng = new RNG<u32>(1, u32.MAX_VALUE);
        const roll = rng.next();
        this.gameId = roll;
        this.player = 'None';
        this.betAmount = u128.Zero;
        this.guess = false;
        this.initialAmount = context.attachedDeposit;
        this.gameState = GameState.Created;
        this.winner = context.sender;
    }
}

const games = new PersistentVector<Roulette>('g');
const gameMap = new PersistentMap<u32, Roulette>('gm');

export function createGame(): u32 {
    const roulette = new Roulette();
    // games.push(roulette);
    gameMap.set(roulette.gameId, roulette);
    return roulette.gameId;
}

export function joinGame(_gameId: u32, _guess: boolean): boolean {
    if (context.attachedDeposit == u128.Zero) {
        return false;
    }
    const game = gameMap.getSome(_gameId);
    game.guess = _guess;
    game.player = context.sender;
    game.gameState = GameState.Joined;
    game.betAmount = context.attachedDeposit;
    gameMap.set(_gameId, game);
    return true;
}

export function endGame(_gameId: u32): string {
    const game = gameMap.getSome(_gameId);
    const rng = new RNG<u8>(1, 36);
    const roll = rng.next();

    if (roll % 2 == 1) {
        if (game.guess == true)  {
            game.winner = game.player;
        }        
    } else {
        if (game.guess == false) {
            game.winner = game.player;
        }
    }
    
    game.gameState = GameState.Ended;
    gameMap.set(_gameId, game);
    
    const to_beneficiary = ContractPromiseBatch.create(game.winner);
    to_beneficiary.transfer(u128.add(game.betAmount, game.initialAmount));

    return game.winner;
}

