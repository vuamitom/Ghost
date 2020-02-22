## Build release

Package deploy file:

```
grunt release
```

Copy output file to server

```
scp .dist/Ghost-3.0.6.zip root@<sever_ip>:/home/ghost-mgr
```

## Update ghost instance


First unzip file to the designated location

```
sudo -i -u ghost-mgr
cd /var/www/ghost/versions
mkdir 3.6.0
cp ~/Ghost-3.0.6.zip ./3.6.0
cd 3.6.0 
unzip Ghost-3.0.6.zip
```

Install dependencies 

```
# inside /var/www/ghost/versions/3.6.0
npm install
```

Run update
```
cd /var/www/ghost
ghost update 3.6.0
```


