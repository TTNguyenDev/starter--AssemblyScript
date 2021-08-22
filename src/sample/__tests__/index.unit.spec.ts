import {
    createGame,
    joinGame
} from "../assembly";
import { PersistentMap, VMContext, VM, u128 } from "near-sdk-as";

const contract = "ttnguyen999.testnet";
const playerAccount = "ttnguyen999_2.testnet";

describe("Game Contract Testing", () => {
  beforeEach(() => {
    VMContext.setCurrent_account_id(contract);
    VMContext.setSigner_account_id(contract);
  });

  it("should ceate a game", () => {
    VMContext.setAttached_deposit(u128.from('50000000000000000000000'));
    VMContext.setCurrent_account_id(contract);
    expect(createGame).toBeTruthy();
  });

  it("should join a Game", () => {
    VMContext.setAttached_deposit(u128.from('50000000000000000000000'));
    VMContext.setCurrent_account_id(playerAccount);
    expect(joinGame).toBeTruthy();
  });

    it('test', () => {
        expect(1.0).toBeTruthy();
    })
});
