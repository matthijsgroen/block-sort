CREATE TABLE IF NOT EXISTS study_progress (
  user_key VARCHAR(191) NOT NULL,
  progress_json LONGTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS study_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_key VARCHAR(191) NULL,
  session_id VARCHAR(191) NULL,
  event_type VARCHAR(64) NOT NULL,
  event_timestamp VARCHAR(64) NULL,
  payload_json LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_key (user_key),
  KEY idx_session_id (session_id),
  KEY idx_event_type (event_type),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
