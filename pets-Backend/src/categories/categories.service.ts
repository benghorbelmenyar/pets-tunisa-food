import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) { }

    create(createCategoryDto: CreateCategoryDto) {
        const createdCategory = new this.categoryModel(createCategoryDto);
        return createdCategory.save();
    }

    findAll() {
        return this.categoryModel.find().exec();
    }

    async findOne(id: string) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category #${id} not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const existingCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
        if (!existingCategory) {
            throw new NotFoundException(`Category #${id} not found`);
        }
        return existingCategory;
    }

    async remove(id: string) {
        const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!deletedCategory) {
            throw new NotFoundException(`Category #${id} not found`);
        }
        return deletedCategory;
    }
}
