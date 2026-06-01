import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PrivyAuthGuard } from '../auth/guards/privy-auth.guard';
import {
  CreateMockCardPaymentDto,
  CreateProductDto,
  CreateSaleDto,
  UpdateProductDto,
} from './dto/merchant.dto';
import { MerchantService } from './merchant.service';

@Controller('merchant')
@UseGuards(PrivyAuthGuard)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('products')
  products(@Req() req: any) {
    return this.merchantService.listProducts(req.user);
  }

  @Post('products')
  createProduct(@Req() req: any, @Body() body: CreateProductDto) {
    return this.merchantService.createProduct(req.user, body);
  }

  @Patch('products/:id')
  updateProduct(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ) {
    return this.merchantService.updateProduct(req.user, id, body);
  }

  @Delete('products/:id')
  deleteProduct(@Req() req: any, @Param('id') id: string) {
    return this.merchantService.deleteProduct(req.user, id);
  }

  @Get('sales')
  sales(@Req() req: any) {
    return this.merchantService.listSales(req.user);
  }

  @Post('sales')
  createSale(@Req() req: any, @Body() body: CreateSaleDto) {
    return this.merchantService.createSale(req.user, body);
  }

  @Post('card-payments/mock')
  createMockCardPayment(
    @Req() req: any,
    @Body() body: CreateMockCardPaymentDto,
  ) {
    return this.merchantService.createMockCardPayment(req.user, body);
  }
}
