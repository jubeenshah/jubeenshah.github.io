---
layout: project
title: "Cosmos: Smart Lock"
categories: ["projects", "iot"]
---  

## Content

- [Functional Block Diagram](#functional-block-diagram)
- [Technical Overview](#technical-overview)
- [Final Product](#final-product)

## Functional Block Diagram


The figure below gives a basic overview of the functional block diagram of the Cosmos: Smart Lock (CLS). The device contains three major components – the ESP8266 based WEMOS chip, the 12V relay and the solenoid lock. When the user enters a correct password, the Wemos chip triggers the relay by sending a digital high signal. The internal coil of the relay magnetizes and current starts flowing through it, which activates the solenoid in the lock. The solenoid lock has a metal pin (locking mechanism) which is pulled inside, and the door can be opened. When de-magnetized the metal pin (locking mechanism) is pushed outside by a spring, locking the door again.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/b70c46219004ed80300f96e1774b715c.png)

## Technical Overview


### Flowchart

The figure below shows the flowchart diagram for COSMOS: Smart lock with RFID and fingerprint scanner. Once the connection is established with the MQTT broker, both the RFID and fingerprint scanner are enabled. Both can be used for authentication of the users. In case of RFID scanner, there is a predefined Master Card, which can be used for entering into programming mode for adding and deleting tags to and from the database respectively. If the module is not in programming mode, known tags would authorize access, and unknown tags would deny access. In case of the fingerprint scanner, the fingerprints have to be registered beforehand, and on-spot addition of users is not permitted for security reasons. If a known fingerprint is scanned, it would allow access, and unknown fingerprints would deny access.

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/39cdbcf4de0148fa27655d7f8f8af0bf.png)

## Final Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/5ba105fb70e59ef0000711660a08f5fe.jpg)

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

