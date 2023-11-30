---
layout: blog
title:  Membuat Game Sederhana dengan C++ dan Cocos2d-x ~ Pengenalan dan Instalasi
custom_css: blog
cover: /assets/images/post-thumbnails/source/Cocos2D-Intro.jpg
tags: ["Tutorial", "Game Dev", "Cocos2D X"]
---

Setelah akhirnya ada kesempatan untuk memulai menulis lagi (Sok sibuk ceritanya, padahal males, hehe). Pada postingan kali ini kita akan mengenal dulu apa itu Framework Cocos2d-x dan dilanjutkan proses instalasi dan konfigurasi dasar Cocos2d-x pada sistem.


![](/content/images/2017/04/Cocos2d-xPi_Version3.14_Banner.jpeg)

<h3>Apa itu Cocos2d-x?</h3>
Cocos2d-x Framework cross platform yang dapat di gunakan untuk mengembangkan applikasi multimedia maupun simulasi (atau lebih umum dikenal sebagai game) untuk berbagai macam jenis target platform. Saat ini Coco2d-x sudah mensupport rilis untuk target Desktop Linux, Mac dan Windows. Platform Mobile Android dan iOS serta Web Based.

Mengunakan C++ sebagai bahasa pemrograman utamanya, namun anda juga dapat mengunakan script binding yang tersedia seperti Javascript, Lua dan Cocos Script.


<h3>Project apa saja yang menggunakan Cocos2d-x?</h3>
Sejak tahun 2010 dari awal rilis-nya Game Engine ini, Cocos2d-x sudah digunakan untuk mengembangkan ribuan game maupun aplikasi baik oleh Perusahaan besar seperti Square Enix maupun Bandai Namco sampai studio-studio indie. 

