 Cosmos: Fire Sensor              

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../../index.markdown)

[Home](../../../../index.markdown)

Projects

[Security](../../../../projects/security.markdown)[DevOps](../../../../projects/devops.markdown)[Internet of Things](../../../../projects/iot.markdown)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../../privacy.markdown)

[Home](../../../../index.markdown)
[Projects](../../../../projects.markdown)
[IoT](../../../../projects/iot.markdown)
[Cosmos](../../../../projects/iot/cosmos.markdown)
[Modules](../../../../projects/iot/cosmos/modules.markdown)
[Fire Sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)

Content
-------

[Fire Sensor](#fire-sensor)[Demo Video](#demo)[Block Diagram](#block-diagram)[Technical Overview](#overview)[Flowchart](#fc)[Final Product](#final-product)

Fire Sensor
===========

Demo Video
----------

Functional Block Diagram
------------------------

The figure below gives the basic overview of the functional block diagram of Cosmos: Fire Sensor. The device contains four separate major components — ESP8266 12E wifi module, the 5V power supply module, the 5V to the 3.3V regulator, and the PC 817 Optocoupler. The assumption that we’ve made with the use of the fire alarms is that the compatible ones are the hard-wired fire-alarms with a feature called interconnect. With the use of this interconnect feature when one of the fire alarms goes off, all the others connected to it going off too.  
  
Aforementioned is made possible by the use of a cable used to transmit a 9-volt pulse to all the connected fire alarm systems, Cosmos: Fire Sensor (CFS) leverages this much functionality in the design. The CFS waits for this 9-volt pulse from the already existing fire detector system, and when it receives this pulse, CFS changes its state and consequently sends the MQTT message to the centralized RPi3 controller.  
  
This controller then broadcasts this information to all the connected devices via push notifications. Correspondingly, the RPi3 can also be used to trigger other connected modules such as the Smart  LED or posting this information on social media to inform authorities.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/657e22cc9952152003398c6698d7b0b4.png)

Technical Overview
------------------

### Flowchart

The figure below is the flowchart diagram of how the system would function. Once the CFS is initialized, it would repeatedly attempt to connect with the MQTT broker, the centralized controller, until the connection is established. Once connected, it would publish the initial state of the detector as “No Fire detected.” Then it would continuously monitor, with a pre-configured delay (in case of CFS, it is 10 seconds), whether the fire detector has sent a 9-volt pulse. If, at any point, it detects a 9-volt pulse, in which case it means that the fire alarm has been triggered, it would send an MQTT message to the broker, which consequently broadcasts a “Fire detected” message over all the authenticated pre-configured devices. Once the necessary actions are taken, and the issue is resolved, the system turns back to the initial state. It continuously monitors the circuit for another 9-volt pulse from the fire detector.

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/8d5bf8814ff2a1a1a39d40f8ca7a280e.png)

### Final Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/ae21b8dc4ac25e36b0dfe0cb901fe0d4.jpg)

Related Pages
-------------

[Summary](../../../../projects/iot/cosmos.markdown)[Project Details](../../../../projects/iot/cosmos/project-details.markdown)[Automation Server](../../../../projects/iot/cosmos/automation-server.markdown)[OpenHAB](../../../../projects/iot/cosmos/openhab.markdown)[Modules  Details](../../../../projects/iot/cosmos/modules.markdown)[Intrusion Sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)[Fire Sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)[Weather Station](../../../../projects/iot/cosmos/modules/weather-station.html)[Ambient Station](../../../../projects/iot/cosmos/modules/ambient-station.html)[Smart LEDs](../../../../projects/iot/cosmos/modules/smart-leds.html)[Smart Switch](../../../../projects/iot/cosmos/modules/connected-switches.html)[Smart Lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

[intrusion sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)

[weather station](../../../../projects/iot/cosmos/modules/weather-station.html)

