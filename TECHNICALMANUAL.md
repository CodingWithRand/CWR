# Manual & Requirement for contributors

## Requirement
- You must have experienced in web app development, and roughly know how the web work.
- You must have a brief knowledge about how an API work, network, CORS, HTTP, HTTP status code, SSH, and CRUD concept.
- These are the brief list of the technologies and computer languages we'll be using to develop the app. So you better study it (*briefly*)
> 1. HTML (Referring to JSX / TSX for the most)
> 2. CSS
> 3. JavaScript
> 4. TypeScript
> 5. JSON

(*The first five on the list, you can search and learn by yourself [here](https://www.w3schools.com/)*)

> 6. [Node.js](https://nodejs.org/dist/v20.11.1/node-v20.11.1-x64.msi)
> 7. [Git](https://git-scm.com/download/win) & GitHub: Learn more about git commmands [here](https://www.w3schools.com/git/)
> 8. Web hosting service (We use [Vercel](https://vercel.com/) & [Render](https://render.com/))
> 9. Simple terminal commands (Bash)
> 10. [React.js](https://react.dev/learn)
> 11. [React Native](https://reactnative.dev/docs/next/getting-started)
> 12. [Express.js](https://expressjs.com/)
> 13. Environment Variable
> 14. [Firebase](https://firebase.google.com/docs/)

## Manual

You must have read [README.md](./README.md) and the [Setup Documentation]("https://reactnative.dev/docs/environment-setup") before this. If you haven't, please go read it first.

After knowing roughly how to configure and run test on the app. Here's something you must know.

- We're mainly developing an __ANDROID__ mobile application.
- Make sure you have enough free storage (At least 25 GB)
- This app requires Java 17, so go install it [here]("https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html")
- If you're facing the error like this

    ```bash
    error Failed to install the app. 
    Command failed with exit code 1: gradlew.bat app:installDebug -PreactNativeDevServerPort=8081 
    FAILURE: Build failed with an exception. 
    * What went wrong: Execution failed for task ':gradle-plugin:compileKotlin'. 
    > A failure occurred while executing org.jetbrains.kotlin.compilerRunner. GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction 
    > Could not delete 'C:\Programming Projects\GitHub Repositories\vnote\node_modules\@react-native\gradle-plugin\build\kotlin\compileKotlin\cacheable\caches-jvm' * 
    ```
    You may try running `npm run android` again
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