Beberapa game yang mungkin anda tau atau pernah mainkan sebelumya adalah Clash of Clans dari Supercell, Badland dari Frogmind atau mungkin anda yang senang melakukan Benchmark pasti pernah menggunakan AnTuTu Benchmark dari AnTuTu, Dan mungkin berbagai macam game atau aplikasi lain-nya. Untuk tahu lebih lanjut bisa langsung mengunjungi [halaman berikut](http://cocos2d-x.org/games).

<h3>Instalasi Compiler dan Build Tools</h3>
Untuk mengkompil source code Cocos2d-x, kita memerlukan compiler C++. Tiap sistem operasi membutuhkan compiler yang berbeda-beda, diantaranya:

Linux / *nix Based Distro: gcc, CMake 2.6+
Mac OS X 10.7 keatas: Xcode 7+
Windows 7 keatas: VS 2013 or VS 2015

Karena berbedanya proses instalasi maupun konfigurasi dependensi tiap sistem operasi, anda bisa merujuk ke dokumentasi masing masing paket untuk petunjuk instalasi.

Untuk distribusi linux Fedora, anda dapat menjalankan perintah berikut untuk menginstall compiler gcc beserta build tools lainya:

`# dnf groupinstall \"C Development Tools and Libraries\"`


<h3>Instalasi Cocos2d-x</h3>
Untuk tutorial kali ini saya akan menggunakan Base Framework dari Cocos2d-x, selain umum di gunakan, Base Framework ini pun dapat di gunakan di semua sistem operasi yang sudah di support, tidak seperti GUI editornya (Cocos Creator) yang hanya dapat di gunakan di sistem operasi Windows dan Mac saja.

Anda dapat mulai mengunduh paket Cocos2d-x [di halaman resmi Cocos2d-x](http://cocos2d-x.org/download) mau pun halaman [Github Cocos2d-x](https://github.com/cocos2d/cocos2d-x) jika anda ingin mengunakan git, pada saat tulisan ini dibuat versi terbaru yang sudah tersedia adalah [Cocos2d-x V3.14.1](http://www.cocos2d-x.org/filedown/cocos2d-x-3.14.1.zip), oleh karena itu saya akan menggunakan versi ini. Setelah selsai anda dapat langsung memindah kan file tersebut ke lokasi / folder lain sesuai keinginan anda dan mengekstrak arsip file tersebut.


Dari hasil ekstraksi anda akan melihat file file berikut ini di direktor anda:
```
AUTHORS          README.md  download-deps.py   plugin     web
CHANGELOG        build      extensions         setup.py
CMakeLists.txt   cmake      external           templates
CONTRIBUTING.md  cocos      issue_template.md  tests
README.cmake     docs       licenses           tools
```


Cocos2d-x sudah menyiapkan installer untuk mempermudah proses instalasi, hanya saja installer ini memerlukan dukungan dari runtime Python V2.7. Untuk pengguna Linux Distro ataupun Mac tidak perlu khawatir karena Python sudah termasuk dalam paket bawaan sistem, untuk memastikan anda dapat menjalankan perintah `$ python --version` di terminal anda.

Bagi anda pengguna Windows terlebih dulu harus menginstall Python kedalam sistem anda. Paket Python untuk Windows dapat di unduh melalui [link berikut](https://www.python.org/downloads/windows/) dan pilih Versi 2.7.x

Jika Python sudah terinstall, anda bisa mulai melakukan proses instalasi dengan membuka Terminal / Command Line Prompt anda dan masuk ke direktori dimana anda menyimpan file Cocos2d-x tadi. Jika direktori Cocos2d-x sudah menjadi CWD ([Current Working Directory](https://en.wikipedia.org/wiki/Working_directory)) dari terminal anda, anda dapat mengetikan perintah berikut untuk memulai proses installasi:

`$ ./setup.py`

ketika anda mejalankan installer tersebut, anda akan diminta untuk memasukan lokasi dari dependensi lain yang di perlukan oleh cocos2d-x seperti JDK, NDK dan ANT untuk rilis di platform android. Anda bisa install ketiga dependesi tersebut dan set PATH-nya saat instalasi atau skip saja dengan mengosongkan-nya karena pada tutorial kali ini akan saya fokuskan untuk rilis di platform Desktop saja. Jika sudah selsai anda bisa update PATH Environment anda dengan perintah:

`$ source ~/.bashrc` di Linux atau Mac

Jika sudah anda bisa menjalankan perintah berikut untuk mengetahui jika Cocos2d-x sudah bisa di gunakan di sistem anda atau belum.

`$ cocos --version`

<h3>Install Dependensi</h3>
Setelah environment path sudah terkonfigurasi oleh installer cocos, anda harus mengunduh atau menginstall dependensi umum yang dibutuhkan oleh Cocos2d-x dengan menjalankan `download-deps.py` pada direktori Cocos2d-x anda:

<b>Contoh: </b> `$ ./download-deps.py`

cara alternative untuk anda penguna distribusi linux Debian based seperti ubuntu atau linux mint bisa menggunakan helper script pada direktori `build`, anda bisa menjalankan perintah berikut dari direktori Cocos2d-x anda:

`$ ./build/install-deps-linux.sh`

<h3>Membuat Project Baru</h3>
Untuk mengecek apakah semua komponen sudah siap untuk di pakai kita akan membuat sample project untuk mentest. Jalankan perintah setelah anda masuk ke lokasi dimana anda akan menyimpan source code project anda:

`$ cocos new -p <nama-paket> -l <bahasa-yang-digunakan> <nama-aplikasi>`

<b>Penjelasan Parameter:</b>
`<nama-paket>` = Nama paket dari aplikasi anda nantinya, Di gunakan untuk rilis pada platform android. Pada umumnya nama paket adalah alamat website dari developer tersebut di ikuti oleh nama software.

`<bahasa-yang-digunakan>` = Bahasa pemrograman yang akan anda gunakan bersama Cocos2d-x nantinya, Cocos2d-x mensupport C++ beserta binding ke bahasa scripting seperti Javascript, Lua dan Cocos Script. Untuk saat ini kita hanya akan menggunakan C++ saja.

`<nama-aplikasi>` = Nama aplikasi anda


<b>Contoh:</b> `$ cocos new -p net.rizkiepratama.pegelwars -l cpp PegelWars`

<h3>Membangun dan Menjalankan Project</h3>
Jika Cocos2d-x sudah selesai mempersiapkan project baru anda, anda bisa melihat direktori baru dengan nama aplikasi anda, untuk contoh di atas maka kita akan menemukan direktori `PegelWars`. masuk ke dalam direktori tersebut dan jalankan perintah berikut untuk mulai mengkompil untuk target platform sistem operasi yang anda gunakan.

`$ cocos compile -p <target-sistem-operasi-anda>`

ganti `<target-sistem-operasi>` dengan `linux` untk sistem operasi linux, `win32` untuk Windows, dan `mac` untuk sistem operasi Mac OS.

<b>Contoh:</b> `$ cocos compile -p linux`

proses kompilasi akan berjalan dan tunggu hingga selsai, Setelah selsai dan sukses. anda bisa coba menjalankanya dengan mengetikan perintah `cocos run`:

<b>Contoh:</b> `$ cocos run -p linux`

![](/content/images/2017/04/cocos2dx_hello_world_desktop-linux.jpeg)

jika aplikasi / game anda sudah dapat di jalankan, berarti kita siap untuk masuk ketahap berikutnya yang akan saya bahas pada postingan berikutnya.

<b>Hint!</b>
Untuk lebih lanjut soal instalasi bisa di baca di halaman [Github Cocos2d-x](https://github.com/cocos2d/cocos2d-x) ataupun [Wiki Cocos2d-x](http://cocos2d-x.org/docs/installation/).

Untuk pengguna sistem operasi Windows bisa mengikuti petunjuk pada halaman [MS Open Tech untuk Cocos2d-x](http://msopentech.github.io/cocos2d-x/) atau salah satu tulisan pada [Blog Windows ini](https://blogs.windows.com/buildingapps/2015/06/15/running-cocos2d-x-on-windows-10/\)
