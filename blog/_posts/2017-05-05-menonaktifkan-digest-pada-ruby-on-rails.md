---
layout: blog
title:  Menonaktifkan Digest di Ruby on Rails
custom_css: blog
cover: /assets/images/post-thumbnails/source/RoRCacheBusting.jpg
tags: ["Tutorial","Ruby on Rails"]
---

Beberapa hari mencoba belajar Ruby dan Rails Framework, saya baru di sadarkan dengan penamaan berkas asset yang sedikit janggal pada *view layout* yang saya gunakan. Seteleah nama file berkas dan sebelum nama ekstensi, ada semacam [MD5 Hash](https://en.wikipedia.org/wiki/MD5#MD5_hashes). Setelah beberapa saat mencoba mencari informasi melalui mesin pencari. Ternyata ini adalah metode yang dinamakan *Cache Busting*, atau pada *Rails Framework* lebih dikenal dengan nama *Digest*. 

# Apa itu Cache Busting?
*Cache Busting* adalah metode dimana agar user anda selalu memuat ulang konten asset, hal ini memungkinkan pengguna akan selalu mendapatkan versi paling baru dari asset yang anda gunakan (eg: berkas CSS atau Javascript)

Tanpa *Cache Busting* mayoritas pengunjung akan memuat berkas asset yang sudah di *cache* atau di simpan sebelumnya oleh *browser*.

# Kenapa Menonaktifkan Fitur Ini?
Lalu kenapa kita mau menonaktifkannya? Walau Hal ini kembali lagi ke preferensi anda. Namun untuk saya pribadi, saya agak tidak nyaman dengan penamaan yang dihasilkan dari metode *Cache Busting* ini.

Seperti contoh, jika saya ingin menggunakan berkas asset `public.css` kedalam view layout saya dengan menambahkan line:
```ruby
<%= stylesheet_link_tag \"public\" %>
```

maka hasil render yang akan muncul akan seperti
```html
<link rel=\"stylesheet\" media=\"screen\" href=\"/assets/public.self-af04b226fd7202dfc532ce7aedb95a0128277937e90d3b3a3d35e1cce9e16886.css?body=1\" />
```


# Lalu Bagaimana Cara Menonaktifkan Fitur ini?
Kita dapat menonaktifkan fitur *digest* ini dengan mudah, hanya menambhakan beberapa line perintah pada file environment aplikasi Rails kita. Sebagai contoh, disini saya akan Menonaktifkan fitur ini pada enviroment *development*, maka:

buka file `config/environment/development.rb`, lalu tambahkan line berikut:
```ruby
    /***/

    # Disable Cache Busting Name
    config.assets.digest = false

    /***/
```

simpan hasil modifikasi file `development.rb` tersebut, lalu jalankan kembali Rails server anda.

Voila, Assets yang anda link kedalam view layouts sudah tidak memiliki *Digest Naming* seperti sebelumnya. Anda dapat mengulangi langkah tersebut untuk setiap environment yang anda inginkan.