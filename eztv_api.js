/*************************
**	Modules		**
**************************/

var request	=	require('request');
var cheerio	=	require('cheerio');

/*************************
**	Variables	**
**************************/

var BASE_URL	=	"http://eztv.it";
var SHOWLIST	=	"/showlist/";
var LATEST	=	"/sort/100/";
var SEARCH	=	"/search/";

/*************************
**	Methods		**
**************************/
exports.getLatestShows	=	function() {
    request(BASE_URL + LATEST, function(error, response, html){

        if(!error){

            var $ = cheerio.load(html);

            var title, show;

            $('tr.forum_header_border[name="hover"]').filter(function(){
                var entry = $(this);

                var show = entry.children('td').first()
				.children('a').first()
				.children('img').first()
				.attr('title').replace('Show Description about ', '');

		var tvrage_id = entry.children('td').first()
				.children('a').last()
				.attr('href').replace(/http:\/\/www.tvrage.com\/(.*)\/episodes\//, '');

		console.log('TVRage ID: ' + tvrage_id);
                console.log('Show: '+ show);
            });
        }
    })

};

exports.getShowListing	=	function(showName) {

};

exports.getAllShows	=	function() {

};

exports.getEpisodeMagnet	=	function(show, season, episode) {
	if(season.toString().length==1) season = "0"+season;

	if(episode.toString().length==1) episode = "0"+episode;

	var searchString = show +"+S"+ season + "E" + episode;

	request.post(BASE_URL + SEARCH, {form: {SearchString1: searchString}}, function (err, res, html) {
		if(!err){

		    var $ = cheerio.load(html);

		    var show_rows = $('tr.forum_header_border[name="hover"]').filter(function(){
		        var entry = $(this);
			return entry.find('img[title="Show Description about '+ show+'"]').length > 0;
		    });

		    var episode_row = show_rows.filter(function() {

			var entry = $(this);
			return entry.text().indexOf("S"+season+"E"+episode) !== -1;
		    });

		    var magnet_link = episode_row.children('td[align="center"]').children('a').first().attr('href');
		    console.log(magnet_link);
        	}
	});
};

/*************************
**	Objects		**
**************************/

function Listing() {
};
