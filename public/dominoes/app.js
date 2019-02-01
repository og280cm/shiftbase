
var dominoes = {}

dominoes.newGame = function() {

    dominoes.state = [];
    dominoes.bag = [];

    $([0,1,2,3,4,5,6]).each(function(i, a) {
        $([0,1,2,3,4,5,6]).each(function(j, b) {

            dominoes.state.push({
                "i": "" + a + b,
                "a": a,
                "b": b,
                "r": 0,
                "x": 62 + (i * 96),
                "y": 24 + (j * 42)
            })
        });
    });

    // WOW!

    dominoes.syncState();

    $("#play-container").empty();
    $("#play-container").append("<canvas id='canvas' width='702' height='458'></canvas>");

    var canvas = $("#canvas")[0]
    dominoes.ctx = canvas.getContext('2d');
    canvas.height = canvas.width * (canvas.clientWidth / canvas.clientHeight);

    dominoes.draw();

//     setInterval(function() {

// //        console.log("timer: syncState");
//         countdown.syncState();
//     }, 5000);


    $("#canvas").mousedown(function(e) {

        var mouseX = parseInt(e.offsetX);
        var mouseY = parseInt(e.offsetY);

        console.log(mouseX);
        console.log(mouseY);

        dominoes.mouseaction = undefined;

        var candidates = [];

        $(dominoes.state).each(function(i, d) {

            d.selected = false;

            var xdiff = Math.abs(d.x - mouseX);
            var ydiff = Math.abs(d.y - mouseY);

            candidates.push({
                domino: d,
                sqrDistance: (xdiff * xdiff) + (ydiff * ydiff)
            })
        });

        if (candidates.length > 0) {

            candidates.sort(function(a, b) {
                return a.sqrDistance - b.sqrDistance;
            });

            console.log(candidates);

            candidates[0].domino.selected = true;

            dominoes.mouseaction = {
                domino: candidates[0].domino,
                offsetX: candidates[0].domino.x - mouseX,
                offsetY: candidates[0].domino.y - mouseY
            }

            dominoes.selection = candidates[0].domino;
        }

        dominoes.draw();
    });

    $("#canvas").mousemove(function(e) {

        if (dominoes.mouseaction) {

            var mouseX = parseInt(e.offsetX);
            var mouseY = parseInt(e.offsetY);

            dominoes.mouseaction.domino.x = mouseX + dominoes.mouseaction.offsetX;
            dominoes.mouseaction.domino.y = mouseY + dominoes.mouseaction.offsetY;

            dominoes.draw();            
        }
    });

    $("#canvas").mouseup(function(e) {

        var mouseX = parseInt(e.offsetX);
        var mouseY = parseInt(e.offsetY);

        // console.log(mouseX);
        // console.log(mouseY);

        dominoes.mouseaction = undefined;

        dominoes.draw();
    });

    $("#scoop-button").click(function() {

        dominoes.bag = dominoes.shuffle(dominoes.state);
        dominoes.state = [];

        dominoes.draw();
    });    


    $("#deal-button").click(function() {

        if (dominoes.bag.length > 0) {

            var d = dominoes.bag.pop();
            dominoes.state.push(d);
        }

        dominoes.draw();
    });   
}

dominoes.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

