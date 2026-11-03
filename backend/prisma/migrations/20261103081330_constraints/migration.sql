-- This is an empty migration.
-- Data integrity
ALTER TABLE users
  ADD CONSTRAINT users_email_lowercase CHECK (email = lower(email));

ALTER TABLE trips
  ADD CONSTRAINT trips_duration_days_positive CHECK (duration_days >= 1),
  ADD CONSTRAINT trips_traveler_count_positive CHECK (traveler_count >= 1),
  ADD CONSTRAINT trips_date_order CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  ADD CONSTRAINT trips_estimated_cost_nonneg CHECK (estimated_cost IS NULL OR estimated_cost >= 0),
  ADD CONSTRAINT trips_save_count_nonneg CHECK (save_count >= 0);

ALTER TABLE trip_days
  ADD CONSTRAINT trip_days_day_number_positive CHECK (day_number >= 1);

ALTER TABLE activities
  ADD CONSTRAINT activities_position_nonneg CHECK ("position" >= 0),
  ADD CONSTRAINT activities_start_minute_range CHECK (start_minute IS NULL OR start_minute BETWEEN 0 AND 1439),
  ADD CONSTRAINT activities_duration_positive CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  ADD CONSTRAINT activities_cost_nonneg CHECK (estimated_cost IS NULL OR estimated_cost >= 0);

ALTER TABLE places
  ADD CONSTRAINT places_latitude_range CHECK (latitude BETWEEN -90 AND 90),
  ADD CONSTRAINT places_longitude_range CHECK (longitude BETWEEN -180 AND 180);

ALTER TABLE ai_generations
  ADD CONSTRAINT ai_generations_attempt_count_nonneg CHECK (attempt_count >= 0);
