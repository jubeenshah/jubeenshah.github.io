---
layout: project
title: "Cosmos: Modules"
categories: ["projects", "iot"]
---  

## Content


- [Modules Summary](#modules-summary)
- [Intrusion Sensor](#intrusion-sensor)
- [Fire Sensor](#fire-sensor)
- [Weather Station](#weather-station)
- [Ambient Station](#ambient-station)
- [Smart LEDs](#smart-leds)
- [Connected Switch](#connected-switch)
- [Smart Lock](#smart-lock)

## Cosmos - Modules


## Modules Summary


The following seven modules out of the eleven were developed by me, you can read the [whole report](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Projects/Cosmos/D3C319827A97C2D9EB8A5FBDC80A76D4.pdf) for the group's effort. 

1.  Intrusion Sensor
2.  Fire Sensor
3.  Weather Station
4.  Ambient Station
5.  Smart LEDs
6.  Connected Switches
7.  Smart Lock

### Intrusion Sensor

Cosmos: Intrusion Sensor is a simple but effective device that has been designed to detect and report suspicious movements in and around the place of installation. The idea behind the method is that it would be installed at all major and minor entry points and once armed, any unusual activity would be reported to the user via a notification on the device that has been configured with the OpenHAB server. The user can get this notification anywhere in the world, as long as the user is connected to the internet.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/ed2701c3965915332f173e56a35ac6f2.jpg)

[Read More](04-cosmos-01-modules-intrusion-sensor.html)

### Fire Sensor

Cosmos: Fire Sensor is a device which augments and makes the already set up fire detection system connected to the internet. It relates to the Cosmos centralized controller which is the Rpi3 through MQTT. Its primary task is to tell the centralized controller the state of the fire detector. The state of the fire detector would be monitored continuously, and any changes to the state would be notified to the user via a smartphone push notification.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/ae21b8dc4ac25e36b0dfe0cb901fe0d4.jpg)

[Read More](04-cosmos-02-modules-fire-sensor.html)

### Weather Station

Cosmos: Weather Station. This module integrates three sensors — Temperature & Humidity Sensor, Gas Leak sensor and the Air pressure sensor. The primary task of this module is to announce the sensor readings to the Rpi3 by sending MQTT messages. Depending on the use case these ratings can be relayed as often or as less frequently as desired.  This module was integrated with the InfluxDB database, and Grafana to provide for an intuitive visualization and monitoring interface.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/e88a9106bd1d1b7593e122c622d4e65c.jpg)

[Read More](04-cosmos-03-modules-weather-station.html)

### Ambient Station

Cosmos: Ambient Station is a device that complements the previous module. It provides information that could be relevant to outdoor application where knowing the UV radiation levels, the light intensity levels, and Soil Moisture Levels are of prime importance — Agricultural domain for example.  Having developed a dashboard for visualizing the data in the previous module, i.e. the COSMOS: Weather Station module, CAS also integrates itself to the existing database, giving a central repository for all the data that is stored locally on the broker. This was done, to align this module with the project’s goal of maintaining user security and privacy.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/4be67ea6e02a7d4a7974c46dcf21307b.jpg)

[Read More](04-cosmos-04-modules-ambient-station.html)

### Smart LEDs

Cosmos: Smart LEDs is a multipurpose device which manages the state of standard RGB LEDs. The device makes use of the standard ESP8266 -12E Wi-Fi chip to receive commands over the air and relay the respective information to the LED lights that are connected directly to the device. The benefit of having Wi-Fi connected LEDs is that they can be triggered by an event that happens on other devices in the environment once the rules are set up.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/a2b3dccf338884f1b3d37275b2bc2dc0.jpg)

[Read More](04-cosmos-05-modules-smart-leds.html)

### Connected Switch

Cosmos: Connected Switch is a module that ties together several modules that have been previously mentioned. Moving away from the norm of just gathering data from the environment, this module provides a way to interact with the environment. The central idea is to allow for a way to bring both manual and automatic state management of devices. The user can manage the state of the connected devices from anywhere in the world, as long as the user is connected to the internet.  This module begins to close the loop which the project started by incorporating functionalities to allow automatic state management of switches, when it receives MQTT messages from other devices.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/6e2f522020f46a07cb072ce2dfcccc2c.jpg)

[Read More](04-cosmos-06-modules-connected-switches.html)

### Smart Lock

Cosmos: Smart Lock is the final module, that was developed by me in the project. The module uses a RFID scanner and a fingerprint scanner for authentication purpose. If the authentication is successful, the ESP8266 based Wemos chip triggers the relay which activates the solenoid in the lock and unlocks it. The lock unlocks for 5 seconds every time the authentication is successful and then automatically locks it again.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/5ba105fb70e59ef0000711660a08f5fe.jpg)

[Read More](04-cosmos-07-modules-smart-lock.html)

## Related Pages

- [Cosmos Project Details](01-cosmos-project-details.html)
- [Automation Server](02-cosmos-automation-server.html)
- [OpenHAB](03-cosmos-openhab.html)
- [Modules & Details](04-cosmos-00-modules-introduction.html)
    - [Intrusion Sensor](04-cosmos-01-modules-intrusion-sensor.html)
    - [Fire Sensor](04-cosmos-02-modules-fire-sensor.html)
    - [Weather Station](04-cosmos-03-modules-weather-station.html)
    - [Ambient Station](04-cosmos-04-modules-ambient-station.html)
    - [Smart LEDs](04-cosmos-05-modules-smart-leds.html)
    - [Connected Switch](04-cosmos-06-modules-connected-switches.html)
    - [Smart Lock](04-cosmos-07-modules-smart-lock.html)


[view entire report](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Projects/Cosmos/D3C319827A97C2D9EB8A5FBDC80A76D4.pdf)
