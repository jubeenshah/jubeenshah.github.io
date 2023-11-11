 Cosmos: Weather Station              

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
[Weather Station](../../../../projects/iot/cosmos/modules/weather-station.html)

Content
-------

[Weather Station](#weather-station)[Demo Video](#demo)[Block Diagram](#block-diagram)[Technical Overview](#overview)[Flowchart](#fc)[Sensors](#sensors)[DHT22](#dht22)[BMP180](#bmp180)[MQ2](#mq2)[Visualization](#visualization)[InfluxDB](#influxdb)[Grafana](#grafana)[Final Product](#final-product)

Weather Station
===============

Demo Video
----------

Functional Block Diagram
------------------------

The figure below shows the functional block diagram of the COSMOS: Weather Station. It makes use of the ESP8266-12E Wemos D1 chip to communicate with the centralized controller. The sensors which are a part of the weather station are connected directly to the ESP8266-12E WiFi chip, as shown in the block diagram.  
  
When the ESP8266 chip receives the sensor values, it relays the information to the centralized controller. Subsequently, the RPi3 checks for the rules set in the '.Rules' file and based on the predefined conditions takes the necessary actions.  
  
Once the relevant information is relayed, this information would be available to the authenticated and authorized users via different web interfaces. The user can also continuously monitor these values; for instance, the temperature and humidity readings directly on his smartphone and take intuitive actions based on the data interpreted. Since the module also integrates a database for persisting the values, there would be an added path in the functional block diagram to make use of that facility.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/1be51b3ef2c03b7bcf4fa2e12adfbf3c.png)

Technical Overview
------------------

### Flowchart

The COSMOS: Weather Station (CWS) initially boots up and repeatedly tries to connect with the MQTT broker, RPi3, until a successful connection is established. Once the link is confirmed, the RPi3 would publish the initial state of CWS. It would monitor the values relayed by the different sensors either continuously or at regular intervals, depending on the sensor. In the case of the DHT22 sensor, MQ2 sensor, and the BMP180 sensor, the data would be consistently read and relayed every two minutes. The centralized controller would then change the state of the system to "Anomaly Detected," and the corresponding alert messages would be broadcasted to notify the authorized individuals. The system will then monitor if the issue that was raised by the CWS is resolved. If not, the system would re-affirm the problem's presence by prompting the corresponding sensors to resend the values to double-check the occurrence of the detected error. If the issue were resolved, the controller would change the state of the system to "No Anomaly Detected."

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/713486f7867d523aa49c181bf1552921.png)

Sensors
-------

### DHT22

DHT22 output is a calibrated digital signal. It utilizes exclusive digital-signal-collecting- technique and humidity sensing technology, assuring its reliability and stability.Its sensing elements is connected with 8-bit single-chip computer. Small size & low consumption & long transmission distance (20m) enable DHT22 to be suited in all kinds of harsh application occasions.

### BMP180

The BMP180 is a high precision digital pressure sensor with an I2C interface for easy and fast integration with microcontroller. It has ultra-low power, low voltage electronics which are optimized for use in mobile phones, PDAs, GPS Navigation devices and outdoor equipment. It is equipped with piezo-resistive technology for EMC robustness, high accuracy and long term stability.

### MQ2

MQ2 gas-sensor makes use of SnO2, which has lower conductivity in clean air. When different gasses are present in the higher concentration, the conductivity of the sensor increases. This electrical conductivity can be mapped to the output signal of the gas concentration. MQ2 Gas sensor has high sensitivity to LPG, Propane and hydrogen, and also other combustible steam.

Visualization
-------------

The idea to establish a graphical dashboard and a persistent storage database came from the roots of trying to integrate Artificial Intelligence into the project. Though the AI integration itself would be a part of much later improvisation into the project, this phase of setting up the database constructs a baseline environment for the same. This section wouldn’t go into the details of setting up the database, however it is meant to give an overview on what has been accomplished.

![](https://project-odyssey.s3.us-east-2.amazonaws.com/e2e12ea5613604fdf359a164d0c114be.png)

### InfluxDB

InfluxDB is an open platform that allows for easy integration into other open projects. It is a time series, metrics, and analytics database written in Go. This database was chosen for integration into the project since it has no external dependencies, which means that once influxDB is installed on the server or network, no additional management is required. Features like but not limited to HTTP API, Database managed retention policies and built in management interface were key in establishing the need for InfluxDB as the primary persistence mechanism in Cosmos.  
  
Once InfluxDB is installed and configured, a database instance was created, with user privileges defined. It must be noted that for advanced application, InfluxDB can be installed directly onto a separate docker image to ensure application independency.

### Grafana

Grafana is another open source software for time series analytics. With Grafana, Cosmos has gained capabilities for visualization, alerting, notifications and annotations. Like InfluxDB, Grafana can either be installed on the broker, a separate docker image, or separate device but on the same network. Once the Grafana and InfluxDB are connected through modifications in the configuration files, the only step that remains is to connect the Cosmos MQTT broker with the two.

### Final Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/e88a9106bd1d1b7593e122c622d4e65c.jpg)

Related Pages
-------------

[Summary](../../../../projects/iot/cosmos.markdown)[Project Details](../../../../projects/iot/cosmos/project-details.markdown)[Automation Server](../../../../projects/iot/cosmos/automation-server.markdown)[OpenHAB](../../../../projects/iot/cosmos/openhab.markdown)[Modules  Details](../../../../projects/iot/cosmos/modules.markdown)[Intrusion Sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)[Fire Sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)[Weather Station](../../../../projects/iot/cosmos/modules/weather-station.html)[Ambient Station](../../../../projects/iot/cosmos/modules/ambient-station.html)[Smart LEDs](../../../../projects/iot/cosmos/modules/smart-leds.html)[Smart Switch](../../../../projects/iot/cosmos/modules/connected-switches.html)[Smart Lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

[fire sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)

[ambient station](../../../../projects/iot/cosmos/modules/ambient-station.html)

Home

[About](../../../../index.markdown)[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../../privacy.markdown)

Education

[Formal](../../../../education/formal.markdown)[Certification](../../../../education/certifications.markdown)[Pursuing](../../../../education/pursuing.markdown)

Projects

[Security](../../../../projects/security.markdown)[DevOps](../../../../projects/devops.markdown)[Internet of Things](../../../../projects/iot.markdown)

Resources

[Resumé](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Resume/JubeenShah-Resume.pdf)

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../../index.markdown)

Passionately curious about technology

Project Odyssey - © All rights reserved. 2020 Jubeen Shah