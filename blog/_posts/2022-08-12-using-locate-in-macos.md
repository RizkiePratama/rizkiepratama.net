---
layout: blog
title:  Using 'locate' with Mac OS
custom_css: blog
cover: /assets/images/post-thumbnails/mlocate-db-mac.jpg
tags: ["Tutorial","MacOS"]
---

Have you ever frustated when you need to find this one file on your system, either it's a text file, photos or even videos, but you forgot where it's located but you luckily still remember the file name. This where `locate` can help you out.  
  
So, what `locate` do? as the command name suggest, it will find any type of files by name. Sure, there's other command that works similary such as `find` but for most people, including my self find `locate` are works better and faster compared to `find`. Why may you ask? because on how it works in the background. While `find` searching the files directly in the file system and traverse every possible directory to find the desired files on every search, `locate` are collecting information of your files in advance and store all of the information inside a database, making query process marginaly faster.  
  
Now you know how those 2 command works, you might already notice disavantage of `locate` right on. Yes, the data on those database might not 100% accurate. Means at the time those database created, result of the following files you want to find might already removed and no longer exist. While it can be mitigated just by update the database before you start locating the files, but i'm sure not everyone will remember to do that an i right? So, Depends on what you need, yo can just conditionaly choose either to use `find` or `locate`.

Then, how can we use this command?  
Simply: `$ locate [-0Scims] [-l limit] [-d database] pattern ...`

> While `locate` is not Mac OS exclusive tools/command, the above options/parameter are one that used by the Mac OS version of `locate`. If you wan't to see more of the specific options can be used, Manual docs for `locate` are accessible on within your terminal with this command `$ man locate`

If this the first time you trying to run the command you migh promted to updated the database first. Just run the following command whenever you need to update your database index `$ sudo /usr/libexec/locate.updatedb`  
  
It might take some time to run, so just be patient, file access permission might prompt few times while the scan run, you can just select "OK"

![File Access Permission Prompt](/assets/images/posts/macos-mlocate/Screen-Shot-2022-08-13-at-1.34.52-1.png){: .original-width }
*File Access Permission Prompt*

All set-up, now you can try find anything you want to find. Let's say on this example, i want to find `httpd.conf` config file, we can simply use the following command to locate it `$ locate httpd.conf`

![Sample Output of the locate command](/assets/images/posts/macos-mlocate/Screen-Shot-2022-08-13-at-1.57.38.png){: .original-width }
*Sample Output of the locate command*

Easy right? but you might want to note while `locate` usefull to find files on System dir or any "rarely accessed" location. `locate` database will not Index any file on obvious location such as your `Documents` and `Downloads` folder. so  just keep that in mind.