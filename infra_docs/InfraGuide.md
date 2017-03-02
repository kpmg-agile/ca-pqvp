# General Infrastructure Setup

## Load Balancer Setup
###1) Install Nginx
Our load balancers run Nginx. Install on each of the load balancers.
```
sudo apt-get install nginx
```

Edit the default sites.
```
sudo nano /etc/nginx/sites-enabled/default
```

_default_
```
upstream calproc {
        server {app01_ip}:8080;
        server {app02_ip}:8080;
}
upstream viz {
		server {mgr01_ip}:8085;
        server {mgr02_ip}:8085;
}

server {
        listen 8080 default_server;
        listen [::]:8080 default_server;

        location / {
                proxy_pass http://calproc;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
}

server {
        listen 8085 default_server;
        listen [::]:8085 default_server;

        location / {
                proxy_pass http://viz;
        }
}


server {
        listen 9000 default_server;
        listen [::]:9000 default_server;

        location / {
                root /var/www/goaccess;
                index report.html;
        }
}
```

###2) Install GoAccess
We utilize GoAccess to generate network traffic reports.  Install and setup GoAccess on all load balancers.
```
mkdir /var/www/goaccess
echo "deb http://deb.goaccess.io/ $(lsb_release -cs) main" | sudo tee -a /etc/apt/sources.list.d/goaccess.list
wget -O - https://deb.goaccess.io/gnugpg.key | sudo apt-key add -
apt-get update
apt-get install goaccess
```

Create _/usr/local/bin/goaccessreport_
```
sudo nano /usr/local/bin/goaccessreport
```

```
#!/bin/bash
goaccess -f /var/log/nginx/access.log -o /var/www/goaccess/report.html
```

Add run permissions
```
sudo chmod +x /usr/local/bin/goaccessreport
```

Create _/lib/systemd/system/goaccessreport.service_
```
sudo nano /lib/systemd/system/goaccessreport.service
```

```
[Unit]
Description=Goaccess Web log Report for Load Balancer
After=network.target

[Service]
Type=simple
User=root
Group=root
Restart=always
ExecStart=/usr/local/bin/goaccessreport
StandardOutput=null
StandardError=null

[Install]
WantedBy=multi-user.target
```

Create _/lib/systemd/system/goaccessreport.timer_
```
sudo /lib/systemd/system/goaccessreport.timere
```

```
[Unit]
Description=Goaccess Web log Report for Load Balancer
After=network.target

[Service]
Type=simple
User=root
Group=root
Restart=always
ExecStart=/usr/local/bin/goaccessreport
StandardOutput=null
StandardError=null

[Install]
WantedBy=multi-user.target
root@agi-dev01vweb01:~# cat /lib/systemd/system/goaccessreport.timer
[Unit]
Description=Run script every 15min

[Timer]
OnBootSec=5min
OnUnitActiveSec=15min
Unit=goaccessreport.service

[Install]
WantedBy=multi-user.target
```

Modify _/etc/goaccess.conf_
```
sudo nano /etc/goaccess.conf
```

```
...

# The following time format works with any of the
# Apache/NGINX's log formats below.
#
time-format %H:%M:%S
#

...

# The following date format works with any of the
# Apache/NGINX's log formats below.
#
date-format %d/%b/%Y

...

# NOTE: If the time/date is a timestamp in seconds or microseconds
# %x must be used instead of %d & %t to represent the date & time.

# NCSA Combined Log Format
log-format %h %^[%d:%t %^] "%r" %s %b "%R" "%u"

...
```

Load the daemons
```
sudo systemctl daemon-reload
sudo systemctl enable goaccessreport
sudo systemctl enable goaccessreport.timer
sudo systemctl start goaccessreport.timer
```



## Docker Swarm Setup
####1) Install Docker on Swarm Machines

Docker must be installed on each machine that will be part of the swarm. A bridge is specificied prior to the initialization of the swarm to ensure no collisions of IPs.
```
apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
sudo apt-get install -y docker-engine
sudo usermod -aG docker $(whoami)
docker network create --opt com.docker.network.bridge.enable_icc=false --subnet=172.16.0.0/24 docker_gwbridge
```

####2) Initialize Docker Swarm on a Node Manager
Initialize the swarm on a Node Manager
```
docker swarm init
```

