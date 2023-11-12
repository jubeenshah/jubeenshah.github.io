---
layout: project
title: "Cosmos: OpenHab Configuration"
categories: ["projects", "iot"]
---  

Content
-------

[Openhab Configuration](#Openhab-configuration)[Things](#things)[Sitemaps](#sitemaps)

OpenHAB
=======

OpenHAB Configuration
---------------------

OpenHAB (Open Home Automation Bus) is the central entity to an automation environment in which it is set up. All the functionalities and properties of the connected endpoints in the environment are available to the end-user for configuration. These configurations primarily comprise of the user interface, setting up the ‘if-this-then-that’ rule engine, and other parts. OpenHAB is an open platform installed and configured by the end-user, that would run solitarily from any other online services. As a user, this gives them full control over all the aspects of their smart environment in which the platform is installed.

### Things

Things are the physical layer of the OpenHAB system; it constitutes of all the material entities. These physical objects include not only the devices but also consists of the web-services and other information sources. Cosmos makes use of all the physical entities to allow for as much integration of services and devices to provide the user a single consolidated view of all the essential information that the user may require to not only manage the automated environment but also act as a decision support system.  
  
Things are connected to openHAB through bindings. An example of bindings that Cosmos makes use of is the MQTT protocol binding, which allows the device to communicate over the lightweight MQTT protocol. Items are used to manage the information and state changes of the Things, which allows this information to be accessible to the user.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/3f967d917fe2c6dd40f81614b2cab2ae.png)

### Sitemaps

Sitemaps are concerned with the visual representation of the Items and things as is visible to the user on the web-browser or the mobile application. Several elementTypes can be defined for the sitemaps, which would then be mapped to the .items and .things file for further details and configuration so that when an action is performed on the UI end of the application, the corresponding steps are taken/performed at the backend to implement the necessary measures. Please note that the icons and the relevant labels will not match, since they’re defined in the \`.items\` file. Sitemap defines what entities would be present in the UI, and how they’re grouped. However, the backend connection with the actual things is made by the .items file. Several elementType definitions are available, ranging from images to media, to slider and switches.

Related Pages
-------------

[Summary](../2017-11-02cosmos.markdown)[Project Details](2017-11-02-cosmos-01-project-details.markdown)[Automation Server](2017-11-02-cosmos-02-automation-server.markdown)[OpenHAB](2017-11-02-cosmos-03-openhab.markdown)[Modules  Details](2017-11-02-cosmos-04-modules-00-Introduction.markdown)

[automation server](2017-11-02-cosmos-02-automation-server.markdown)

[modules sumary](2017-11-02-cosmos-04-modules-00-Introduction.markdown)

