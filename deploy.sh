#!/bin/bash

# Nginx servisini durdur
systemctl stop nginx

# GitHub'dan güncellemeleri çek
git pull origin main

# Docker Compose ile yeniden başlat
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Eğer container'lar başarıyla başlatılamazsa Nginx'i tekrar başlat
if [ $? -ne 0 ]; then
    echo "Docker container'ları başlatılamadı. Nginx'i tekrar başlatıyorum..."
    systemctl start nginx
    exit 1
fi