Make note of the connection string.
```
docker swarm join --token {TOKENID} {IP}:{PORT}
```

####3) Join the Swarm on All Machines and Create ~/docker to support deployments
You should join the Docker swarm on all machines, including any additional Node managers. Jenkins will transfer files to ~/docker during automated deployments. Each machine in the swarm will require this directory.
```
docker swarm join --token {TOKENID} {IP}:{PORT}
mkdir ~/docker
```

####4) Promote Additional Node Managers
For the swarm to have efficient failover, additional nodes must be promoted to Manager. As a note, our Dev and SIT/UAT environments only have one node manage.  Production is setup with two node managers.
```
docker node ls
docker node promote {ID}
```

## Jenkins Setup
We utilize Jenkins for build automation.

Install Jenkins
```
wget -q -O - https://pkg.jenkins.io/debian/jenkins-ci.org.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list
apt-get update
apt-get install jenkins
```

Install Docker
```
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
sudo apt-get install -y docker-engine
```

Install Google Chrome, xfvb, and supporting modules
```
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
apt-get update
sudo apt-get install google-chrome-stable
sudo apt-get install xvfb gtk2-engines-pixbuf
sudo apt-get install xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable
sudo apt-get install imagemagick x11-apss dbus-x11
```


Format a drive with sufficient space as ext4.
```
sudo fdisk {drive}

(create new partion)

sudo mkfs -t ext4 {partition}
```

Make a /u01/app directory
```
sudo mkdir -p /u01/app
```

Mount the drive to /u01/app
```
sudo mount {partition} /u01/app
```

Add the drive to _/etc/fstab_ (make note of partition blkid)
```
sudo -i blkid
sudo nano /etc/fstab
```

_/etc/fstab_
```
UUID={UID} /u01/app ext4 defaults,nofail 1 2
```

Make a /u01/app/jenkins directory and give permissions to Jenkins
```
sudo -p /u01/app/jenkins
chown jenkins:jenkins /u01/app/jenkins
```

Add args to support display of archived report.
```
sudo nano /etc/defaults/jenkins
```

_/etc/defaults/jenkins_
```
...

JAVA_ARGS="-Djava.awt.headless=true -Dhudson.model.DirectoryBrowserSupport.CSP=\"default-src https:; connect-src https:; font-src https: data:; frame-src https:; img-src https: data:; media-src https:; object-src https:; script-src 'unsafe-inline' 'unsafe-eval' https:; style-src 'unsafe-inline' https:;\""  # Allow graphs etc. to work even when an X server is present

...
```

Restart Jenkins
```
systemctl restart jenkins 
```

Allow Jenkins user to execute docker commands.
```
sudo usermod -aG docker jenkins
```


Configure Jenkins. Our install has the following plugins enabled.
```
Ant Plugin
Authentication Tokens API Plugin
bouncycastle API Plugin
Branch API Plugin
build timeout plugin
Conditional BuildStep
Credentials Binding Plugin
Credentials Plugin
Display URL API
Docker Commons Plugin
Docker Pipeline
Durable Task Plugin
Email Extension Plugin
External Monitor Job Type Plugin
Folders Plugin
Git client plugin
Git plugin
GIT server Plugin
GitHub API Plugin
GitHub Branch Source Plugin
GitHub Organization Folder Plugin
GitHub plugin
Gradle Plugin
Hudson Post build task
Hudson SCP publisher plugin
Icon Shim Plugin
Javadoc Plugin
JavaScript GUI Lib: ACE Editor bundle plugin
JavaScript GUI Lib: Handlebars bundle plugin
JavaScript GUI Lib: jQuery bundles (jQuery and jQuery UI) plugin
JavaScript GUI Lib: Moment.js bundle plugin
JUnit Plugin
LDAP Plugin
Mailer Plugin
MapDB API Plugin
Matrix Authorization Strategy Plugin
Matrix Project Plugin
Maven Integration plugin
OWASP Markup Formatter Plugin
PAM Authentication plugin
Pipeline
Pipeline Graph Analysis Plugin
Pipeline: API
Pipeline: Basic Steps
Pipeline: Build Step
Pipeline: Declarative Agent API
Pipeline: GitHub Groovy Libraries
Pipeline: Groovy
Pipeline: Input Step
Pipeline: Job
Pipeline: Milestone Step
Pipeline: Model API
Pipeline: Model Definition
Pipeline: Multibranch
Pipeline: Nodes and Processes
Pipeline: REST API Plugin
Pipeline: SCM Step
Pipeline: Shared Groovy Libraries
Pipeline: Stage Step
Pipeline: Stage Tags Metadata
Pipeline: Stage View Plugin
Pipeline: Step API
Pipeline: Supporting APIs
Plain Credentials Plugin
Publish Over SSH
Resource Disposer Plugin
Role-based Authorization Strategy
Run Condition Plugin
Safe Restart Plugin
SCM API Plugin
Script Security Plugin
Slack Notification Plugin
SSH Agent Plugin
SSH Credentials Plugin
SSH Slaves plugin
Structs Plugin
Throttle Concurrent Builds Plug-in
Timestamper
Token Macro Plugin
Windows Slaves Plugin
Workspace Cleanup Plugin
Xvfb plugin
```

