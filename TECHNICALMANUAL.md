# Manual & Requirement for contributors

## Requirement
- You must have experienced in web app development, and roughly know how the web work.
- You must have a brief knowledge about how an API work, network, CORS, HTTP, HTTP status code, SSH, and CRUD concept.
- These are the brief list of the technologies and computer languages we'll be using to develop the app. So you better study it (*briefly*)
> 1. HTML
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
- The android SDKs we install in __Android Studio__ are
    ### Android API 34
    - *Android SDK Platform 34*
    ### Android 13.0 ("Tiramisu")
    - *Android SDK Platform 33*
    - *Intel x86_64 Atom System Language*
    ### *"OR"*   
    - Create a phone device with Pixel 7 Pro hardware and Tiramisu API 33 System image

- This app requires environment variables (sensitive data), please contact me for them.