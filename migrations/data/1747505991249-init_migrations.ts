import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrations1747505991249 implements MigrationInterface {
    name = 'InitMigrations1747505991249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "security_device_to_user" ("device_id" character varying NOT NULL, "device_name" character varying NOT NULL DEFAULT 'Google', "ip" character varying NOT NULL DEFAULT '255.255.255.255', "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, CONSTRAINT "PK_7a1cce4139feb9620bff8d44ec0" PRIMARY KEY ("device_id"))`);
        await queryRunner.query(`ALTER TABLE "security_device_to_user" ADD CONSTRAINT "FK_980766af865924202aba719a251" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "security_device_to_user" DROP CONSTRAINT "FK_980766af865924202aba719a251"`);
        await queryRunner.query(`DROP TABLE "security_device_to_user"`);
    }

}