Configure Jenkins to point to our mounted drive for workspace and builds.
```
Workspace Root Directory: /u01/app/jenkins/workspace/${ITEM_FULLNAME}
Build Record Root Directory: /u01/app/jenkins/builds/${ITEM_FULLNAME}/builds
```

Configure Jenkins to point to our public url
```
Jenkins URL: https://jenkins.calproc.website/
```

Create two throttle items
```
Category Name: GitPushBuild
Maximum Total Concurrent Builds: 1
Maximum Total Concurrent Builds Per Node: 1
Category Name: SitDeploy
Maximum Total Concurrent Builds: 1
Maximum Total Concurrent Builds Per Node: 1
```

Configure Publish over SSH
```
1) Generate a key pair on Jenkins as Jenkins user
2) Point Publish Over SSH key path to /var/lib/jenkins.ssh/id_rsa
3) Add all servers that Jenkins will interact with
```

Configure Slack Integration
```
1) Point to appropriate team subdomain
2) Add appropriate Integration Token Credential ID
3) Point to correct channel
```

Manage Roles and Assign Roles
```
Create appropriate roles and assignments for the project
```

## Configure WAF
Our WAF runs Nginx with Naxi.

```
sudo su - 
apt-get install git
cd /usr/src
git clone -b http2 https://github.com/nbs-system/naxsi.git
wget https://github.com/nginx/nginx/archive/release-1.11.10.tar.gz

(extract nginx release to nginx-release-1.11.10)

git clone https://github.com/yaoweibin/ngx_http_substitution_filter_module.git
cd nginx-release-1.11.10/

./configure   --add-module=/usr/src/naxsi-http2/naxsi_src/ --add-module=/usr/src/ngx_http_substitutions_filter_module/ --user=www-data   --group=www-data  --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_addition_module --with-http_geoip_module --with-stream --with-stream_ssl_module --with-http_sub_module --with-threads --with-http_v2_module --with-debug

make
make install
```

This project makes use of Let's Encrypt. Certs were obtained for all public facing domains.
```
sudo apt-get install letsencrypt
letsencrypt certonly -a webroot --webroot-path=/usr/local/nginx/html/ -d {domain}
```

