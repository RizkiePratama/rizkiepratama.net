---
layout: blog
title:  Resize LVM Partition with lvextend on Linux
custom_css: blog
cover: /assets/images/post-thumbnails/resize-lvm-partition-using-lvextend.jpg
tags: ["Tutorial", "Linux"]
---

Sometimes when you're setting up new Linux Box you always forgot to configure size of certain parition, and when its time, the partition is filled and you can't do any work on it. or maybe any other reason that your partition just get filled up. in my case it was happen with my Root Partition, Luckly i'm using LVM File System on that partition, and i can easly extend it using lvextend.

## View Disk Usage

but before we start, we need to check first which partition that are need to be resized, we can just run the following command:

```
➜  ~ df -h
Filesystem                         Size  Used Avail Use% Mounted on
tmpfs                              1.6G  1.7M  1.6G   1% /run
/dev/mapper/ubuntu--vg-ubuntu--lv   36G   36G     0 100% /
/dev/sda2                          2.0G  251M  1.6G  14% /boot
```

as you can see i have 100% usage on my Root partition, and thats what i want to resize.

## Check Free Space on Volume Group

We also need to check how many free space available on Volume Group that we can use to resize the partition that we want.

```
➜  ~ sudo vgdisplay
[sudo] password for rizkie.pratama:
  --- Volume group ---
  VG Name               ubuntu-vg
  System ID
  Format                lvm2
  Metadata Areas        1
  Metadata Sequence No  4
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                1
  Act PV                1
  VG Size               <78.00 GiB
  PE Size               4.00 MiB
  Total PE              19967
  Alloc PE / Size       23534 / <38.00 GiB
  Free  PE / Size       39674 / 40.0 GiB
  VG UUID               XXXXXXXX
```

as you can see on Free  PE / Size, i have 40.0 GiB available that i can use to resize my parition.
So all good.

## Extend the LVM Partition

Since we already have the information that we need, we can just go extend the LVM Partition now

```
➜  ~ sudo lvextend -L +20G /dev/mapper/ubuntu--vg-ubuntu--lv
```

Here some parameter you want to Modify,
- `+20G` is the value of how many space you want to add to your LVM Partition, in my case, i was adding 20Gb. if you want to add all the free space you have on that Volume Group, you can use `+100%FREE` instead
- `/dev/mapper/ubuntu--vg-ubuntu--lv` is tha path of your LVM Parition, you can get the dev mapper path using the above guide using `df`

after that you can run the `resize2fs` command to apply the new size to your partition

```
➜  ~ sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```

## Verifying your changes

after you complete running the `resize2fs` your partition should now having the new size / capacity that you can use.
To check it you can just rerun the `df -h` command again:

```
➜  ~ df -h
Filesystem                         Size  Used Avail Use% Mounted on
tmpfs                              1.6G  1.7M  1.6G   1% /run
/dev/mapper/ubuntu--vg-ubuntu--lv   56G   36G 19.7G 100% /
/dev/sda2                          2.0G  251M  1.6G  14% /boot
```

And we're success add another 20Gig into our root partition, pretty simple right?