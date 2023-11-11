 Milestone 1 - Configuration Management & Build              

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.markdown)

[Home](../../../index.markdown)

Projects

[Security](../../../projects/security.markdown)[DevOps](../../../projects/devops.markdown)[Internet of Things](../../../projects/iot.markdown)

[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.markdown)

[Home](../../../index.markdown)

##### /

[Projects](../../../projects.markdown)

##### /

[Devops](../../../projects/devops.markdown)

##### /

[Poseidon](../../../projects/devops/poseidon.markdown)

##### /

[Configuration Management & Build](../../../projects/devops/poseidon/milestone-1.html)

Content
-------

[CM & Build](#cm-build)[Video Summary](#video-summary)[Report](#report)

Milestone 1
===========

Configuration Management & Build
--------------------------------

In this milestone, we have demonstrated the build automation and configuration management using Ansible. The following tasks were performed:

*   Provisioning of configuration server (Ansible) and a build server (Jenkins) on remote virtual machine instances
*   Configuring the Jenkins server, automatically using Ansible
*   Used OpenStack's Jenkins Job Builder and Ansible, to automatically setup build jobs for two applications:  
    — A Nodejs web application - checkbox.io  
    — An enterprise Java system - iTrust
*   Used a combination of mocha/pm2, to create a test script that will start and stop the checkbox.io service on the server
*   Created a git hook to trigger a build when a push is made to the local bare repository

Video Summary
-------------

Report
------

We faced the following set of difficulties while configuring the jenkins server. Starting off with the project was challenging, as we couldn't find clear requirements for checkbox.io and itrust. This became clear, once some attention was paid to the actual implementation of the different applications. Once we understood the dependencies and initial setup requirements, it was fairly straightforward implementation for both of the applications. What we noticed is that, though the initial configuration of the jenkins server, that is, the setup and configuration of Jenkins itself, along with other dependencies were not very difficult and we were done with a mjority of the project well before the deadline, we were stuck with simple tasks such as -- the mocha and pm2 test cases, which took us sometime to understand and then implement.  
  
We also faced difficulties while implementing GitHooks because we were not able to clearly understand the requirement itself. Though it was clearly mentioned that the push to the local bare repository were itrust and checkbox while implementing we thought it was _this_ repository that we needed to make the push to, which would then trigger the build for the two applications. Once the placement of the git hooks was understood, we were confused as to the placement of the post-receive hook itself. We first thought, that the git hooks were to be placed in the itrust, and checkbox repositroy itself, but which was not the case.

Related Pages
-------------

[Summary](../../../projects/devops/poseidon.markdown)[Milestone 1](../../../projects/devops/poseidon/milestone-1.html)[Milestone 2](../../../projects/devops/poseidon/milestone-2.html)[Milestone 3](../../../projects/devops/poseidon/milestone-3.html)

[projects](../../../projects/devops/poseidon.markdown)

[milestone 2](../../../projects/devops/poseidon/milestone-2.html)

Home

[About](../../../index.markdown)[Contact](mailto:jnshah2@ncsu.edu)[Privacy](../../../privacy.markdown)

Education

[Formal](../../../education/formal.markdown)[Certification](../../../education/certifications.markdown)[Pursuing](../../../education/pursuing.markdown)

Projects

[Security](../../../projects/security.markdown)[DevOps](../../../projects/devops.markdown)[Internet of Things](../../../projects/iot.markdown)

Resources

[Resumé](https://project-odyssey.s3.us-east-2.amazonaws.com/Odyssey-Resources/Resume/JubeenShah-Resume.pdf)

[![banner icon for Jubeen Shah](https://project-odyssey.s3.us-east-2.amazonaws.com/d130db536435d20d7579fafb511ca245.svg)](../../../index.markdown)

Passionately curious about technology

Project Odyssey - © All rights reserved. 2020 Jubeen Shah