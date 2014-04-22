EZTV API
========
Web scraper for EZTV.it

Currently supports 2 methods

`getAllShows(cb)` Returns an object array of all TV Shows on eztv.it/showlist/ in the form `{show: showname, id: eztvId, slug: eztv-slug}`

`getEpisodeMagnet(data, cb)` Data is a JSON object in the format `{show: 'Community', season: 5, episode: 12}`. Returns the magnet link as a string.

`getAllEpisodes(data, cb)` Data is JSON object same as one returned in `getAllShows` returns multi-dimensional array with magnet URL string in the form `episodes[season][episode]`

`cb` is the callback function passed to the methods and will be of the form `function cb(error, result)`
