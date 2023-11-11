 Milestone 1 - Configuration Management & Build             try{Typekit.load();}catch(e){} !function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);    window.dataLayer = window.dataLayer || \[\]; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-167957177-1'); 

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

[Summary](../../../projects/devops/poseidon.html)[Milestone 1](../../../projects/devops/poseidon/milestone-1.html)[Milestone 2](../../../projects/devops/poseidon/milestone-2.html)[Milestone 3](../../../projects/devops/poseidon/milestone-3.html)

[projects](../../../projects/devops/poseidon.html)

[milestone 2](../../../projects/devops/poseidon/milestone-2.html)

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