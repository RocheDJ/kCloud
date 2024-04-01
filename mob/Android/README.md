# SETU HDip Computer Science  Final Project kCloud app

## kCloud - Android Application

- An example Android application written to showcase the possibilities of using an android app with kCloud.

![Version](https://img.shields.io/badge/version-1.0.24089-blue.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Originator

- David Roche

---

## An Android Application to interface with kCloud final Project  

---

## Description

This Demonstration application allows the user to log in and view data from industrial installations in real time using an application rather than a web site.

The project is based on a previous project I did for Mobile Development Assignment II Github [Link](https://github.com/RocheDJ/DataViewLogger/tree/Assignment-II) but with some under the hood changes.

1) User Login and Data retrieved from kCloud API server using Volly.

2) User can scan NFC tag to ID particular instillation.

3) APK file built for limited user testing.

---

## Screen shots

> Login Page user can sign up or log in.

![Login][image1]

> Installation list page allows the user view list of installations FAB floating action button for NFC scan.

![Installations][image2]

> Latest Process variable values list.

![Process Data Variables][image3]

---

## References

Using Volly [Volley Library in Android](https://www.geeksforgeeks.org/volley-library-in-android/)

NFC Developer docs for NFCV [NfcV](https://developer.android.com/reference/android/nfc/tech/NfcV)

Medium Article on NFC[NFC From Scratch (With a Practical Example)](https://medium.com/flux-it-thoughts/nfc-from-scratch-with-a-practical-example-ce0c7995595b)

Good Stackoverflow discussion on writing blocks to the tag and reading back [Writing Single Block command fails over NfcV](https://stackoverflow.com/questions/55856674/writing-single-block-command-fails-over-nfcv)


## Debug APK 

---
A Debug APK package file for the application can be found here
[APK Download](https://github.com/RocheDJ/kCloud/tree/main/mob/Android/app-kcloud.apk "download")

[image1]: ./images/login.jpg

[image2]: ./images/installations.jpg

[image3]: ./images/pvo.jpg