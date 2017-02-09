# bamusic
Repo for the bamusic.in . A streaming service based completely on youtube api and data. Depends on youtube-dl for converting videos to mp3

bamusic depends on two other packages **[youtube-dl](https://rg3.github.io/youtube-dl/download.html)** and **[ffmpeg](https://ffmpeg.org/)** . This is used for downloading and converting videos to mp3.


# Setting up
```
$ git clone https://github.com/kingbalan/bamusic.git
$ cd bamusic
$ npm install
```
Before running ensure you have ```youtube-dl``` and ```ffmpeg```
```
$ sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
$ sudo chmod a+rx /usr/local/bin/youtube-d
```

After this start the project by 

```
node app.js
```

The server should be running on ```port 3000```
