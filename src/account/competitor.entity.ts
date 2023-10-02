import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'competitors' })
export class Competitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id', type: 'varchar' })
  accountId: string;

  @Column({ name: 'username', type: 'varchar' })
  username: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({
    name: 'provider',
    default: 'instagram',
    type: 'varchar',
  })
  provider: string;

  @Column({ name: 'picture_url', type: 'varchar', nullable: true })
  picture_url: string;

  @ManyToOne(() => User, (user) => user.competitors)
  user: User;
}
