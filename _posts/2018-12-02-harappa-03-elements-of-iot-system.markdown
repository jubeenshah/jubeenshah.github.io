---
title: "Harappa - Elements of IoT System (Contd.) "
categories: ["projects", "iot"]
---              

Content
-------

* [Sensors](#sensors)
* [Actuators](#actuators)
* [Community of Things](#community-of-things)
* [Federation of communities](#federation-of-communities)
* [Conversations](#conversations)
* [Enabling technologies](#enabling-technologies)

Elements of IoT (Contd.)
========================

Sensors
-------

This subsection lists and describes in some detail the sensors that would be needed as a part of the project. This is not an exhaustive list and more/fewer sensors might be needed as a part of the implementation when considering each house.

*   Temperature & Humidity — DHT22: The temperature and humidity sensor would help record the temperature and humidity of the environment (room/house) with an accuracy unto ±2% for relative humidity and unto ±0.5°C (±0.9°F). The primary purpose of the DHT22 sensor is to send updates to the user and other things (actuators) in the environment to take appropriate action based on the readings from the sensor. For example, if the temperature shoots above a threshold value, an alert can be sent to the user that the air conditioner has been turned on, while concurrently sending a signal to the air conditioner to turn on. Similarly, in case of humidity readings, a dehumidifier can be turned on.  
    
*   Air Pressure — BMP180: Air Pressure Sensor can give relative height from the sea level, and this information along with the temperature reading either from BMP180 \[6\] sensor itself, or the DHT22 sensor, can help control the temperature of the environment more accurately in hilly regions to provide more energy efficiency. According to the datasheet, the BMP 180 sensor has an accuracy of ±0.12 hPa.
*   Light Sensor — BH1750: Light Intensity sensor would help record the amount luminosity in the environment. This would then be translated into other signals for other actuators in the environment primarily the switches for lights and window blinds. It has a very high resolution that gives values ranging from 1 lux to 65535 lux.
*   Air Quality Sensor — MQ2: The MQ2 sensor would record the concentration of different gases in the environment. The concentration of the gases is calculated on the basis of electrical conductivity. MQ2 Gas sensor has high sensitivity to LPG, Propane, and hydrogen, and also other combustible steam. When different gasses are present in the higher concentration, the conductivity of the sensor increase.
*   Motion Sensor — PIR: The motion sensor is a Passive Infrared sensor that makes use of anomalies in IR generated to detect motion in the environment. This sensor would be able to detect motion, and then based on a certain set of predefined rules and conditions, ESP8266 would be used to send a signal other devices in the environment to generate an alarm. 
*   UV Sensor — ML8511: ML8511 works on a similar principle such as FC-28. However, it is to be noted that both FC-28 and the ML8511 use the Analog pin to communicate with the micro-controller. What this means, is that only one of them would be able to communicate with the micro-controller at any one time since ESP8266 has only one Analog pin, a Demultiplexer such as the IC 4051 would be needed to switch between the Analog pins between two or more sensors using it.  
    
*   Magnetic Sensor: The switches would make use of the relays to switch on/off a device. The smart switches would simply make use of multiple relays to switch on/off a device like the irrigation system, the smart switches would be given three triggering mechanisms. The first would be an alert signal from any of the sensors in the environment which would trigger the switch being turned on/off, and the remaining two are discussed in the mobile app.
*   Camera: The camera would be used to classify the type of plant as required in BR 15. It would make use of the AWS Rekognition service to classify the plant type
*   Soil Moisture Sensor—FC28: Soil Moisture sensor makes use of conductance between two electrodes, to determine the percentage amount of water in the soil. This sensor makes use of an Analog pinto detect the difference in voltage level, which can then be used to translate into digital data

Actuators
---------

As required by BR 7, BR 9, and BR 15 the following list of actuators are identified

*   Micro-controller—ESP8266: The ESP8266 would be the brains of the individual sensors that would have the compute capability to wirelessly transfer information to the cloud server. This would also have the power supply connected to it; either in the form of a battery or any other source of wall outlet (5V) 
*   Valves: The valves would be part of the irrigation system which would be used to control the flow of water to the plants.
*   Relays: The relays would be a part of the smart switches, and irrigation system which would be used to switch ON/OFF the devices in which it is embedded.
*   Temperature Controller: The temperature controller would be a part of the smart thermostat system which would be responsible for setting the temperature of the environment.  
    

Community of Things
-------------------

This subsection outlines an arbitrary collection of things, as seen in the [things](2018-12-02-harappa-02-elements-of-iot.markdown) section, which are useful from a management perspective. There are several communities of things that are possible with the project, however, we limit ourselves to four.

*   Community of rooms: This would be a collection of the rooms in the house, with sub-communities defined for different types of rooms such as the living room, bathroom, and study room.
*   Community of plants: This would be a collection of the different plants that would be identified in the house of the user.
*   Community of doors & windows: This would be a collection of the doors and windows in the house that are required to be monitored by BR 14.
*   Community of mobile devices: This would be a collection of the mobile devices being used by the user to manage and monitor the state of the devices in the smart house.  
    

Federation of Communities
-------------------------

This subsection outlines the communication. Between Heterogeneous sets of communities as discussed above. There are several federations of communities possible in the project, but we limit ourselves to the three that are discussed below.

*   Community of rooms communicating with community of mobile devices 
*   The different sensors deployed in the rooms would send values to the mobile devices via the AWS environment as mentioned in BR 1.  
    
*   The mobile device would also send signals to the devices such as the smart switches, smart thermostat, irrigation system etch to control the states of the devices via the AWS environment as expected in BR 9.  
    
*   Community of doors and windows communicating with the community of mobile devices
*   The magnetic sensor fitted on the doors and windows would send its status when they are changed to the mobile devices which are described in BR 14.  
    
*   These status messages would be sent to the mobile devices either whenever the state changes or as described by the user.  
    
*   Community of plants communicating with community of rooms  
    
*   The plants would communicate with the room, which would help identify what plants are available in which room which is described in BR 15.
*   This information would be necessary to identify which rooms have which plant(s).

Conversations
-------------

This subsection outlines the different types of conversations that are possible between the sets and subsets of things, people, and data as discussed on the [previous](2018-12-02-harappa-02-elements-of-iot.markdown) page. A few of the many conversations possible are listed below.

*   Things to Data: Rooms would be monitored for different data points including temperature, humidity, air pressure, the light intensity which would be collected by different sensors in the room. For example,, when the temperature sensor records some value from the room it would generate data that would then be sent to the AWS environment for further processing or storage.
*   Thing to Thing: The mobile device is used to manage the states of the devices in the environment. For example, when the mobile device is used by the user of the system to manage the state of switches in the environment, the user would toggle the switch on the mobile device via the application which would then be sent to the AWS environment for processing. This would then trigger a Lambda function which would then cause the switch in the house of the user to change states.
*   Thing to People: Notification being sent by the device to the user. For example, when the  alarm is triggered, it would send an MQTT message to the AWS environment which would then trigger a Lambda function to trigger the AWS SNS to send a notification to the user of the system on the mobile device associated with the automation environment.
*   Data to Things: Trigger generated based on events from the database to control the states of things in the environment. For example, soil moisture reading, triggering the activation of the water sprinklers. 
*   Data to People: Visualization of the past information of the data being stored in the database. The data being collected by the sensors, when sent to the AWS environment would trigger several Lambda functions, one of which would be responsible for the visualization of the data being collected for the user of the system to understand. 
*   Data to Data: When data is used to extract data from other databases. for example, when we use the flower name from the classification model to get the water requirements from another database.
*   People to Data: People manually changing the status of a particular device in the environment. For example, when the user is using the mobile device to manage the state of a particular device in the environment, the user is also adding data points for the states of the devices that he is managing.  
    

Enabling Technologies
---------------------

*   Visualization: Visualization of data would be an enabling technology in the project, as it would give the user a glimpse of all the information that the system is trying to accumulate with all the sensors in the smart home environment. The visualization mainly can comprise a time series display of the readings from the sensors. Open source tools such as influxDB (Time Series Database) and Grafana (Open source Visualization tool) and Amazons QuickSight.

Related Pages
-------------

[Summary](2018-12-02-harappa.markdown)[Project Details](2018-12-02-harappa-01-project-details.markdown)[Elements of IoT (1)](2018-12-02-harappa-02-elements-of-iot.markdown)[Elements of IoT (2)](2018-12-02-harappa-02-elements-of-iot.markdown)[IoT-A Architecture](2018-12-02-harappa-04-iot-a.markdown)[Analytics & Computing](2018-12-02-harappa-05-analytics.markdown)[Conclusion](2018-12-02-harappa-06-conclusion.markdown)

[elements of iot (1)](2018-12-02-harappa-02-elements-of-iot.markdown)

[Iot-a architecture](2018-12-02-harappa-04-iot-a.markdown)

