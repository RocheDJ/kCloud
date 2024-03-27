# SETU HDip Computer Science  Final Project kCloud app

![version](https://img.shields.io/badge/version-1.01.24079-blue.svg)
![license](https://img.shields.io/badge/license-MIT-blue.svg)
---

## kCloud Android APP Readme File

---

## Originator

- David Roche

---

## An Android Application to interface with kCloud final Project  

---

## Description

This Demonstration application allows the user to log in and view data from industrial installations in real time using an application rather than a web site.
The project is based on a previous project I did from Mobile Development Assignment II Github [Link](https://github.com/RocheDJ/DataViewLogger/tree/Assignment-II) but with some under the hood changes.

1) Data retrieved from kCloud API server using Volly.

2) User login and registration from the same API server.

3) User can scan NFC tag to ID particular instillation.

4) APK file built for limited user testing.

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

Using volly [Volley Library in Android](https://www.geeksforgeeks.org/volley-library-in-android/)

NFC Developer docs for NFCV [NfcV](https://developer.android.com/reference/android/nfc/tech/NfcV)

Good Example 'all be it 3 years old'  from marcosdecris on Git hub[NFC Activity](https://github.com/marcosdecris/Nfc_desde_cero/blob/master/app/src/main/java/com/marcos/nfctutorial/BeamActivity.kt) found from this medium article [NFC From Scratch (With a Practical Example)](https://medium.com/flux-it-thoughts/nfc-from-scratch-with-a-practical-example-ce0c7995595b)

Good Stackoverflow discussion on writing blocks to the tag and reading back [Writing Single Block command fails over NfcV](https://stackoverflow.com/questions/55856674/writing-single-block-command-fails-over-nfcv)


## Debug APK 

---
Debug APK package file for the application can be found here
[APK Download](https://github.com/RocheDJ/kCloud/tree/main/mob/Android/app-kcloud.apk "download")

[image1]: ./images/login.jpg

[image2]: ./images/installations.jpg

[image3]: ./images/pvo.jpg