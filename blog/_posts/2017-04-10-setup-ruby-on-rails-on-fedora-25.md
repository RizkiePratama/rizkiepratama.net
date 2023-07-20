---
layout: blog
title:  Setup Ruby on Rails on Fedora 25
custom_css: blog
cover: /assets/images/post-thumbnails/SetupRoRFedora25.jpg
tags: ["Tutorial","Ruby on Rails","Fedora"]
---

Beberapa hari ini saya gencar mengulik bahasa pemrograman Ruby, Terutama framework *Ruby on Rails*, Oleh karena itu mungkin ada bagusnya juga kalau saya membuat tulisan ini sebagai catatan pribadi atau mungkin pembaca yang mengalami kesulitan atau tidak tahu cara instalasi Ruby on Rails, terutama pada distribusi Linux Fedora 25.

> Jika anda tidak tahu apa itu *Ruby on Rails*, singkat *Rails*, dan tertarik untuk mengetahui lebih lanjut bisa mengunjungi situs *Rails* pada [tautan berikut](http://rubyonrails.org/) atau http://rubyonrails.org/

# Instal Ruby
Karena *Rails* hanyalah framework dan komponen utama yang digunakanya adalah bahasa pemrograman *Ruby* maka kita perlu menginstall *Ruby* terlebih dahulu melalui Repository Fedora, Jalankan 2 perintah berikut:
```term
$ sudo dnf group install \"C Development Tools and Libraries\"
$ sudo dnf install ruby-devel zlib-devel
```

jika proses download dan instalasi sudah selesai, anda dapat memulai instalasi *Rails*. Ada 2 metode yang dapat dilakukan untuk instalasi `Rails`, yaitu melalui upstream [Ruby Gems](http://rubygems.org/) melalui perintah `gem`. Atau melalui Repository Fedora.

Perbedaan antara 2 metode ini hanyalah pada versi *Rails* yang akan terintall nantinya, Biasanya pada upstream *Ruby Gems* akan tersedia versi paling baru ketimbang dengan yang ada pada Repository stable Fedora.

Untuk instalasi melalui `gem`, anda dapat menjalankan perintah berikut:
```term
$ gem install rails
```
atau melalui Repository Fedora dengan perintah berikut:

```term
$ sudo dnf install rubygem-rails
```

Untuk mengkonfirmasi apakah *Rails* sudah terinstall pada system anda atau belum, dapat dilakukan dengan menjalankan perintah berikut:

```term
$ rails --version
```
Anda akan melihat versi *Rails* yang anda gunakan pada output terminal anda.


# Troubleshoting
### Error: `/usr/lib/rpm/redhat/redhat-hardened-cc1` Tidak ditemukan saat mengkompil
Error ini biasa terjadi saat anda mungkin ingin menginstall paket / extensi mengunakan `gem` namun tidak memiliki library `redhat-rpm-config` terinstall pada sistem anda. Ini dapat di tangani dengan mudah dengan perintah berikut:
```term
$ sudo dnf install redhat-rpm-config
```

### Error: `Failed to complete patch task` saat instalasi mengunakan `gem`
Hampir sama pada kasus di atas,Masalah ini muncul dikarenakan anda tidak memiliki paket library `patch` pada system anda. Jalankan:

```term
$ sudo dnf install patch
```