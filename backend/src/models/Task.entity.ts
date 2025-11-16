import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { TaskLog } from './TaskLog.entity';

export enum TaskStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  DELETED = 'deleted',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50 })
  schedule: string; // Cron expression

  @Column({ type: 'text' })
  webhook_url: string;

  @Column({ type: 'jsonb' })
  payload: object;

  @Column({ type: 'int', default: 3 })
  max_retry: number;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.ACTIVE,
  })
  @Index()
  status: TaskStatus;

  @Column({ type: 'boolean', default: true })
  @Index()
  is_enabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_execution: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  next_execution: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => TaskLog, (log) => log.task)
  logs: TaskLog[];
}

