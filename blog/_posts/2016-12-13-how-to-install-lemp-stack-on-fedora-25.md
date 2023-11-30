---
layout: blog
title:  How to install LEMP stack on Fedora 25
custom_css: blog
cover: /assets/images/post-thumbnails/source/Fedora25LEMPCover.jpg
tags: ["Tutorial","Ruby on Rails","Fedora"]
---

While its still fresh, i guess i will cover how i Install LEMP Stack. LEMP stack is term for Linux, Nginx, MariaDB/Mysql and PHP. Just like LAMP stack, but instead of using Apache it use[Nginx](https://www.nginx.com)as the HTTP Server.


## **Preparing**

if youre using Fedora 25 Cloud (server) version, i highly recommend you to update your system to latest available package, simply run

`$ sudo dnf update`

since our LEMP Stack going to be running as service, im going to proceed as super user.  
 Depending on your preference, you can use **sudo** command instead. But for simplicity im going to use **su **


## **Install Nginx**

if youre set, lets start with the installation progress.  
 First, we are going to install Nginx into our system, run:  
`# dnf install nginx`

Now open **/etc/nginx/nginx.conf**By default your nginx config should look like this snippet bellow. Modify and add the marked line with your server info or preferences

`user nginx; *// Set nginx user* worker_processes auto; *// or set this with your total / desired host cpu* /* .... */ server { listen 80 default_server; listen [::]:80 default_server; server_name _; *// change this with your domain name or with your public ip* root /srv/www/yoursite.com/public; *// or replace with your desired root location* index index.php index.html index.htm; /* .... */ location / { } location ~\\.php$ { try_files $uri =404; fastcgi_split_path_info ^(.+\\.php)(/.+)$; fastcgi_pass unix:/run/php-fpm/www.sock; fastcgi_index index.php; fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; include fastcgi_params; } /* .... */ }`

if youre done, check your new configuration for error by simply run

`# nginx -t`

if everythings ok, now you can start nginx with the following command

`# systemctl start nginx # systemctl enable nginx`


## **Test Nginx**

Now with nginx up and running, lets check if its working or not. Open you favorite web browser and point it to **http://localhost/** or **http://your-server-ip-address/**if its a success, you should see something like this on your web browser.

![](/content/images/2016/12/scrot_nginx_default_fedora_test_page_demo-1024x530.png?resize=1024%2C530)


## **Database System**

Next, we are going to install our database package. for this guide im going to use MariaDB since it what im most confortable with.

`# dnf install mariadb mariadb-server`

when youre done, run this following command to start secure installation.

`# mysql_secure_installation`

proceed according to your preferences, make sure to enable password for your mysql root user and disable remote access to those root.

Now start and enable your database service

`# systemctl start mariadb`
`# systemctl enable mariadb`


## **PHP**

To install PHP and some of its Core module you can run this command:

`# dnf install php php-cli php-mysqli php-fpm`

by default, Fedora 25 using PHP 7, therefore if you need to run PHP 5 you need to change **php** with **php5**.

when the installation proggress is complete without any error, now open the php-fpm config at**/etc/php-fpm.d/www.conf** and find the following syntax:

`; RPM: apache Choosed to be able to access some dir as httpd User = apache ; RPM: Keep a group allowed to write in log dir groups = apache`

php-fpm process are using an apache users and group for its process, but since were use nginx, we need to overide it intu nginx users and group or anything that you have set on nginx config.

when youre done, start the php service by running this command:

`# systemctl start php-fpm # systemctl enable php-fpm`


## **Test PHP**

now, lets do a test drive. first. create a new fie called**info.php**on your nginx web root. and add this following line:

`<?php phpinfo(); ?>`

safe it, and now point your web browser to **http://localhost/info.php** or **http://your-server-ip-address/info.php**.****Now you should be able to see the phpinfo page on your screen. It should be something like this :

![](/content/images/2016/12/scrot_phpinfo_fedora_test_page_demo-1024x571.png?resize=1024%2C571)

There you go! Congratulation, At this point your LEMP Stack is now ready to rock on your Fedora 25 system!


## **A Little Tips!**

If youre happen to get a 403 (Access Denied) or 502 () errors from nginx, you can follow this checklistto fix it.

1. Set SElinux to Permissive
2. Make sure Nginx listengin to a correct and active PHP-FPM socket, this can be done by verifying wether **listen =** syntax on **/etc/php-fpm.d/www.conf** is having the same value as **fastcgi_pass** on **/etc/nginx/nginx.conf**.
3. Check your Nginx root folder ownership. make sure its same with user inside your Nginx config.
4. Make sure to restart the services after you made change into your config.

to make it easy to figure out whats went wrong, you can always check the very last line of nginx error log ( default at `/var/log/nginx/error.log` )