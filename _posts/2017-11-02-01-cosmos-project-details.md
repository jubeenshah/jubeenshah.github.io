---
layout: project
title: "Cosmos: Project Details 🗃️"
categories: ["projects", "iot"]
---     

## Content


* [Concept & Plan](#concept-and-plan)
* [System Overview](#system-overview)

## Concept and Plan


The idea, as briefly stated earlier is to connect the managed endpoints over the network in the installed environment via open platforms that are freely available for use through any personal device, which may include a smartphone, tablet, or even any other device through which a user could access the internet.

## System Overview


![Cosmos - System Overview](https://project-odyssey.s3.us-east-2.amazonaws.com/8a6f75eee06765e38e54be1586b38430.png)

The figure above describes a system consisting of four necessary components which are described along with the sub-components briefly below:

*   **Cloud**: The cloud is one of the most crucial part of the system. It is the central part to which all the other components are connected. It is also the gateway for the different elements to act and interact with each other by sending information to each other and taking actions based on the messages received from one device.
*   **Wifi Access Points:** The implementor of the system needs to make sure that the environment in which Cosmos is being installed or integrated with, has 2.4 GHz option since the ESP8266 wifi modules that would be used to make the managed endpoints aren’t 5GHz compatible. It is essential to note down the SSID and set a secure password to the router, as needed for each subsequently managed endpoint that would be integrated into the environment.
*   **Managed Endpoints**: These components comprise the connected devices built for the Cosmos automation solution. They are divided into two groups based on the function they would be performing.
*   Sensors: These devices would send information to the automation server when an event occurs. Eg. Opening or closing of a door/window. These devices would send a push notification to the authorized smart devices and be followed up by taking up specific actions. For example, if a door opens, you might want the lights to turn on if it is evening or night time. Another use-case will be to automatically turn on the air conditioner if the temperature drops a certain threshold level.
*   **Utility Devices**: These are primarily any device in the house that can be automated like connected locks, smart LED strip, connected switches.
*   **Server**: The server used is a Raspberry Pi 3 with a heat sink installed, since the server would be running 24/7, additionally a fan would help keep the processor from overheating. After considering several open platforms for the Automation Server, such as Home Assistant, Calaos, OpenMotics, and OpenHAB. Finally, OpenHAB was selected.
*   **User Interfaces**: These are the different mediums through which the smart devices can be managed or monitored. The system can be accessed through an external interface from any part of the world, as long as it is connected to the internet. Additionally, voice-controlled devices such as Amazon’s Alexa, or Apple HomePod, or the already available Siri on the iPhone, can be used to control the devices.

## Related Pages

- [Cosmos Project Details](01-cosmos-project-details.html)
- [Automation Server](02-cosmos-automation-server.html)
- [OpenHAB](03-cosmos-openhab.html)
- [Modules & Details](04-cosmos-00-modules-introduction.html)

[view entire report](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Projects/Cosmos/D3C319827A97C2D9EB8A5FBDC80A76D4.pdf)


