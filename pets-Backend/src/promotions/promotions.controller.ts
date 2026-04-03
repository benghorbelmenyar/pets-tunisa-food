import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/entities/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new promotion (Admin only)' })
    create(@Body() createPromotionDto: CreatePromotionDto) {
        return this.promotionsService.create(createPromotionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all promotions' })
    @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
    findAll(@Query('activeOnly') activeOnly?: string) {
        const isActiveOnly = activeOnly === 'true';
        return this.promotionsService.findAll(isActiveOnly);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a promotion by id' })
    findOne(@Param('id') id: string) {
        return this.promotionsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a promotion (Admin only)' })
    update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
        return this.promotionsService.update(id, updatePromotionDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a promotion (Admin only)' })
    remove(@Param('id') id: string) {
        return this.promotionsService.remove(id);
    }
}
