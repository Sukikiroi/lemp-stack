server {
    listen 80;
    listen [::]:80;

    client_max_body_size 100M;
    server_tokens off;

    set $base /var/www/fakedomain.dz;

    index index.html index.php  index.htm index.nginx-debian.html;

    server_name fakedomain.dz www.fakedomain.dz;

#   security
    include fakedomain.dz/security.conf;


#   index.php
    index index.php;

#   index.php fallback
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # handle .php
    location ~ \.php$ {
        include ipfinder.io/php_fastcgi.conf;
    }

    # additional config
    include ipfinder.io/general.conf;
}
