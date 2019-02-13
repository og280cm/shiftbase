
var nscape = {}


nscape.newGame = function() {

    nscape.cards = {};

    // nscape.player = $("<div class='player'></div>");
    // $("#room").empty().append(nscape.player);

    var currentHostname = window.location.hostname;

    console.log("trying to connect to : " + currentHostname);

    var socketAddress = "ws://" + currentHostname + "/nscape";

    nscape.ws = new WebSocket(socketAddress);

//    nscape.ws = new WebSocket('ws://localhost:8080/nscape');

    nscape.ws.onerror = function(event) {
        console.log("onerror");
    }

    nscape.ws.onopen = function(event) {
        console.log("onopen");

        nscape.ws.send('{"request": "setup"}');
    }

    var roomContents = "<div id='room1-pad-left-1'></div> <div id='room1-pad-left-2'></div> <div id='room1-pad-left-3'></div> <div id='room1-pad-left-4'></div> <div id='room1-pad-left-5'></div>" + 
                       "<div id='room1-pad-right-1'></div><div id='room1-pad-right-2'></div><div id='room1-pad-right-3'></div><div id='room1-pad-right-4'></div><div id='room1-pad-right-5'></div>" + 
                       "<div id='room1-output'>00000000</div><div id='room1-exit'></div>";

    $("#room").addClass("room1");

    $("#room").empty().append(roomContents);

    nscape.sameplace = function(player, item) {

        if (Math.abs($(player).css("left") - $(item).css("left")) < 10) {

            console.log("yes sameplace");
        }
    }

    nscape.ws.onmessage = function(event) {
        console.log("onmessage");

        console.log(event.data);

        var e = JSON.parse(event.data);

        console.log(e.type);

        if (e.type == "setup") {

            nscape.connected = true;
            nscape.clientID = e.ID.number;

//            nscape.player = $(".player." + nscape.clientID);

            console.log(e.ID);
            // $(nscape.player).addClass(e.ID.number);
            // $(nscape.player).css("background-color", e.ID.colour);
            // $(nscape.player).css("left", e.ID.left);
            // $(nscape.player).css("top", e.ID.top);
            // $(nscape.player).empty().append(e.ID.number);
        }

        if (e.type == "state") {

            $("#room").empty().append(roomContents);

            console.log(e);

            $.each(e.players, function(i, p) {

                console.log(p);

                var number = p.number;

                console.log("player id " + number);

                if ($(".player." + number).length == 0) {

                    $("#room").append("<div class='player " + number + "'>" + number + "</div>");
                }

                var cl = $(".player." + number).css("left");
                var ct = $(".player." + number).css("top");

                $(".player." + number).css("background-color", p.colour);

                if (Math.abs(cl - p.left) + Math.abs(ct - p.top) > 16) {

                    $(".player." + number).css("left", p.left);
                    $(".player." + number).css("top", p.top);
                }

                if (nscape.sameplace(".player.1", "#room1-pad-left-1")) {

                    console.log("p1 padleft1 sameplace");
                }
            });
        }
    }

    nscape.moveleft = function() {
        $(".player." + nscape.clientID).css("left", parseInt($(".player." + nscape.clientID).css("left")) - 4);
    }

    nscape.moveup = function() {
        $(".player." + nscape.clientID).css("top", parseInt($(".player." + nscape.clientID).css("top")) - 4);
    }

    nscape.moveright = function() {
        $(".player." + nscape.clientID).css("left", parseInt($(".player." + nscape.clientID).css("left")) + 4);
    }

    nscape.movedown = function() {
        $(".player." + nscape.clientID).css("top", parseInt($(".player." + nscape.clientID).css("top")) + 4);
    }

    $("#touch-left").click(function(e) {
        nscape.moveleft();
    });

    $("#touch-up").click(function(e) {
        nscape.moveup();
    });

    $("#touch-right").click(function(e) {
        nscape.moveright();
    });

    $("#touch-down").click(function(e) {
        nscape.movedown();
    });

    $(document).bind('keydown', function(e) {

        var code = e.keyCode || e.which;

        console.log(code);

        if (code == 37) { 
            nscape.moveleft();
        }

        if (code == 38) { 
            nscape.moveup();
        }

        if (code == 39) { 
            nscape.moveright();
        }

        if (code == 40) { 
            nscape.movedown();
        }
    });

    setInterval(function() {

        if (nscape.connected) {

            var d = {};
            d.ID = nscape.clientID;
            d.left = parseInt($(".player." + nscape.clientID).css("left"));
            d.top = parseInt($(".player." + nscape.clientID).css("top"));

            console.log("client:");
            console.log(d);

            nscape.ws.send('{"notify": "position", "data": ' + JSON.stringify(d) + '}');
            nscape.ws.send('{"request": "state"}');
        }
    }, 1000);    

    //nscape.syncState();

    // console.log("> POST (arrival)");
    // $.post( "http://127.0.0.1:3000/nserve", { 
    //     "g": "countdown",
    //     "i": 1,
    //     "status": "arrival"
    // }, function( data ) {

    //     // console.log("> server response:");
    //     // console.log(data);

    //     var d = JSON.parse(data);
    //     $( "#server-state" ).empty().append( JSON.stringify(d, undefined, 2) );

    //     countdown.createFromState(d);
    // });



//     setInterval(function() {

// //        console.log("timer: syncState");
//         countdown.syncState();
//     }, 5000);    

//     $("#quickstart").click(function() {

//         $("#quickstart").remove();

//         //console.log($(".card.picked").length);

//         while ($(".card.picked").length < 6) {

//             var random = Math.floor(Math.random() * 24);
//             $(".card").eq(random).click();
//         }
//     });

}


