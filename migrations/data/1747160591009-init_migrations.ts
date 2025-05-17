import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrations1747160591009 implements MigrationInterface {
    name = 'InitMigrations1747160591009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "email_confirmation_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "confirmation_code" character varying(255) NOT NULL, "expiration_date" TIMESTAMP WITH TIME ZONE, "is_confirmed" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_56925ba65f907e81ba65d5e0ef" UNIQUE ("user_id"), CONSTRAINT "PK_e313c3be9d6ffd32b0d35607445" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" ADD CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "email_confirmation_to_user" DROP CONSTRAINT "FK_56925ba65f907e81ba65d5e0ef4"`);
        await queryRunner.query(`DROP TABLE "email_confirmation_to_user"`);
    }

}
