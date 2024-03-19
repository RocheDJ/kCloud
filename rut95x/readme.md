# PyIo - FOG NODE Application

![version](https://img.shields.io/badge/version-0.0.24019-blue.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg)

---


## An application written in Python to run on a Teltonika Rut95X industrial router

This is an example application written in python as part of my SETU final project for HDip in computer science.

It implements a simplified pasteurizer application running on a [Teltonika](https://teltonika-networks.com/products/routers/rut956) industrial router with an [IFM](https://www.ifm.com/ie/en/product/AL1350) IOlink master to communicate to various edge sensors and outputs.

It also uses [Flask](https://flask.palletsprojects.com/en/3.0.x/#) to host a local web server control and monitoring with an [SQlite](https://www.sqlite.org/) database backbone.

### Test Rig

> A simple test rig was constructed for the project.

![Test Rig][image4]

### Process overview page screen shot

> Allows the user to see an overview of the process.

![Home page][image1]


### Process data page screen shot

> Allows the user to latest data values.

![Data List page][image2]


### Process Trend screen shot.

> Allows the user to view trend data for a particular variable.

![Process Trend page][image3]


[image1]: ./images/FogHome.png

[image2]: ./images/FogList.png

[image3]: ./images/FogTrend.png

[image4]: ./images/TestRig.png