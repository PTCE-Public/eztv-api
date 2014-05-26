var eztv = require('./eztv_api');

var episodes = eztv.getAllEpisodes({id: 36, slug: 'breaking-bad'}, function(err, data) {
    if(err) return console.error(err);
    console.log(data);
})