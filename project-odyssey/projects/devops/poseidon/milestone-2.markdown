 Milestone 2 - Test & Analysis             try{Typekit.load();}catch(e){} !function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);    window.dataLayer = window.dataLayer || \[\]; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'UA-167957177-1'); 

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

[Test & Analysis](../../../projects/devops/poseidon/milestone-2.html)

Content
-------

[Test & Analysis](#test-analysis)[Video Summary](#video-summary)[Report](#report)

Milestone 2
===========

Test & Analysis
---------------

In this milestone, the focus was on testing and analysis of the source code, and integrating it with the existing pipeline. The following tasks were performed:

*   Developing a script that automatically commits random changes to source code triggering a build
*   Creation of corresponding jenkins job  to run the test suite against this branch and handle rollback
*   Using  automated commit fuzzer, generating 100 random commits (that still compile) and  run tests
*   Generating a report that displays the test cases in sorted order, based on time to execute and number of failed tests
*   For the iTrust build job, extending the build job to support running an existing static analysis tool on the source code, process its results, and report its findings and fail the build minimum testing criteria and analysis criteria.
*   For checkbox.io, extending the build job to support the custom metrics and fail the build if any of these metrics exceed a given threshold.

Video Summary
-------------

Report
------

With Fuzzing, we wanted to the approach to be recreated as and when required, hence we used a pseudo-randomgenerator, with a seed value associated with each of the build. Thus it is easier for anyone, to get the same results in the test cases, and errors. Once the seed value is passed, we generate a probability of whether a line has to be modified, and then there is a probability that is associated with each of the fuzing operations. Once the fuzzing operation is completed, we push the code onto Jenkins Server for a build. Once the build is complete, we copy the test files fromsurefire-reports to a different folder, and then another fuzzing operation is queued up.  
  
Once the hundred builds are built, and all the files collected we wrote an analysis script, that would be responsible for walking through the directories, and compiling information about each build. Some analysis of the errors generated, and the changes that caused the errors are listed below. This is not a comprehensive list, but something that we uncovered while going through the saved results.

*   When replacing strings, email.properties was changed to CSC-Devops\_string. This often caused the test to be errored.
*   This brings me to the next point, there are a lot of strings in the java files. Even after reducing the probability of line within a file being altered to less than 0.5, and then adding another condition that limits the fuzzing of string operation to less than 0.035, the average number of strings that were "fuzzed" in each build averaged about 7-8 times. Agreed, that most of the strings that were altered, wre a part of a print statement, but there were some strings, that were reading meant for reading certain files.
*   There were two tests - testDrugLookup and testDrugForm that never failed. This was because no fuzzing operation was ever operated on the methods relating to those two tests.
*   The testDiaryEntryInvalid test failed the most number of times, because it checked if the values set for different parameters like fats,proteins, carbohydrates, etc were ever negative. Since we induced a fuzzing operation that changed the signs of operations from ">"/">=" with "
*   The next maximum numbers of failed error cases was with testInvalidCodes and testCodeAPI which accoring to us has a similar explaination as the previous point. Since the testInvalidCodes check for values within a specific range, the alteration of the operations from ">"/">=" with "
*   Next test we try to analyse is the testPatientAPI test, where patient information is tested, again a similar explaination like the previous point. The interesting observation that we had was the alteration of lastName.length() > 30 to lastName.length() < 30 led to an infinite loop.

Related Pages
-------------

[Summary](../../../projects/devops/poseidon.html)[Milestone 1](../../../projects/devops/poseidon/milestone-1.html)[Milestone 2](../../../projects/devops/poseidon/milestone-2.html)[Milestone 3](../../../projects/devops/poseidon/milestone-3.html)

[Milestone 1](../../../projects/devops/poseidon/milestone-1.html)

[milestone 3](../../../projects/devops/poseidon/milestone-3.html)

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