import { FollowsRepository } from '@/app/repositories/follows-repository';
import { NotificationsRepository } from '@/notification/application/repositories/notifications-repository';
import { Notification } from '@/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository implements NotificationsRepository {
  findById(id: string): Promise<Notification | null> {
      throw new Error('Method not implemented.');
  }
  save(notification: Notification): Promise<void> {
      throw new Error('Method not implemented.');
  }
  items: Notification[] = []; 

  async create(follow: Notification): Promise<void> {
    await this.items.push(follow);
  }
}
