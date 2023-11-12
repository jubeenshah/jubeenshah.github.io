---
title: "Cosmos: Connected Switch"
categories: ["projects", "iot"]
---  


Content
-------

[Connected Switch](#Connected-Switch)[Demo Video](#demo)[Block Diagram](#block-diagram)[Technical Overview](#overview)[Flowchart](#flowchart)[Third Party Integration](#third-party)[Alexa](#amazon-alexia)[Siri](#apple-siri)[Final Product](#final-product)

Connected Switch
================

Demo Video
----------

Functional Block Diagram
------------------------

The Figure below shows the functional block diagram of CCS. The device contains four separate major components — ESP8266 12E wifi module, the 5V power supply module, PC 817 Optocoupler, and a bipolar transistor. The optocoupler is used for optical isolation of the circuit to prevent probable damage from the high voltage side of the relay. The NPN transistor is used for switching the voltage from the ESP8266 to the relay. To the end of the relays, would be connected the high voltage devices such as fans, lights, air conditioners etc. The switches’ states can be manually managed by User Managed End-Points, or can be triggered by other connected end-points

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/793d97ef903ad7fc321b1329527b0a14.png)

Technical Overview
------------------

### Flowchart

The Cosmos: Connected Switches (CCS) initially boots up and repeatedly tries to connect with the MQTT broker, RPi3, till a successful connection is established. Once the link is confirmed, the RPi3 would publish the initial state of CCS. The CCS, then waits for a message from the broker, which would indicate the action that it has to perform. For instance, consider the following message being sent by the broker to the CCS module —\`C1ON\` as mesgRecvd, which translates to a turning on switch 1. The mesgRecvd is stored as a string, and compared using simple if-else conditions stored on the ESP8266 module. This mesgSent value is checked, if it is the same as the previous message sent, to prevent redundant message transfer.  
  
Once any one of the conditional statements return a true value, the ESP8266 would send an active high signal to the corresponding pin which is predefined in the schematic. This in turn would result in the relay to be activated, allowing the live wire to be in contact with the commonly closed pin, to complete the circuit.

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/b6c3968998caf834b12ec89f785157bd.png)

Third Party Integration
-----------------------

Alexa
-----

In the initial scope of the project, it was indicated that voice commands would be integrated into COSMOS. Using standard API calls as defined by Amazon for Amazon echo, simple commands like, “Turn on Switch 1”, “Turn off Switch 2”, can be used to trigger events without using either the phone or a web user interface. Please note that the name of the device, is easily customizable, and can be sent to something generic such as “Lights”, or something more specific like “Desk Lights”.

### Siri

Since, the mobile operating system platform chosen for development was iOS, integration of Apple’s voice assistant was taken into consideration. Making use of the HomeKit library, integration with the native ‘Home’ app on iPhone was carried out to allow for a more flexible approach for state management of the COSMOS: Connected switches. This allows for easy voice based commands to be executed from any apple device – iPhone, iPad, HomePod, and Apple Watch. Simply saying “Hey Siri, Turn on Switch 1” or “Hey Siri, Turn off Switch 2” can be used to trigger events. Please note that the name of the device, is easily customizable, and can be sent to something generic such as “Lights”, or something more specific like “Desk Lights”.

### Final Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/6e2f522020f46a07cb072ce2dfcccc2c.jpg)

Related Pages
-------------

[Summary](../../2017-11-02cosmos.markdown)[Project Details](2017-11-02-cosmos-01-project-details.markdown)[Automation Server](2017-11-02-cosmos-02-automation-server.markdown)[OpenHAB](2017-11-02-cosmos-03-openhab.markdown)[Modules  Details](2017-11-02-cosmos-04-modules.markdown)[Intrusion Sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)[Fire Sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)[Weather Station](../../../../projects/iot/cosmos/modules/weather-station.html)[Ambient Station](../../../../projects/iot/cosmos/modules/ambient-station.html)[Smart LEDs](../../../../projects/iot/cosmos/modules/smart-leds.html)[Smart Switch](../../../../projects/iot/cosmos/modules/connected-switches.html)[Smart Lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

[smart leds](../../../../projects/iot/cosmos/modules/smart-leds.html)

[smart lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

