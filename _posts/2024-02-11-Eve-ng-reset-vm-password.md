---
layout: blog
categories:
  - blog
  - security
title: Reset password for Virtual Machine in EVE-NG (Linux)
---

What happens when you forget the password for your virtual machine in EVE-NG? You can't just reset it like you would on a physical machine. Here's how you can reset the password for a virtual machine in EVE-NG.

## Step 1: Access the EVE-NG VM

First, you need to access the EVE-NG VM. You can do this by using the console or SSH. If you're using the console, you can access the VM by clicking on the VM in the EVE-NG interface and then clicking on the "Console" tab. If you're using SSH, you can access the VM by using an SSH client like PuTTY.

## Step 2: Open the Web Console

Once you're logged into the EVE-NG VM, you need to open the web console. You can do this by opening a web browser and navigating to the IP address of the EVE-NG VM followed by the port number 2600. 

## Step 3: Log in to the Web Console

When you open the web console, you'll be prompted to log in. The default username is "admin" and the default password is "eve".

## Get the Lab ID and Node ID

Once you're logged into the web console, you need to get the lab ID and node ID of the virtual machine that you want to reset the password for. You can do this by clicking on the "Nodes" tab and then clicking on the virtual machine in the list of nodes. The lab ID and node ID will be displayed in the URL of the web console.

## Step 4: Reset the Password

Now that you have the lab ID and node ID, you can reset the password for the virtual machine. You can do this by running the following command in the web console, replacing "lab_id" and "node_id" with the lab ID and node ID that you obtained in the previous step:

### Generate a new password

```bash
openssl passwd -1 [new_password]
``` 

### Locate the node's configuration file

```bash
cd /opt/unetlab/tmp/your_lab_id/node_id/virioa.cow2
```

### Change the password

```bash
guestfish -a virioa.cow2
```

### List the partitions

```bash
><fs> launch
><fs> list-filesystems
```

### Mount the root partition

```bash
><fs> mount /dev/sda1 /
```

### Change the password

```bash
><fs> vi /etc/shadow
```

## Step 5: Reboot the Virtual Machine

Once you've reset the password, you can reboot the virtual machine. You can do this by clicking on the "Nodes" tab in the web console, clicking on the virtual machine in the list of nodes, and then clicking on the "Reboot" button.


Now, that you don't forget the password again, I suggest you use a password manager solution. This experience has taught me to use a password manager, and I've been using a solution called "post-its" ever since. 😂

Thanks! Have fun. 