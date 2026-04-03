import { Controller, Get, Query, Patch, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    async getNotifications(@Query('userId') userId?: string, @Query('sessionId') sessionId?: string) {
        return this.notificationsService.findAll({ userId, sessionId });
    }

    @Patch(':id/read')
    async markAsRead(@Param('id') id: string) {
        return this.notificationsService.markAsRead(id);
    }
}
