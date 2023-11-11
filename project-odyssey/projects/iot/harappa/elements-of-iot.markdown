 Harappa's Elements of IoT             try{Typekit.load();}catch(e){} !function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);    window.dataLayer = window.dataLayer || \[\]; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-167957177-1'); 

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.html)

[Home](../../../index.html)

Projects

[Security](../../../projects/security.html)[DevOps](../../../projects/devops.html)[Internet of Things](../../../projects/iot.html)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.html)

[Home](../../../index.html)

##### /

[Projects](../../../projects.html)

##### /

[IoT](../../../projects/iot.html)

##### /

[Harappa](../../../projects/iot/harappa.html)

##### /

[Elements of IoT](../../../projects/iot/harappa/project-details.html)

Content
-------

[Things](#things)[People](#people)[Processes](#processes)[Registration](#registration-of-device)[Transfering data](#transfer-of-data)[Data](#data)

Elements of IoT
===============

Things
------

This subsection describes the things in the project and their functionality in minor details.

*   Soil: The soil moisture sensor would monitor the soil to record the moisture levels which satisfies BR 1.
*   Plants: The water sprinklers would have a camera setup that would monitor the type of plant in the user’s home which satisfies BR 15.
*   Rooms: Environment station, with all the different sensors, would monitor the rooms for tempera- ture, humidity, air quality, UV index, light intensity which satisfies BR 1 There would be smart switches deployed in the room that would control the states of the switches and ambient lights in the room.
*   Doors & Windows: Intrusion sensor and motion sensor would be used to monitor the doors and windows of the house which satisfies BR 14.
*   Switch: The switches would make use of the relays to switch on/off a device. The smart switches would simply make use of multiple relays to switch on/off a device like the irrigation system, the smart switches would be given three triggering mechanisms. The first would be an alert signal from any of the sensors in the environment which would trigger the switch being turned on/off, and the remaining two are discussed in the mobile app.
*   Mobile Devices: GPS would be used to monitor the location of the user and make predictions about the users' movement. The mobile device would be used to give an overview of all the con- nected things in the environment and also be used to manage and monitor other things in the envi- ronment. One of the ways it can manage other things in the environment would be through manual control of the devices by sending an HTTP signal to the server, which in turn sends an MQTT signal/ command to the ESP8266 to turn on or off certain devices in the environment — Smart Switches or irrigation system. Another set of information that would be transferred between the mobile app and the server would be the Red, Blue, and Green values to be set in the Ambient Lights. Finally, there could also a schedule in terms of how frequently certain devices are to be turned on/off. For exam- ple, the irrigation system might be configured to turn on every day at 9 am, and turn off at 9:30 am. This can be done using the mobile application. Another, functionality that would be a part of the mobile app would be to allow integration with the in-house operating system’s voice assistant — Siri in case of iOS and google assistant in case of Android. For any other operating system, Alexa can be used since, it is an open source assistant provided by Amazon, thus satisfying BR 11.

People
------

This subsection outlines the people directly involved in interacting with the project. It also outlines the roles of the people involved. This is not an exhaustive list of the people involved in the project, but the ones that would be directly interacting with the system either to use it on a daily basis (Users), or to solve any problem associated with the devices or services being used a part of the system as whole (AWS Administrator and Local Administrator).

*   Owner/User: The first type of people would be the direct consumers of the information being generated in the house — the owners of the house and the system. The owner would monitor and manage the states of the things in the environment, and take any action in case of an anomaly.
*   Administrator: The administrator would be responsible for maintenance of the devices installed in the environment and take actions if the devices are malfunctioning or not functioning. They would also be responsible for managing this information for a group of users across houses.
*   AWS Administrator: The AWS administrator would be responsible for registration and de-regis- tration of any services that the user subscribes through either manually, or automatically through the use of the mobile application or other devices.  
    

Processes
---------

This section describes in detail few processes that would be a part of the project. It describes the process for registration of a device with the environment under consideration for a particular home. It also provides the series of steps that would be performed whenever there is a need to transfer information between the things in the project and the AWS environment. Finally, we also discuss a few more processes that would be a part of the system but are not described in detail.

### Registration of Device

*   Switch on the device
*   Once on, the device would look for a wireless network to connect to.
*   Once connected, the device would be available on the mobile device, the web application, orthe command line interface for the people involved in the project to interact with, for the regis-tration process.  
    
*   Get device information
*   Scan the bar code of the device using a smartphone application, to get the information such as the Unique identifier (UID) and the Name of the thing (device).  
    
*   In case of command line interface registration of the devices, the unique ID from the device itself can be copied into the CLI for registration.
*   This information would be saved on the mobile application/ webapplication,to keep a track of the registered devices and then this information would be sent to AWS for registration with the IoT core service using the AWS IoT management service.
*   Generate a unique Certificate  
    
*   Generate a unique certificate for the thing on the AWS platform using the mobile application/ web application.
*   Attach the policy for the devices to the generated certificate  
    
*   These policies would allow communicating with other AWS services in the environment.  
    
*   Use the private key of the thing along with the device certificate to register the thing with AWS environment.
*   Configure the device in the AWS environment 
*   Use the publish and subscribe parameters from the devices to generate as many numbers of events in the AWS environment.
*   If the thing is configured to only publish values (for example the environment monitor), as many publishing topics would be generated as there are sensors publishing the values.
*   If the thing is configured to be both publish and subscribe, respective topics should be created in the AWS environment.

### Transfer of data between things and AWS

*   The thing would collect data from the environment as required and described in BR 1, and BR 2.
*   This data could in digital or analog form. Such as temperature, humidity, soil moisture, etc.  
    
*   If the data is in analog format, it is converted into digital format.  
    
*   This process would be repeated for all the sensors mounted on the thing.  
    
*   If multiple sensors are connected to the same pins, a multiplexer or a demultiplexer would be used to switch between the sensors connected to avoid interference amongst sensors.  
    
*   The thing would subscribe to events.
*   These events can be manually triggered by the user, for example in the case of switches.  
    
*   These events can be automatically triggered by lambda function from other things in the environment.
*   Publish the data to the publishing topic.   
    
*   Publishing topic would be a unique address to which the things would be sending the MQTT messages too.
*   Based on the publishing topic for the particular thing, the AWS message broker would route the formatted data from the publishing client to the subscribing client.
*   AWS IoT Core responds to the event by creating a lambda function.  
    
*   Once the subscribing client has received the messages, it would trigger off a lambda function.  
    
*   Using the lambda function; the received data can be processed to carry out the required functionalities. 

Data
----

This subsections outlines the type of data that would be collected in the automation environment. 

*   The data being generated by the sensors as required in BR 1, BR 2, and BR 14, are as follows :
*   Temperature  
    
*   Humidity  
    
*   Air QualityCO2, CO, LPG, Propane, and hydrogen   
    
*   Light intensity  
    
*   Air pressure  
    
*   Soil moisture  
    
*   UV radiation  
    
*   Magnetic sensor status  
    
*   The data from the actuators as required in BR 2 are as follows 
*   Status of the switches   
    
*   Status of the irrigation system  
    
*   Status of fire alarm  
    
*   Red, Blue, Green values form the Ambient lights

Related Pages
-------------

[Summary](../../../projects/iot/harappa.html)[Project Details](../../../projects/iot/harappa/project-details.html)[Elements of IoT (1)](../../../projects/iot/harappa/elements-of-iot.html)[Elements of IoT (2)](../../../projects/iot/harappa/elements-of-iot-system-2.html)[IoT-A Architecture](../../../projects/iot/harappa/iot-a.html)[Analytics & Computing](../../../projects/iot/harappa/analytics.html)[Conclusion](../../../projects/iot/harappa/conclusion.html)

[project details](../../../projects/iot/harappa/project-details.html)

[elements of iot (contd.)](../../../projects/iot/harappa/elements-of-iot-system-2.html)

Home

[About](../../../index.html)[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.html)

Education

[Formal](../../../education/formal.html)[Certification](../../../education/certifications.html)[Pursuing](../../../education/pursuing.html)

Projects

[Security](../../../projects/security.html)[DevOps](../../../projects/devops.html)[Internet of Things](../../../projects/iot.html)

Resources

[Resumé](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Resume/JubeenShah-Resume.pdf)

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.html)

Passionately curious about technology

Project Odyssey - © All rights reserved. 2020 Jubeen Shah