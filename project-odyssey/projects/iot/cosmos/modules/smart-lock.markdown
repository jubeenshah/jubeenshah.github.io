 Cosmos: Smart Lock             try{Typekit.load();}catch(e){} !function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);    window.dataLayer = window.dataLayer || \[\]; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-167957177-1'); 

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../../index.html)

[Home](../../../../index.html)

Projects

[Security](../../../../projects/security.html)[DevOps](../../../../projects/devops.html)[Internet of Things](../../../../projects/iot.html)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../../privacy.html)

[Home](../../../../index.html)

##### /

[Projects](../../../../projects.html)

##### /

[IoT](../../../../projects/iot.html)

##### /

[Cosmos](../../../../projects/iot/cosmos.html)

##### /

[Modules](../../../../projects/iot/cosmos/modules.html)

##### /

[Smart Lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

Content
-------

[Smart Lock](#smart-lock)[Block Diagram](#block-diagram)[Technical Overview](#overview)[Flowchart](#flowchart)[Final Product](#final-product)

Smart Lock
==========

Functional Block Diagram
------------------------

The figure below gives a basic overview of the functional block diagram of the Cosmos: Smart Lock (CLS). The device contains three major components – the ESP8266 based WEMOS chip, the 12V relay and the solenoid lock. When the user enters a correct password, the Wemos chip triggers the relay by sending a digital high signal. The internal coil of the relay magnetizes and current starts flowing through it, which activates the solenoid in the lock. The solenoid lock has a metal pin (locking mechanism) which is pulled inside, and the door can be opened. When de-magnetized the metal pin (locking mechanism) is pushed outside by a spring, locking the door again.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/b70c46219004ed80300f96e1774b715c.png)

Technical Overview
------------------

### Flowchart

The figure below shows the flowchart diagram for COSMOS: Smart lock with RFID and fingerprint scanner. Once the connection is established with the MQTT broker, both the RFID and fingerprint scanner are enabled. Both can be used for authentication of the users. In case of RFID scanner, there is a predefined Master Card, which can be used for entering into programming mode for adding and deleting tags to and from the database respectively. If the module is not in programming mode, known tags would authorize access, and unknown tags would deny access. In case of the fingerprint scanner, the fingerprints have to be registered beforehand, and on-spot addition of users is not permitted for security reasons. If a known fingerprint is scanned, it would allow access, and unknown fingerprints would deny access.

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/39cdbcf4de0148fa27655d7f8f8af0bf.png)

### Final Product

![Cosmos: Fire Sensor Flow Chart](https://project-odyssey.s3.us-east-2.amazonaws.com/5ba105fb70e59ef0000711660a08f5fe.jpg)

Related Pages
-------------

[Summary](../../../../projects/iot/cosmos.html)[Project Details](../../../../projects/iot/cosmos/project-details.html)[Automation Server](../../../../projects/iot/cosmos/automation-server.html)[OpenHAB](../../../../projects/iot/cosmos/openhab.html)[Modules  Details](../../../../projects/iot/cosmos/modules.html)[Intrusion Sensor](../../../../projects/iot/cosmos/modules/intrusion-sensor.html)[Fire Sensor](../../../../projects/iot/cosmos/modules/fire-sensor.html)[Weather Station](../../../../projects/iot/cosmos/modules/weather-station.html)[Ambient Station](../../../../projects/iot/cosmos/modules/ambient-station.html)[Smart LEDs](../../../../projects/iot/cosmos/modules/smart-leds.html)[Smart Switch](../../../../projects/iot/cosmos/modules/connected-switches.html)[Smart Lock](../../../../projects/iot/cosmos/modules/smart-lock.html)

[connected switch](../../../../projects/iot/cosmos/modules/connected-switches.html)

[projects page](../../../../projects.html)

Home

[About](../../../../index.html)[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../../privacy.html)

Education

[Formal](../../../../education/formal.html)[Certification](../../../../education/certifications.html)[Pursuing](../../../../education/pursuing.html)

Projects

[Security](../../../../projects/security.html)[DevOps](../../../../projects/devops.html)[Internet of Things](../../../../projects/iot.html)

Resources

[Resumé](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Resume/JubeenShah-Resume.pdf)

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../../index.html)

Passionately curious about technology

Project Odyssey - © All rights reserved. 2020 Jubeen Shah