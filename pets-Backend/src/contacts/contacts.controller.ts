import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }

  @Post()
  create(@Body() createContactDto: any) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: any) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
