import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) { }

    async create(createDto: { userId?: string, sessionId?: string, title: string, message: string }) {
        const notification = new this.notificationModel(createDto);
        return notification.save();
    }

    async findAll(query: { userId?: string, sessionId?: string }) {
        if (!query.userId && !query.sessionId) {
            return [];
        }

        const filter = query.userId ? { userId: query.userId } : { sessionId: query.sessionId };
        return this.notificationModel.find(filter).sort({ createdAt: -1 }).limit(20).exec();
    }

    async markAsRead(id: string) {
        return this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
    }
}
