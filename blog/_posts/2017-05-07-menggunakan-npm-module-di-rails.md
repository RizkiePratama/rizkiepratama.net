---
layout: blog
title:  Menggunakan NPM Module di Ruby on Rails
custom_css: blog
cover: /assets/images/post-thumbnails/source/NPMRails.jpg
tags: ["Tutorial","Ruby on Rails"]
---

Jika anda menggunakan berbagai macam framework untuk project anda tentu perlu memasang paket framework tersebut kedalam project anda. Baik dengan mengunduh berkas *Framework* tersebut dalam bentuk arsip `zip`,`tar.gz` atau  bentuk lainya, atau juga menggunakan *Package Manager* seperti `gem` pada Ruby atau `bower` web project, `npm` untuk Javascript / CSS, `composer` untuk PHP dan lain-lainya.

Kali ini saya akan mengulas bagaimana menggunakan paket module yang di pasang melalui `npm` agar dapat digunakan bersama Assets Pipeline pada Rails.

# Inisialisasi NPM pada Rails Project anda
Seperti pada project lainya, anda perlu menginisialisasi NPM pada Rails Project anda dengan membuat file `package.json` yang berisi informasi project yang anda buat beserta list dependensi yang digunakan. Untuk menciptakan berkas `package.json` anda dapat menjalan kan perintah berikut pada direktori Rails Project anda dan ikuti petujuk yang ada.
```bash
$ npm init
```

# Memasukan direktori NPM kedalam assets search path Rails
Sebelum memasang paket module NPM yang anda butuhkan, terlebih dulu akan kita konfigurasi agar direktori `node_modules` berada di dalam search path Rails dan dapat digunakan didalam *Assets Pipeline*. Buka berkas `config/application.rb` lalu tambahkan line berikut di dalam *class* `Application` pada namespace project anda, Contoh:
```ruby
module NamaRailsProjectAnda
  class Application < Rails::Application
    /***/
    config.assets.paths << Rails.root.join('node_modules')
    /***/
  end
end
```
simpan berkas tersebut dan jalankan kembali Rails Server anda dengan perintah:
```bash
$ rails s
```

# Mulai memasang module melalui NPM
Setelah semua langkah di atas di lakukan anda bisa langsung memasang module yang anda inginkan melalui NPM seperti biasa, sebagai contoh saya akan memasang modules `foundation-sites`, CSS Framework dari Zurb, dengan menjalankan perintah berikut pada direktori Rails Project:
```bash
$ npm install foundation-sites --save
```

atau jika anda sudah melist dependensi apasaja yang akan digunakan pada berkas `package.json` milik anda tadi. anda bisa langsung menjalankan perintah berikut:

```bash
$ npm install
```

# Tips
* Jangan lupa memasukan direktori `node_modules` kedalam berkas `.gitignore` anda, karena kemungkinan besar anda tidak ingin menyertakan semua module yang anda pasang kedalam repositori anda.
* Untuk mempermudah pada saat proses pengembangan, Anda dapat menyertakan perintah `npm install` setiap anda memulai Rails server di *development environment*. Untuk mempermudah hal tersebut, Anda dapat membuat file `config/initializers/npm_startup.rb` dan menambahkan line berikut kedalam berkas tersebut:
```ruby
system 'npm install' if Rails.env.development? || Rails.env.test?
```