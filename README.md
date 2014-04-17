EZTV API
========
Web scraper for EZTV.it

Currently supports 2 methods

`getAllShows(cb)` Returns a string list of all TV Shows on eztv.it/showlist/.

`getEpisodeMagnet(data, cb)` Data is a JSON object in the format `{show: 'Community', season: 5, episode: 12}`. Returns the magnet link as a string.

`cb` is the callback function passed to the methods and will be of the form `function cb(error, result)`
