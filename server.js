
const express = require('express');
const app = express();

var expressWs = require('express-ws')(app);

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'));

var dominoServer = {
	rooms: [],
	start: (i, j) => {

		console.log(">> dominoServer - start...");		
		dominoServer.rooms[i] = {};
	},
	update: (i, j) => {

		console.log(">> dominoServer - update with...");
		console.log(j);

		Object.keys(j).forEach(function(key) {
			var val = j[key];
			// console.log(key + " =>"); 
			// console.log(val);

			if (key == "arrival") {

				console.log("new arrival");
			}

			if (key == "cards") {

				console.log(">> dominoServer - update cards...");
				console.log(val);
				countdownServer.rooms[i].state = val;
			}

			if (key == "move") {

				console.log(">> dominoServer - update move (" + val.id + ")");

				dominoServer.rooms[i].state[val.id].x = val.x;
				dominoServer.rooms[i].state[val.id].y = val.y;
			}
		});
	},
	handle: (i, j) => {
		if (!dominoServer.rooms[i]) {
			console.log("starting dominoes room " + i)
			dominoServer.start(i, j);
		}

		dominoServer.update(i, j);

		return JSON.stringify(dominoServer.rooms[i]);
	}
};

var countdownServer = {
	rooms: [],
	start: (i, j) => {

		console.log(">> countdownServer - start...");
		countdownServer.rooms[i] = {};
	},
	update: (i, j) => {

		console.log(">> countdownServer - update with...");
		console.log(j);

		Object.keys(j).forEach(function(key) {
			var val = j[key];
			// console.log(key + " =>"); 
			// console.log(val);

			if (key == "arrival") {

				console.log("new arrival");
			}

			if (key == "cards") {

				console.log(">> countdownServer - update cards...");
				console.log(val);
				countdownServer.rooms[i].cards = val;
			}

			if (key == "target") {

				console.log(">> countdownServer - update target");
				countdownServer.rooms[i].target = val;
			}

			if (key == "move") {

				console.log(">> countdownServer - update move (" + val.id + ")");

				if (!countdownServer.rooms[i].cards[val.id]) {

					console.log(">> countdownServer - this card had to be added to the store");
					console.log(val);

					countdownServer.rooms[i].cards[val.id] = {
						"id": val.id,
						"n": val.n
					}
				}

				countdownServer.rooms[i].cards[val.id].x = val.x;
				countdownServer.rooms[i].cards[val.id].y = val.y;
			}
		});
	},
	handle: (i, j) => {
		if (!countdownServer.rooms[i]) {

			console.log(">> starting countdown room " + i)
			countdownServer.start(i);
		}

		countdownServer.update(i, j);

		return JSON.stringify(countdownServer.rooms[i]);
	}  		
};

var nscapeServer = {
	rooms: [],
	start: (i, j) => {

		console.log(">> nscapeServer - start...");
		nscapeServer.rooms[i] = {};
	},
	update: (i, j) => {

		console.log(">> nscapeServer - update with...");
		console.log(j);

		Object.keys(j).forEach(function(key) {
			var val = j[key];
			// console.log(key + " =>"); 
			// console.log(val);

			if (key == "arrival") {

				console.log("new arrival");
			}

			// if (key == "cards") {

			// 	console.log(">> countdownServer - update cards...");
			// 	console.log(val);
			// 	countdownServer.rooms[i].cards = val;
			// }

			// if (key == "target") {

			// 	console.log(">> countdownServer - update target");
			// 	countdownServer.rooms[i].target = val;
			// }

			// if (key == "move") {

			// 	console.log(">> countdownServer - update move (" + val.id + ")");

			// 	if (!countdownServer.rooms[i].cards[val.id]) {

			// 		console.log(">> countdownServer - this card had to be added to the store");
			// 		console.log(val);

			// 		countdownServer.rooms[i].cards[val.id] = {
			// 			"id": val.id,
			// 			"n": val.n
			// 		}
			// 	}

			// 	countdownServer.rooms[i].cards[val.id].x = val.x;
			// 	countdownServer.rooms[i].cards[val.id].y = val.y;
			// }
		});
	},
	handle: (i, j) => {
		if (!nserveServer.rooms[i]) {

			console.log(">> starting nserve room " + i)
			nserveServer.start(i);
		}

		nserveServer.update(i, j);

		return JSON.stringify(nserveServer.rooms[i]);
	}
};

