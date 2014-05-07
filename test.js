var eztv = require('./eztv_api');

var episodes = eztv.getAllEpisodes({id: 53, slug: 'the-colbert-report/'}, function(err, data) {
    if(err) return console.error(err);
    console.log(data);
})