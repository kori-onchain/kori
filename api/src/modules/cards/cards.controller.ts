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
import { CardsService } from './cards.service';
import {
  CreateCardDto,
  CreatePurchaseDto,
  UpdateCardLimitDto,
} from './dto/card.dto';

@Controller('cards')
@UseGuards(PrivyAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  list(@Req() req: any) {
    return this.cardsService.list(req.user.id);
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateCardDto) {
    return this.cardsService.create(req.user.id, body);
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.get(req.user.id, id);
  }

  @Get(':id/details')
  details(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.getDetails(req.user.id, id);
  }

  @Patch(':id/freeze')
  freeze(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.toggleFreeze(req.user.id, id);
  }

  @Patch(':id/online')
  online(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.toggleOnline(req.user.id, id);
  }

  @Patch(':id/limit')
  limit(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateCardLimitDto,
  ) {
    return this.cardsService.updateLimit(req.user.id, id, body.limitTotalCents);
  }

  @Post(':id/regenerate')
  regenerate(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.regenerate(req.user.id, id);
  }

  @Post(':id/purchases')
  purchase(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: CreatePurchaseDto,
  ) {
    return this.cardsService.purchase(req.user.id, id, body);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.cardsService.remove(req.user.id, id);
  }
}
