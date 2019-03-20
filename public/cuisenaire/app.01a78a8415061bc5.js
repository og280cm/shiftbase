
var cuisenaire = {};

cuisenaire.problems = [
    {
        "title": "Sealed solution",
        "description": "These five bars can be represented by 10 different cuisenaire rods in pairs. How can this be achieved?",
        "prepopulated": [
            {
                x: 80, 
                y: 160,
                l: 9
            },
            {
                x: 80, 
                y: 220,
                l: 10
            },
            {
                x: 80, 
                y: 280,
                l: 15
            },
            {
                x: 80, 
                y: 340,
                l: 16
            },
            {
                x: 80, 
                y: 400,
                l: 5
            }
        ]
    },
    {
        "title": "Bananas",
        "description": "Sue has 8 bananas. Harold has 5 bananas. How many bananas are there in total?",
    },
    {
        "title": "Toy sharing",
        "description": "Jim has twice as many toys as Peter. He gives 7 of them to Peter. Now Peter has twice as many toys. How many does Jim have now?",
    },
    {
        "title": "Eggs in baskets",
        "description": "There are three baskets, holding ten eggs. The Brown basket has one more egg in it than the Red basket. The Red basket has three fewer eggs than the Pink basket. How many are in each?",
    },
    {
        "title": "Marbles",
        "description": "Sam has 5 times as many marbles as Tom. If Sam gives 26 marbles to Tom, the two friends will have exactly the same amount. How many marbles do they have altogether?",
    },
    // {
    //     "description": "Mary has 9 grapes. She share them with two friends, and they each eat 2. How many grapes are left in total?"
    // }
];

cuisenaire.templates = [
{
    "template": "%person-a has %number-1 %object-plural. %person-b has %number-2 %object-plural. How many %object-plural are there in total?"
}
];

cuisenaire.people = [
    "Sue", "Harold", "Sam", "Neil", "Peter", "Jenny"
];

cuisenaire.setupProblem = function(r) {

    $(".nrich-settings-title").empty().append("Cuisenaire - " + cuisenaire.problems[r].title);
    $("#problem").empty().append(cuisenaire.problems[r].description);

    var prepop = cuisenaire.problems[r].prepopulated;

    if (prepop) {

        $.each(prepop, function(i, p) {

            var prebar = $("<div class='bar'></div>");

            $("#container").append(prebar);

//            console.log(p);

            $(prebar).css("left", parseInt(p.x) - 44);
            $(prebar).css("top", parseInt(p.y) - 43);

            $(prebar).addClass("bar-n");

            $(prebar).css("width", p.l * 22);
        });
    }
};

