import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

    create(createProductDto: CreateProductDto) {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }

    findAll(query: any) {
        const filters: any = {};
        if (query.search) {
            filters.name = { $regex: query.search, $options: 'i' };
        }
        if (query.category) {
            filters.category = query.category;
        }
        if (query.promo === 'true') {
            filters.isPromo = true;
        }
        return this.productModel.find(filters).sort({ createdAt: -1 }).populate('category').exec();
    }

    async findOne(id: string) {
        const product = await this.productModel.findById(id).populate('category').exec();
        if (!product) {
            throw new NotFoundException(`Product #${id} not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const existingProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
        if (!existingProduct) {
            throw new NotFoundException(`Product #${id} not found`);
        }
        return existingProduct;
    }

    async remove(id: string) {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new NotFoundException(`Product #${id} not found`);
        }
        return deletedProduct;
    }
}