dominoes.draw = function() {

    dominoes.ctx.fillStyle = "#ffffee";
    dominoes.ctx.fillRect(0, 0, 702, 458);

    $(dominoes.state).each(function(i, d) {

        // console.log(i);
        // console.log(d);

        var x = d.x;
        var y = d.y;

        if (d.r) {

            // translate context to center of canvas
            dominoes.ctx.translate(d.x, d.y);

            // rotate 45 degrees clockwise
            dominoes.ctx.rotate(d.r);

            x = 0;
            y = 0;
        }

        dominoes.ctx.beginPath();
        dominoes.ctx.fillStyle = "#23212d";

            if (d.r == 0) {

                var dw = 76;
                var dh = 38;

                dominoes.ctx.moveTo(x - (dw / 2), y - (dh / 2));

                dominoes.ctx.lineTo(x + (dw / 2), y - (dh / 2));
                dominoes.ctx.lineTo(x + (dw / 2), y + (dh / 2));
                dominoes.ctx.lineTo(x - (dw / 2), y + (dh / 2));
                dominoes.ctx.lineTo(x - (dw / 2), y - (dh / 2));
            }

        dominoes.ctx.fill();

        dominoes.ctx.beginPath();
        dominoes.ctx.fillStyle = "#666";

            if (d.r == 0) {

                var mw = 4;
                var mh = 36;

                dominoes.ctx.moveTo(x - (mw / 2), y - (mh / 2));

                dominoes.ctx.lineTo(x + (mw / 2), y - (mh / 2));
                dominoes.ctx.lineTo(x + (mw / 2), y + (mh / 2));
                dominoes.ctx.lineTo(x - (mw / 2), y + (mh / 2));
                dominoes.ctx.lineTo(x - (mw / 2), y - (mh / 2));
            }

        dominoes.ctx.fill();

        // console.log(d.a);
        // console.log(d.b);

        dominoes.drawSpots(dominoes.ctx, x - (dw / 4), y, d.a);
        dominoes.drawSpots(dominoes.ctx, x + (dw / 4), y, d.b);

        if (d.r) {

            // rotate 45 degrees clockwise
            dominoes.ctx.rotate(-d.r);

            // translate context to center of canvas
            dominoes.ctx.translate(-d.x, -d.y);
        }
    });
}


dominoes.drawSpots = function(ctx, x, y, n) {

    if (n == 1) {

        //console.log("drawing 1 spot");
        ctx.fillStyle = "#fff";

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (n == 2) {

        //console.log("drawing 2 spots");
        ctx.fillStyle = "#e44";

        ctx.beginPath();
        ctx.arc(x - 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (n == 3) {

        //console.log("drawing 3 spots");
        ctx.fillStyle = "#dd5";

        ctx.beginPath();
        ctx.arc(x - 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (n == 4) {

        //console.log("drawing 4 spots");
        ctx.fillStyle = "#6d6";

        ctx.beginPath();
        ctx.arc(x - 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (n == 5) {

        //console.log("drawing 5 spots");
        ctx.fillStyle = "#6df";

        ctx.beginPath();
        ctx.arc(x - 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    }

    if (n == 6) {

        //console.log("drawing 6 spots");
        ctx.fillStyle = "#e4d";

        ctx.beginPath();
        ctx.arc(x - 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y - 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x + 10, y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();
    }
}

dominoes.sendState = function() {

    $(".domino").each(function(i, n) {

        dominoes.state[$(this).attr("i")] = {

            "id": $(this).attr("i"),
            "n": $(this).attr("n"),
            "x": $(this).css("left"),
            "y": $(this).css("top")
        }
    });

    //console.log("> POST (sendState)");
    $.post( "http://127.0.0.1:3000/nserve", { 
        "g": "dominoes",
        "i": 1,
        "state": dominoes.state

    }, function( data ) {

        // console.log("> server response:");
        // console.log(data);

        var d = JSON.parse(data);
        $( "#server-state" ).empty().append( JSON.stringify(d, undefined, 2) );
    });
}


dominoes.syncState = function() {

//    console.log("> POST (syncState)");
    $.post( "http://127.0.0.1:3000/nserve", { 
        "g": "dominoes",
        "i": 1,
    }, function( data ) {

        // console.log("> server response:");
        // console.log(data);

        var d = JSON.parse(data);
        $( "#server-state" ).empty().append( JSON.stringify(d, undefined, 2) );

        dominoes.createFromState(d);
    });
}

dominoes.createFromState = function(state) {

}

dominoes.init = function(settings) {

    dominoes.settings = settings;

    console.log("[init] calling newGame");
    console.log(dominoes.settings);

    dominoes.newGame();
}
