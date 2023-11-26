---
layout: blog
categories:
  - blog
  - security
title: EVE-NG - Way down we go!
---


## What happens when you fuck up?

*Oh, Father, tell me, do we get what we deserve?*

*Oh, we get what we deserve*

Imagine you didn't commit your work, apply a config, and you happen to walk away from your keyboard. And while you were gone, for the lack of awareness of what just happened, which can be characterized as only, and only as a single event upset, where you forgot to commit to the intermediary paths which were taken and avoided in your quest to find the answer to a simple question. 

*How do I make sure one router can discover and roõte packets from one machine to the other.*

- **Kernel Panic**
	- Did you try turning it on and off again?
		- In most cases, could be an easy out, if the larger network is operational. If not. you need to think on your toes and find a solution, if one isn't available inherently.
	- After some digging and wild ideas, a good hard reboot helped. 

## The Curious case of `NET` commands

Unfortunately, I didn't save the `gpt`, but at least got to a point where I can save the net commands and quick reference them. 

```shell

cumulus@cumulus:mgmt:~$ nv --gelp
Ambiguous Command:
  action
  config
  list-commands
  set
  show
  tree
  unset

```

The above is the available playground for me. 

and I have the following set of commands to translate, so lets start [Cumulus VX - (eve-ng.net)](https://www.eve-ng.net/index.php/documentation/howtos/howto-add-cumulus-vx/). 

```shell
net add hostname west-spine-01
net add interface swp1 ipv6 nd ra-interval 5
net del interface swp1 ipv6 nd suppress-ra
net add interface swp2 ipv6 nd ra-interval 5
net del interface swp2 ipv6 nd suppress-ra
net add interface swp3 ipv6 nd ra-interval 5
net del interface swp3 ipv6 nd suppress-ra
net add loopback lo ip address 10.1.1.1/32
net add bgp autonomous-system 65000
net add bgp router-id 10.1.1.1
net add bgp bestpath as-path multipath-relax
net add bgp bestpath compare-routerid
net add bgp neighbor fabric peer-group
net add bgp neighbor fabric remote-as external
net add bgp neighbor fabric description Internal Fabric Network
net add bgp neighbor fabric capability extended-nexthop
net add bgp neighbor swp1 interface peer-group fabric
net add bgp neighbor swp2 interface peer-group fabric
net add bgp neighbor swp3 interface peer-group fabric
net add bgp ipv4 unicast network 10.1.1.1/32
net add bgp ipv6 unicast neighbor fabric activate
net add bgp l2vpn evpn neighbor fabric activate
net add bgp l2vpn evpn advertise-all-vni
net commit
```

*and way down we go...*
### Adding Hostnames


```shell
cumulus@cumulus:mgmt:~$ cat nv-commands.txt | grep "^nv set system hostname"
nv set system hostname <idn-hostname>
```

![](assets/images/KP-02.png)


### Interfaces

1. IPV6 Enabled
2. Neighbor Discovery
3. Router advertisement interval 70-1800000
### Other Configurations

1. BGP Configurations

## Ansible for Automation

There are a lot of nodes, and even though I'm interested in learning a few things about the network configuration, i would like to automate it. So if that means standing up a Ansible Server post my understanding of the switch setup. I'll do that. 

[Building a Network Automation Lab Environment - EVE-NG Ansible · Will Grana](https://willgrana.com/posts/network-automation-lab-setup/)

This looks promising. 

We start a [Ubuntu 22.04)](https://www.eve-ng.net/index.php/documentation/howtos/howto-create-own-linux-host-image/) 22.04 server, make sure it is connected to the internet, and be nice and update it. Another idea would be to auto update an ubuntu server 22.04 on startup, or if the server is online for ever, to have a cron job with a regular update and upgrade process. 

Once I spawned a new server, all sorts of security questions came in my mind. Is it hardened? What about compliance? What about this... what about that.. 

Okay, pause, find a *balance*, *and way down we go...* 

It's so damn tough folks... how does anyone do it? How do you it?

Anywho, lets install python and ansible. 

![](/assets/images/KP-03.png)

at least we're to a point where we have a [package manager]([Getting Started | asdf (asdf-vm.com)](https://asdf-vm.com/guide/getting-started.html)). 

![](/assets/images/KP-04.png)

## Firewall Setup

While we're at it, we'll also setup a OpnSense Firewall, just because we can and it would be a good practice. and we had done the hard part of installing the [OPNsense Firewall - (eve-ng.net)](https://www.eve-ng.net/index.php/documentation/howtos/opnsense-firewall/)  some point. 


![](/assets/images/KP-05.png)

After some configurations, we make sure that LAN is configured on a interface that is connected to the "internal network". I think for now I'm directly connecting my endpoint to help with configurations. But maybe, there's a better way to configure the switches and routers to connect up to the Firewall and that be the way network gets routed. We'll see. 

![](/assets/images/KP-06.png)

Able to connect to the internet. Which is GREAT!

![](/assets/images/KP-07.png)

- Let's [Updates — OPNsense documentation](https://docs.opnsense.org/manual/updates.html); and wait FOREVER for it to reboot .But, while that is happening a thought that popped up is that at least two firewalls make sense for such situation to avoid network interruptions; and GPT agrees.
- It really took forever, so I manually stopped and started the server (≈ hard reboot). Not the best solutions so a DR plan needs to be in place. A backup would be quick. 

![](/assets/images/KP-08.png)

### IDS/IPS Setup

[(28) Suricata IDS/IPS Installation on Opnsense - Virtual Lab Building Series: Ep3 - YouTube](https://www.youtube.com/watch?v=TPKLu4a3A4E)

Interestingly, I just wanted to make sure that the ansible server can be behind a firewall. But looking at OpnSense's offerings. 

[Security — OPNsense documentation](https://docs.opnsense.org/security.html)

Seem like it would be good to enable IDS and [Intrusion Prevention System — OPNsense documentation](https://docs.opnsense.org/manual/ips.html) on the firewall. 

Interestingly enough we can explore [2. Quickstart guide — Suricata 8.0.0-dev documentation](https://docs.suricata.io/en/latest/quickstart.html) rules and create some. Seems pretty complex, so we'll add that as a story, for future exploration. Can involve additional "threat intel" servers they are constantly populates the ruleset for management within the environment. 


## Updated Topology


![](/assets/images/KP-10.png)

## Okay, something gave

Something did give out of all the digging we did. We added a few more modules. I was at least able to ping all the routers from all the routers. which is amazing. Both Kali and ansible are able to at least reach the internet but there's a firewall there, and in between the data centers. 

I wish i could just say that, and be done with it... but... *way down we [go](https://www.youtube.com/watch?v=0-7IHOXkiV8). 