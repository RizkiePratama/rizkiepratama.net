---
layout: blog
title:  Cross Compile QT6 Project From Linux to Windows Using MXE
custom_css: blog
cover: /assets/images/post-thumbnails/cross-compile-qt6-project-using-mxe.jpg
tags: ["Tutorial", "QT6", "Linux", "Windows"]
---

This past few week i've worked on my client project for developing Windows Desktop App, needless to say, it was runs just fine without any hastle on my Windows Development box.
And skip forward to the future that said client is requesting additional features to be developed for that app. Well of course i'm happy because it means more work for me (and get paid, lol). But the problem is, i just recently switch back my Legion 5 Pro to Fedora again.

While yes, QT6 is Cross-platform and it wont be much a problem, but as of my experience. Cross-Compiling is not a fun work to do.
Tried modify the Kit on QT Creator, using MinGW for cross compile as the Documentation said, while it does compile and open just fine using wine, but for some unknown reason it cant be executed when its on the actual windows.
And no mater what configuration i set on CMake and QT Build Kit, it always end up the same like that.

Strolling accros Stackoverflow i found a little hint that there's actualy tool can help us for it, it was called [MXE (M Cross Environment)](https://github.com/mxe/mxe).

*NOTE:*
as of i'm doing this, i was using QT6 Creator Project with CMake + Ninja, so if you're using different build system there's might slight difference on the preparation step.
But overall it should've be the same.

## Getting The Dependencies

on this guide i was using Fedora, so make sure you're already installing "C Development Tools and Libraries", if you're on Ubuntu it's should be similar to ["build-essential"](https://packages.ubuntu.com/focal/build-essential)

for additional dependencies you can install the following packages
```
sudo dnf install wget cmake pkgconfig zlib-devel libX11-devel
```

## Setting up MXE

After installing all dependencies, we can now start cloning the MXE and Build our Necessary build deps for cross compiling.

```
git clone https://github.com/mxe/mxe.git
```

enter to your `mxe` directory and start building it with make

```
MXE_TARGETS=x86_64-w64-mingw32.static make -j$(nproc) qt6
```

and wait it to build. Depends on Your systems and Internet speed, it might take a while.
after all the build process completed you can add mxe bin directory to the PATH Env

```
export PATH=/path/to/mxe/usr/bin:$PATH
```


## Start Cross Compiling

For this one is gonna be pretty direct, Just open your Project Root directory, create `build`, and inside that `build` directory you can run the following command, make sure to adjust your MXE Path

```
cmake -DCMAKE_TOOLCHAIN_FILE=/path/to/mxe/usr/x86_64-w64-mingw32.static/share/cmake/toolchain.cmake -DCMAKE_PREFIX_PATH=/path/to/mxe/usr/x86_64-w64-mingw32.static ..
```

if you multiple Build Type inside your CMake files you can also defined it with this Variabke on that previous command
```
-DCMAKE_BUILD_TYPE=Release
```

After CMake Finish running we can just go a head and star building it
```
make -j$(nproc)
```

## Confirm it Running

to confirm you binary is sucessfuly compiled for Windows, you can either try run it on You Windows VM you might have, or running it with wine should be fine as well.

<br>
# Conclusion
in my opinion, using MXE for doing cross compiling is much more simpler and straight forward. As i mention previously, i do tried QTCreator Build in Kit to specifiy the Cross Compiler to biuld it With MinGW but for some reason it just not work for me as i was expected. And figuring how to fix and deal with it already takes me hours, which is not very pleasant.