-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('APPLE', 'GOOGLE');

-- CreateEnum
CREATE TYPE "AppEnvironment" AS ENUM ('SANDBOX', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "SubscriptionProvider" AS ENUM ('APP_STORE', 'REVENUECAT');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'GRACE_PERIOD', 'BILLING_RETRY', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "BudgetLevel" AS ENUM ('BUDGET', 'MODERATE', 'LUXURY');

-- CreateEnum
CREATE TYPE "TravelPace" AS ENUM ('RELAXED', 'BALANCED', 'PACKED');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('GENERATING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "TripVisibility" AS ENUM ('PRIVATE', 'UNLISTED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "TripSource" AS ENUM ('AI', 'MANUAL');

-- CreateEnum
CREATE TYPE "TripMemberRole" AS ENUM ('VIEWER', 'EDITOR');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('SIGHTSEEING', 'FOOD', 'ACTIVITY', 'TRANSPORT', 'LODGING', 'SHOPPING', 'FREE_TIME', 'OTHER');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "password_hash" TEXT,
    "email_verified_at" TIMESTAMPTZ(6),
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "plan_expires_at" TIMESTAMPTZ(6),
    "home_city" TEXT,
    "country_code" CHAR(2),
    "locale" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "user_id" UUID NOT NULL,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dietary" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "budget_level" "BudgetLevel" NOT NULL DEFAULT 'MODERATE',
    "pace" "TravelPace" NOT NULL DEFAULT 'BALANCED',
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "auth_identities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "family_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "device_name" TEXT,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),
    "last_used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "environment" "AppEnvironment" NOT NULL DEFAULT 'PRODUCTION',
    "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "provider" "SubscriptionProvider" NOT NULL,
    "environment" "AppEnvironment" NOT NULL DEFAULT 'PRODUCTION',
    "provider_customer_id" TEXT,
    "provider_subscription_id" TEXT,
    "product_id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "current_period_start" TIMESTAMPTZ(6),
    "current_period_end" TIMESTAMPTZ(6),
    "auto_renew_enabled" BOOLEAN,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_events" (
    "id" UUID NOT NULL,
    "provider" "SubscriptionProvider" NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "received_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),

    CONSTRAINT "webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_place_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "country_code" CHAR(2),
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "rating" DOUBLE PRECISION,
    "photo_url" TEXT,
    "metadata" JSONB,
    "refreshed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "forked_from_id" UUID,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "destination" TEXT NOT NULL,
    "destination_country_code" CHAR(2),
    "destination_lat" DOUBLE PRECISION,
    "destination_lng" DOUBLE PRECISION,
    "cover_image_url" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "duration_days" INTEGER NOT NULL,
    "traveler_count" INTEGER NOT NULL DEFAULT 1,
    "budget_level" "BudgetLevel" NOT NULL DEFAULT 'MODERATE',
    "pace" "TravelPace" NOT NULL DEFAULT 'BALANCED',
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "estimated_cost" DECIMAL(10,2),
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "source" "TripSource" NOT NULL DEFAULT 'AI',
    "status" "TripStatus" NOT NULL DEFAULT 'GENERATING',
    "visibility" "TripVisibility" NOT NULL DEFAULT 'PRIVATE',
    "share_slug" TEXT,
    "save_count" INTEGER NOT NULL DEFAULT 0,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_days" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "day_number" INTEGER NOT NULL,
    "date" DATE,
    "title" TEXT,
    "summary" TEXT,

    CONSTRAINT "trip_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL,
    "day_id" UUID NOT NULL,
    "place_id" UUID,
    "position" INTEGER NOT NULL,
    "act_type" "ActivityType" NOT NULL DEFAULT 'SIGHTSEEING',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location_name" TEXT,
    "start_minute" INTEGER,
    "duration_minutes" INTEGER,
    "estimated_cost" DECIMAL(10,2),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_trips" (
    "user_id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_trips_pkey" PRIMARY KEY ("user_id","trip_id")
);

-- CreateTable
CREATE TABLE "trip_members" (
    "trip_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" "TripMemberRole" NOT NULL DEFAULT 'VIEWER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_members_pkey" PRIMARY KEY ("trip_id","user_id")
);

-- CreateTable
CREATE TABLE "trip_revisions" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "generation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_messages" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "generation_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_generations" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "trip_id" UUID,
    "status" "GenerationStatus" NOT NULL DEFAULT 'QUEUED',
    "input" JSONB NOT NULL,
    "model_name" TEXT NOT NULL,
    "provider_request_id" TEXT,
    "idempotency_key" TEXT,
    "input_tokens" INTEGER,
    "output_tokens" INTEGER,
    "cost_usd" DECIMAL(10,6),
    "latency_ms" INTEGER,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMPTZ(6),
    "lease_expires_at" TIMESTAMPTZ(6),
    "next_retry_at" TIMESTAMPTZ(6),
    "error_code" TEXT,
    "error" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "auth_identities_user_id_idx" ON "auth_identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_identities_provider_provider_user_id_key" ON "auth_identities"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_expires_at_idx" ON "refresh_tokens"("user_id", "expires_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");

