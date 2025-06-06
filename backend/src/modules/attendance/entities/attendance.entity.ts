import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { Transform } from 'class-transformer';

@Entity()
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.records, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'date' })
  date: Date; // YYYY-MM-DD 형식

  @Column({ type: 'timestamp', nullable: true })
  checkIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOut: Date;
}
