---
layout: blog
title:  "Membuat Game Sederhana dengan C++ dan Cocos2d-x ~ Part2: Hello Cocos"
custom_css: blog
cover: /assets/images/post-thumbnails/source/Cocos2D-Intro.jpg
tags: ["Tutorial", "Game Dev", "Cocos2D X"]
---

setelah pada postingan sebelumnya kita berhasil melakukan proses instalasi Cocos2d-x di sistem operasi anda masing-masing, sekarang akan kita lanjutkan dengan membuat scene pertama kita dan menambahkan beberapa `Sprites` ataupun *Game Actor* pada Scene sederhana kita ini.


# Membuat Scene Pertama Kita
Untuk memulai membuat scene kita membuat file baru pada sub-direktori `Classes`, Cocos2d-x sudah menyertakan beberapa file `cpp` dalam direktori ini, di ataranya adalah `AppDelegate.cpp`, `AppDelegate.cpp` dimana kita bisa mengubah variable pada file ini untuk mengubah pengaturan dari game atau aplikasi kita. Adapun file `HelloWorldScene.h` dan  `HelloWorldScene.cpp` yang merupanakan sample contoh scene Hello World dari Cocos2d-x. Akan kita abaikan file ini dan mulai untuk membuat sendiri Hello World Scene.


# Header File
Buat file header baru untuk scene anda, disini saya akan memberikan nama `PegelScene.hpp`. Kemudian isi file tersebut dengan contoh Header file berikut ini:

```cpp
#ifndef __PEGEL_SCENE_HEADER_GUARD__
#define __PEGEL_SCENE_HEADER_GUARD__

#include \"cocos2d.h\"

class PegelScene : public cocos2d::Layer {
public:
    public static cocos2d::Scene* createScene();
    virtual bool init();

    CREATE_FUNC(PegelScene);
};

#endif//__PEGEL_SCENE_HEADER_GUARD__
```

**Penjelasan Header File:**
Jika anda sudah familiar dengan *Object Oriented Programming* dalam bahasa `C++` mungkin ada sudah sedikit mengerti dengan apa yang kita lakukan disini.

Hal pertama yang kita lakukan adalah menyertakan *header files* dari framework Cocos2d-x kedalam *header file* kita. Ini di maksudkan karena kita memerlukan *Class* `Layer` dan juga komponen lainnya pada *namespace* `cocos2d` sebagai basis dari *Class* untuk *Scene* kita,

Fungsi Statik `createScene()`: Fungsi ini akan kita gunakan untuk menciptakan scene baru.
Fungsi `init()`: Digunakan untuk menginisialisasi komponen yang akan di gunakan pada scene tersebut.

Makro `CREATE_FUNC`: ini ada lah fungsi inline dari Cocos2d-x untuk membantu mendefinisikan fungsi lainya yang dibutuhkan oleh komponen internal Cocos2d-x.

# Source File
Setelah header file dibuat sekarang kita lanjutkan dengan membuat *source file* dan isikan dengan contoh dibawah ini.Disini saya akan memberinama *source file* saya dengan nama `PegelScene.cpp`.
```cpp
#include \"PegelScene.hpp\"
USING_NS_CC;

Scene* PegelScene::createScene() {
    auto scene = Scene::create();
    auto layer = PegelScene::create();
    scene->addChild( layer );
    return scene;
}

bool PegelScene::init() {

    if( !Layer::init() )  {
        return false;
    }

    return true;
}
```
**Penjelasan Source File:**
Pada fungsi `createScene()`: Disini kita akan menciptakan *Scene* dengan menggabungkan / menyertakan setidaknya 1 `Layer` (*Class* yang kita buat ini) kedalam objek *Scene*.

Pada fungsi `init()`: sebelum semua komponen pada *Layer* atau *Scene* dapa di proses baik oleh *Renderer* ataupun sub-sistem Cocos2d-x lainnya, kita di wajibkan untuk menginisialisasikanya terlebih dahulu, Disini kita perlu menginisialisasi *Layer* itu sendiri seperti pada contoh diatas. serta mendefinisikan *Game Actor* yang akan berjalan di dalam *Layer* atau *Scene* tersebut (Akan di bahas di bawah).

# Menjalankan Scene
Tidak seperti Unity 3D atau Unreal Engine atau variant Cocos Creator. Framework Cocos2d-x tidak dapat dijalankan secara praktis walau hanya untuk testing.

**Merubah Konfigurasi `AppDelegate.cpp`:**
Secara umum anda akan melihat banyak konfigurasi pada file ini, namun untuk saat ini kita hanya akan merubah *Default Scene* kita yang semua menggunakan *sample* dari Cocos2d-x, yaitu `HelloWorldScene.h` dengan nama *Class* `HelloWorld` seperti pada kedua baris kode berikut:
```cpp
#include \"HelloWorldScene.h\"
    
     /* ... */

    // create a scene. it's an autorelease object
    auto scene = HelloWorld::createScene();

     /* ... */
```
Di rubah menjadi nama *Header File* dan nama *Class* dari scene anda. Dalam contoh ini nama *Header File* scene saya adalah `PegelScene.hpp` dan nama *Class* `PegelScene`.
**Contoh:**
```cpp
#include \"PegelScene.h\"

     /* ... */

    // create a scene. it's an autorelease object
    auto scene = PegelScene::createScene();

     /* ... */

```

