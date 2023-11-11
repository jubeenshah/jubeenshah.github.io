 Harappa's IoT-A Architecture             try{Typekit.load();}catch(e){} !function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);    window.dataLayer = window.dataLayer || \[\]; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-167957177-1'); 

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.markdown)

[Home](../../../index.markdown)

Projects

[Security](../../../projects/security.markdown)[DevOps](../../../projects/devops.markdown)[Internet of Things](../../../projects/iot.markdown)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.markdown)

[Home](../../../index.markdown)
[Projects](../../../projects.markdown)
[IoT](../../../projects/iot.markdown)
[Harappa](../../../projects/iot/harappa.markdown)
[IoT-A Architecture](../../../projects/iot/harappa/iot-a.markdown)

Content
-------

[Domain Model](#domain-model)[Information Model](#information-model)

IoT-A Architecture
==================

Domain Model
------------

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/ad5f82e879a9c5d6b5b442eb37e50551.svg)

In this model, we outline the physical entities and the users of the that are colored in yellow. We also show the Virtual entities that comprise of the cloud services such as the compute, network, and storage (Turquise Color). Each of the physical entities — Lights, Room, Switch, Soil, and Door have the associated sensors and actuators (Blue Color) that are responsible for monitoring the state of the respective physical entity and also responsible for managing the state of the devices in the environment using the actuators — relays, valve etc. Finally, we use two types of identification mechanisms — RFID and Barcode. This was done primarily to allow for both Users and administrators to register new devices using the steps described on a [previous](../../../projects/iot/harappa/elements-of-iot.markdown) page.  
‍  
Taking an example of one of the physical entity to describe the model — Switch. For this physical entity, the RFID Tags, and the barcode would be used to identify the thing for registration purposes. The fault sensor would be used to monitor the status of the smart switches to keep into account whether the device is operating or not. Also, this physical entity has an associated actuator, that is, the relay that would act on the switch to which it is connected.   
‍  
Similarly, for other devices connected in the system, there are associated sensors and actuators that would help them operate as required in the Business Requirements.

Information Model
-----------------

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/bb3ccd5881d651448ded1dac904054ac.svg)

In this model, we describe the associated information generated and monitored by each of the entity in the system, with the set of functions each of the devices are calling, that is, we describe the structure of the system by specifying the Attributes (White) , Services (Purple), Service Description (White) and associated metadata (Yellow).   
‍  
For each of the entity, we associate the attributes they would be responsible. For example, Irrigation System has the attributes for measuring the water/moisture level in the soil, and the irrigation system status. Which would have the corresponding metadata about when the measurement was taken, and when was the last update made to the database. The battery status information would help identify if the administrator needs to be informed about any faults with the system or to the User about whether they need to replace the batteries of the device.   
‍  
Finally, each of the devices also has the associated functions that can call and perform. Taking the same example fo the irrigation system, we have to turn valve On and Off functions which would be responsible for reacting to the soil moisture thresholds as received from the AWS environment. 

Related Pages
-------------

[Summary](../../../projects/iot/harappa.markdown)[Project Details](../../../projects/iot/harappa/project-details.markdown)[Elements of IoT (1)](../../../projects/iot/harappa/elements-of-iot.markdown)[Elements of IoT (2)](../../../projects/iot/harappa/elements-of-iot.markdown)[IoT-A Architecture](../../../projects/iot/harappa/iot-a.markdown)[Analytics & Computing](../../../projects/iot/harappa/analytics.markdown)[Conclusion](../../../projects/iot/harappa/conclusion.markdown)

[elements of iot (2)](../../../projects/iot/harappa/elements-of-iot-system-2.markdown)

[Analytics & computing](../../../projects/iot/harappa/analytics.markdown)

