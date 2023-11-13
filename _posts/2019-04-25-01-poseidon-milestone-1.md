---
layout: project
title: "Poseidon: Milestone 1 - Configuration Management & Build) ⚙️"
categories: ["projects","devops"]
---   

Content
-------

* [CM & Build](#cm-build)
* [Video Summary](#video-summary)
* [Report](#report)

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

[Summary](2019-04-25-poseidon.markdown)[Milestone 1](../../../projects/devops/poseidon/milestone-1.html)[Milestone 2](../../../projects/devops/poseidon/milestone-2.html)[Milestone 3](../../../projects/devops/poseidon/milestone-3.html)

[projects](2019-04-25-poseidon.markdown)

[milestone 2](../../../projects/devops/poseidon/milestone-2.html)

