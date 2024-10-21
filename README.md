# Hidra

Hidra is an open-source tool that allows you to post simultaneously on both Bluesky and Twitter.

## Getting Started

### Installation

You can download the latest version in [Release](https://github.com/INCHMAN1900/Hidra/releases).

The app is not notarized, so Apple might suggest you to move it to Trash. You'll need to go to **Settings -> Privacy & Security**, scroll down to bottom and press "Open Anyway" to run Hidra.

If you don't want to do that, you can build Hidra from source code. [Instructions](#dev).

### Prerequisites

To use Hidra, you'll need to obtain API keys from Twitter and create a special app password for Bluesky.

#### Twitter

1. Visit the [Twitter Developer Portal](https://developer.twitter.com/).
2. Create a new project and generate your `API Key`, `API Key Secret`, `Access Token` and `Access Token Secret` in **Keys & tokens**.

#### Bluesky

1. Go to the [Bluesky - Settings - App Passwords](https://bsky.app/settings/app-passwords).
2. Create an app to generate your special app password.

### Usage

1. Enter your Twitter API keys and Bluesky app password in the `Configuration` modal of Hidra.
2. Compose your post and select your preferred platforms.
3. Click "Post" to share your content on both Bluesky and Twitter!

## dev

```bash
git clone https://github.com/INCHMAN1900/hidra.git
cd hidra

# Install Node if you haven't: https://nodejs.org/en/download/package-manager
npm install # or yarn

# dev
npm run electron:dev
# build
npm run electron:build
```

## Contributing
If you’d like to contribute to Hidra, please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

