import { Account } from 'src/account/account.entity';
import { Competitor } from 'src/account/competitor.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 320, type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', length: 35, type: 'varchar' })
  lastName: string;

  @Column({
    name: 'display_name',
    length: 64,
    type: 'varchar',
    nullable: false,
  })
  displayName: string;

  @Column({
    name: 'email',
    length: 320,
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ name: 'picture', nullable: true, type: 'varchar' })
  picture: string;

  @Column({ name: 'verified', type: 'boolean', default: false })
  verified: boolean;

  @Column('text', { name: 'roles', array: true, default: ['user'] })
  roles: string[];

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @OneToMany(() => Competitor, (competitor) => competitor.user)
  competitors: Competitor[];

  @Column({
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    type: 'timestamp with time zone',
  })
  updatedAt: Date;
}
