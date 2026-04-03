import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { Model } from 'mongoose';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
    constructor(@InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>) { }

    create(createPromotionDto: CreatePromotionDto) {
        const createdPromotion = new this.promotionModel(createPromotionDto);
        return createdPromotion.save();
    }

    findAll(activeOnly?: boolean) {
        const filters: any = {};
        if (activeOnly) {
            filters.isActive = true;
            const now = new Date();
            filters.startDate = { $lte: now };
            filters.endDate = { $gte: now };
        }
        return this.promotionModel.find(filters).populate('applicableProducts').exec();
    }

    async findOne(id: string) {
        const promotion = await this.promotionModel.findById(id).populate('applicableProducts').exec();
        if (!promotion) {
            throw new NotFoundException(`Promotion #${id} not found`);
        }
        return promotion;
    }

    async update(id: string, updatePromotionDto: UpdatePromotionDto) {
        const existingPromotion = await this.promotionModel.findByIdAndUpdate(id, updatePromotionDto, { new: true }).exec();
        if (!existingPromotion) {
            throw new NotFoundException(`Promotion #${id} not found`);
        }
        return existingPromotion;
    }

    async remove(id: string) {
        const deletedPromotion = await this.promotionModel.findByIdAndDelete(id).exec();
        if (!deletedPromotion) {
            throw new NotFoundException(`Promotion #${id} not found`);
        }
        return deletedPromotion;
    }
}