Add appropriate entries to nginx config, force SSL
_/usr/local/nginx/conf/
```
...

    upstream prd_calproc_lb {
        server {ip1}:8080;
        server {ip2}:8080;
    }
    upstream prd_viz_lb {
        server {ip1}:8085;
        server {ip2}:8085;
    }
    
...

    server {
        listen 80;
        #listen [::]:80;
        server_name jenkins.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name nagios.calproc.website;
        return 301 https://$server_name$request_uri;
    }


    server {
        listen 80;
        #listen [::]:80;
        server_name dev.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name sit.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name www.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name docker-dev.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name docker-sit.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name docker-prd.calproc.website;
        return 301 https://$server_name$request_uri;
    }


    server {
        listen 80;
        #listen [::]:80;
        server_name dev-lb.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name sit-lb.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name prd-lb1.calproc.website;
        return 301 https://$server_name$request_uri;
    }
    server {
        listen 80;
        #listen [::]:80;
        server_name prd-lb2.calproc.website;
        return 301 https://$server_name$request_uri;
    }


...

    #####################################################################
    #      (Dev) calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     dev.calproc.website;

        include snippets/ssl-dev.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;


        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:8080;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                proxy_redirect off;
        }

        location ~ /.well-known {
                allow all;
        }
    }

    #####################################################################
    #      (Sit) calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        listen          443 ssl http2;
        server_name     sit.calproc.website;

        include snippets/ssl-sit.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;


        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:8080;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                proxy_redirect off;
        }

        location ~ /.well-known {
                allow all;
        }
    }

    #####################################################################
    #      (PRD) calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     www.calproc.website;

        include snippets/ssl-www.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;


        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://prd_calproc_lb;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                proxy_redirect off;
        }

        location ~ /.well-known {
                allow all;
        }
    }

    #####################################################################
    #      (Dev) docker.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     docker-dev.calproc.website;

        include snippets/ssl-docker-dev.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;


        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:8085;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;
               proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                proxy_redirect off;
        }

        location ~ /.well-known {
                allow all;
        }
    }

    #####################################################################
    #      (sit) docker.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     docker-sit.calproc.website;

        include snippets/ssl-docker-sit.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;


        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:8085;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                proxy_redirect off;
        }

        location ~ /.well-known {
                allow all;
        }
    }

    #####################################################################
    #      (prd) docker.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     docker-prd.calproc.website;

        include snippets/ssl-docker-prd.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;


        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://prd_viz_lb;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                proxy_redirect off;
        }

        location ~ /.well-known {
                allow all;
        }
    }


    #####################################################################
    #      (Ops) jenkins.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     jenkins.calproc.website;

        include snippets/ssl-jenkins.calproc.website.conf;
        include snippets/ssl-jenkins-params.conf;

        index index.html;


        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip};

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                proxy_redirect off;
        }

        location ~ /.well-known {
                allow all;
        }
    }

    #####################################################################
    #      (Ops) nagios.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     nagios.calproc.website;

        include snippets/ssl-nagios.calproc.website.conf;
        include snippets/ssl-nagios-params.conf;

        index index.html;



        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip};

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                #proxy_redirect off;
        }


        location ~ /.well-known {
                allow all;
        }
    }






    #####################################################################
    #      (Mgmt) dev-lb.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     dev-lb.calproc.website;

        include snippets/ssl-dev-lb.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;



        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:9000;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                #proxy_redirect off;
        }


        location ~ /.well-known {
                allow all;
        }
    }


    #####################################################################
    #      (Mgmt) sit-lb.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     sit-lb.calproc.website;

        include snippets/ssl-sit-lb.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;



        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:9000;


                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                #proxy_redirect off;
        }


        location ~ /.well-known {
                allow all;
        }
    }
    #####################################################################
    #      (Mgmt) prd-lb1.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     prd-lb1.calproc.website;

        include snippets/ssl-prd-lb1.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;



        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:9000;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                #proxy_redirect off;
        }


        location ~ /.well-known {
                allow all;
        }
    }
    #####################################################################
    #      (Mgmt) prd-lb2.calproc.website
    #####################################################################
    server {
        listen          443 ssl http2;
        server_name     prd-lb2.calproc.website;

        include snippets/ssl-prd-lb2.calproc.website.conf;
        include snippets/ssl-params.conf;

        index index.html;



        location / {
                include /usr/local/nginx/conf/naxsi.rules;
                include /usr/local/nginx/conf/naxsi_whitelist_calproc.rules;
                proxy_pass http://{ip}:9000;

                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_set_header Host $http_host;

                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                #proxy_set_header X-Forward-Proto http;
                proxy_set_header X-Forward-Proto $scheme;
                proxy_set_header X-Nginx-Proxy true;

                #proxy_redirect off;
        }


        location ~ /.well-known {

        location ~ /.well-known {
                allow all;
        }
    }

```

## General NGFW Information and Azure NSG
Each administrator is provisioned a VPN profile certificate as well as user name and pasword for access to our networks. VPN profiles are restricted using firewall rules to only machines and environments that they have access to.

We utilize Azure NSG's to restrict network to network traffic. This ensures that machines in our dev region cannot communicate with production machines.  Likewise, access from the ops network to the various environments are restricted based on the behaviours that are required.


