ALTER TABLE "8hourrelay_dev_raceEntries" DROP CONSTRAINT "8hourrelay_dev_raceEntries_promoCodeId_8hourrelay_dev_promoCodes_id_fk";
--> statement-breakpoint
ALTER TABLE "8hourrelay_dev_raceEntries" ALTER COLUMN "promoCodeId" SET DATA TYPE varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_raceEntries" ADD CONSTRAINT "8hourrelay_dev_raceEntries_promoCodeId_8hourrelay_dev_promoCodes_promoCodeId_fk" FOREIGN KEY ("promoCodeId") REFERENCES "public"."8hourrelay_dev_promoCodes"("promoCodeId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
