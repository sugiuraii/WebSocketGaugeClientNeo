# Websocket dashboard client (new version with WebGL)

## Table of contents

* [Description](#description)
* [System diagram](#system_diagram)
* [Requirement](#requirement)
* [Dependency](#dependency)
* [Install](#install)
* [Build](#build)
* [License](#license)

## <a name="description">Description</a>
This program is graphical dashboard gauge 

## <a name="system_diagram">System diagram</a>

## <a name="requirement">Requirement</a>
* Web server PC or appliance to distribute html and javascript files to browsers.
* Web browser to view dashboard gauges.
	* Thanks to PIXI.js, graphical gauge can work both on WebGL and Canvas enviromment. However, to get sufficient performance (over 30fps), WebGL capable browser is recommended.
		* If you want to check the operation of your browser, please try []().
	* Operation is tested mainly on Google Chrome (on Windows and Android).
	* And unfortunatelly, some part of graphical gauge cannot work well on Microsoft Edge (Gliches sometimes occurs on circular progressbar type gauges).
	* On Firefox, program works well, but performance is worse than Chrome.
	* On Safari/iOS, the program seems to works well (But I don't test on Safari so much because I only have very old iPhone4s).

## <a name="dependency">Dependency</a>
* jQuery
* 
## <a name="install">Install</a>

## <a name="build">Build</a>

## <a name="license">License</a>
[MIT License](./LICENSE)
