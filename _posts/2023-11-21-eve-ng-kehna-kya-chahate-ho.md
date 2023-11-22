---
layout: post
categories:
  - blog
  - security
  - networking
title: EVE-NG - Kehna Kya chahate ho?
---
## It is hard

I'm imagining this as a 40 year project. Where I add assets to the labs, as I find more use-cases for it.  If [Cosmos](/projects/iot/2017/11/02/00-cosmos.html) was any indication, I can definitely build automation around my home. And if [Oikos](/projects/security/2019/12/31/00-oikos.htm) was any indication then I care about my privacy. 

But if i can do it for my house, I can also do my uncle's house. and maybe for even for some of my friends. But whatever comes along the way. I need to be prudent, and thoughtful of the judgement calls I make. From the supply chain of the parts I use, to the networking, programming, monitoring, and then the slew of *customer* wants.

But mereko kirane ka shop chalane ka hai. Matlab? Mein kisaan, toh mera ladka kisaan. 

How do I make sure it is thoughtful enough, ke nahi chill hai. Theek kiya. 

- Lets use Ansible for host configurations and management.
- Linux, don't want to stick to RedHat, but if needed can look into that, lets just use Ubuntu or something. 
- Monitoring using ELK Stack. 
- Metrics and Dashboards - InfluxDB and Grafana could be a good option.
- Security of the endpoints. 
- Some ticketing system for tracking things that need tracking 
- Maybe a couple more things that I'm not thinking. 

But this is a lot. And I need to break down a lot of things, and build slowly. But I need to play the game of survival. So there will be decisions not full thought through and not fully envisioned. How do I make the judgment call? 

## RTFM

[Cumulus](https://docs.nvidia.com/networking-ethernet-software/cumulus-vx/Overview/) seems a good starting point for starting a network components I might need. I have a configured an [OpenSense](https://opnsense.org/) node to be available. but We'll get to a firewall when we have the basic network ready. 

*Read the fucking manual* is a big [term](https://en.wikipedia.org/wiki/RTFM), and I can't do everything. But I sure am expected to. Oh well... the *line*, if one of you fine people find that line, you contact me first!

Inconsistent behaviour, is what causes some of these *questions*. 

But I can be a complainbox. 

So contrary to what the other article suggests, the way you add routes and hostname and all the fancy network connections you don't use 

```
net add hostname west-spine-01
```

You'll spend some time reading the *manual*, and check some configuration files. 

![](/assets/images/kehna-kya-chahte-ho-01.png)

But maybe the binary changed, and the man pages were not updated?

anywho..

```shell
nv --help
set                   Modify system configurations.
```


![](/assets/images/kehna-kya-chahte-ho-02.png)

Something that ansible can make use of?

![](/assets/images/kkch-03.png)

Anywho..

![](/assets/images/kkch-05.png)

Cool so I should be able to get gpt to help me with a few things.

Damnit, this is so funny. LOL

![](/assets/images/KKCH-07.png)

![](/assets/images/KKCH-08.png)

Gives about 4438 lines of commands.... which is interesting use-case. 

Now, how the fuck do you get the file from a host, within a host that is being itself run on a host. BIG SIGH!

![](/assets/images/KKCH-09.png)

What did I miss now?

![](/assets/images/Pasted%20image%2020231121223435.png)

![](/assets/images/KKCH-10.png)

Okay. so there has been a bug change in the documentation, and feel like i've gotten a hang of some of it today. Maybe tomorrow is when we have the network setup!
