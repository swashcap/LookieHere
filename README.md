# LookieHere

_📱✨ Sample mobile app with [react-native](https://facebook.github.io/react-native/)._

## Setup

_(Steps for macOS. See links below for Linux/Windows setup instructions.)_

Make sure you have [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12), [Node.js](https://nodejs.org/en/) (>=6.x.x) and [Homebrew](https://brew.sh) installed. Then:

1. [Install react-native](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies) as a global package:

    ```shell
    $ npm install -g react-native-cli
    ```
2. [Install watchman](https://facebook.github.io/watchman/docs/install.html#buildinstall):

    ```shell
    # On OS X with Homebrew:
    $ brew install watchman
    ```
3. Clone the repository:

    ```shell
    $ git clone git@github.com:swashcap/LookieHere.git
    $ cd LookieHere
    ```
4. Install dependencies using [npm](https://www.npmjs.com):

    ```shell
    $ npm install
    ```

5. Create an API configuration file at _config/index.json_:

    ```shell
    $ mkdir config
    $ touch config/index.json
    ```

    _index.json_ should have should have two properties—`apiKey` and `apiBase`— cooresponding to your
    API configuration. An example:

    ```json
    {
      "apiKey": "key",
      "apiBase": "https://fully-qualified.domain/path/to/api"
    }
    ```

    See _[config/sample.json](./config/sample.json)_ for an example file.

## Running

Open a terminal and `cd` to the project directory. To start the react-native packager server, run:

```
$ npm start
```

…this takes several seconds to bundle the iOS application. Keep this process running! Then, in a new terminal window, run:

```
$ react-native run-ios
```

…this opens LookieHere in the iOS Simulator.

## Development Server

This project contains a development server for testing the application without making requests to an external server. Ensure your _config/index.json_ has an accessible hostname (`localhost` works when developing in simulators or emulators) and open port on your machine. An example:

```json
{
  "apiKey": "my-api-key",
  "apiBase": "http://localhost:3000/path/to/base"
}
```

The server mimics the API's expected responses, but with random field values supplied by [Chance.js](http://chancejs.com). To run the server:

```shell
$ npm run server
```

Optionally, you can configure builds to access the development server by using your development machine's IP address as the hostname. To look this up on macOS, run:

```shell
$ ifconfig
```

Your machine's network-accessible IP address should be under the `en0` interface:

```shell
#...
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	ether 20:c9:d0:8a:0a:55
	inet 192.168.0.111 netmask 0xffffff00 broadcast 192.168.0.255
	media: autoselect
	status: active
#...
```

(`192.168.0.111` in the above output.)

## License

MIT. See [LICENSE](./LICENSE) for details.

