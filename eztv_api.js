/*************************
**  Modules     **
**************************/

var request =   require('request');
var cheerio =   require('cheerio');
var moment  =   require('moment');

/*************************
**  Variables   **
**************************/

var BASE_URL    =   "http://eztv.it";
var SHOWLIST    =   "/showlist/";
var LATEST  =   "/sort/100/";
var SEARCH  =   "/search/";
var SHOWS   =   "/shows/";

var eztv_map = [];
eztv_map['louie'] = 'louie-2010';
eztv_map['battlestar-galactica'] = 'battlestar-galactica-2003';
eztv_map['the-killing'] = 'the-killing-us';
eztv_map['hawaii-five-0-2010'] = 'hawaii-fiveo-2010';
eztv_map['the-goldbergs'] = 'the-goldbergs-2013';
eztv_map['vikings-us'] = 'vikings';

exports.getAllShows =   function(cb) {
    if(cb == null) return;
        request(BASE_URL + SHOWLIST, function(err, res, html){

        if(err) return (err, null);

        var $ = cheerio.load(html);
        var title, show;
        var allShows = [];

        $('.thread_link').each(function(){
            var entry = $(this);
            var show = entry.text();
            var id = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[1];
            var slug = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[2];
            slug = slug in eztv_map ? eztv_map[slug]: slug;
            allShows.push({show: show, id: id, slug: slug});
        });

        return cb(null, allShows);
        });
}

exports.getAllEpisodes = function(data, cb) {
    if(cb == null) return;
    var episodes = {};

    request.get(BASE_URL + SHOWS + data.id + "/"+ data.slug +"/", function (err, res, html) {
        if(err) return cb(err, null);

        var $ = cheerio.load(html);

        var show_rows = $('tr.forum_header_border[name="hover"]').filter(function() {
            episode_rows = $(this).children('.forum_thread_post');
            if(episode_rows.length > 0) {
                var title = $(this).children('td').eq(1).text();

                if(title.indexOf("-CTU") > -1)
                    return false;
                else
                    return true;
                
            }
            return false;
        });

        if(show_rows.length === 0) return cb("Show Not Found", null);

        show_rows.each(function() {
            var entry = $(this);
            var title = entry.children('td').eq(1).text().replace('x264', ''); // temp fix
            var magnet = entry.children('td').eq(2).children('a').first().attr('href');
            var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
            var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "420p";
            if(matcher) {
                var season = parseInt(matcher[1], 10);
                var episode = parseInt(matcher[2], 10);
                var torrent = {};
                torrent.url = magnet;
                torrent.seeds = 0;
                torrent.peers = 0;
                if(!episodes[season]) episodes[season] = {};
                if(!episodes[season][episode]) episodes[season][episode] = {};
                if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
                	episodes[season][episode][quality] = torrent;
                episodes.dateBased = false;
            }
            else {
                matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "420p";
                if(matcher) {
                    var season = matcher[1]; // Season : 2014
                    var episode = matcher[2].replace(" ", "/"); //Episode : 04/06
                    var torrent = {};
                    torrent.url = magnet;
                    torrent.seeds = 0;
                    torrent.peers = 0;
                    if(!episodes[season]) episodes[season] = {};
	                if(!episodes[season][episode]) episodes[season][episode] = {};
	                if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
	                	episodes[season][episode][quality] = torrent;
                    episodes.dateBased = true;
                }
            }
        });
        return cb(null, episodes);
    });
}
