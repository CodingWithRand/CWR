You must have read `README.md` and the [Setup Documentation]("https://reactnative.dev/docs/environment-setup") before this. If you haven't, please go read it first.

After knowing roughly how to configure and run test on the app. Here's something you must know.

- Make sure you have enough free storage (At least 25 GB)
- This app requires Java 17, so go install it [here]("https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html")
- If you're facing the error like this

    ```bash
    error Failed to install the app. Command failed with exit code 1: 
    gradlew.bat app:installDebug -PreactNativeDevServerPort=8081 
    FAILURE: Build failed with an exception. 
    * What went wrong: Execution failed for task ':gradle-plugin:compileKotlin'. 
    > A failure occurred while executing org.jetbrains.kotlin.compilerRunner.GradleCompilerRunnerWithWorkers$GradleKotlinCompilerWorkAction 
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