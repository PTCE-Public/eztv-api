EZTV API
========
Web scraper for EZTV.it

Currently supports 3 methods

`getShowList()` Returns an object array of all TV Shows on eztv.it/showlist/ in the form `{show: showname, id: eztvId, slug: eztv-slug}`

`getEpisodes(data)` Data is JSON object same as one returned in `getAllShows` returns multi-dimensional array with magnet URL string in the form `episodes[season][episode]`

`latest()` Returns an object array of all TV Shows on eztv.it/sort/100 in the form 
```
{
	show: 'Breaking Bad',
	season: 4,
	episode: 10,
    quality: '720p',
    torrent: 
     { url: 'magnet:?xt=urn:btih:GKUWY3Y3UPOYW2FJZUWE2GQ4KAPFJI5Y&dn=Breaking.Bad.S04E10.HDTV.x264-2HD&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.istole.it:80&tr=udp://open.demonii.com:80&tr=udp://tracker.coppersurfer.tk:80',
       seeds: 0,
       peers: 0 },
    dateBased: false,
    repack: false }
```

