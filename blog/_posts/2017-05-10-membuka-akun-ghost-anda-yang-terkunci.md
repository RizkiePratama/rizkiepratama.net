---
layout: blog
title:  Membuka Akun Ghost Anda Yang Terkunci
custom_css: blog
cover: /assets/images/posts/GhostBlogLocked.jpg
tags: ["Tutorial","Ghost Blog"]
---

Hari ini saya mencoba coba masuk ke halaman admin Ghost Blog saya, dan tidak seperti biasanya kata kunci yang saya masukan di anggap salah, Entah karena memang saya sering lupa kombinasi yang saya gunakan atau *typo* pada saat memasukan kombinasi yang sebenarnya saya pakai.

Alhasil setelah 5 kali gagal akun saya secara otomatis terkunci. Dan sayangnya lagi saya belom mengaktifkan fungsi lupa password pada Ghost Blog saya. Setelah coba cari dokumentasi kesana kemari akhirnya saya menemukan solusi untuk keadaan seperti ini.

# Merubah Status Pada Akun Yang Terkunci Di Database
Pada akun yang terkunci anda akan menemukan bahwa pada kolom `status` pada table `users` di susunan database milik Ghost akan memiliki nilai `locked`. Jadi untuk memulihkan akun yang terkunci tersebut kita hanya perlu merubah nilai `locked` menjadi `active`. Ini dapat di capai dengan sedikit pemahaman pada SQL Syntax pada Database Engine yang anda gunakan.

Secara umum, Ghost menggunakan [SQLite](https://www.sqlite.org/) sebagai engine database bawaan-nya. Namun pada kasus yang terjadi pada saya, Saya menggunakan Database MySql / [MariaDB](https://mariadb.org/).

# Masuk Ke Dalam Database
Sebelum kita bisa merubah nilai kolom pada database, terlebih dahulu kita harus masuk ke dalam database tersebut. Pada cntoh berikut kita akan mengakses database kita langsung melalui console pada server yang di gunakan untuk menjalankan database / situs Ghost tersebut.

Pada MySql / MariaDB, terlebih dahulu anda harus login kedalam `mysql` mengunakan akun yang memiliki akses kepada database yang anda gunakan pada situs Ghost anda.
```bash
$ mysql -u <username_database> -p
```
Setelah anda masuk ke `mysql` anda dapat langsung menggunakan Database yang digunakan oleh Ghost, Contoh:
```sql
USE <nama_database>;
```

Tidak seperti MariaDB, pada SQLite berkas database berada didalam direktori konten milik ghost, Sehingga untuk mengakses database tersebut anda dapat masuk ke direktori Ghost milik anda dan menjalankan perintah berikut:
```bash
$ sudo sqlite3 content/data/ghost.db
```

# Mengganti Nilai Pada Kolom Status
lalu kemudian anda bisa lanjutkan dengan mengetik perintah berikut:
```sql
UPDATE users PUT status=active WHERE id=<user_id>;
```
ganti `<id_user_yang_terkunci>` sesuai dengan `id` akun pengguna anda yang terkunci, untuk mengetahui nilai `id` ini anda dapat mejalankan perintah lain seperti:
```sql
SELECT id,name FROM users WHERE status=locked;
```
ambil `id` pengguna tersebut yang sesuai dengan nama penulis atau pengguna yang akun-nya terkunci 

Jika *query* yang di kirim sudah OK, anda bisa keluar dari mysql dengan mengetik perintah `exit` lalu coba login kembali kedalam Ghost anda.