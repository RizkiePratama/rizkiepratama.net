---
layout: blog
title:  Mengatasi 403 Pada Nginx Dan SELinux
custom_css: blog
cover: /assets/images/post-thumbnails/SELinuxnginx.jpg
tags: ["Tutorial","Ghost Blog"]
---

hal pertama yang selalu saya jumpai pada saat pertama kali memasang web server Nginx adalah menemui masalah nginx tidak dapat mengakses *root directory* dari blok server yang telah saya konfigurasi. dan Biasanya terjadi jika saya meletakan *web root* saya di luar dari direktori `/var/www/public`.

# Pastikan Kepemilikan Direktori Sama Dengan Nginx
Untuk mendapaktkan akses yang sudah di terapkan oleh suatu direktori, Aplikasi tersebut harus di jalankan oleh *user* yang sama atau memiliki hak istimewa (*privilege*) di atas atau sama dengan *user* tersebut.

Secara umum jika di jalankan sebagai *services*, Nginx akan dijalankan oleh nama *user* `nginx` sebagai mana yang di deskripsikan pada berkas konfigurasi di `/etc/nginx/nginx.conf`. Jika nama *user* yang menjalankan Nginx tidak sama dengan pemilik direktori, atau tidak memiliki hak akses istimewat terhadap direktori tersebut secara otomatis Nginx akan melemparkan respon 403 dimana dia tidak dapat mengakses berkas yang diminta.

Untuk Menyelsaikan hal ini anda dapat memilih antara mengganti nama user yang menjalankan Nginx atau Mengganti hak kepemilikan berkas tersebut kepada nama *user* `nginx`.

## Metode 1: Mengganti Pengguna Nginx
Untuk mengganti nama user yang menjalankan Nginx terlebih dahulu anda perlu mengetahui *user* mana yang memiliki kepemilikan terhadap berkas tersebut. Asumsikan anda meletakan direktori *root* anda di home folder *user* anda dengan nama direktori `situs`, atau lebih jelasnya `~/situs`, maka anda bisa mencek dengan menjalankan perintah:
```bash
$ namei -l ~/situs
```
Pada baris paling akhir anda bisa melihat nama *user* yang meiliki direktori tersebut. Pada contoh kasus yang saya miliki maka pemilik direktori tersebut adalah *user* dengan nama `VikTymZ` seperti yang ada pada gambar berikut:
![](/content/images/2017/05/nginx_403_selinux_permission_001.jpeg)

Setelah mengetahui nama *user* yang memiliki akses penuh terhadap direktori tersebut maka langkah selanjutnya adalah menyesuaikan nama *user* yang nantinya akan menjalankan Nginx, untuk melakukan hal ini anda dapat membuka berkas `/etc/nginx/nginx.conf` dan dapat merubah nilai dari variabel `user`, Pada kasus ini saya akan merubah nilai `user` dari `nginx` menjadi `VikTymZ`:
```bash
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user VikTymZ; # Ubah dari nginx menjadi nama user anda
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

/***/
```

Selanjutnya anda bisa coba jalankan kembali nginx server anda dan coba muat kembali halaman tersebut.

## Metode 2: Mengganti Kepemilikan Direktori
selain cara sebelumnya anda juga dapat melakukan hal sebaliknya, yaitu mengganti kepemilikan Direktori tersebut dengan nama *user* `nginx`, Asumsikan kita menggunakan direktori yang sama dengan yang sebelumnya, yaitu di `~/situs` maka anda dapat menjalankan perintah berikut:
```bash
$ sudo chown nginx:nginx -R ~/situs
```
Perintah di atas dimaksudkan untuk merubah kepemilikan dari yang sebelumnya dimiliki oleh `VikTymZ` menjadi `nginx` beserta *user group*-nya secara recrusive (turut merubah kepemilikan untuk berkas didalam direktori tersebut)
![](/content/images/2017/05/nginx_403_selinux_permission_002.jpeg)
Setelah perubahan berhasil, maka anda dapat memuat ulang halaman tersebut.

# Oops! Masih mendapatkan pesan 403?
Walau telah melakukan hal di atas terkadang nginx masih tidak dapat mengakses direktori yang diminta. Biasanya ini berkaitan dengan status *Enforcing* pada [SELinux](https://en.wikipedia.org/wiki/Security-Enhanced_Linux) Anda. Jika SELinux terpasang di sistem anda, anda dapat mengecek status SELinux yang sedang berjalan dengan perintah berikut:
```bash
$ getenforce
```
Jika anda mendapatkan *output* `Enforcing`, anda dapat coba merubah status SELinux tersebut menjadi `Permissive`
```bash
$ sudo setenforce Permissive
```
jika sudah bisa dicoba kembali untuk memuat ulang halaman tersebut. Untuk membuat opsi ini permanen, anda dapat merubah status SELinux pada sistem anda melalui berkas `/etc/sysconfig/selinux`.

Namun jika anda tidak ingin merubah Status SELinux anda menjadi `Permissive`, anda dapat mecoba merubah *Security Context* SELinux di direktori situs anda tersebut menjadi `httpd_sys_content`, Rubah `~/situs` dengan *path* menuju direktori situs anda dan Jalankan perintah berikut:
```bash
$ sudo chcon -Rt httpd_sys_content_t ~/situs
```