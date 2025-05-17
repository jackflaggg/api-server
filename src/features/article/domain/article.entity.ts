import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from '../../../core/domain/base.model';
import { isNull, User } from '../../user/domain/user.entity';

@Entity('articles')
export class Article extends Base {
    @Column({ type: 'varchar', length: 55 })
    title: string;

    @Column({ type: 'varchar', length: 1000 })
    description: string;

    @ManyToOne(() => User, user => user.articles)
    @JoinColumn({ name: 'author_id' })
    author: User;
    @Column({ name: 'author_id' })
    authorId: string;

    public static buildInstance(title: string, description: string, authorId: string) {
        const article = new this();
        article.title = title;
        article.description = description;
        article.authorId = authorId;
        return article;
    }

    makeDeleted(): void {
        if (!isNull(this.deletedAt)) throw new Error('Коммент уже был помечен на удаление!');
        this.deletedAt = new Date();
    }

    updateContent(title: string, description: string): void {
        this.title = title;
        this.description = description;
    }
}
