# WebSocketGaugeServer - Build Docker image

## How to build image
Install Docker and simply build by `Dockerfile`
```
docker build --tag (your tag name) .
```
If you want to build on non-x64 enviromnent, you may have to change `---platform` option of the `Dockerfile`.
You need to change `--platform` on 2 lines.
```Docker
# Application build container (public_html) ----------------------
# Change platform option for your build architecture
FROM --platform=linux/amd64 node:16-bullseye-slim AS build
```
and
```Docker
# Build thumbnail by playwright ---------------------------------
# Change platform option for your build architecture
FROM --platform=linux/amd64 mcr.microsoft.com/playwright AS thumbnails
```

## How to build multi-platform image by `buildx`
`Dockerfile` of this source repository can be used to build multi-platform image with `buildx`.

1.  Install qemu Docker image and setup builder
    ```Docker
    docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
    docker buildx rm builder
    docker buildx create --name builder --driver docker-container --use
    docker buildx inspect --bootstrap
    ```
2.  Change `--platform` option of `Dockerfile` (This step is not needed if you build the image on linux-x64)
    ```Docker
    # Select architecture of build platform
    # Change platform option for your build platform
    FROM --platform=linux/amd64 mcr.microsoft.com/dotnet/sdk:6.0-bullseye-slim AS build
    ```
3.  Login to docker hub (to upload image to docker hub)
    (This may not be needed to build the image to local)
    ```
    docker login
    ```
4.  Finally, build the image with `buildx`
    ```
    docker buildx build --tag (your image tag name) --platform linux/amd64,linux/arm64,linux/arm/v7 --push .
    ```
Reference
* https://stackoverflow.com/questions/60080264/docker-cannot-build-multi-platform-images-with-docker-buildx
