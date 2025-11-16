import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Task } from './Task.entity';

export enum LogStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  RETRYING = 'retrying',
}

@Entity('task_logs')
export class TaskLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  task_id: string;

  @ManyToOne(() => Task, (task) => task.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Index()
  execution_time: Date;

  @Column({
    type: 'enum',
    enum: LogStatus,
  })
  @Index()
  status: LogStatus;

  @Column({ type: 'int', default: 0 })
  retry_count: number;

  @Column({ type: 'int', nullable: true })
  response_status: number;

  @Column({ type: 'text', nullable: true })
  response_body: string;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @CreateDateColumn()
  created_at: Date;
}

