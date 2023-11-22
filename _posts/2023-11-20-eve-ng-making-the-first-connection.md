---
layout: post
categories:
  - blog
  - security
title: Emulated Virtual Environment (next, new) generation
---
## Making the first connection

- What do we know? And what have we learnt?
	- Well, it's on the network... so I should be able discover it using either ([Address Resolution Protocol - Wikipedia](https://en.wikipedia.org/wiki/Address_Resolution_Protocol)
	- machines do not inherently know each other's MAC addresses. ARP allows them to communicate by specifying rules that they can follow to learn which IP address belongs to each MAC address.
	- So, I should be able to discover `cumulous` some how. 
		- Maybe ARP Probes? 
		- Announcements?

`arp -a` just gives me the `eth0` that i'm connected on through to the internet. 

![Spine Network](/assets/images/making-the-first-connection-01.png)

Let's go through the "painful" process of turning them on. logging in on each, and editing the configuration file, as [Labbing A Modern Datacentre with Cumulus VX - JD Networks (jd-networks.co.uk)](https://jd-networks.co.uk/blog/2019/10/05/labbing-a-modern-datacentre/) suggests. We use `vim` instead, because we're wannabe pros. Okay, so we set `zebra=yes` and `bpgd=yes`. But wtf are those?

Also, post editing the configuration files we restart the service, instead of rebooting as the other guide suggests. 

```shell
sudo systemctl restart frr.service
```

Something to help with [Configuring FRRouting - Cumulus Linux 4.1 (nvidia.com)](https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-41/Layer-3/Configuring-FRRouting/). 

`bgpd`, most likely goes back to "border gateway protocol", and the `d` would be the daemon.

Something tells me, its going to be a long night. and it's only 23:53 EST. God damnit. AMD Ryzen 9 7945HX with Radeon Graphics. GTX 4090. 64 GB ram. And yet, a 2 GB router takes forever to load. Aahh... these systems... they never seem to get better. 

Sometimes, hitting `enter` helps. 

Also, lets save a safe password. `cumulusadmin`. Kids, please protect yourself, passwords can be tricky. 

At least before/after has the `bgpd`  state as up and connected. which is nice. 

![Restart Services](/assets/images/making-the-first-connection-02.png)

About 20 minutes later, and we've at least configured the "Free Range Routing" on these routers, for what ever that is needed. So far, it seems more dynamic, more receptive, more tolerant. All seem good enough reason to make sure we set those flags. [Adding the routes](#Adding%20the%20routes), we'll get to that soon.
### Some background on `zebra=yes` and `bgpd=yes` 

*GPT says...*

In Cumulus Linux, Zebra is a core component of the FRRouting (Free Range Routing) suite, which is an IP routing protocol suite that includes several daemon processes such as Zebra, BGPd, OSPFd, and others. These daemons work together to provide advanced routing capabilities on your network devices.

Here's what happens when you set `zebra=yes` and `bgpd=yes` in a Cumulus VX (Virtual Experience) configuration:

1. **Zebra Daemon (`zebra=yes`):**
   - When you enable the Zebra daemon, you are turning on the routing manager that handles all the kernel routing table updates based on the information provided by various routing protocols like BGP, OSPF, etc.
   - Zebra acts as an abstraction layer by communicating with the Linux kernel and updating the routing table based on the routing information it receives from the routing protocols.
   - It provides interfaces to the routing protocols, allowing them to communicate the routing information to the kernel.

2. **BGP Daemon (`bgpd=yes`):**
   - Enabling the BGP daemon activates the BGP routing protocol on your device.
   - BGP (Border Gateway Protocol) is used for exchanging routing information between different networks on the internet (between autonomous systems).
   - When `bgpd` is set to `yes`, the BGP daemon will start, and it will use the Zebra daemon to apply the BGP routing information to the device's routing table.
   - The BGP daemon will establish connections with BGP peers, exchange routing information, and determine the best paths for routing traffic to different networks.

When both `zebra` and `bgpd` are set to `yes` and FRRouting is enabled:

- The Zebra daemon will manage the routing table and interface with the Linux kernel.
- The BGP daemon will communicate with other BGP peers, receive routing updates, and send these updates to the Zebra daemon.
- Zebra will then update the kernel's routing table with the information received from the BGP daemon.
- This configuration allows the device to participate in BGP routing, making it capable of understanding and manipulating routes within an autonomous system and across different autonomous systems.

The combination of these daemons being enabled is common in network setups where dynamic routing is required, especially when dealing with multiple networks or when the network needs to make intelligent path decisions based on the most up-to-date routing information available.

### What are the benefits?

*GPT says*

In the network topology you provided, enabling FRRouting (Free Range Routing) on each of the Cumulus devices would be beneficial for several reasons:

1. **Dynamic Routing:**
   - FRRouting allows for dynamic routing protocols like BGP, OSPF, and IS-IS. In a data center with multiple paths like the one in your topology, dynamic routing protocols can automatically select the best path for data to travel based on current network conditions, topology changes, and policy.

2. **Scalability:**
   - As your network grows, you'll need to add more devices and possibly more complex topologies. FRRouting facilitates scalability by allowing you to use routing protocols that can automatically adjust to the changing network.

3. **Redundancy and High Availability:**
   - In any data center environment, minimizing downtime is critical. FRRouting can help achieve high availability by rerouting traffic in the event of a link or device failure.