cuisenaire.newGame = function(instant) {

    var currentHostname = window.location.hostname;
    console.log("trying to connect to : " + currentHostname);
    var socketAddress = "ws://" + currentHostname + "/cuisenaire";

    cuisenaire.ws = new WebSocket(socketAddress);
//    cuisenaire.ws = new WebSocket('ws://localhost:8080/cuisenaire');

    cuisenaire.ws.onerror = function(event) {
        console.log("onerror");
    };

    cuisenaire.ws.onopen = function(event) {
        console.log("onopen");
        console.log("sending request for setup");

        cuisenaire.ws.send('{"request": "setup"}');
    };

    cuisenaire.ws.onmessage = function(event) {
        console.log("onmessage");

        console.log(event.data);

        var e = JSON.parse(event.data);

        console.log(e.msgtype);
//        console.log(e.ID.number);

        if (e.msgtype == "setup") {

            console.log("SETUP message received");
            console.log(e);

            cuisenaire.connected = true;
            cuisenaire.clientID = e.ID;

            console.log("remembering my ID = " + e.ID);

//            cuisenaire.player = $(".player." + cuisenaire.clientID);

        }

        if (e.msgtype == "state") {

            console.log("STATE update");
            console.log(e);

            if (cuisenaire.clientID == 1) {
                console.log("ignore");
                return;
            }

            $(".bar").remove();

            cuisenaire.setupProblem(e.problem);

            $.each(e.state, function(i, b) {

                var newbar = $("<div class='bar'></div>");

                $("#container").append(newbar);

    //            console.log(p);

                console.log(b);

                $(newbar).css("left", parseInt(b.left));
                $(newbar).css("top", parseInt(b.top));

                $(newbar).addClass("bar-" + b.length);

//                $(newbar).css("width", b.l * 22);
                $(newbar).css("width", b.length * 22);
            });

//            $("#room").empty().append(roomContents);
//            console.log(e);

            // if (e.state) {

            // }
        }
    };

    // countdown.numbers = [];

    var r = Math.floor(Math.random() * cuisenaire.problems.length);

    cuisenaire.setupProblem(r);

    cuisenaire.problem = r;

    $(".create").click(function() {

        if (cuisenaire.clientID == undefined || cuisenaire.clientID == 1) {

            var l = $(this).offset().left;
            var t = $(this).offset().top;
            var b = $(this).attr("bar");

            console.log("creating a new bar");
            console.log("l: " + l);
            console.log("t: " + t);
            console.log("b: " + b);

            var newbar = $("<div class='bar'></div>");

            $("#container").append(newbar);

            $(newbar).css("left", parseInt(l) - 44);
            $(newbar).css("top", parseInt(t) - 43);

            $(newbar).addClass("bar-" + b);

            $(newbar).css("width", b * 22);

            $(newbar).draggable({}); 
        }
    });

    $("#restart-button").click(function() {

        $(".bar").remove();
    });

    $("#prev-problem").click(function() {

        console.log("prev problem");

        cuisenaire.problem--;

        if (cuisenaire.problem < 0) {
            cuisenaire.problem = cuisenaire.problems.length - 1;
        }

        console.log("problem: " + cuisenaire.problem);

        $(".bar").remove();
        cuisenaire.setupProblem(cuisenaire.problem);
    });

    $("#next-problem").click(function() {

        console.log("next problem");

        cuisenaire.problem++;

        if (cuisenaire.problem >= cuisenaire.problems.length) {
            cuisenaire.problem = 0;
        }

        console.log("problem: " + cuisenaire.problem);

        $(".bar").remove();
        cuisenaire.setupProblem(cuisenaire.problem);
    });

    setInterval(function() {

        if (cuisenaire.connected) {

            var state = {};
            state.problem = cuisenaire.problem;
            state.rods = [];

            $(".bar").each(function() {

                var bar = {};
                bar.left = $(this).css("left");
                bar.top = $(this).css("top");

                if ($(this).is(".bar-1")) {
                    bar.length = 1;
                }
                if ($(this).is(".bar-2")) {
                    bar.length = 2;
                }
                if ($(this).is(".bar-3")) {
                    bar.length = 3;
                }
                if ($(this).is(".bar-4")) {
                    bar.length = 4;
                }
                if ($(this).is(".bar-5")) {
                    bar.length = 5;
                }
                if ($(this).is(".bar-6")) {
                    bar.length = 6;
                }
                if ($(this).is(".bar-7")) {
                    bar.length = 7;
                }
                if ($(this).is(".bar-8")) {
                    bar.length = 8;
                }
                if ($(this).is(".bar-9")) {
                    bar.length = 9;
                }
                if ($(this).is(".bar-10")) {
                    bar.length = 10;
                }

                state.rods.push(bar);
            });

            console.log("client with ID (" + cuisenaire.clientID + ") sending:");
            console.log(state);

            cuisenaire.ws.send('{"notify": "state", "ID": ' + cuisenaire.clientID + ', "data": ' + JSON.stringify(state) + '}');
            cuisenaire.ws.send('{"request": "state", "ID": ' + cuisenaire.clientID + '}');
        }
    }, 1000);    

};

cuisenaire.init = function(settings) {

    cuisenaire.settings = settings;

    console.log("[init] calling newGame");
    console.log(cuisenaire.settings);

    cuisenaire.newGame(false);
};
