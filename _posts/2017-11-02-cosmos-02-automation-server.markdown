---
title: "Cosmos: Automation Server"
categories: ["projects", "iot"]
---   

Content
-------

[Automation Server](#)

[Hardware Requirements](#hardware-requirements)[Storage Requirements](#storage-requirements)[MQTT  Requirements](#mqtt-requirements)

Automation Server
=================

Setting up the automation server
--------------------------------

### Hardware Requirements

The entire automation server is running on the Raspberry Pi 3 (RPi3) and is connected to the automation environment network. It hosts the OpenHAB 2 service as well as the Mosquitto MQTT (MQ Telemetry Transport) service. It is advisable to use a case to house the Raspberry Pi 3, and with heat sinks installed and a fan to cool off the RPi3. Heat sinks are needed since the server would be run 24/7 throughout the lifetime of the project. The subsequent section gets into the details of installing the OpenHABian and Mosquitto MQTT service onto the Server.

### Setting up the micro SD Card for the server

The project's initial steps involve flashing a prebuilt image called OpenHABian as well as Mosquitto MQTT onto the RPi3 server. Once downloaded, any suitable unarchiver software can be used to unarchive the files which house the image file that is to be used to flash onto the micro SD card. Once completed, the next step is to flash the image files onto the RPi3. There are several online software available for flashing, for Mac users — Apple Pi Baker, for Windows users — win32 disk imager.  
  
Once the software is downloaded, the onscreen instructions were helpful enough to install the software. Once the SD card is flashed, RPi3 needs to be added to the Address reservation list on the routers web page. Once the RPi3 is configured over the network, one can directly SSH into the server with its IP address and begin setting the server, such as the date and time and edit the password.

### Testing the MQTT server

To test out whether the MQTT server is online or not, software — MQTT.fx can be used. This software will be needed in the future to test out other devices before physically installing them. We only need to change the MQTT broker address to the IP address of the Raspberry Pi and make sure that the port is 1883, which is the port for MQ Telemetry Transport (MQTT).  
  
Once that is done, we need to do one final step, and that is to change the broker URL in the RPi3 to “broker.url=tcp://\`IP\`:1883”.Once complete, only the final installation of the RPi3 physically in the network remains.

Related Pages
-------------

[Summary](../2017-11-02cosmos.markdown)[Project Details](2017-11-02-cosmos-01-project-details.markdown)[Automation Server](2017-11-02-cosmos-02-automation-server.markdown)[OpenHAB](2017-11-02-cosmos-03-openhab.markdown)[Modules  Details](2017-11-02-cosmos-04-modules.markdown)

[Project details](2017-11-02-cosmos-01-project-details.markdown)

[OpenHab configuration](2017-11-02-cosmos-03-openhab.markdown)

