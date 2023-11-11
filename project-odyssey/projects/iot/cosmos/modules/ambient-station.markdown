 Cosmos: Ambient Station              

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../../index.markdown)

[Home](../../../../index.markdown)

Projects

[Security](../../../../projects/security.markdown)[DevOps](../../../../projects/devops.markdown)[Internet of Things](../../../../projects/iot.markdown)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../../privacy.markdown)

[Home](../../../../index.markdown)

##### /

[Projects](../../../../projects.markdown)

##### /

[IoT](../../../../projects/iot.markdown)

##### /

[Cosmos](../../../../projects/iot/cosmos.markdown)

##### /

[Modules](../../../../projects/iot/cosmos/modules.markdown)

##### /

[Ambient Station](../../../../projects/iot/cosmos/modules/ambient-station.html)

Content
-------

[Ambient Station](#ambient-station)[Block Diagram](#block-diagram)[Technical Overview](#overview)[Flowchart](#flowchart)[Sensors](#sensors)[BH1750](#bh1750)[ML8511](#ml8511)[FC-28](#fc28)[Alternative Solutions](#alternative-solutions)[Using Programming](#programming-modification)[Using Diode](#using-diode)[Using demultiplexer](#using-demultiplexer)[Final Product](#final-product)

Ambient Station
===============

Functional Block Diagram
------------------------

The figure below shows the functional block diagram of the Cosmos: Ambient Station. It makes use of the ESP8266-12E Wemos D1 chip to communicate with the centralized controller. The sensors which are a part of the Ambient station are connected directly to the ESP8266-12E WiFi chip, as shown in the block diagram. The additional component in this module is the IC 4051 multiplexer/demultiplexer, which is needed since both ML8511 and the FC-28 sensor have analog outputs, whereas the ESP8266 has only one ADC.  
  
When the ESP8266 chip receives the sensor values, it relays the information to the centralized controller. Subsequently, RPi3 checks for the rules set in the '.Rules' file and based on the predefined conditions takes the necessary actions.  
  
Once the relevant information is relayed, this information would be available to the authenticated and authorized users via different web interfaces. The user can also continuously monitor these values. Since a database integration is already setup in the Cosmos: Weather Station Module, the Cosmos: Ambient Station values would be appended to the existing database by creating the required columns.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/d730cc6fb7225ba3cf26d92311940b1d.png)

Technical Overview
------------------

### Flowchart

The Cosmos: Ambient Station (CAS) initially boots up and repeatedly tries to connect with the MQTT broker, RPi3, till a successful connection is established. Once the link is confirmed, the RPi3 would publish the initial state of CAS. It would then monitor the values relayed by the different sensors at regular intervals. If the sensor values being read, are anomalous than the predefined threshold values, the centralized controller would change the state of the system to "Anomaly Detected" and the corresponding alert messages would be broadcasted to notify the authorized individuals. The system will then monitor if the issue that was raised by the CAS is resolved. If not, the system would re-affirm the presence of the problem by prompting the corresponding sensors to resend the values to double-check the occurrence of the detected error. If the issue were resolved, the controller would change the state of the system to "No Anomaly Detected." The switching between the ML8511 and the FC-28 happens in the loop itself, while the sensor values are being read. A delay of 5 seconds allows for optimal results, such that values from either sensor don't interfere with each other.

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/2ca4f3a1f0ab2da06ffcffcdb25f2215.png)

Sensors
-------

### BH1750

BH1750’s output is a calibrated digital signal. As stated earlier, it is a digital Ambient Light sensor integrated circuit. Like the BMP180 sensor from the weather station module, it communicates over an I2C interface, one of the primary reasons, the Cosmos: Weather Station Module and Cosmos: Ambient Station Module had to be different. It has a very high resolution that gives values ranging from 1 lux to 65535 lux.

### ML8511

