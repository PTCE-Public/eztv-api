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
            var allShows = {};

            $('.thread_link').each(function(){

                var thisShow = {};
                var entry = $(this);
                var showUrl = entry.first().attr('href');
                var slug = showUrl.match(/\/shows\/(.*)\/(.*)\//)[2];
                console.log('Show: '+ showUrl);

                request(BASE_URL + showUrl, function(error, response, html){

                    var $$ = cheerio.load(html);
                    $$('tr.forum_header_border').each(function(){

                        var showStructure = {};
                        var episode_elements = $$(this);
                        // title
                        var title = episode_elements.children().eq(1).children().attr('title');
                        var seasonFound = title.match(/S([0-9]+)E([0-9]+)/);

                        var saison = seasonFound[1];
                        var episode = seasonFound[2];
                        if (!thisShow[saison]) thisShow[saison] = {};
                        thisShow[saison][episode] = "http://google.com";
                    });
                    
 

                });
                
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
                            console.log(data);

                            // ok we need torrents
                            

                        } else {

                            // TODO: Do something with not found tv shows on trakt...
                            // Perhaps we can check with imdb
                        }
                    }
                });

                   console.log(thisShow);
                    process.exit(1);

            });
        }
    })
};

/*************************
**	Objects		**
**************************/

function Listing() {
};
