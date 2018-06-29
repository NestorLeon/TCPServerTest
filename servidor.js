module.exports = function(host, puerto){

	var net = require('net');

	var x = 0;
	var y = 0;
	var z = 0;

	let clientes = [];

	var server = net.createServer();
	server.listen(puerto, host);

	// --------------------------
	// 		SOCKET CONNECTION
	// --------------------------
	server.on('connection', function(sock) {
	    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

	    clientes.push(sock);

	    sock.on('error', function(err){
			console.log("Error (Socket Connection): "+err.message);

			var index = clientes.indexOf(sock);
			if (index > -1) {
			  clientes.splice(index, 1);
			}
		});

		sock.on('close', function(){
			console.log('DISCONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

		    var index = clientes.indexOf(sock);
			if (index > -1) {
			  clientes.splice(index, 1);
			}
		});

	}).listen(puerto, host);

	// --------------------------
	// 		Send to Everyone
	// --------------------------
	setInterval(function() {
		var json = "{";
        json += "\"HipCenter\": { \"x\": " + x + " ,\"y\": " + y + ", \"z\": " + z + "},";
        json += "\"FootRight\": { \"x\": " + x + " ,\"y\": " + y + ", \"z\": " + z + "}";
        json += "}";

        clientes.forEach(function(cliente) {
        	try{
        		cliente.write(json);
        	}
        	catch(err){
        		console.log("Error (Send): "+err.message); 		
        	}
        });

        //console.log('x: ' + x);

        x += 10;
        y += 10;
        z += 10;

        if(x == 1000){
        	x = 0;
        	y = 0;
        	z = 0;
        }

	}, 5000 );

	//console.log('Server listening on ' + server.address().address +':'+ server.address().port);

};

/*
class Servidor{

	var net = require('net');
	
	crear(){
		server.listen(this.puerto, this.host);
	}

	server.on('connection', function(sock) {
	    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
	sock.write("TCP sending message : 1");
	    console.log('Server listening on ' + server.address().address +':'+ 
	        server.address().port);
	}).listen(this.puerto, this.host);

}
*/