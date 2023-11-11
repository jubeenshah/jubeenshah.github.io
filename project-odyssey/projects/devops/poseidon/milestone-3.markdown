 Milestone 3 - Deployment             try{Typekit.load();}catch(e){} !function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);    window.dataLayer = window.dataLayer || \[\]; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-167957177-1'); 

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.html)

[Home](../../../index.html)

Projects

[Security](../../../projects/security.html)[DevOps](../../../projects/devops.html)[Internet of Things](../../../projects/iot.html)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.html)

[Home](../../../index.html)

##### /

[Projects](../../../projects.html)

##### /

[Devops](../../../projects/devops.html)

##### /

[Poseidon](../../../projects/devops/poseidon.html)

##### /

[Deployment](../../../projects/devops/poseidon/milestone-3.html)

Content
-------

[Deployment](#deployment)[Video Summary](#video-summary)[Report](#report)

Milestone 3
===========

Deployment
----------

In this milestone, the focus was on deployment, and monitoring analysis using Ansible on AWS servers. The following tasks were performed:

*   Deploying the applications (checkbox.io and iTrust) on AWS using git trigger hooks
*   Configurin a redis client to turn off some features using feature flags
*   Extracted a microservice and deployed sereral instances using Kubernetes
*   Implementing the monitoring analysis of the project as a special componenet using Prometheus and Grafana

Video Summary
-------------

Report
------

This was a particular interesting milestone in terms of what we learnt. There were a lot of challenges while we were doing the project, probably only a subset of which were really very easy to solve. We would walk through some of the challenges faced below.

*   Deployment Challenges
*   While spawning AWS instances initially we used to hard code the security group. For testing the project, when we ran code on a different AWS account, we faced the problem that it could not find the hard-coded Security Group. That was a problem that we overlooked, but quickly resolved by making the script we wrote, also create an security group that the spawned instance would use.
*   We also had to make the inventory file using the script, we wrote so that it can be used with the subsequent playbook.
*   With the Jenkins service running on the AWS, we faced issues with the permissions for executing a build job for the jenkins user. Initially we couldn't figure out the problem, because on manually running the ansible playbooks, there was no problem, but with jenkins it was. The resolution was just to assign necessary privileges for the Jenkins user to allow for normal execution.
*   Also, initally when deploying the iTrust service, we used to download the repository on the production server which at first did not seem incorrect. Halfway through the milestone we realized that we had deploy the .warfile which seemed the logical thing to do in the first place. We had to re-write the deployment strategy for iTrust service.
*   With the new deployment strategy, we took some time before realizing how to migrate a MySQL database from the build server to the deployment server.
*   Infrastructure Challenges
*   Initially we didn't seperate the checkbox.io render service as a micro-service. And were still able to make the checkbox.io service to node failures. When, we figured that was not the approach we had to take, we had to re-write the docker containers, and push the changes.  
    
*   Once the containers were ready, and running independent of Kubernetes, on deployment to AWS, the same containers wouldn't run. Turns out it was a security group issue, when necessary ports were not allowed inbound access. Also with kubernetes we had to expose the services themselves.  
    
*   Monitroing Analysis Challenges
*   First we wrote nodejs scripts that we presumed could run on the nodes and give us the information. Little did we know before the infrastructure upgrade part of the milestone, that for us to deploy nodejs scripts that we wrote it either had to be a part of the docker container we already deployed, or create new configuration files for kubernetes.  
    
*   Slowly we realized that we also had to have a database ready if we wish to have a visualization for the metric we collected. One of the team members had experience with and grafana. Not, looking at whether kubernetes has support for InfluxDB we started modifying the scripts to allow for the integration.  
    
*   Once ready with the new scripts with support for InfluxDB and Grafana we quickly realized that Kubernetes works best with Prometheus, since we faced problems collecting metrics from the Kubernetes cluster.  
    
*   Finally, we settled with Prometheus and Grafana, collected the necessary configuration files and deployed it Kubernetes. Which worked like a charm.  
    

Related Pages
-------------

[Summary](../../../projects/devops/poseidon.html)[Milestone 1](../../../projects/devops/poseidon/milestone-1.html)[Milestone 2](../../../projects/devops/poseidon/milestone-2.html)[Milestone 3](../../../projects/devops/poseidon/milestone-3.html)

[Milestone 2](../../../projects/devops/poseidon/milestone-2.html)

[projects](../../../projects.html)

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