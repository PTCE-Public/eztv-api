eztv = require("./eztv_api");

eztv.getAllShows(function(err, res) {
	if(err) console.error(err);
	else {
		console.log(res);
	}
});

eztv.getEpisodeMagnet({show: "Castle (2009)", season: 5, episode: 2}, function(err, res) {
	if(err) console.error(err);
	else {
		console.log(res);
	}
});
