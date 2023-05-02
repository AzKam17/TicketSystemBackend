FROM phpdockerio/php:8.1-fpm
WORKDIR "/application"

RUN apt-get update; \
    apt-get -y --no-install-recommends install \
        git \
        curl \
        php8.1-mysql \
        # Install GD extension \
        php8.1-gd \
        php8.1-redis \
        curl \
        php8.1-yaml; \
    apt-get -y --no-install-recommends install \
    openssl \
    php8.1-openssl ;\
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*
