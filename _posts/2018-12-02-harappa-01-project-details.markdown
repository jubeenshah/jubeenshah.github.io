---
title: "Harappa - Project Details"
categories: ["projects", "iot"]
---                       

Content
-------

* [Business Requirements](#business-requirements)
* [Technical Requirements](#technical-requirements)

Project Details
===============

Business Requirements
---------------------

This project should be designed to help the users/owner of the house in the following ways:

*   BR-1: Monitor various aspects of the environment of home to give the user a detailed overview of the conditions in the house.
*   BR-2: Record the values from sensors positioned in the house and store them in a persistent and reliable environment.
*   BR-3: Build a system that is scalable to allow for the addition of other devices, that were previously not considered for the implementation or add the same type of device.
*   BR-4: Visualize the data collected in the form of graphs to allow for easy interpretation by the user of the system.
*   BR-5: Develop a machine learning model from the collected data to allow for automated decision taking by the system.
*   BR-6: Manage the states of Switches, Irrigation system, and ambient lights in the environment.
*   BR-7: Manage the states of the devices in the environment automatically, manually and using aschedule from both, within the network and remotely.
*   BR-8: Manage the updates to the particular device automatically, manually, and using a schedule toensure the security of the devices and vulnerabilities are sought after.
*   BR-9: Control and monitor the states of the things in the environment using a mobile application,and a web application and through a behavioral model.
*   BR-10: Integrate with voice recognition services such as Alexa, Siri, and Google Assistant to allowan additional layer of user experience and interaction with the system under consideration.
*   BR-11: Ensure durability of data in case of a disaster to allow for analysis of data
*   BR-12: Store the recorded data into a persistent data store.
*   BR-13: Make the model react to the predictions from the machine learning model.
*   BR-14: Monitor the state of doors and windows in the house which can be a point of entry into thehouse and allow for notifications to be sent to the user.
*   BR-15: Enable a way to automatically water the plants based on the type of plant the user has in hishouse in each room.

As a consequence of helping the user of the Harappa in these ways, we would expect an increase in the productivity of the user for daily chores. We would also expect the users to save up on electricity costs. For this reason, we believe that this type of system could have significant commercial potential.

Technical Requirements
----------------------

In order to meet the business requirements discussed above, the system must meet the technical requirements TR 1-6 set out in this section. Even though we focus on these 6 technical requirements there are several more that the system would need as a part of a complete implementation.

*   TR-1: Custom designed hardware product. For example, sensors which compliment each other (Temperature, Humidity, Air Pressure, Light Intensity) can be put together on a single circuit board. This would enable the system to monitor the environment in a more complete fashion and thus satisfy BR 1 and BR 14.
*   TR-1.1: Obtain information about the environmental conditions.
*   TR-1.2: Obtain the status of the devices in the environment.  
    
*   TR-1.3: Reacting to signals sent over from the cloud environment.
*   TR-2: A database cloud service (DynamoDB) would be needed to store the data collected into a NoSQL database. The high availability and reliability of the cloud service should satisfy the need for persistent storage for BR 2 and BR 3.
*   TR-2.1: Couple with AWS Machine Learning Service, BR 5 can be satisfied.  
    
*   TR-2.2: The database solution with the machine learning service should help solve BR 4 for visu-alization of data through IoT Analytics.
*   TR-3: With a streaming service already in place, a service such as AWS Simple Notification Servicewould enable to send notifications (email, SMS) to the registered users there yet satisfying BR 6.  
    
*   TR-3.1: Fire off events such as lambda function in an AWS environment, BR 7, BR 8, and BR 9 canbe satisfied.
*   TR-4: A Mobile/Web application with API connection to the AWS services should allow for interac-tion between the devices in the house and the User. This would help satisfy BR 10.  
    
*   TR-4.1: For BR 11 Depending on the operating system of the mobile being used; Siri or GoogleAssistant can be incorporated in the project.  
    
*   TR-4.2: Integrate with the local digital personal assistant available — Siri, or Google Assistant.
*   TR-4.3: Provide Alexa integration if a digital personal assistant is not available for integration.
*   TR-5: Transfer of data from DynamoDB to an object-based storage (S3) with policies for lifecycle management and archival should help with BR 12.
*   TR-5.1: Transfer the data from Standard S3 to Infrequently-Accessed (IA) S3 data store after 30 days.
*   TR-5.2: Transfer the data from IA-S3 to Glacier after 60 days.
*   TR-5.3: Transfer of data should not traverse the Internet, thus making use of NAT instances.
*   TR-6: Use of a pre-built machine learning model for classification of the plants and using inputsfrom the devices outlined in TR 1, should help with BR 13 and BR 15.  
    
*   TR-6.1: Obtain information plant in the environment using the Amazon Recognition service.
*   TR-6.2: Obtain the water requirement for the plant under consideration using a lambda functiontrigger from a DynamoDB.
*   TR-6.3: Trigger AWS Lambda functions to take necessary actions to turn ON/OFF the irrigationsystem based on the soil moisture reading from the plant under consideration.

Related Pages
-------------

[Summary](2018-12-02-harappa.markdown)[Project Details](2018-12-02-harappa-01-project-details.markdown)[Elements of IoT (1)](2018-12-02-harappa-02-elements-of-iot.markdown)[Elements of IoT (2)](2018-12-02-harappa-03-elements-of-iot-system.markdown)[IoT-A Architecture](2018-12-02-harappa-04-iot-a.markdown)[Analytics & Computing](2018-12-02-harappa-05-analytics.markdown)[Conclusion](2018-12-02-harappa-06-conclusion.markdown)

[summary](../../../project-odyssey/projects.markdown)

[elements of iot](2018-12-02-harappa-02-elements-of-iot.markdown)

