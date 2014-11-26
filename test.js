var eztv = require('./eztv_api');

eztv.getShowList().then(function(data){
	console.log(data);
}).catch(function(err) {
	console.log('Error: '+ err);
});

eztv.getEpisodes({id: 36, slug: 'breaking-bad'}).then(function(data){
	console.log(data);
}).catch(function(err) {
	console.log('Error: '+ err);
});

eztv.latest().then(function(data){
	console.log(data);
}).catch(function(err) {
	console.log('Error: '+ err);
});