## Nagios Setup
# 1) Nagios instllation
# Creating a nagios user and nagios group 
sudo /usr/sbin/useradd -m -s /bin/bash nagios
sudo /usr/sbin/groupadd nagios
sudo /usr/sbin/usermod -G nagios nagios

Downlaod latest version of Nagios and plugins (We are using nagios-4.3.1)
# wget http://prdownloads.sourceforge.net/sourceforge/nagios/nagios-4.3.1.tar.gz
# wget http://prdownloads.sourceforge.net/sourceforge/nagiosplug/nagios-plugins-2.1.2.tar.gz

# Compile the Nagios package downloaded

Go the directory the package is downloaded and extract the tar balls 
tar -xvf nagios-4.3.1.tar.gz
tar -xvf nagios-plugins-2.1.2.tar.gz

# Run the configure script for Nagios passing the group created earlier
cd nagios-4.3.1/
./configure --with-command-group=nagios --with-httpd-conf=/etc/apache2/sites-enabled
# Compile the Nagios code
make all

# Install Bianries (Init script, config files) for the Nagios version
make install 
make install-init
make install-config

# Run and compile the Nagios plugin 
cd nagios-plugins-2.1.2
./configure
gmake
make install

# Creating Nagios users, Authentication is http cached, the credentials are stored once you logged in. 
htpasswd -mb /usr/local/nagios/etc/htpasswd.users $USERNAME $PASSWORD 

# Authentication permissions can be configured in cgi.cfg file 
/usr/local/nagios/etc/cgi.cfg

# Configuration files of Nagios 
locate the directory you compiled the code

usr/local/nagios/etc/ --(My desired location is under /usr/local/) 

# Configuration files for remote client servers

usr/local/nagios/etc/objects/localhost.cfg 

# Configue the host name and address in localhost.cfg file 
Create a file with any name and cfg extension and provide the host name and address you wre monitoring. 
alias                   localhost (Server you want to monitor) 
address                 127.0.0.1 (IP ADDRESS of the server) 
# Define a host for the local machine

define host{
        use                     linux-server            ; Name of host template to use
                                                        ; This host definition will inherit all variables that are defined
                                                        ; in (or inherited by) the linux-server host template definition.
        host_name               localhost
        alias                   localhost
        address                 127.0.0.1  (IP ADDRESS OF REMOTE SERVER)
        }

# Define an optional hostgroup for Linux machines

define hostgroup{
        hostgroup_name  linux-servers ; The name of the hostgroup
        alias           Linux Servers ; Long name of the group
        members         localhost     ; Comma separated list of hosts that belong to this group
        
# Define a service to the the local machine

define service{
        use                             local-service         ; Name of service template to use
        host_name                       localhost
        service_description             PING
        check_command                   check_service(ping, tcp, load, users) ---- {service can be ping, tcp, load, users) 
        }

# Nagios configuration file to add client servers --- # Nagios.cfg 
-- Add the location of remote client server which is to be monitored in the nagios.cfg file 
cfg_file=/usr/local/nagios/etc/objects/localhost.cfg -- (localhost is the client i want to monitor) 

# Start the Nagios Server through init
/etc/init.d/nagios start
# Login to the web interface using credentials created 
http://IPADDRESS/nagios/

# For Email Notifications
install postfix and mailx 
sudo apt-get install postfix mailx
# For any modifications restart the server through init. 
sudo /etc/init.d/nagios restart


# NRPE CLINET INSTALLTION TO MONITOR THE CLIENT SERVER
sudo apt-get install nagios-nrpe-server nagios-plugins

# Default location for nrpe config file 

/etc/nagios/nrpe.cfg --- Where you can configure the commands to execute over Nagios server 

# plugins directory for nrpe cleint 
/usr/lib/nagios/plugins/ -- The location nrpe plugins are stored

## NRPE.CFG -- Allow the host and make dont balme to 1 so that we can run command line executions

allowed_hosts= "NAGIOS SERVER IP ADDRESS"
dont_blame_nrpe=1

# RESTART THE NRPE SERVER THROUGH INIT

/etc/init.d/nagios-nrpe-server start 

We are monitoring the PING, SSH, LOAD, PROCESSES, DOCKER CONTAINER STATUS, CONTAINER MEMORY AND UPTIME, BANDWIDTH RX/TX, DISC SPACE UTILIZATION. 
