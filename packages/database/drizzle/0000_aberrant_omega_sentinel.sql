DO $$ BEGIN
 CREATE TYPE "public"."gender_type" AS ENUM('Male', 'Female');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."size_type" AS ENUM('2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'captain', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_emailInvitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(1024) NOT NULL,
	"gender" "gender_type" NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userId" integer,
	"teamId" integer,
	CONSTRAINT "8hourrelay_dev_emailInvitations_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"year" varchar(4) NOT NULL,
	"location" varchar(1024) NOT NULL,
	"time" varchar(256) NOT NULL,
	"registerDeadline" varchar(256) NOT NULL,
	"description" varchar(2048),
	"isActive" boolean NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "8hourrelay_dev_events_year_unique" UNIQUE("year")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(1024) NOT NULL,
	"name" varchar(256) NOT NULL,
	"message" varchar(1024) NOT NULL,
	"response" json,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_paymentStatus" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(256),
	"userId" integer NOT NULL,
	"teamId" integer,
	"raceEntryId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_promoCodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(256) NOT NULL,
	"discount" integer NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"maxUsage" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"apiId" varchar(256),
	CONSTRAINT "8hourrelay_dev_promoCodes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_raceEntries" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(256) NOT NULL,
	"lastName" varchar(256) NOT NULL,
	"preferName" varchar(256),
	"birthYear" varchar(4) NOT NULL,
	"personalBest" varchar(256),
	"gender" "gender_type" NOT NULL,
	"email" varchar(1024) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"year" varchar(4) NOT NULL,
	"wechatId" varchar(256),
	"isActive" boolean DEFAULT true NOT NULL,
	"isForOther" boolean DEFAULT false NOT NULL,
	"size" "size_type" NOT NULL,
	"emergencyName" varchar(256) NOT NULL,
	"emergencyPhone" varchar(15) NOT NULL,
	"medicalInfo" varchar(2048),
	"teamPassword" varchar(256),
	"emailConsent" boolean DEFAULT false NOT NULL,
	"smsOptIn" boolean DEFAULT false NOT NULL,
	"accepted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"userId" integer NOT NULL,
	"sessionId" varchar(256) NOT NULL,
	"promoCodeId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_race_entries_to_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"teamId" integer NOT NULL,
	"raceEntryId" integer NOT NULL,
	"userId" integer NOT NULL,
	"bib" varchar(256),
	"raceOrder" integer,
	"raceDuration" integer,
	"raceActualDistance" numeric,
	"raceAdjustedDistance" numeric,
	"raceCoefficient" numeric,
	"raceStartTime" varchar,
	"raceEndTime" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_races" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" varchar(4) NOT NULL,
	"name" varchar(256) NOT NULL,
	"isCompetitive" boolean NOT NULL,
	"description" varchar(2048),
	"entryFee" integer NOT NULL,
	"lowerAge" integer,
	"upperAge" integer,
	"maxTeamSize" integer,
	"minFemale" integer,
	"lookupKey" varchar(256),
	"stripePrice" json,
	"eventId" integer,
	CONSTRAINT "dev_unique_year_name" UNIQUE("year","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_stripeSessions" (
	"sessionId" varchar(256) PRIMARY KEY NOT NULL,
	"priceId" varchar(256) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"productId" varchar(256) NOT NULL,
	"paymentIntentId" varchar,
	"status" varchar(256) NOT NULL,
	"paymentStatus" varchar(256) NOT NULL,
	"payload" json,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) NOT NULL,
	"receiptNumber" varchar(256),
	"receiptUrl" varchar(1024)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" varchar(4) NOT NULL,
	"name" varchar(256) NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"slogan" varchar(1024),
	"photoUrl" varchar(1024),
	"password" varchar(256),
	"isOpen" boolean DEFAULT true,
	"state" varchar(10) DEFAULT 'PENDING',
	"captainId" integer,
	"userId" integer NOT NULL,
	"raceId" integer NOT NULL,
	"sessionId" varchar(256),
	CONSTRAINT "dev_unique_year_team_name" UNIQUE("year","name"),
	CONSTRAINT "dev_unique_year_user" UNIQUE("year","userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "8hourrelay_dev_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(1024),
	"uid" uuid NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"firstName" varchar(256),
	"lastName" varchar(256),
	"preferName" varchar(256),
	"gender" varchar(10),
	"wechatId" varchar(256),
	"birthYear" varchar(16),
	"personalBest" varchar(256),
	"avatarUrl" varchar(1024),
	"customerId" varchar(256),
	"phone" varchar(16),
	"address" varchar(1024),
	CONSTRAINT "8hourrelay_dev_users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_emailInvitations" ADD CONSTRAINT "8hourrelay_dev_emailInvitations_userId_8hourrelay_dev_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."8hourrelay_dev_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_emailInvitations" ADD CONSTRAINT "8hourrelay_dev_emailInvitations_teamId_8hourrelay_dev_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."8hourrelay_dev_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_paymentStatus" ADD CONSTRAINT "8hourrelay_dev_paymentStatus_sessionId_8hourrelay_dev_stripeSessions_sessionId_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."8hourrelay_dev_stripeSessions"("sessionId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_paymentStatus" ADD CONSTRAINT "8hourrelay_dev_paymentStatus_userId_8hourrelay_dev_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."8hourrelay_dev_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_paymentStatus" ADD CONSTRAINT "8hourrelay_dev_paymentStatus_teamId_8hourrelay_dev_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."8hourrelay_dev_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_paymentStatus" ADD CONSTRAINT "8hourrelay_dev_paymentStatus_raceEntryId_8hourrelay_dev_raceEntries_id_fk" FOREIGN KEY ("raceEntryId") REFERENCES "public"."8hourrelay_dev_raceEntries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_raceEntries" ADD CONSTRAINT "8hourrelay_dev_raceEntries_userId_8hourrelay_dev_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."8hourrelay_dev_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_raceEntries" ADD CONSTRAINT "8hourrelay_dev_raceEntries_sessionId_8hourrelay_dev_stripeSessions_sessionId_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."8hourrelay_dev_stripeSessions"("sessionId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_raceEntries" ADD CONSTRAINT "8hourrelay_dev_raceEntries_promoCodeId_8hourrelay_dev_promoCodes_id_fk" FOREIGN KEY ("promoCodeId") REFERENCES "public"."8hourrelay_dev_promoCodes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_race_entries_to_teams" ADD CONSTRAINT "8hourrelay_dev_race_entries_to_teams_teamId_8hourrelay_dev_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "public"."8hourrelay_dev_teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_race_entries_to_teams" ADD CONSTRAINT "8hourrelay_dev_race_entries_to_teams_raceEntryId_8hourrelay_dev_raceEntries_id_fk" FOREIGN KEY ("raceEntryId") REFERENCES "public"."8hourrelay_dev_raceEntries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_race_entries_to_teams" ADD CONSTRAINT "8hourrelay_dev_race_entries_to_teams_userId_8hourrelay_dev_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."8hourrelay_dev_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_races" ADD CONSTRAINT "8hourrelay_dev_races_eventId_8hourrelay_dev_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."8hourrelay_dev_events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_teams" ADD CONSTRAINT "8hourrelay_dev_teams_captainId_8hourrelay_dev_users_id_fk" FOREIGN KEY ("captainId") REFERENCES "public"."8hourrelay_dev_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_teams" ADD CONSTRAINT "8hourrelay_dev_teams_userId_8hourrelay_dev_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."8hourrelay_dev_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_teams" ADD CONSTRAINT "8hourrelay_dev_teams_raceId_8hourrelay_dev_races_id_fk" FOREIGN KEY ("raceId") REFERENCES "public"."8hourrelay_dev_races"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "8hourrelay_dev_teams" ADD CONSTRAINT "8hourrelay_dev_teams_sessionId_8hourrelay_dev_stripeSessions_sessionId_fk" FOREIGN KEY ("sessionId") REFERENCES "public"."8hourrelay_dev_stripeSessions"("sessionId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_index" ON "8hourrelay_dev_teams" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "uid_index" ON "8hourrelay_dev_users" USING btree ("uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_index" ON "8hourrelay_dev_users" USING btree ("email");