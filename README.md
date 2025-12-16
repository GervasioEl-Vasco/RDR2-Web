# RDR2 Web Project Pemweb

## Anggota Kelompok
- Khoiri Faldi Marwan Haki
- Ilham Huda
- Zaki Fatah

## Deskripsi
Aplikasi web interaktif bertema Red Dead Redemption II (RDR2) yang menyediakan:
- Halaman Home, About, Character, Game, dan Quiz
- Sistem otentikasi (login, register, logout)
- Komentar karakter (dengan rating)
- Mini game kuis (Quiz) dengan sistem admin
- SPA (Single Page Application) dengan navigasi dinamis

## Fitur Frontend
- Navigasi dinamis tanpa reload (SPA)
- Tampilan responsif dan tema western
- Form login, register, validasi input
- Komentar karakter dengan rating bintang
- Daftar quiz, main quiz, dan lihat hasil quiz
- Admin dapat membuat, mengedit, dan menghapus quiz melalui modal editor
- Notifikasi dan alert interaktif
- Animasi transisi halaman

## Fitur Backend (PHP)
- **Autentikasi**: Login, register, cek session, logout
- **Quiz API**: Ambil daftar quiz, detail quiz, tambah quiz (admin), edit quiz (admin), hapus quiz (admin)
- **Komentar API**: Ambil komentar karakter, tambah komentar, edit komentar, hapus komentar
- **Quiz Attempt API**: Simpan hasil percobaan quiz, ambil riwayat quiz user
- **Session Handler**: Cek login, cek admin, ambil data user dari session
- **Model**: Query database untuk users, quizzes, comments, quiz_attempts
- **Proteksi**: Hanya admin yang bisa akses endpoint quiz management

## Struktur Folder
- `index.html` — Entry point utama SPA
- `pages/` — Halaman HTML terpisah (misal: quiz.html)
- `js/` — Script utama (SPA, quiz, auth, komentar, API client)
- `css/` — Style untuk tiap halaman dan global
- `api/` — Endpoint PHP untuk API (auth, quiz, komentar)
- `models/` — Model PHP untuk database
- `includes/` — Fungsi utilitas dan session PHP
- `config/` — Koneksi database
- `media/` — Gambar dan aset
- `uploads/` — Upload file (jika ada)
- `logs/` — Log aplikasi

## Database
- File: `database.sql`
- Tabel utama: `users`, `character_comments`, `quizzes`, `quiz_attempts`
- Contoh data admin: username `admin`, password `admin123`

## Teknologi
- Frontend: HTML, CSS, JavaScript (SPA)
- Backend: PHP (API, session, DB)
- Database: MySQL