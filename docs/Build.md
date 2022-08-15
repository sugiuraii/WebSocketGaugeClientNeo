# Build instruction

0. To build docker image, skip reading this and see [Build-Docker.md](Build-Docker.md)
1. Install node.js (16 or newer)
2. Install `npm-run-all` package
    ```
    npm install --global npm-run-all
    ```
3. Install dependent packages, and run `build-all` script.
    ```
    npm i
    npm run build-all
    ```
4. (Optional) Build thumbnail for frontpage (`index.html`).
    1. cd to `playwright` sub directory.
        ```
        cd playwright
        ```
    2. Install playwright and dependencies.
        ```
        npm i
        ```
    3. Build thumbnails
        ```
        node thumbnails.js
        ```
5. Finally, you can find compiled html/js in `public_html` directory.