The ML8511 UV sensor according to the data sheet is suitable for measuring UV intensity indoors and outdoors. It consists of an internal amplifier that converts the photo-current to voltage depending the UV intensity. This configuration allows the ML8511 to be easily configured with an ADC which makes it feasible for integration into the Cosmos: Ambient Station.

### FC-28

The FC-28 soil moisture sensor is designed to detect the moisture of soil water around the sensor

Alternative Solutions
---------------------

One limitation of the ESP8266 MCU is that, there is only one onboard ADC available for use. As it has been stated several times in the chapter, the ML8511 and FC-28 Sensors have analog outputs, using them with one ESP8266 was not possible. This section briefly covers the three alternatives that were tried to overcome this hindrance. The alternatives are as follows:

*   Programming Modifications  
    
*   Using a diode  
    
*   IC 4051 multiplexer/demultiplexer

### Programming Modifications  

In the initial stages of the project, when the COSMOS: Ambient Station module was in the feasibility study phase, a simple solution was thought to be able to read analog values from both the sensors. The ESP8266’s digital pins have an output voltage of 3.3 volts, when set HIGH. This voltage output was within the specified limits of the sensors as per the data sheet. As a result, due to lack of familiarity with electronics component, the digital pins of the ESP8266 were directly to supply voltage to the sensors. Using simple programming constructs, the following logic was implemented.

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/ae199c54ace72727e6dc6b35bcdf0895.png)

However, this did not solve the problem, since it was observed that even when the sensor’s input Vcc were set to LOW, a current kept flowing through the closed circuit, which interfered with the readings.

### Using Diode

After scraping off the initial idea, and after doing some more study regarding the electronic components, the features for a diode made it appealing to be used as tool to allow the flow of current in one direction only. This seemed promising, since the flaw in the previous logic was the presence of interfering current. After using a low reverse leakage current enabled diode — IN4007, and using the logic as before, another issue had risen. With the use of diode, came a voltage drop of approximately 0.7 Volts in the test circuit. This reduced supply voltage from the digital pins to 2.6 Volts, which was below the minimum operating requirement of the sensors. This alternative was discarded as well.

### Using Demultiplexer

After studying more about multiplexing and demultiplexing of signals, the IC 4051 was chosen to overcome the restriction imposed by ESP8266 of a single ADC. Pin 3 of IC 4051, as seen in the pin diagram is the COMMON pin that is connected to CHANNELS IN/ OUT pins 1, 2, 4, 5, 12, 13, 14 and 15. To choose one of the pins to connect with the COMMON pin, the pins 9, 10, 11 which correspond to C, B, and A pins on the IC to high or low. This expands the capabilities to connect up to eight additional analog sensors. The value of A, B, and C are set according to the following truth table.

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/9a107a800525e9e1c65067385f29d03a.png)

The advantage of using IC 4051 was, that no reverse current was observed in the circuit, and moreover since there is a single Vcc pin for the IC, no significant voltage drop was experienced. The only precaution that needed to be taken was to set appropriate delay between selecting the pins to connect to the COMMON pin and reading the analog values.

### Final Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/4be67ea6e02a7d4a7974c46dcf21307b.jpg)

Related Pages
-------------

[Summary](../../../../projects/iot/cosmos.markdown)[Project Details](../../../../projects/iot/cosmos/project-details.markdown)[Automation Server](../../../../projects/iot/cosmos/automation-server.markdown)[OpenHAB](../../../../projects/iot/cosmos/openhab.markdown)[Modules  Details](../../../../projects/iot/cosmos/modules.markdown)[Intrusion Sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)[Fire Sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)[Weather Station](../../../../projects/iot/cosmos/modules/weather-station.html)[Ambient Station](../../../../projects/iot/cosmos/modules/ambient-station.html)[Smart LEDs](../../../../projects/iot/cosmos/modules/smart-leds.html)[Smart Switch](../../../../projects/iot/cosmos/modules/connected-switches.html)[Smart Lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

[weather station](../../../../projects/iot/cosmos/modules/weather-station.html)

[smart leds](../../../../projects/iot/cosmos/modules/smart-leds.html)

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