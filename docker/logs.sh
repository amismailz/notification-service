#!/bin/sh

docker-compose exec api pm2 logs -f
