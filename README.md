# SETU HDip Computer Science  Final Project

![logo][image1]

AI generated logo from [app.logo.com](https://app.logo.com/flow/business-name)

---

## kCloud

- IIOT customizable solution for data transfer in small to medium industrial control.

![Version](https://img.shields.io/badge/version-1.0.24089-blue.svg)

---

## Originator

- David Roche

---

## Description

This is work-based Industrial Internet of Things project developed for [Kilderry Instruments Ltd](http://kilderry.ie/) an industrial control software provider.
The project uses the knowledge gained during the [HDip in Computer science course](https://www.wit.ie/courses/hdip-computer-science-parttime) to develop a modern adaptable IIOT solution framework would allow us to offer a greater range of services to our existing and potentially new customers to help them expand and grow further with Industry 4.0.
Using a real-world sample application written in Python with local control and RESTful API cloud connectivity, a desktop web app and native Android application, this project will be used a foundation to update existing control systems and as the basis for completely new developments.

---

## Sections

There are four modules in the project, there is a readme with more details for each section.

### Fog Node

    Python based example application connected to an IO link master for process moderating and control and data capture.

- [Fog Node Readme](/rut95x/readme.md)

### API Server

    NodeJS back end with MySql data base to receive telemetry from the system and allow user interaction.

- [API Server Readme](/api/README.md)

### Web Server

    A Svelte TS web server to provide a user front end for observing telemetry data and process interaction.

- [Web Server Readme](/web/README.md)

### Android App

    An Kotlin Based android app to allow a user to view telemetry data via the API back end in a clear and simple manner.

- [Android App Readme](/mob/Android/README.md)

## Git Approach

This was a solo work based project so I chose to use a single repository and branch on GIT with each project section contained in its own folder with separate readme files.

## License

The software in this project is a demonstration of what can be done,new ideas and uses open source controls and platforms.
It comes wil no warranty express or implied.

![license](https://img.shields.io/badge/license-MIT-blue.svg)


[image1]: ./images/logo45.png