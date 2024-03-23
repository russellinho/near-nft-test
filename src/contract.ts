import { NearBindgen, call, view } from 'near-sdk-js';

@NearBindgen({})
class NFT {
  quantity: number = 0;

  @call({})
  mint() {
    this.quantity++;
  }

  @call({})
  burn() {
    if (this.quantity === 0) {
      throw "No quantity remaining";
    }
    this.quantity--;
  }

  @view({})
  get_quantity(): number { return this.quantity }
}
