import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1763041145717 implements MigrationInterface {
    name = 'Migrations1763041145717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('active', 'paused', 'deleted')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "schedule" character varying(50) NOT NULL, "webhook_url" text NOT NULL, "payload" jsonb NOT NULL, "max_retry" integer NOT NULL DEFAULT '3', "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'active', "is_enabled" boolean NOT NULL DEFAULT true, "last_execution" TIMESTAMP, "next_execution" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6086c8dafbae729a930c04d865" ON "tasks" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_c72a88d9f3451f7832bcdbbc21" ON "tasks" ("is_enabled") `);
        await queryRunner.query(`CREATE INDEX "IDX_821a1048f213f20547ffa0d306" ON "tasks" ("next_execution") `);
        await queryRunner.query(`CREATE TYPE "public"."task_logs_status_enum" AS ENUM('success', 'failed', 'retrying')`);
        await queryRunner.query(`CREATE TABLE "task_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "task_id" uuid NOT NULL, "execution_time" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."task_logs_status_enum" NOT NULL, "retry_count" integer NOT NULL DEFAULT '0', "response_status" integer, "response_body" text, "error_message" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9754457a29b4ffbb772e8a3039c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fdafd5e130ca3d2a7c12f957c5" ON "task_logs" ("task_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d5a7dd5c9010124cdc13ca8c03" ON "task_logs" ("execution_time") `);
        await queryRunner.query(`CREATE INDEX "IDX_d73bc40e3248320e2ae1e03e0b" ON "task_logs" ("status") `);
        await queryRunner.query(`ALTER TABLE "task_logs" ADD CONSTRAINT "FK_fdafd5e130ca3d2a7c12f957c5d" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_logs" DROP CONSTRAINT "FK_fdafd5e130ca3d2a7c12f957c5d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d73bc40e3248320e2ae1e03e0b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d5a7dd5c9010124cdc13ca8c03"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdafd5e130ca3d2a7c12f957c5"`);
        await queryRunner.query(`DROP TABLE "task_logs"`);
        await queryRunner.query(`DROP TYPE "public"."task_logs_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_821a1048f213f20547ffa0d306"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c72a88d9f3451f7832bcdbbc21"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6086c8dafbae729a930c04d865"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
    }

}
