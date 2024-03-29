---
layout: project
title: "Cosmos: Weather Station"
categories: ["projects", "iot"]
---  

## Content

- [Demo Video](#demo-video)
- [Functional Block Diagram](#functional-block-diagram)
- [Technical Overview](#technical-overview)
- [Sensors Used](#sensors-used)
- [Visualization and Dashboards](#visualization-and-dashboards)
- [Final Product](#final-product)

## Demo Video

[Watch Video](https://www.youtube.com/watch?v=ixRpzv12PUg)

## Functional Block Diagram


The figure below shows the functional block diagram of the COSMOS: Weather Station. It makes use of the ESP8266-12E Wemos D1 chip to communicate with the centralized controller. The sensors which are a part of the weather station are connected directly to the ESP8266-12E WiFi chip, as shown in the block diagram.  
  
When the ESP8266 chip receives the sensor values, it relays the information to the centralized controller. Subsequently, the RPi3 checks for the rules set in the '.Rules' file and based on the predefined conditions takes the necessary actions.  
  
Once the relevant information is relayed, this information would be available to the authenticated and authorized users via different web interfaces. The user can also continuously monitor these values; for instance, the temperature and humidity readings directly on his smartphone and take intuitive actions based on the data interpreted. Since the module also integrates a database for persisting the values, there would be an added path in the functional block diagram to make use of that facility.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/1be51b3ef2c03b7bcf4fa2e12adfbf3c.png)

## Technical Overview


### Flowchart

The COSMOS: Weather Station (CWS) initially boots up and repeatedly tries to connect with the MQTT broker, RPi3, until a successful connection is established. Once the link is confirmed, the RPi3 would publish the initial state of CWS. It would monitor the values relayed by the different sensors either continuously or at regular intervals, depending on the sensor. In the case of the DHT22 sensor, MQ2 sensor, and the BMP180 sensor, the data would be consistently read and relayed every two minutes. The centralized controller would then change the state of the system to "Anomaly Detected," and the corresponding alert messages would be broadcasted to notify the authorized individuals. The system will then monitor if the issue that was raised by the CWS is resolved. If not, the system would re-affirm the problem's presence by prompting the corresponding sensors to resend the values to double-check the occurrence of the detected error. If the issue were resolved, the controller would change the state of the system to "No Anomaly Detected."

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/713486f7867d523aa49c181bf1552921.png)

## Sensors Used


### DHT22

DHT22 output is a calibrated digital signal. It utilizes exclusive digital-signal-collecting- technique and humidity sensing technology, assuring its reliability and stability.Its sensing elements is connected with 8-bit single-chip computer. Small size & low consumption & long transmission distance (20m) enable DHT22 to be suited in all kinds of harsh application occasions.

### BMP180

The BMP180 is a high precision digital pressure sensor with an I2C interface for easy and fast integration with microcontroller. It has ultra-low power, low voltage electronics which are optimized for use in mobile phones, PDAs, GPS Navigation devices and outdoor equipment. It is equipped with piezo-resistive technology for EMC robustness, high accuracy and long term stability.

### MQ2

MQ2 gas-sensor makes use of SnO2, which has lower conductivity in clean air. When different gasses are present in the higher concentration, the conductivity of the sensor increases. This electrical conductivity can be mapped to the output signal of the gas concentration. MQ2 Gas sensor has high sensitivity to LPG, Propane and hydrogen, and also other combustible steam.

## Visualization and Dashboards


The idea to establish a graphical dashboard and a persistent storage database came from the roots of trying to integrate Artificial Intelligence into the project. Though the AI integration itself would be a part of much later improvisation into the project, this phase of setting up the database constructs a baseline environment for the same. This section wouldn’t go into the details of setting up the database, however it is meant to give an overview on what has been accomplished.

![](https://project-odyssey.s3.us-east-2.amazonaws.com/e2e12ea5613604fdf359a164d0c114be.png)

### InfluxDB

InfluxDB is an open platform that allows for easy integration into other open projects. It is a time series, metrics, and analytics database written in Go. This database was chosen for integration into the project since it has no external dependencies, which means that once influxDB is installed on the server or network, no additional management is required. Features like but not limited to HTTP API, Database managed retention policies and built in management interface were key in establishing the need for InfluxDB as the primary persistence mechanism in Cosmos.  
  
Once InfluxDB is installed and configured, a database instance was created, with user privileges defined. It must be noted that for advanced application, InfluxDB can be installed directly onto a separate docker image to ensure application independency.

### Grafana

Grafana is another open source software for time series analytics. With Grafana, Cosmos has gained capabilities for visualization, alerting, notifications and annotations. Like InfluxDB, Grafana can either be installed on the broker, a separate docker image, or separate device but on the same network. Once the Grafana and InfluxDB are connected through modifications in the configuration files, the only step that remains is to connect the Cosmos MQTT broker with the two.

## Final Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/e88a9106bd1d1b7593e122c622d4e65c.jpg)

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
