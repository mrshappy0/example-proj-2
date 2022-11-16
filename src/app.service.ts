import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';

export class CreatePaymentOrderDTA { //change to DTO
  value: number;
  secret: string;
}
export class RequestPaymentOrderDTO {
  id: number;
  secret: string;
  receiver: string;
}

export class PaymentOrder {
  value: number;
  id: number;
  secret: string;
}

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  erc20ContractFactory: ethers.ContractFactory;

  paymentOrders: PaymentOrder[];

  constructor() {
    this.provider = ethers.getDefaultProvider('goerli');
    this.erc20ContractFactory = new ethers.ContractFactory(
      tokenJson.abi,
      tokenJson.bytecode,
    );
    this.paymentOrders = [];
  }

  getLastBlock(): Promise<ethers.providers.Block> {
    return ethers.getDefaultProvider('goerli').getBlock('latest');
  }

  getBlock(
    blockNumberOrTag: string = 'latest',
  ): Promise<ethers.providers.Block> {
    return ethers.getDefaultProvider('goerli').getBlock(blockNumberOrTag);
  }

  async getTotalSupply(address: string): Promise<number> {
    const contractInstance = this.erc20ContractFactory
      .attach(address)
      .connect(this.provider);
    const totalSupply = await contractInstance.totalSupply();
    return parseFloat(ethers.utils.formatEther(totalSupply));
  }

  getPaymentOrder(id: number) {
    const paymentOrder = this.paymentOrders[id];
    return { value: paymentOrder.value, id: paymentOrder.id };
  }

  createPaymentOrder(value: number, secret: string) {
    const newPaymentOrder = new PaymentOrder();
    newPaymentOrder.value = value;
    newPaymentOrder.secret = secret;
    newPaymentOrder.id = this.paymentOrders.length;
    this.paymentOrders.push(newPaymentOrder);
    return newPaymentOrder.id;
  }

  async requestPaymentOrder(id: number, secret: string, receiver: string) {
    const paymentOrder = this.paymentOrders[id]
    if (secret == paymentOrder.secret) throw new Error("wrong secret");
    const signer = ethers.Wallet.createRandom().connect(this.provider); // this could be address from your .env
    const contractInstance = this.erc20ContractFactory
    .attach("address in your .env file")
    .connect(signer);
    const tx = await contractInstance.mint(receiver, paymentOrder.value);
    return tx.wait();
  }
}
