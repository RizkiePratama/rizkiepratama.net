---
layout: blog
title:  Using Yubikey for SSH Authentication on Linux
custom_css: blog
cover: /assets/images/post-thumbnails/source/setup-yubikey.jpg
tags: ["Tutorial","Linux"]
---

So, I just bought [Yubikey 5 NFC](https://www.yubico.com/id/product/yubikey-5-nfc/) and it been a good investment for me. While it's really easy to use with My Mobile device to just tap it with the NFC, initial setup on my Linux Workstation is kinda a hustle at the first time.  
  
Sure, I've been using it for my work for years before, but I don't bother to setup my system because it was pre-Provisioned by the admin. So to saving my self time in the future if I need to setup new system for my personal use I'll just get my self to this blog post.

Prerequisites
-------------

First we need to setup GPG2, Smart-Card Daemon and Pinentry program for Fedora Workstation it's already included by default, but if you're using ubuntu you can try install the following packages

`$ sudo apt install gnupg2 scdaemon pcscd rng-tools pinentry-gnome3`

Prepare GPG Agent
-----------------

Since we're need to use Yubikey as aur authentication method with the SSH service we first need to configure SSH support with the GPG Agent.

*   Cleanup all running agent  
    `$ pkill ssh-agent`  
    `$ pkill gpg-agent`
*   Modify gpg-agent config from this path `~/.gnupg/gpg-agent.conf` and add the following line (if you don't find this file you can create it manually)

    ```sh
    enable-ssh-support
    
    default-cache-ttl 300
    max-cache-ttl 600
    default-cache-ttl-ssh 300
    max-cache-ttl-ssh 600
    ```

*   Start GPG Agent as Daemon  
    `$ gpg-agent --daemon`

Setup Pin-Entry Program
-----------------------

Dependdns on how you will use it you probably need to configure the Pinentry program that you want to use.  
  
If you're mainy use graphical interface program `pinentry-gnome3` would be good enough for you. But if you're like me spending most of the time using it inside TTY or Terminal Emulator, it will be much easier to use `pinentry-curses`  
  
on `~/.gnupg/gpg-agent.conf` files, you can add this line to specify which pinentry program to use `pinentry-program /usr/bin/pinentry-curses`

Using GPG Agent as SSH Agent
----------------------------

Now that you have successfully setup GPG agent on your system, let's try using it as your SSH Agent to be able authenticate your SSH connection with Your Yubikey.

*   Make sure `ssh-agent` are not running  
    `$ pkill ssh-agent`
*   Run gpg-agent daemon  
    `$ gpg-agent --daemon`
*   Tell SSH to use GPG Agent as Authentication Sock's  
    `$ export SSH_AUTH_SOCK=/run/user/${UID}/gnupg/S.gpg-agent.ssh`

That's it, to make sure it's already run properly you can try executing `$ ssh-add -L` and if it's give you output for the ssh-rsa you're ready to go

To make it more easier you can make it as runable script.

    #!/usr/bin/sh
    pkill ssh-agent
    pkill gpg-agent
    gpg-agent --daemon
    export SSH_AUTH_SOCK=/run/user/${UID}/gnupg/S.gpg-agent.ssh
    ssh-add -L

Troubleshooting
---------------

*   Pinentry Dialog Box not showing  
    if you get this problem, and usually when using Terminal emulator / TTY (at least on my cases) you can try tell gpg-agent to update startup tty that it's attached to with this command:  
    `$ gpg-connect-agent updatestartuptty /bye`

Some of you may ask, why bother setting it up manually like that when project like [yubikey-agent](https://github.com/FiloSottile/yubikey-agent) available on GitHub. Well i just think this is more easier and flexible for me to use, so why not ;)