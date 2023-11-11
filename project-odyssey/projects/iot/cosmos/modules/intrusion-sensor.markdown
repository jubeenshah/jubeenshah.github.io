 Cosmos: Intrusion Sensor              

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
[Intrusion Sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)

Content
-------

[Intrusion Sensor](#intrusion-sensor)[Demo Video](#demo)[Block Diagram](#block-diagram)[Software Requirements](#sw-req)[Uploading Code](#uploading-code)[Schematic](#schematic)[Uploading](#uploading)[Challenges](#challenges)[Solutions](#solutions)[Disassembled Product](#final-product)

Intrusion Sensor
================

Demo Video
----------

Functional Block Diagram
------------------------

The following diagram is the basic functional block diagram of the Cosmos: Intrusion Sensor device. The device comprises of four main components the ESP8266-12E wifi module, 5v power supply for the device, and 5v to 3.3v Regulator. The intrusion sensor when triggered communicates the values with the centralized controller, which then relays the corresponding message to the devices configured on receiving the notification.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/8b15154ef8757bcc834f152e8d28d0ee.png)

Software Requirements
---------------------

### EAGLE

EAGLE, which stands for Easily Applicable Graphical Layout Editor is a scriptable Electronic Design Automation (EDA) software application with schematic capture, printed circuit board (PCB) layout, auto-router and computer-aided manufacturing (CAM) features. This particular software seemed the best for the project for schematic and PCB design since it has an inbuilt schematic editor for circuit diagrams. EAGLE has been used because it not only gives an easy to use interface but also has several open source libraries available for our purpose. These libraries include that for the ESP8266, the LM1117 5v to 3.3v Regulator and in future for other components and parts that may be required. After finalizing the Gerber file layout to be used for printing the PCB via an online PCB manufacturer PCBPOWER.

### MQTT.fx

MQTT which stands for MQ Telemetry Transport is a lightweight publish/subscribe, straightforward messaging protocol. This protocol is specially designed for constrained devices and low-bandwidth with high latency and unreliable network. So, the design principles are to minimise network bandwidth, and device resource requirements whilst also attempting to ascertain the reliability and some level of acknowledgment of delivery. As per our research, MQTT is by far the most competitive solution out there for a machine to machine (M2M) or Internet of Things (IoT) application. COSMOS revolves around the core idea of having a single interface with multiple sensor nodes and utility devices connected to it. It was found necessary to find a protocol that sits over the standard TCP/IP protocol to standardize the solution, while at the same time account for the unreliable networks and provide message transport with low- latency.

Uploading Code to ESP8266
-------------------------

### Schematic

The ESP8266 12E has the below schematic which consists of 9 GPIO pins for input and output of data values from and to the sensors. It has a Tx pin for transmission of data values and Rx pin for Receiving the data values. The VCC pin is for voltage input, which must be 3.3 volts. It should be noted that any voltage above 3.3 volts increases the risk of burning down the chip. The ESP8266 also has the limitation of working with just 2.4 GHz of network, any 5 GHz connection would not work.

![Cosmos - Adding things to Cosmos](https://project-odyssey.s3.us-east-2.amazonaws.com/7ec3b48d382d91bbbbd7d6f7d7a2819c.png)

*   SV1 — 4 pin Female Header
*   Pin 1 — GND
*   Pin 2 — VCC (5 volts)
*   Pin 3 — RX
*   Pin 4 — TX
*   SV1 — 4 pin Female Header
*   Pin 1 + Pin 2 : Run Mode
*   Pin 2 + Pin 3 : Programmable Mode
*   Pin 1 — CH\_PD and GPIO2
*   U1 — ESP8266-12E  
    
*   IC1 — LM1117T Voltage Regulator  
    
*   In — 5 volts
*   Out — 3 volts  
    
*   X2-1/2 — Power Supply Module (5 volts)  
    
*   X1-1/2 — Magnetic Sensor  
    

### Uploading

Referring back to figure above, connections for the Rx and Tx of the Arduino board to the Tx and Rx of the ESP8266 via the pins 4 and 3 of the SV1 female header are made, and is seen in figure 30. Connections to the pin 1 to the GND of the Arduino and pin 2 to the VCC (+5v) of the Arduino. Once the connections are made, and the next step is to select the tools command in the Arduino IDE and the different configuration as per Table 3, shown below

*   Board: Generic ESP8266 Module
*   Description: Board in use  
    
*   Flash Frequency: 40 MHZ
*   Description: Affects the Wifi and BLE functionality
*   CPU Frequency: 80 MHz  
    
*   Description: Default value, but can be overridden  
    
*   Flash Size: 512K (64K SPIFFS)  
    
*   Description: SPI Flash Filing System
*   Upload Speed: 9600 br / 57600 br / 115200 br  
    
*   Description: The baud rate at which the upload takes place.
*   Port: (Depends on the OS)  
    
*   Description: Needed to configure the ESP8266 via the Arduino UNO

Challenges Encountered
----------------------

One of the most common problem encountered while uploading the code to ESP8266 12-E is the espcomm\_uploaded\_mem failed. Several reasons were identified after carrying out the tests in multiple iterations

*   Upload Speed much higher than what ESP8266 can handle
*   The port is non-operational
*   Not enough power is being supplied to the module  
    
*   The ESP8266 is not booted into programmable mode Tx and Rx pins are interchanged  
    

### Possible Solutions

Following one or more of the following solutions should help resolve the problem.

*   Choose a lower serial speed selection, preferably, 9600. In the tests, the upload took significantly more time around 5-7 minutes if the serial speed selection was 9600 however at the same time the success rate was around 80-90% that the code got uploaded.
*   Make sure that the port drivers are installed and operational based on your operating system. With macOS, the steps were particularly tedious since the CH430 drivers aren’t readily available.
*   Add additional power to the ESP8266. We did this by adding another 5v power source in serial with the additional input while programming it. We first tried the 3.3 v power output from the Arduino, and when that didn’t work added another 5v on top of that.  
    
*   The GPIO 0 pin from the ESP8266 has to be grounded just before power is being supplied to it, ensuring that the ESP8266 boots into a programmable mode. If the ESP8266 is not in the programmable mode, the upload tends to fail.  
    
*   Finally, it is a crucial point, to not mix up the Tx and Rx pins on the Arduino and the ESP8266.  
    

### Disassembled Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/ed2701c3965915332f173e56a35ac6f2.jpg)

Related Pages
-------------

[Summary](../../../../projects/iot/cosmos.markdown)[Project Details](../../../../projects/iot/cosmos/project-details.markdown)[Automation Server](../../../../projects/iot/cosmos/automation-server.markdown)[OpenHAB](../../../../projects/iot/cosmos/openhab.markdown)[Modules  Details](../../../../projects/iot/cosmos/modules.markdown)[Intrusion Sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)[Fire Sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)[Weather Station](../../../../projects/iot/cosmos/modules/weather-station.html)[Ambient Station](../../../../projects/iot/cosmos/modules/ambient-station.html)[Smart LEDs](../../../../projects/iot/cosmos/modules/smart-leds.html)[Smart Switch](../../../../projects/iot/cosmos/modules/connected-switches.html)[Smart Lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

[modules](../../../../projects/iot/cosmos/modules.markdown)

[fire sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)

