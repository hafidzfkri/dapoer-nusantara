FROM php:8.3-cli-bookworm

# Install system dependencies & PHP extensions required by Laravel 13
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    git \
    libicu-dev \
    libonig-dev \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install \
    bcmath \
    intl \
    mbstring \
    opcache \
    pdo_mysql \
    xml \
    zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Composer binary
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP production dependencies first (cached layer)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader

# Copy application source (includes pre-built public/build assets)
COPY . .

# Ensure writable directories for Laravel (including non-root container user on HF Spaces)
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 7860

# Run migrations, seed initial roles/menus/tables idempotently, link storage, and serve on $PORT (7860 for HF Spaces)
CMD sh -c "php artisan package:discover --ansi && php artisan migrate --seed --force && php artisan storage:link --force && php artisan serve --host=0.0.0.0 --port=${PORT:-7860}"
