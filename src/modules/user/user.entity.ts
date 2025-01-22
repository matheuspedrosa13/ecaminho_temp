import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('eca_users')
export class EcaUsers {
  @PrimaryGeneratedColumn()
  pk_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  user_lastname: string;

  @Column({ type: 'date', nullable: false })
  birth: Date;

  @Column({ type: 'int', nullable: false })
  pfk_eca_genders_id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  user_password: string;

  @Column({ type: 'int', nullable: false })
  pfk_eca_companies_id: number;

  @Column({ type: 'varchar', length: 14, unique: true, nullable: false })
  cpf: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pix: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  telephone: string | null;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: true })
  cnh: string | null;

  @Column({ type: 'int', nullable: true })
  pfk_eca_vehicles_id: number | null;

  @Column({ type: 'bytea', nullable: false })
  profile_photo: Buffer;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creation_date: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  change_date: Date | null;
}
