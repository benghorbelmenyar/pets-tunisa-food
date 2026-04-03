import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(Contact.name) private contactModel: Model<ContactDocument>) { }

  async create(createContactDto: any) {
    const newContact = new this.contactModel(createContactDto);
    return newContact.save();
  }

  async findAll() {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) throw new NotFoundException('Message not found');
    return contact;
  }

  async update(id: string, updateContactDto: any) {
    const updated = await this.contactModel.findByIdAndUpdate(id, updateContactDto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Message not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.contactModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Message not found');
    return deleted;
  }
}
