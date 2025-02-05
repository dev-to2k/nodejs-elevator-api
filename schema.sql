CREATE DATABASE IF NOT EXISTS elevator_system;
USE elevator_system;

CREATE TABLE elevators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  current_floor INT NOT NULL,
  direction INT NOT NULL,      -- 0: Idle, 1: Up, -1: Down
  door_open BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  elevator_id INT,              -- Có thể null nếu yêu cầu chưa được phân bổ
  floor INT NOT NULL,
  direction INT NOT NULL,
  request_type VARCHAR(10) NOT NULL,   -- Ví dụ: "CALL", "SELECT"
  status VARCHAR(20) DEFAULT 'pending',  -- pending, served, canceled,...
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (elevator_id) REFERENCES elevators(id)
);


INSERT INTO elevators (current_floor, direction, door_open) VALUES (1, 0, 0);
INSERT INTO elevators (current_floor, direction, door_open) VALUES (1, 0, 0);
INSERT INTO elevators (current_floor, direction, door_open) VALUES (1, 0, 0);