-- CreateIndex
CREATE INDEX "device_tokens_user_id_idx" ON "device_tokens"("user_id");

-- CreateIndex
CREATE INDEX "subscriptions_user_id_status_idx" ON "subscriptions"("user_id", "status");

-- CreateIndex
CREATE INDEX "subscriptions_current_period_end_idx" ON "subscriptions"("current_period_end");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_provider_provider_subscription_id_key" ON "subscriptions"("provider", "provider_subscription_id");

-- CreateIndex
CREATE INDEX "webhook_events_received_at_idx" ON "webhook_events"("received_at");

-- CreateIndex
CREATE UNIQUE INDEX "webhook_events_provider_event_id_key" ON "webhook_events"("provider", "event_id");

-- CreateIndex
CREATE INDEX "places_latitude_longitude_idx" ON "places"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "places_city_category_idx" ON "places"("city", "category");

-- CreateIndex
CREATE UNIQUE INDEX "places_provider_provider_place_id_key" ON "places"("provider", "provider_place_id");

-- CreateIndex
CREATE UNIQUE INDEX "trips_share_slug_key" ON "trips"("share_slug");

-- CreateIndex
CREATE INDEX "trips_owner_id_deleted_at_updated_at_idx" ON "trips"("owner_id", "deleted_at", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "trips_visibility_created_at_idx" ON "trips"("visibility", "created_at" DESC);

-- CreateIndex
CREATE INDEX "trips_visibility_save_count_idx" ON "trips"("visibility", "save_count" DESC);

-- CreateIndex
CREATE INDEX "trips_destination_idx" ON "trips"("destination");

-- CreateIndex
CREATE INDEX "trips_forked_from_id_idx" ON "trips"("forked_from_id");

-- CreateIndex
CREATE INDEX "trips_tags_idx" ON "trips" USING GIN ("tags");

-- CreateIndex
CREATE UNIQUE INDEX "trip_days_trip_id_day_number_key" ON "trip_days"("trip_id", "day_number");

-- CreateIndex
CREATE INDEX "activities_day_id_position_idx" ON "activities"("day_id", "position");

-- CreateIndex
CREATE INDEX "activities_place_id_idx" ON "activities"("place_id");

-- CreateIndex
CREATE INDEX "saved_trips_trip_id_idx" ON "saved_trips"("trip_id");

-- CreateIndex
CREATE INDEX "saved_trips_user_id_created_at_idx" ON "saved_trips"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "trip_members_user_id_created_at_idx" ON "trip_members"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "trip_revisions_generation_id_idx" ON "trip_revisions"("generation_id");

-- CreateIndex
CREATE UNIQUE INDEX "trip_revisions_trip_id_version_key" ON "trip_revisions"("trip_id", "version");

-- CreateIndex
CREATE INDEX "trip_messages_trip_id_created_at_idx" ON "trip_messages"("trip_id", "created_at");

-- CreateIndex
CREATE INDEX "trip_messages_generation_id_idx" ON "trip_messages"("generation_id");

-- CreateIndex
CREATE INDEX "ai_generations_user_id_created_at_idx" ON "ai_generations"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "ai_generations_trip_id_idx" ON "ai_generations"("trip_id");

-- CreateIndex
CREATE INDEX "ai_generations_status_next_retry_at_idx" ON "ai_generations"("status", "next_retry_at");

-- CreateIndex
CREATE INDEX "ai_generations_status_lease_expires_at_idx" ON "ai_generations"("status", "lease_expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_generations_user_id_idempotency_key_key" ON "ai_generations"("user_id", "idempotency_key");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_identities" ADD CONSTRAINT "auth_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_forked_from_id_fkey" FOREIGN KEY ("forked_from_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_days" ADD CONSTRAINT "trip_days_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "trip_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_trips" ADD CONSTRAINT "saved_trips_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_trips" ADD CONSTRAINT "saved_trips_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_members" ADD CONSTRAINT "trip_members_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_members" ADD CONSTRAINT "trip_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_revisions" ADD CONSTRAINT "trip_revisions_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_revisions" ADD CONSTRAINT "trip_revisions_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "ai_generations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_messages" ADD CONSTRAINT "trip_messages_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_messages" ADD CONSTRAINT "trip_messages_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "ai_generations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_generations" ADD CONSTRAINT "ai_generations_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;
