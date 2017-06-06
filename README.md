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

## License

MIT. See [LICENSE](./LICENSE) for details.

