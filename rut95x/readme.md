# PyIo - FOG NODE Application

![version](https://img.shields.io/badge/version-1.0.24083-blue.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg)

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


### Process Trend screenshot

> Allows the user to view trend data for a particular variable.

![Process Trend page][image3]

### Registration Page

> A page to allow Fog nodes to be registered on the kCloud back end.

![Settings page][image5]

---

## References

[Open WRT](https://openwrt.org/docs/start)

[Flask CRUD Application with SQLite](https://www.vrsofttech.com/python-flask/flask-with-sqlite-crud-application)

[Teltonika Forum](https://community.teltonika.lt/)

[RUT955 Python3](https://wiki.teltonika-networks.com/index.php?title=RUT955_Python3&mobileaction=toggle_view_desktop)

[Python Multiprocessing and shared memory](https://docs.python.org/3/library/multiprocessing.shared_memory.html)

[More on shared memory](https://superfastpython.com/multiprocessing-sharedmemory/)

[Python Requests](https://docs.python-requests.org/en/latest/user/advanced/)

[Logging to file discussion](https://stackoverflow.com/questions/24505145/how-to-limit-log-file-size-in-python)

[Lambda functions](https://stackoverflow.com/questions/6198372/most-pythonic-way-to-provide-global-configuration-variables-in-config-py)

[W3 Schools Scatter Chartjs](https://www.w3schools.com/ai/ai_chartjs.asp)

[Chart JS](https://www.chartjs.org/)

[Working with JSON in SQLite](https://sqldocs.org/sqlite/sqlite-json-data/)

[How to Build an API With Python Flask](https://www.moesif.com/blog/technical/api-development/Building-RESTful-API-with-Flask/)


[Flask REST API Tutorial](https://pythonbasics.org/flask-rest-api/)

---
[image1]: ./images/FogHome.png

[image2]: ./images/FogList.png

[image3]: ./images/FogTrend.png

[image4]: ./images/TestRig.png

[image5]: ./images/register.png
