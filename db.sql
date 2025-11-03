CREATE TABLE `body_measurements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `weight` float DEFAULT NULL,
  `arm` float DEFAULT NULL,
  `forearm` float DEFAULT NULL,
  `chest` float DEFAULT NULL,
  `waist` float DEFAULT NULL,
  `hips` float DEFAULT NULL,
  `thigh` float DEFAULT NULL,
  `calf` float DEFAULT NULL,
  `date` datetime NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `confirmation_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('email-verification','forgot-password') NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_date` datetime NOT NULL,
  `attempts` int(11) NOT NULL DEFAULT 10,
  PRIMARY KEY (`id`)
);

CREATE TABLE `exercises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `exercises_muscle_groups` (
  `exercise_id` int(11) NOT NULL,
  `muscle_group_id` int(11) NOT NULL
);

CREATE TABLE `muscle_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `scheduled_workouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `week_schedule_id` int(11) NOT NULL,
  `workout_template_id` int(11) DEFAULT NULL,
  `day` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `time` time DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `sets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workout_exercise_id` int(11) NOT NULL,
  `reps` int(11) NOT NULL,
  `weight` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `google_id` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `refresh_token` varchar(255) DEFAULT NULL,
  `last_sync` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `week_schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `selected` tinyint(1) NOT NULL DEFAULT 0,
  `notification_time` enum('disabled','1m','5m','15m','30m','45m','1h','2h','3h','4h','5h','6h') NOT NULL DEFAULT 'disabled',
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `workouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `workout_template_id` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `date` datetime NOT NULL,
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `workouts_exercises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workout_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `workout_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `workout_templates_exercises` (
  `workout_template_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `position` int(11) NOT NULL
);


ALTER TABLE `body_measurements`
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `confirmation_codes`
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `exercises`
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `exercises_muscle_groups`
  ADD PRIMARY KEY (`exercise_id`,`muscle_group_id`),
  ADD UNIQUE KEY `exercises_muscle_groups_muscle_group_id_exercise_id_unique` (`exercise_id`,`muscle_group_id`),
  ADD KEY `muscle_group_id` (`muscle_group_id`);

ALTER TABLE `scheduled_workouts`
  ADD KEY `week_schedule_id` (`week_schedule_id`),
  ADD KEY `workout_template_id` (`workout_template_id`);

ALTER TABLE `sets`
  ADD UNIQUE KEY `set_workout_exercise_id_position_unique` (`workout_exercise_id`,`position`);

ALTER TABLE `week_schedules`
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `workouts`
  ADD KEY `user_id` (`user_id`),
  ADD KEY `workout_template_id` (`workout_template_id`);

ALTER TABLE `workouts_exercises`
  ADD UNIQUE KEY `we_workout_position_unique` (`workout_id`,`position`),
  ADD KEY `exercise_id` (`exercise_id`);

ALTER TABLE `workout_templates`
  ADD KEY `user_id` (`user_id`);

ALTER TABLE `workout_templates_exercises`
  ADD KEY `exercise_id` (`exercise_id`);



ALTER TABLE `body_measurements`
  ADD CONSTRAINT `body_measurements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `confirmation_codes`
  ADD CONSTRAINT `confirmation_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `exercises`
  ADD CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `exercises_muscle_groups`
  ADD CONSTRAINT `exercises_muscle_groups_ibfk_1` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `exercises_muscle_groups_ibfk_2` FOREIGN KEY (`muscle_group_id`) REFERENCES `muscle_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `scheduled_workouts`
  ADD CONSTRAINT `scheduled_workouts_ibfk_1` FOREIGN KEY (`week_schedule_id`) REFERENCES `week_schedules` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `scheduled_workouts_ibfk_2` FOREIGN KEY (`workout_template_id`) REFERENCES `workout_templates` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `sets`
  ADD CONSTRAINT `sets_ibfk_1` FOREIGN KEY (`workout_exercise_id`) REFERENCES `workouts_exercises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `week_schedules`
  ADD CONSTRAINT `week_schedules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `workouts`
  ADD CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `workouts_ibfk_2` FOREIGN KEY (`workout_template_id`) REFERENCES `workout_templates` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

ALTER TABLE `workouts_exercises`
  ADD CONSTRAINT `workouts_exercises_ibfk_1` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `workouts_exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `workout_templates`
  ADD CONSTRAINT `workout_templates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `workout_templates_exercises`
  ADD CONSTRAINT `workout_templates_exercises_ibfk_1` FOREIGN KEY (`workout_template_id`) REFERENCES `workout_templates` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `workout_templates_exercises_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;