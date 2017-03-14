# RMD-Letter web

Node v6.10.0

## Setup

### MongoDB

macOS

```
brew install mongodb
```

### Redis

macOS

```
brew install redis
```

### nodemon

```
npm install nodemon -g
```

### npm packages

```
npm install
```

## Start Server

### MongoDB

```
sudo mongod
```

### Redis

```
redis-server
```

### Web Server

```
npm start
```

## DNSAgent - for windows

### Download
https://github.com/stackia/DNSAgent/releases/latest

### Configuration

#### options.cfg:

```
{
    "HideOnStart": false,
    "ListenOn": "127.0.0.1:3000, [::1]",  //port 3000
    "DefaultNameServer": "119.29.29.29",
    "UseHttpQuery": false,
    "QueryTimeout": 4000,
    "CompressionMutation": false,
    "CacheResponse": true,
    "CacheAge": 86400,
    "NetworkWhitelist": null
}
```

#### rules.cfg:
convert your rules : https://stackia.github.io/masq2agent/ 

```
[
    {
        "Pattern": "^(.*\\.)?localhost$",
        "Address": "127.0.0.1"
    }
]
```