// nscape.sendState = function() {

//     if (!countdown.target) {
//         console.log("no point sending server state without a target of my own");
//         return;
//     }

//     $(".number").each(function(i, n) {

//         // console.log(".number being scraped for server communication");
//         // console.log(i);
//         // console.log(n);

//         // console.log("id: " + $(this).attr("i"));

//         countdown.cards[$(this).attr("i")] = {

//             "id": $(this).attr("i"),
//             "n": $(this).attr("n"),
//             "x": $(this).css("left"),
//             "y": $(this).css("top")
//         }
//     });

//     // console.log("what am I sending to the server?");
//     // console.log(countdown.cards);

//     //console.log("> POST (sendState)");
//     $.post( "http://127.0.0.1:3000/nserve", { 
//         "g": "countdown",
//         "i": 1,
//         "target": countdown.target,
//         "cards": countdown.cards

//     }, function( data ) {

//         // console.log("> server response:");
//         // console.log(data);

//         var d = JSON.parse(data);
//         $( "#server-state" ).empty().append( JSON.stringify(d, undefined, 2) );
//     });
// }


// nscape.syncState = function() {

// //    console.log("> POST (syncState)");
//     $.post( "http://127.0.0.1:3000/nserve", { 
//         "g": "countdown",
//         "i": 1,
//     }, function( data ) {

//         // console.log("> server response:");
//         // console.log(data);

//         var d = JSON.parse(data);
//         $( "#server-state" ).empty().append( JSON.stringify(d, undefined, 2) );

//         countdown.createFromState(d);
//     });
// }

// nscape.createFromState = function(state) {

//     // console.log("create from state:");
//     // console.log(state);

//     // a really basic way of sanitising the server state
//     if (state.target && state.cards) {

//         countdown.target = state.target;

//         $("#quickstart").addClass("hidden");
//         $("#play-button").addClass("hidden");
//         $("#container").append("<div id='solve-button'>Show a solution</div>");

//         $("#target-number").empty().append(countdown.target);

//         $("#tableau").animate({
//             top: 564
//         });

//         $("#instructions").empty().append("Rearrange the cards to make the number!");

//         $("#instructions").animate({
//             top: 524
//         });

//         $(".card").off("click");

//         $.each(state.cards, function(i, s) {

//             // console.log("number");
//             // console.log(i);
//             // console.log(s);

//             if ($(".number[i=" + i + "]").length == 0) {

//                 if (s.n) {

//                     $("#container").append("<div class='number flipped' n='" + s.n + "' i='" + i + "'>" + s.n + "</div>");
//                 } else {

//                     $("#container").append("<div class='number flipped' i='" + i + "'>?</div>");
//                 }
//             } else {

//             }

//             // console.log("please, move to x: " + s.x);
//             // console.log("please, move to y: " + s.y);

//             $(".number[i=" + i + "]").css("left", s.x);
//             $(".number[i=" + i + "]").css("top", s.y);

//             if (s.n) {

//                 $(".number[i=" + i + "]").css("width", 64);
//                 $(".number[i=" + i + "]").css("height", 86);
//                 $(".number[i=" + i + "]").css("padding-top", 42);
//             } else {

//                 $(".number[i=" + i + "]").css("width", 60);
//                 $(".number[i=" + i + "]").css("height", 56);
//             }
//         });
//     }
// }

nscape.init = function(settings) {

    nscape.settings = settings;

    console.log("[init] calling newGame");
    console.log(nscape.settings);

    nscape.newGame();
}