var cuisenaireServer = {
	rooms: [],
	start: (i, j) => {

		console.log(">> cuisenaireServer - start...");
		cuisenaireServer.rooms[i] = {};
	},
	update: (i, j) => {

		console.log(">> cuisenaireServer - update with...");
		console.log(j);

		Object.keys(j).forEach(function(key) {
			var val = j[key];
			// console.log(key + " =>"); 
			// console.log(val);

			if (key == "arrival") {

				console.log("new arrival");
			}
		});
	},
	handle: (i, j) => {
		if (!nserveServer.rooms[i]) {

			console.log(">> starting nserve room " + i)
			nserveServer.start(i);
		}

		nserveServer.update(i, j);

		return JSON.stringify(nserveServer.rooms[i]);
	}
};

app.listen(8080, function() {
  console.log('listening on 8080')
});




// app.ws('/echo', function(ws, req) {

//   ws.on('message', function(msg) {
//   	console.log("MESSAGE");
//     ws.send(msg);
//   });
// });

// var players = [{
// 	colour: "#bae",
// 	number: 3,
// 	left: 50,
// 	top: 50
// }, {
// 	colour: "pink",
// 	number: 2,
// 	left: 150,
// 	top: 50
// }, {
// 	colour: "yellow",
// 	number: 1,
// 	left: 250,
// 	top: 50
// }];

var cs = {};
cs.clients = [];
cs.state = [];
//cs.rooms = [];

app.ws('/cuisenaire', function(ws, req) {

  console.log("ws");

//  console.log(req);

  //console.log(ws.getWss().clients);

  ws.on('message', function(msg) {

  	var m = JSON.parse(msg);

  	if (m.request == "setup") {

	  console.log("SETUP request");

	  // we assume the player is not trolling by requesting a second identify after loading once
//	  var newPlayer = players.pop();

	  var clientID = cs.clients.length + 1;

	  if (clientID == 0) {
	    cs.clients.push("{ 'role': 'leader' }");
	  } else {
	    cs.clients.push("{ 'role': 'watcher' }");
	  }

	  // clients[newPlayer.number] = newPlayer;

	  console.log("ID = " + clientID);

	  var json = {}
	  json.msgtype = "setup";
	  json.ID = clientID;
	  ws.send(JSON.stringify(json));
  	}

  	if (m.request == "state") {

	  console.log("STATE REQUEST from " + m.ID);
	  // console.log(m);

	  var json = {}
	  json.msgtype = "state";

  	  json.state = cs.state;
  	  json.problem = cs.problem;

	  json.ID = m.ID;

	  console.log(JSON.stringify(json));

	  ws.send(JSON.stringify(json));
  	}

  	if (m.notify == "state") {

  	  // console.log("STATE NOTIFY from " + m.ID);
  	  // console.log(m);

	  if (m.ID == 1) {

		console.log("STATE NOTIFY from #1 - recording state");

	  	console.log(JSON.stringify(m.data.rods));

	  	cs.state = m.data.rods;
	  	cs.problem = m.data.problem;
	  }

	  // We don't send anything back to the client in this case
  	}
  });
});

app.post('/nserve', (req, res) => {

  	// var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  	// console.log("address might be " + ip);

  	var g = req.body.g;
  	var i = req.body.i;
  	var j = req.body;

  	if (g == undefined) {  		
		res.send("no game specified (use g parameter)")
		return;
  	}

  	if (i == undefined) {  		
		res.send("no room specified (use i parameter)")
		return;
  	}

  	if (j == undefined) {  		
		res.send("no json provided (use j parameter)")
		return;
  	}

	if (g == "dominoes") {
		res.send(dominoServer.handle(i, j));
	}
	else
	if (g == "countdown") {
		res.send(countdownServer.handle(i, j));
	}
	else
	if (g == "nscape") {
		res.send(nscape.handle(i, j));
	}
	else
	if (g == "cuisenaire") {

		console.log("received request for cuisenaire server");
		res.send(cuisenaireServer.handle(i, j));
	}
	else {
		res.send("no handler found for this game")
	}
})
