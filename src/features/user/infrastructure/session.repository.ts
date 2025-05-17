import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityDeviceToUser } from '../domain/device.entity';
import { User } from '../domain/user.entity';

@Injectable()
export class SessionsRepository {
    constructor(@InjectRepository(SecurityDeviceToUser) private sessionsRepository: Repository<SecurityDeviceToUser>) {}
    private async save(entity: SecurityDeviceToUser): Promise<string> {
        const result = await this.sessionsRepository.save(entity);
        return result.deviceId;
    }

    async findSessionByDeviceId(deviceId: string): Promise<SecurityDeviceToUser | void> {
        const result = await this.sessionsRepository
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.user', 'user') // Добавляем это для загрузки пользователя
            .select(['s.deviceId', 's.deviceName', 's.ip', 's.issuedAt', 's.deletedAt', 'user.id'])
            .where('s.deleted_at IS NULL AND s.device_id = :deviceId', { deviceId })
            .getOne();
        if (!result) {
            return void 0;
        }
        return result;
    }

    async deleteAllSessions(userId: string, deviceId: string): Promise<void> {
        const issuedAt = new Date().toISOString();
        await this.sessionsRepository
            .createQueryBuilder()
            .update(SecurityDeviceToUser)
            .set({ deletedAt: issuedAt })
            .where('device_id <> :deviceId AND user_id = :userId', { deviceId, userId })
            .execute();
    }
    async createSession(dto: any, user: User) {
        const result = SecurityDeviceToUser.buildInstance(dto, user);
        await this.save(result);
    }

    async deleteSession(session: SecurityDeviceToUser) {
        session.markDeleted();
        await this.save(session);
    }
    async updateSession(session: SecurityDeviceToUser) {
        session.updateIssuedAt();
        await this.save(session);
    }
}
