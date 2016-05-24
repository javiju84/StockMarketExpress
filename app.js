var express = require ("express");
var mongoose = require ("mongoose");
var request = require ("request");
var app = express();
var aData = null;


mongoose.connect("mongodb://localhost/Santander");
var db = mongoose.connection;
var Document = null;
db.on("error", console.error.bind(console,"Connection error:"));
db.once('open',function(callback){

	var SAN_schema = mongoose.Schema({
	fecha: String,
	abierto: Number,
	alto: Number,
	bajo: Number,
	cierre: Number,
	volumen:Number,
	});
	Document = mongoose.model('Document', SAN_schema);

	var urlSantander = "https://www.quandl.com/api/v3/datasets/YAHOO/MC_SAN.json?api_key=HGoTu3E3A_Lsv6biw1kc";
	request({
		url: urlSantander,
		json: true
	}, function (error, response, body){

		if (!error && response.statusCode == 200){
		var parseo = body.dataset.data;
		//console.log(parseo)
		var jsonString=[];
		for(var i = 0 ; i < parseo.length; i++){
			var jsonDato={};
			
				jsonDato.fecha = String(parseo[i][0]);
				jsonDato.abierto = parseFloat(parseo[i][1]);
				jsonDato.alto = parseFloat(parseo[i][2]);
				jsonDato.bajo = parseFloat(parseo[i][3]);
				jsonDato.cierre = parseFloat(parseo[i][4]);
				jsonDato.volumen = parseFloat(parseo[i][5]);
				jsonString.push(jsonDato);
			}

		
			var jsonArrayValor = JSON.parse(JSON.stringify(jsonString));
			//si count === 0
			var aDocs = jsonArrayValor;
			
			Document.count({},function(error,count){

			/*if (count === 0){
				for (var n = 0; n < aDocs.length; n++){
				var docToAdd = new Document(aDocs[n]);
				docToAdd.save(function(error,docToAdd){
					if (error) return console.error(error)
				});
			}
			}*/
			if (count === 0){
				for (var n = aDocs.length-1; n >=0 ; n--){
				var docToAdd = new Document(aDocs[n]);
				docToAdd.save(function(error,docToAdd){
					if (error) return console.error(error)
				});
			}
			}
			else{

				for (var n = 0; n < 1; n++){
				//var docToAdd = new Document(aDocs[aDocs.length-1]);
				var docToAdd = new Document(aDocs[n]);
				docToAdd.save(function(error,docToAdd)
				{
					if (error) return console.error(error)
				});
			}
			}

			});
			/* http://stackoverflow.com/questions/12590267/how-to-properly-save-array-of-objects-with-mongoose-nodejs

			for (var n = 0; n < aDocs.length; n++){
				(function(aDocs_now){
					Document.findOne({fecha:aDocs_now},
						function(err,doc){
							if(!err && !doc){
								var docToAdd = new DocToAdd();
								docToAdd.fecha = aDocs_now;
								console.log(docToAdd.fecha);
								docToAdd.save(function(err){});
							}else if(!err){
								console.log("Fecha esta en el sistema");
							}else{
								console.log("ERROR: "+err);
							}

						});
				})(aDocs[n]);
			}
			*/

			/*	if (count = 0){
				for (var n = 0; n < aDocs.length; n++){
				var docToAdd = new Document(aDocs[n]);
				docToAdd.save(function(error,docToAdd){
					if (error) return console.error(error)
				});
			}
			}
			else{
				for (var n = 1; n < aDocs.length-1; n++){
				var docToAdd = new Document(aDocs[n-1]);
				docToAdd.save(function(error,docToAdd)
				{
					//if (error) return console.error(error)
				});
			}
			}
			*/
			
			//else
			//añado el último elemento docToAdd = new Document(aDocs[aDocs.length-1])
		}
	});
});
app.use(express.static('./'));

app.get('/', function (req, res) {
  res.sendFile('./index.html', {root: './'});
});

// Send all records when there's a GET request to `localhost:3000/test`
app.get('/Santander', function (req, res) {
	Document.find(function(err, records){
		aData = records;
		res.send(aData);
	});
});

app.listen(7070);
console.log("Servidor conectado puerto 7070");