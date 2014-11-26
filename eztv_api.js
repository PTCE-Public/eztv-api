/*************************
**  Modules     **
**************************/

var request		=   require('superagent');
var cheerio		=   require('cheerio');
var moment      =   require('moment');
var Q			=	require('q');

/*************************
**  Variables   **
**************************/

var BASE_URL	=	"https://eztv.it";
var SHOWLIST	=	"/showlist/";
var LATEST		=   "/sort/100/";
var SEARCH		=	"/search/";
var SHOWS		= 	"/shows/";

var mappings = require('./mappings');

var EZTV = function(){};

EZTV.prototype.showMap = mappings;

EZTV.prototype.getShowList =   function() {
	var defer = Q.defer();
	request(BASE_URL + SHOWLIST, function(res){

		if(!res.ok) {
			return defer.reject(res.text);
		}


		var $ = cheerio.load(res.text);
		var title, show;
		var allShows = [];

		$('.thread_link').each(function(){
			var entry = $(this);
			var show = entry.text();
			if(show) {
				var id = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[1];
				var slug = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[2];
				slug = slug in mappings ? mappings[slug]: slug;
				allShows.push({show: show, id: id, slug: slug});
			}
		});

		return defer.resolve(allShows);
	});

	return defer.promise;
}

EZTV.prototype.getEpisodes = function(data, cb) {
	var defer = Q.defer();
	var episodes = {};

	request(BASE_URL + SHOWS + data.id + '/'+ data.slug +'/', function (res) {
		if(!res.ok) return defer.reject(res.text);

		var $ = cheerio.load(res.text);

		var show_rows = $('tr.forum_header_border[name="hover"]').filter(function() {
			episode_rows = $(this).children('.forum_thread_post');
			if(episode_rows.length > 0) {
				return true;
			}
			return false;
		});

		if(show_rows.length === 0) return defer.reject('Show Not Found: '+ data.slug);

		show_rows.each(function() {
			var entry = $(this);
			
			var info = parseRow(entry);

			if(!episodes[info.season]) episodes[info.season] = {};
			if(!episodes[info.season][info.episode]) episodes[info.season][info.episode] = {};
			if(!episodes[info.season][info.episode][info.quality] || info.repack)
				episodes[info.season][info.episode][info.quality] = info.torrent;
			episodes.dateBased = info.dateBased;
			});
		defer.resolve(episodes);
	});
	return defer.promise;
}

EZTV.prototype.latest = function() {
	var defer = Q.defer();
	var episodes = [];
	request(BASE_URL + LATEST, function(res) {
		if(!res.ok) {
			return defer.reject(res.text);
		}

		var $ = cheerio.load(res.text);

		var show_rows = $('tr.forum_header_border[name="hover"]').filter(function() {
			episode_rows = $(this).children('.forum_thread_post');
			if(episode_rows.length > 0) {
				return true;
			}
			return false;
		});

		show_rows.each(function() {
			var entry = $(this);
			
			var info = parseRow(entry);

			if(info != null) {
				episodes.push(info);
			}
		});

		defer.resolve(episodes);
	})

	return defer.promise;
}

var parseRow = function(entry) {
	var result = {};

	var season = -1;
	var episode = -1;
	var dateBased = false;
	var repack = false;

	var show = entry.children('td').eq(0).children('a').eq(0).children('img').eq(0).attr('title').replace('Show Description about ', '');

	var title = entry.children('td').eq(1).text().replace('x264', '').replace('x265', ''); // temp fix
	var magnet = entry.children('td').eq(2).children('a').first().attr('href');
	var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
	var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
	var torrent = null;
	if(matcher) {
		season = parseInt(matcher[1], 10);
		episode = parseInt(matcher[2], 10);
		torrent = {};
		torrent.url = magnet;
		torrent.seeds = 0;
		torrent.peers = 0;
	}
	else {
		matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
		quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
		if(matcher) {
			season = matcher[1]; // Season : 2014
			episode = matcher[2].replace(" ", "/"); //Episode : 04/06
			torrent = {};
			torrent.url = magnet;
			torrent.seeds = 0;
			torrent.peers = 0;
			dateBased = true;
		}
	}

	result.season = season;
	result.episode = episode;
	result.quality = quality;
	result.torrent = torrent;
	result.dateBased = dateBased;
	result.show = show;
	result.repack = title.toLowerCase().indexOf('repack') > -1;

	return torrent == null ? null : result;
}

module.exports = new EZTV();
