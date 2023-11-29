---
layout: blog
categories:
  - blog
  - security
title: fping install from source
---
## What is `fping`

`fping` is a network diagnostic tool used for ping-like operations but with enhanced features and functionality. Unlike the traditional `ping`, `fping` allows you to ping multiple hosts in parallel, providing a more efficient way to check the status of multiple connections. It's widely used in network troubleshooting and monitoring tasks.

## Installing `fping`

### Step 1: Cloning the Repository
The journey to installing `fping` from the source begins with cloning its repository from GitHub. You can do this using the `git clone` command:

```bash
git clone https://github.com/schweikert/fping.git
```

### Step 2: Navigating to the Cloned Directory
Once the repository is cloned, navigate to the `fping` directory:

```bash
cd fping/
```

### Step 3: Preparing for Configuration
Before configuring, it's a good practice to check the existing files in the directory using the `ls` command. This step helps in verifying if all necessary files are present:

```bash
ls
```

### Step 4: Running `autoreconf`
`autoreconf` is used to generate configuration scripts. Run the following command:

```bash
autoreconf -i
```

### Step 5: Configuring the Makefile
Now, it's time to configure the Makefile. If you want to install `fping` in a specific directory, you can specify the prefix. Here, we install it in the `/usr` directory:

```bash
./configure --prefix=/usr
```

### Step 6: The Make Process
The `make` command is used to compile the source code:

```bash
make
```

### Step 7: Installing `fping`
After successful compilation, the next step is to install `fping`:

```bash
make install
```

Alternatively, you can combine the `make` and `make install` commands:

```bash
make; make install .
```

### Step 8: Verifying the Installation
To verify if `fping` is installed correctly, use the `which` command:

```bash
which fping
```

## Why Install from Source

Installing `fping` from source provides several benefits:

1. **Latest Version**: You get the latest version, which might not be available in the package repositories.
2. **Customization**: You have the flexibility to customize the installation, like specifying the installation directory.
3. **Learning Experience**: It provides a deeper understanding of how Linux tools are installed and compiled.
4. **Security Benefits**: Source code auditing, knowing what you're running, even if its to verify who are its supporters, how many forks or stars

## Additional Configuration Steps (If Needed)

### Setting Ping Group Range
In some systems, you might need to set the ping group range for proper functionality. This is done using:

```bash
sudo sysctl -w net.ipv4.ping_group_range="1 1000"
```

Then, verify the range:

```bash
cat /proc/sys/net/ipv4/ping_group_range
```

### Checking Group ID
You can check your group ID using:

```bash
id -g
```

### Running `fping` Help
To explore `fping` options and usage, you can use:

```bash
fping --help
```

Installing `fping` from source might seem like a series of intricate steps, but it offers control and insight into the installation process. Whether you're a network administrator or a curious Linux user, mastering these steps can enhance your understanding of how network tools operate at a fundamental level.


## Running `fping` on a network range 

Use [CIDR.xyz](https://cidr.xyz/) to understand what network range you want to explore.

```shell
 fping --ipv4 --size=32 --interval=1 --timeout=100 --quiet --generate 10.10.0.0/16 -c 1
```

Alternatively, running a nmap ping scan should also do the same work. 

```shell
nmap -sn 10.10.0.0/16
```