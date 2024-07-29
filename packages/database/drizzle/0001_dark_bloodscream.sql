CREATE TABLE IF NOT EXISTS "8hourrelay_dev_coupons" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"amountOff" integer,
	"currency" varchar(10),
	"percentOff" integer,
	"valid" boolean DEFAULT true NOT NULL,
	"timesRedeemed" integer DEFAULT 0 NOT NULL,
	"duration" varchar(256),
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "8hourrelay_dev_promoCodes" RENAME COLUMN "apiId" TO "promoCodeId";--> statement-breakpoint
ALTER TABLE "8hourrelay_dev_promoCodes" ALTER COLUMN "promoCodeId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "8hourrelay_dev_promoCodes" ADD COLUMN "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "8hourrelay_dev_promoCodes" ADD COLUMN "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE "8hourrelay_dev_promoCodes" ADD COLUMN "couponId" varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_promoCodes" ADD CONSTRAINT "8hourrelay_dev_promoCodes_couponId_8hourrelay_dev_coupons_id_fk" FOREIGN KEY ("couponId") REFERENCES "public"."8hourrelay_dev_coupons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
