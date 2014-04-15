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

                var show = entry.children('td').first().children('a').first().children('img').first().attr('title').replace('Show Description about ', '');

                console.log('Show: '+ show);
            });
        }
    })

};

exports.getShowListing	=	function(showName) {

};

exports.getAllShows	=	function() {

};

/*************************
**	Objects		**
**************************/

function Listing() {
};
