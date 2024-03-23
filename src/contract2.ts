import { NearBindgen, initialize, call, near, NearPromise, PromiseIndex } from "near-sdk-js";
import { AccountId } from "near-sdk-js/lib/types";

const FIVE_TGAS = BigInt("50000000000000");
const NO_DEPOSIT = BigInt(0);
const NO_ARGS = JSON.stringify({});

@NearBindgen({})
class Bridge {
    nft_account: AccountId = "";

    @initialize({})
    init({ nft_account }: { nft_account: AccountId }) {
        this.nft_account = nft_account;
    }

    @call({})
    bridge_to(): NearPromise {
      const promise = NearPromise.new(this.nft_account)
      .functionCall("burn", JSON.stringify({}), NO_DEPOSIT, FIVE_TGAS)
      .then(
        NearPromise.new(near.currentAccountId())
        .functionCall("callback", NO_ARGS, NO_DEPOSIT, FIVE_TGAS)
      );

      return promise.asReturn();
    }

    @call({})
    bridge_from(): NearPromise {
      const promise = NearPromise.new(this.nft_account)
      .functionCall("mint", null, NO_DEPOSIT, FIVE_TGAS)
      .then(
        NearPromise.new(near.currentAccountId())
        .functionCall("callback", NO_ARGS, NO_DEPOSIT, FIVE_TGAS)
      );

      return promise.asReturn();
    }

    @call({privateFunction: true})
    callback(): boolean {
      let { success } = promiseResult();

      if (success) {
        near.log(`Success!`);
        return true;
      } else {
        near.log("Promise failed...");
        return false;
      }
    }
}

function promiseResult(): {result: string, success: boolean}{
    let result, success;
    
    try{ result = near.promiseResult(0 as PromiseIndex); success = true }
    catch{ result = undefined; success = false }
    
    return {result, success}
};