4. **Traffic Engineering:**
   - With FRRouting, you can implement advanced traffic engineering policies. This includes manipulating route advertisements and path selection to optimize network resource usage and performance.

5. **Segmentation and Multi-Tenancy:**
   - FRRouting supports advanced features like VRF (Virtual Routing and Forwarding), which can be used to create separate routing tables for different segments of the network. This is particularly useful in multi-tenant environments where you might need to segment traffic for different customers or departments.

6. **Interoperability:**
   - By using FRRouting, which adheres to standard routing protocols, you can ensure interoperability between different vendor devices in your network. This is essential in a diverse network environment.

7. **Policy-Based Routing:**
   - FRRouting enables complex routing decisions based on policies beyond the destination IP address. This includes routing based on source addresses, application types, or other criteria.

8. **Visibility and Troubleshooting:**
   - FRRouting provides extensive monitoring and diagnostic capabilities that can help with network troubleshooting and performance monitoring.

9. **Customization and Control:**
   - Since FRRouting is open-source, it offers a level of customization and control that may not be available with proprietary solutions. You can modify and extend it to fit the specific needs of your network.

10. **Consistency:**
    - Having FRRouting on all devices ensures a consistent routing platform across your network, which simplifies management and configuration.

For these reasons, enabling FRRouting on each device in a spine-leaf topology like yours can provide a robust, flexible, and scalable networking foundation that is well-suited to the demands of modern data centers.

## Adding the routes

Seemingly, the next step is to add the routes. Please kill me. I'm not a networking guy.. and this is way too much. But ehh.. good learning. 

![old news](/assets/images/making-the-first-connection-03.png)

Oh well... seems like things have changed a little. Okay. Another night then. But, the next step is to add those paths. 


## Garbage in Garbage Out

---

**Title: Navigating the Night: A Sysadmin's Guide to Securing Dynamic Routing with FRRouting on Cumulus VX**

**Introduction:**
As the digital landscape evolves, the complexity of data center networks grows exponentially. Network administrators are often found burning the midnight oil, configuring and securing dynamic routing to ensure the seamless flow of data. The use of Free Range Routing (FRR) on Cumulus VX serves as the backbone for a robust, flexible, and scalable network infrastructure. This blog post delves into the intricacies of enabling and securing FRRouting, sharing insights from a sysadmin's late-night endeavors.

**Understanding the Role of ARP:**
Address Resolution Protocol (ARP) is the unsung hero of local network communication, mapping IP addresses to MAC addresses. It's the first line of discovery, revealing the devices connected to your network. However, reliance on ARP alone is not enough in a complex data center environment. This is where dynamic routing protocols come into play.

**The Power of `zebra=yes` and `bgpd=yes`:**
FRRouting in Cumulus VX hinges on various daemons, with Zebra and BGPd being the stars. Setting `zebra=yes` launches the routing manager that interfaces with the Linux kernel, while `bgpd=yes` fires up the Border Gateway Protocol daemon, essential for exchanging routing information across autonomous systems. These settings are the keystones for enabling dynamic, policy-based routing.

**Optimizing Service Restart with FRR:**
Gone are the days of unnecessary reboots; a modern sysadmin knows the value of uptime. Restarting the FRR service via `sudo systemctl restart frr.service` applies configuration changes with minimal disruption. This practice is not just about saving time—it's a necessity for high-availability environments.

**The BGP Daemon - `bgpd`:**
BGP is the protocol that underpins the internet, and `bgpd` is its gatekeeper in your network. Understanding its role in path selection and routing information exchange is pivotal. It's a complex beast, but taming it ensures your network's resilience and efficiency.

**System Resources: A Reality Check:**
Even with top-tier hardware like an AMD Ryzen 9 and a GTX 4090, network processes can test your patience. This reality check reminds us that networking is not just about power but also about the harmony between hardware and software.

**Security First - Password Management:**
In the networking world, a password is more than a key—it's a guardian. The choice of `cumulusadmin` for a password reflects a balance between security and memorability. It's a small but critical component of network security hygiene.

**Verifying Service Status:**
Post-configuration, it's crucial to ensure that `bgpd` is up and that connections are secure. Monitoring the state of your routing daemons is as vital as locking the front door—it's your network's first defense against the chaos of the internet.

**The Advantages of FRRouting:**
FRRouting brings a host of benefits, from the dynamism in routing decisions to the ability to scale and segment your network. It allows for policy-based routing and provides the visibility needed for effective troubleshooting. Moreover, its open-source nature offers a level of customization that proprietary solutions can't match.

**Route Addition - The Next Frontier:**
With FRRouting configured, the next step is adding routes. This task is daunting but critical, shaping the flow of traffic and defining the pathways that data packets will traverse. It's a meticulous process, but essential for network optimization.

**Conclusion:**
Securing a dynamic routing environment with FRRouting is a journey of balancing the immediate needs of network traffic flow with the long-term vision of network scalability and security. It's a testament to the sysadmin's skill and perseverance that even in the quietest hours of the night, the network remains a stronghold, resilient and responsive to the demands of the data it carries.

---

**About the Author:**
The author is a seasoned system administrator with a penchant for late-night troubleshooting and a passion for networking. With a knack for demystifying complex concepts and a commitment to network security, they share their experiences in the hope of enlightening fellow IT professionals and enthusiasts.