import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'accounts' })
export class Account {
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

  @Column({ name: 'token', nullable: true, type: 'varchar' })
  token: string;
}
