CREATE DATABASE rdr2_db;
USE rdr2_db;

-- Tabel users (akun)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('admin', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Tabel character_comments (komentar karakter)
CREATE TABLE character_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    character_name VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert data contoh
-- Password: admin123 (dihash)
INSERT INTO users (username, email, password, user_type) VALUES
('admin', 'admin@rdr2.com', '$2y$10$Q4RQcAguxIy2VcWsAgzEPOPDe45ARAdPzTnMaPTMcF7spmLFKz762', 'admin'),
('john_m', 'john@rdr2.com', '$2y$10$gYaqf1sx7oPE3.WZJDDeN.unZnOcvf3YMhSf8IeJj3kxTZ6.r9E0G', 'member'),
('arthur_fan', 'arthur@rdr2.com', '$2y$10$gYaqf1sx7oPE3.WZJDDeN.unZnOcvf3YMhSf8IeJj3kxTZ6.r9E0G', 'member');

-- Insert komentar contoh
INSERT INTO character_comments (user_id, character_name, comment, rating) VALUES
(2, 'Arthur Morgan', 'Karakter terbaik dalam game! Sangat kompleks.', 5),
(3, 'Dutch van der Linde', 'Perkembangan karakternya sangat menarik.', 4);

-- Tabel quizzes (mini game kuis)
CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    questions TEXT NOT NULL, -- JSON string: [{"q":"...","options":[".."],"answer":0}, ...]
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO quizzes (title, description, questions, created_by) VALUES
( 'RDR2 Guessing Game - Characters', 'Tebak karakter-karakter legendaris dari Red Dead Redemption II',
  '[{"q":"Siapa protagonis utama yang menderita penyakit tuberkulosis?","options":["Arthur Morgan","John Marston","Dutch van der Linde","Micah Bell"],"answer":0,"hint":"Dia adalah anggota Van der Linde gang yang sangat loyal","category":"Characters"},{"q":"Siapa pemimpin karismatik dari Van der Linde gang?","options":["Arthur Morgan","John Marston","Dutch van der Linde","Micah Bell"],"answer":2,"hint":"Dia memiliki visi besar untuk masa depan gang","category":"Characters"},{"q":"Siapa karakter yang dikenal sebagai pengkhianat dalam cerita?","options":["Arthur Morgan","John Marston","Dutch van der Linde","Micah Bell"],"answer":3,"hint":"Dia adalah orang kepercayaan Dutch yang ternyata licik","category":"Characters"}]', 1),
( 'RDR2 Guessing Game - Locations', 'Tebak lokasi-lokasi ikonik dari dunia Red Dead Redemption II',
  '[{"q":"Di kota manakah Arthur sering mengunjungi dokter untuk pengobatan?","options":["Saint Denis","Valentine","Rhodes","Strawberry"],"answer":0,"hint":"Kota terbesar dan termewah di negara bagian Lemoyne","category":"Locations"},{"q":"Di daerah manakah gang Van der Linde pertama kali menetap?","options":["Heartland Overflow","Cumberland Forest","Scarlett Meadows","Bayou Nwa"],"answer":2,"hint":"Daerah pedesaan yang tenang di negara bagian New Hanover","category":"Locations"}]', 1),
( 'RDR2 Guessing Game - Missions', 'Tebak misi-misi penting dari cerita Red Dead Redemption II',
  '[{"q":"Misi apakah yang membuat Arthur bertemu dengan Rains Fall?","options":["Exit Pursued by a Bruised Ego","The First Shall Be Last","A Strange Kindness","Money Lending and Other Sins"],"answer":2,"hint":"Misi di Chapter 2 yang melibatkan pertemuan dengan penduduk asli","category":"Missions"},{"q":"Misi apakah yang menandai titik balik dalam hubungan Arthur dan Dutch?","options":["Old Friends","American Venom","The Wheel","Horse Flesh for Dinner"],"answer":0,"hint":"Misi di Chapter 5 yang penuh dengan pengkhianatan","category":"Missions"}]', 1);

-- Tabel untuk menyimpan percobaan kuis dan skor
CREATE TABLE quiz_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    quiz_id INT NOT NULL,
    user_id INT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    answers TEXT NULL, -- JSON string with selected options
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);