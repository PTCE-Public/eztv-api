/*************************
**	Modules		**
**************************/

var request	=	require('request');
var cheerio	=	require('cheerio');
var URI = require('URIjs');


/*************************
**	Variables	**
**************************/

var BASE_URL	=	"http://eztv.it";
var SHOWLIST	=	"/showlist/";
var LATEST	=	"/sort/100/";
var SEARCH	=	"/search/";

var TRAK_API_ENDPOINT = URI('http://api.trakt.tv/');
var TRAK_API_KEY = '7b7b93f7f00f8e4b488dcb3c5baa81e1619bb074';


exports.getAllShows	=	function() {
    request(BASE_URL + SHOWLIST, function(error, response, html){

        if(!error){

            var $ = cheerio.load(html);
            var title, show;
            var allShows = [];

            $('.thread_link').each(function(){

                var entry = $(this);
                var thisShow = {};
                var showUrl = entry.first().attr('href');
                var slug = showUrl.match(/\/shows\/(.*)\/(.*)\//)[2];
                console.log('Show: '+ slug);

                // ok we have our show, we'll trakt it
                // http://api.trakt.tv/show/summary.json/apikey/the-walking-dead
                var uri = TRAK_API_ENDPOINT.clone()
                    .segment([
                        'show',
                        'summaries.json',
                        TRAK_API_KEY,
                        slug,
                        'full'
                    ]);



                request({url: uri.toString(), json: true}, function(error, response, data) {


                    if(error || !data) {
                        //console.log(error);
                    } else {
                        // ok we have a tv shows found so we can import it
                        if (data.status != 'failure') {
                            
                            var imdb = Math.floor((Math.random()*100)+1);
                            //var imdb = response.imdb;
                            //console.log(data.imdb_id);

                            // ok we extract all torrents file
                            request(BASE_URL + showUrl, function(error, response, html){

                                var $$ = cheerio.load(html);
                                $$('tr.forum_header_border').each(function(){

                                    var showStructure = {};
                                    var showDetails = [];
                                    var episode_elements = $$(this);
                                    // title
                                    var title = episode_elements.children().eq(1).children().attr('title');

                                    if (title) {
                                        var seasonFound = title.match(/S([0-9]+)E([0-9]+)/);

                                        if (seasonFound && seasonFound.length > 1) {
                                            var saison = seasonFound[1];
                                            var episode = seasonFound[2];
                                            if (!thisShow[saison]) thisShow[saison] = {};
                                            thisShow[saison][episode] = "http://google.com";

                                            //console.log(data);
                                            showDetails[imdb] = {
                                                eztv : data,
                                                files : thisShow
                                            };

                                            allShows.push(thisShow);
                                        }
                                    }

                                });
                            });

    
                        } else {

                            // TODO: Do something with not found tv shows on trakt...
                            // Perhaps we can check with another source
                        }
                    }
                });
            });

            console.log(allShows);

        }
    });
}

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