Jika perubahan sudah di simpan sekarang kita tambahkan *header* dan *source file* scene yang baru saja kita buat tadi kedalam file `CMakeList.txt` yang ada di *root directory project* anda. Cari line kode berikut kemudian tambahkan *header* dan *source file* setelah atau menggantikan nama File `HelloWorldScene.cpp` atau `HelloWorldScene.h`. **Contoh:**

```clike
set(GAME_SRC
  Classes/AppDelegate.cpp
  Classes/HelloWorldScene.cpp  ## Hapus Ini dan gantikan
  Classes/PegelScene.cpp       ## atau Tambahkan pada baris berikutnya
  ${PLATFORM_SPECIFIC_SRC}
)

set(GAME_HEADERS
  Classes/AppDelegate.h
  Classes/HelloWorldScene.h    ## Hapus Ini dan gantikan
  Classes/PegelScene.hpp       ## atau Tambahkan pada baris berikutnya
  ${PLATFORM_SPECIFIC_HEADERS}
)

```

Simpan, kemudian jalankan perintah `cocos run` dari direktori Project Cocos2d-x anda:

**Contoh:** `$ cocos run -p linux`

proses kompilasi akan berjalan jika Cocos2d mendeteksi adanya perubahan pada *source code project* anda, jika Cocos2d-x tidak mendeteksi adanya perubahan, secara otomatis Cocos2d-x akan langsung menjalankan binary yang sudah di bangun sebelumnya.

Jika proses kompilasi sukses. Anda akan melihat aplikasi / game anda terbuka dengan *Scene* kosong / blank hitam saja. Ini di karena kan kita belum menambahkan `Sprites` atau *Game Actor* pada scene kita ini.

![](/content/images/2017/04/cocos2dx_tutorial_blank_scene_desktop_linux.jpeg)


# Menambahkan Sprite kedalam Scene
`Sprite` adalah salah satu komponen yang akan sering di gunakan di karenakan nantinya object ini akan bertindak sebagai *Game Actor* baik sebagai *Player*, AI atau *bot* ataui bahkan hanya sebagai properti (*Static Object*) saja.

Untuk menambahkan `Sprite` kedalam Scene, buka kembali *Source File scene* anda, pada fungsi `init()` kita tambahkan kode berikut setelah kita menginisialisasi `Layer`:
```cpp

    /* ... */

    if( !Layer::init() )  {
        return false;
    }

    auto visibleSize    = Director::getInstance()->getVisibleSize();

    auto oSpriteKu = Sprite::create(\"PegelTux.png\");
    oSpriteKu->setPosition(visibleSize.height / 2, visibleSize.width / 2);
    this->addChild( oSpriteKu );

    /* .. */

```
**Penjelasan:** untuk membuat `Sprite` kita hanya perlu membuat objek baru mengunkan fungsi statik dari *Class* `Sprite` dengan menyertakan lokasi path / nama texture yang akan di gunakan oleh objek tersebut. File texture ini sudah kita buat sebelumnya dan di letakan kedalam direktori `Resources`.

Setelah membuat objek `Sprite` langkah selanjutnya adalah menentukan dimana sprite itu akan di posisikan di viewport. Untuk Contoh di atas saya menggunakan *Director Singleton* untuk mendapatkan informasi ukuran viewport dan origin-nya.

`visibleSize.width` adalah lebar dari viewport sedangkan `visibleSize.height` adalah tinggi dari viewport. Untuk meletakan `Sprite` yang kita buat tadi di berada di tengah viewport, *simply* membagi 2 variable tersebut dalam parameter fungsi `setPosition()` seperti pada contoh diatas.

Langkah selanjutnya adalah memasukan objek `Sprite` yang kita buat tadi sebagai *child node* dari `Layer` kita mengunakan fungsi `addChild( <nama-objek> )` pada objek `Layer` kita.

Setelah texture sprite anda simpan ke direktori `Resources`, Jalankan kembali project anda, dan lihat hasilnya:

![](/content/images/2017/04/cocos2dx_tutorial_sprite_desktop_linux.jpeg)

Tergantung dari besar-nya gambar texture dan *design resolution* anda (yang akan di bahas lebih detail nanti) texture anda mungkin akan terlihat terlalu kecil / terlalu besar dari viewport yang ada.

Anda dapat menyesuaikanya mengunakan fungsi `setScale( <float value> )` pada objek `Sprite` anda, **Contoh:**

```cpp
    /* ... */

    oSpriteKu.setScale(0.7f);

    /* ... */
```