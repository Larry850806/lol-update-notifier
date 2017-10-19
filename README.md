# lol-update-notifier

This is a program that send lol update notification.

## How to run this program

1. pull latest docker image from dockerhub

`docker pull larry850806/lol-update-notifier-app`

2. run a container in background

`docker run -d --restart=always --name lol-update-notifier larry850806/lol-update-notifier-app`

## Using docker-compose

```
lol-update-notifier:
    image: larry850806/lol-update-notifier-app
    container_name: lol-update-notifier
    restart: always
```

## How to publish newer image to dockerhub

Just push to this github repo, dockerhub will build latest image automatically.

### dockerhub image repo

[larry850806/lol-update-notifier-app](https://hub.docker.com/r/larry850806/lol-update-notifier-app/builds/)
