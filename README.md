# RDR2 Web Project Responsi Penrograman Web
## Anggota Kelompok
Khoiri Faldi Marwan Hakim

Ilham Huda

Zaki fatah

## Deskripsi
Aplikasi web interaktif bertema Red Dead Redemption II (RDR2) yang menyediakan fitur:
- Halaman Home, About, Character, Game, dan Quiz
- Sistem otentikasi (login, register, logout)
- Komentar karakter (dengan rating)
- Mini game kuis (Quiz) dengan sistem admin untuk membuat/mengelola soal
- SPA (Single Page Application) dengan navigasi dinamis

## Fitur Utama
- **Quiz System**: Mainkan kuis tentang karakter, lokasi, dan misi RDR2. Admin dapat menambah/edit/hapus soal.
- **Komentar Karakter**: Pengguna dapat memberi komentar dan rating pada karakter favorit.
- **Otentikasi**: Sistem login/register dengan validasi dan session.
- **SPA**: Navigasi antar halaman tanpa reload penuh.
- **Admin Panel**: Hanya admin yang bisa mengelola soal kuis.

## Fitur Frontend
- Navigasi dinamis tanpa reload (SPA)
- Tampilan responsif dan tema western
- Form login, register, dan validasi input
- Komentar karakter dengan rating bintang
- Daftar quiz, main quiz, dan lihat hasil quiz
- Admin dapat membuat, mengedit, dan menghapus quiz melalui modal editor
- Notifikasi dan alert interaktif
- Animasi transisi halaman

## Fungsi Backend (PHP)
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


