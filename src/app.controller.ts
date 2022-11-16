import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ethers } from 'ethers';
import { AppService, CreatePaymentOrderDTA, PaymentOrder, RequestPaymentOrderDTO } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('last-block')
  getLastBlock(): Promise<ethers.providers.Block> {
    return this.appService.getLastBlock();
  }
  @Get('block/:hash')
  getBlock(@Param('hash') hash: string): Promise<ethers.providers.Block> {
    return this.appService.getBlock();
  }
  @Get('total-supply/:address')
  getTotalSupply(@Param('address') address: string): Promise<number> {
    return this.appService.getTotalSupply(address);
  }

  @Get('payment-order/:id')
  getPaymentOrder(@Param('id') id: number): any {
    return this.appService.getPaymentOrder(id);
  }

  @Post('payment-order')
  createPaymentOrder(@Body() body: CreatePaymentOrderDTA): number {
    return this.appService.createPaymentOrder(body.value, body. secret);
  }

  @Post('request-payment')
  requestPaymentOrder(@Body() body: RequestPaymentOrderDTO): Promise<any> {
    return this.appService.requestPaymentOrder(body.id, body.secret, body.receiver);
  }
}
