 Harappa's Analytics and Computing              

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.markdown)

[Home](../../../index.markdown)

Projects

[Security](../../../projects/security.markdown)[DevOps](../../../projects/devops.markdown)[Internet of Things](../../../projects/iot.markdown)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.markdown)

[Home](../../../index.markdown)
[Projects](../../../projects.markdown)
[IoT](../../../projects/iot.markdown)
[Harappa](../../../projects/iot/harappa.markdown)
[Analytics & Computing](../../../projects/iot/harappa/analytics.markdown)

Content
-------

[Monitoring Analytics](#monitoring-analytics)[Predictive Analytics](#predictive-analytics)[Acting Analytics](#acting-analytics)[Analytics Considerations](#analytics-considerations)[Computing](#computing)

Analytics & Computing
=====================

Monitoring Analytics
--------------------

Taking into consideration BR 1, BR 2, BR 4, and BR 14 one of the collective goal is to set up a visualization and monitoring service for the project. In this scenario, the System Under Management would be the environment station with all the different sensors that it encompasses. The set of sensors that would be a part of the environment station are Temperature and humidity sensor, air pressure sensor, air quality sensor, UV intensity sensor, and light intensity sensor. An example from the project for Environment station is shown in Figure below.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/c97d591cfc01ef652da0f2fa795974c2.png)

In monitoring analytics, the data from the environment station would be passed via the gateway to the AWS Kinesis streams service which would be responsible for transporting the collected data to the AWS broker on the backend. This would then lead to the triggering of an AWS lambda function which would duplicate the data and send it to two separate kinesis streams. One path would be responsible for real-time analytics, whereas the other path would be responsible for storing of the data for predictive and query analytics, in either scenario the processed data would be passed on to either Amazon Quicksight or Grafana for visualization and other trend related predictions. 

Predictive Analytics
--------------------

Referring to the figure above, from the [monitoring](#monitoring-analytics) analytics portion of the page, the process of transport of information from the devices to the AWS environment would be through the Kinesis service. The predictive processing would happen in the “processing section” of the model, where the lambda function would be used for storing the data in the Amazon DynamoDB from where the trend analysis would be processed.   
‍  
An example of the predictive analysis would be to use the air quality sensors deployed in the house. If the network of sensors deployed in the house is taken into consideration for predicting whether a particular room has a higher concentration of a particular gas (Carbon Monoxide, Carbon Dioxide, Ammonia, Nitrogen Dioxide etc.) This would not include checking the current values against a threshold but predicting whether the rate at which a gas’ concentration is increasing would it breach the threshold levels and if so predict this information for the user to see.

Acting Analytics
----------------

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/ade05b39743f305960a1fdac8cbd4f57.png)

In the acting analytics portion of the project, the analytics being processed by AWS Lambda function would result in signals being sent back to the devices in the network of the home. These devices would be subscribed to the topics to which the lambda function publishes. The information being transferred would be transported via the Kinesis service again back to the devices in the network. The devices that would receive these signals would be the one with actuators integrated with them, for example, the irrigation system, smart switches, and smart lights.

Other considerations for analytics
----------------------------------

In the figure below, we outline a simple AWS architecture for the project. This gives an example as to how the data would reach the cloud for processing. In this example, we take into consideration the Environment station which would be sending values to the AWS environment.

![Cosmos: Fire Sensor Functional Block Diagram](https://project-odyssey.s3.us-east-2.amazonaws.com/d3ed63e8c0ee263f10294aee2fa68814.png)

The Environment Station would be sending data to the AWS environment with the help of the AWS Kinesis Service. Once in the AWS environment, the AWS Lambda Function would be used to send the data across two different processes — processing data for real-time analytics, and for predictive analysis. For real-time analytics, the data would be stored in AWS S3 buckets, and also sent to Amazon Kinesis Analytics for monitoring analytics. Once the analytics is processed, the processed data would be sent to either Grafana or Amazon QuickSight. For predictive analytics, the data collected would be stored in Amazon DynamoDB for query-based requests. Once the required data is collected, it would be sent to an AWS Machine Learning service for further processing for predictive purposes.

Types of Computing Considered
-----------------------------

Here, we describe the two sets of computation that would take place in the project based on the use case of the device. The first set of computation would primarily happen at the edge, whereas the next set of computation would take place in the cloud.

*   Edge
*   This is where most computations should take place  
    
*   For example, in case of things with analog sensors, the translation of the analog voltage signals to the corresponding digital values can be computed at the edge itself, so as to reduce the latency of the transmission of only essential information to the AWS environment.  
    
*   Cloud
*   The next set of computation can happen at the cloud, where more computational power is needed for the processing of the received data.   
    
*   Generation of the threshold values for different things and sensors depending on several attributes such as — location, time of the year, time of the day, and other weather-related information.  
    
*   For example, in one of the applications where we use the image recognition service from AWS, a P3.2xlarge instance would help with the computing needs of the application.  
    
*   8 vCPUs and 16 GB in GPU memory should ensure scalable classification of plant types  
    
*   The camera would send the image information over to AWS Rekognition and then use the computational power at the P3.2xlarge instance to recognize the plant or crop in the picture, and then use lambda function to not only store the plant information but also retrieve the water usage per week for the plant under consideration.  
    

While choosing the cloud service that would be optimal for the project we had a look at several Service Level Agreements of AWS IoT Core, Google Cloud IoT Core, Azure IoT Hub to make an informed decision. While considering the server downtimes, each of the cloud services provided an equal amount of credit refunds for similar percentage of downtime, the only difference was the maximum credit, which was offered by Google at 50% for less than 99% uptime.   
  
We were attracted at the wide range of the services offered by AWS’ environment as compared to that provided by Google and Azure. Also, the pricing for IoT Core services4 was very competitive and was found to be more cost effective than the other two.

Related Pages
-------------

[Summary](../../../projects/iot/harappa.markdown)[Project Details](../../../projects/iot/harappa/project-details.markdown)[Elements of IoT (1)](../../../projects/iot/harappa/elements-of-iot.markdown)[Elements of IoT (2)](../../../projects/iot/harappa/elements-of-iot.markdown)[IoT-A Architecture](../../../projects/iot/harappa/iot-a.markdown)[Analytics & Computing](../../../projects/iot/harappa/analytics.markdown)[Conclusion](../../../projects/iot/harappa/conclusion.markdown)

[iot-a architecture](../../../projects/iot/harappa/iot-a.markdown)

[conclusion](../../../projects/iot/harappa/conclusion.markdown)

