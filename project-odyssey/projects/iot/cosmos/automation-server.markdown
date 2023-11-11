 Cosmos' automation server              

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.markdown)

[Home](../../../index.markdown)

Projects

[Security](../../../projects/security.markdown)[DevOps](../../../projects/devops.markdown)[Internet of Things](../../../projects/iot.markdown)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.markdown)

[Home](../../../index.markdown)

##### /

[Projects](../../../projects.markdown)

##### /

[Internet of Things](../../../projects/iot.markdown)

##### /

[Cosmos](../../../projects/iot/cosmos.markdown)

##### /

[Automation Server](../../../projects/iot/cosmos/automation-server.markdown)

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

[Summary](../../../projects/iot/cosmos.markdown)[Project Details](../../../projects/iot/cosmos/project-details.markdown)[Automation Server](../../../projects/iot/cosmos/automation-server.markdown)[OpenHAB](../../../projects/iot/cosmos/openhab.markdown)[Modules  Details](../../../projects/iot/cosmos/modules.markdown)

[Project details](../../../projects/iot/cosmos/project-details.markdown)

[OpenHab configuration](../../../projects/iot/cosmos/openhab.markdown)

Home

[About](../../../index.markdown)[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.markdown)

Education

[Formal](../../../education/formal.markdown)[Certification](../../../education/certifications.markdown)[Pursuing](../../../education/pursuing.markdown)

Projects

[Security](../../../projects/security.markdown)[DevOps](../../../projects/devops.markdown)[Internet of Things](../../../projects/iot.markdown)

Resources

[Resumé](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Resume/JubeenShah-Resume.pdf)

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.markdown)

Passionately curious about technology

Project Odyssey - © All rights reserved. 2020 Jubeen Shah