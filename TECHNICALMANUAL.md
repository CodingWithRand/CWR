# Manual & Requirement for contributors

## Requirement
- You must have experienced in web app development, and roughly know how the web work.
- You must have a brief knowledge about how an API work, network, CORS, HTTP, HTTP status code, SSH, and CRUD concept.
- You must have a brief knowledge about the React lifecycle, and hooks implementation.
- You must know how to design an optimal database structure.
- You must have a creativity to design the user interface that will enhance user experiences.
- These are the brief list of the technologies and computer languages we'll be using to develop the app. So you better study it (*briefly*)

### Core Structure
> 1. [Node.js](https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi)
> 2. [React.js](https://react.dev/learn)
> 3. [React Native](https://reactnative.dev/docs/next/getting-started)
> 4. [Android Native](https://developer.android.com/) for native module. Most likely sticks with its *[API](https://developer.android.com/reference)*.
> 5. [Firebase](https://firebase.google.com/docs/) for Authentication and Database systems.

### Computer Languages
(*You can search and learn by yourself [here](https://www.w3schools.com/)*)
> 1. JavaScript & TypeScript - *to write on React Native and React code.*
> 2. XML - *XML is required to write configuration in AndroidManifest. Beside that, it includes to JSX / TSX*
> 3. CSS - *We use CSS in JS in React Native. It's used to style the page*
> 4. JSON - *Use for altering the project configurations*
> 5. Java - *Its fundamental is required for writting native module*
> 6. [Groovy](https://www.tutorialspoint.com/gradle/index.htm) - *It is required to import Java package to the application, which is written in `.gradle` files*
> 7. Bash - *The commands that are associated to the projects are required. Mostly are npm or adb commands*

### Additional Technologies & Libraries
> 1. [Git](https://git-scm.com/download/win) & [GitHub](https://github.com): Learn more about git commmands [here](https://www.w3schools.com/git/)
> 2. Web hosting service (In this project, we use [Render](https://render.com/)) for publishing API server to request some data from firebase. 
> 3. [Express.js](https://expressjs.com/) - it is used to create the API server as I mentioned in the previous one.
> 4. Environment Variable - it is used to store secrets

## Manual

You must have read [README.md](./README.md) and the [Setup Documentation](https://reactnative.dev/docs/environment-setup) before this. If you haven't, please go read it first.

After knowing roughly how to configure and run test on the app. Here's something you must know.

- We're mainly developing an __ANDROID__ mobile application, through an emulator.
- Make sure you have enough free storage (At least 25 GB)
- This app requires Java 17, so go install it [here](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- In some cases, you may need `adb` to debug or to retrieve the secret information. So, I recommend you to take a look on it [here](https://developer.android.com/tools/adb), and follow this [guide](https://www.howtogeek.com/125769/how-to-install-and-use-abd-the-android-debug-bridge-utility/) to install it properly.
- Following these metadata to install an android emulator in [__Android Studio__](https://developer.android.com/studio) for unit test

    <table>
        <tr>
            <th rowspan="2" style="background-color: navy">Device Category</th>
            <th colspan="5" style="text-align: center; background-color: magenta">Hardware Profie</th>
            <th colspan=4 style="text-align: center; background-color: darkgreen">System Image</th>
        </tr>
        <tr>
            <th style="text-align: center; background-color: magenta">Name</th>
            <th style="font-size: x-small; background-color: magenta">Google Play Store Service Included</th>
            <th style="background-color: magenta">Size</th>
            <th style="background-color: magenta">Resolution</th>
            <th style="background-color: magenta">Density</th>
            <th style="background-color: darkgreen">Release Name</th>
            <th style="background-color: darkgreen">API Level</th>
            <th style="text-align: center; background-color: darkgreen">ABI</th>
            <th style="text-align: center; background-color: darkgreen">Target</th>
        </tr>
        <tr>
            <th style="background-color: blue">Phone</th>
            <th style="background-color: hotpink">Pixel 7 Pro</th>
            <th style="text-align: center; background-color: hotpink">Yes</th>
            <th style="background-color: hotpink">6.71"</th>
            <th style="background-color: hotpink">1440x3120</th>
            <th style="background-color: hotpink">560dpi</th>
            <th style="text-align: center; background-color: forestgreen">Tiramisu</th>
            <th style="text-align: center; background-color: forestgreen">33</th>
            <th style="background-color: forestgreen">x86_64</th>
            <th style="font-size: x-small; background-color: forestgreen">Android 13 (Google Play)</th>
        </tr>
    </table>

- This app requires environment variables (sensitive data), please contact me for them.
- *__HIGHLY__* recommended to work or learn with a ChatBot AI (My suggestion is ChatGPT)