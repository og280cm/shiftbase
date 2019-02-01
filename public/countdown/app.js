
var countdown = {}

countdown.newGame = function() {

    countdown.cards = {};

    var bignumbers = countdown.shuffle([100, 75, 50, 25]);
    var smallnumbers = countdown.shuffle([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]);

    $("#row-1").empty();
    $("#row-2").empty();

    var opNames = {
        "+": "add",
        "x": "times",
        "-": "sub",
        "/": "div"
    }

    $.each([1,2,3], function(i, t) {
        $.each(["+", "x", "-", "/"], function(j, o) {

            var newCard = $("<div class='number flipped'>" + o + "</div>");

            $("#container").append(newCard);
            $(newCard).css("left", 198 + (j * 80));
            $(newCard).css("top", 564);

            $(newCard).attr("i", "" + opNames[o] + i);
        });
    });

    $("#play-button").addClass("hidden");

    $.each(bignumbers, function(i, n) {

        var newCard = $("<div class='card big' n=" + n + "></div>");
        $("#row-1").append(newCard);

        $(newCard).css("left", -238);

        setTimeout(function() {

            x = (30 * i);
            $(newCard).animate({
                "left": x,
                "top": 0,
                "duration": 1200
            });
        }, 1000);
    });

    $.each(smallnumbers, function(i, n) {

        var newCard = $("<div class='card small' n=" + n + "></div>");
        $("#row-2").append(newCard);

        $(newCard).css("left", 0);
        $(newCard).css("top", -78);

        setTimeout(function() {

            x = (30 * i);
            $(newCard).animate({
                "left": x,
                "top": 0,
                "duration": 1200
            });
        }, 1000);
    });

    // WOW!

    countdown.syncState();

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

    $(".card").click(function() {

        if (Object.keys(countdown.cards).length >= 6) {
            return;
        }

        if ($(this).is(".picked")) {
            return;
        }

        $(this).addClass("picked");

        var o = $(this).offset();
        var x = o.left;
        var y = o.top;

        console.log("clicked " + o);

        if (countdown.cards.length == 5) {

            var total = (parseInt(countdown.cards[0]) + parseInt(countdown.cards[1]) + parseInt(countdown.cards[2]) + parseInt(countdown.cards[3]) + parseInt(countdown.cards[4]));

            if (total < 12) {

                // dangerously low set of numbers, don't allow another low one!

                if ($(this).attr("n") < 5) {

                    //console.log("rather than providing " + $(this).attr("n"));
                    $(this).attr("n", 6 + Math.floor(Math.random() * 3));
                    //console.log("we instead provide " + $(this).attr("n"));
                }
            }
        }

        var coolID = "n"+Object.keys(countdown.cards).length;

        countdown.cards[coolID] = {
            "id": coolID,
            "n": $(this).attr("n")
        };

        var newCard = $("<div class='number' n=" + $(this).attr("n") + "></div>");

        $("#container").append(newCard);

        $(newCard).css("left", x);
        $(newCard).css("top", y - 42);

        $(newCard).attr("i", coolID);

        $(newCard).animate({
            "left": 44 + (78 * Object.keys(countdown.cards).length),
            "top": 194,
            "width": 64,
            "height": 86,
            "padding-top": 42,
            "duration": 2000
        },
        function() {
            $(newCard).addClass("flipped");
            $(newCard).empty().append($(newCard).attr("n"));

            if (Object.keys(countdown.cards).length >= 6) {

                $("#instructions").empty().append("Press play to generate a number");
                $("#quickstart").addClass("hidden");
                $("#play-button").removeClass("hidden");
            }
        });
    });

    $("#play-button").click(function() {

        $("#play-button").remove();

        var repeats = 0;

        var timer = setInterval(function() {

            var x = Math.floor(Math.random() * 899) + 100;
            $("#target-number").empty().append(x);

            repeats++;

            if (repeats > 20) {

                clearTimeout(timer);

                x = countdown.generateTargetNumber()
                countdown.target = x;

                $("#target-number").empty().append(x);

                $("#container").append("<div id='solve-button'>Show a solution</div>");
                $("#instructions").empty().append("Rearrange the cards to make the number!");

                $("#instructions").animate({
                    top: 524
                });

                $("#tableau").animate({
                    top: 564
                });

                $.each([1,2,3], function(i, t) {

                    $.each(["+", "x", "-", "/"], function(j, o) {

                        $(".number[i=" + opNames[o] + i + "]").animate({
                            "top": 404 - (i * 20),
                            "width": 60,
                            "height": 56
                        });
                    });
                });

                $(".number").draggable({

                    snap: ".number",
                    snapMode: "outer",
                    drag: function() {

                        if ($(this).attr("n")) {
                            //console.log("a number is dragging");
                        } else {

                            //console.log("an operator is dragging");
                            countdown.checkOperatorSnaps(this);
                        }

                        countdown.sendState();
                    },
                    stop: function() {

                        if ($(this).attr("n")) {
                            console.log("a number has finished dragging");
                        } else {

                            console.log("an operator has finished dragging");
                        }

                        countdown.sendState();
                    }
                });

                // Give the operators a bit of time to get into place, then update the server
                setTimeout(function() {

                    countdown.sendState();
                }, 1000);

                $("#solve-button").click(function() {

                    $("#solve-button").remove();
                    $("#instructions").remove();

                    $("#container").append("<div id='solution'>" + countdown.solution.replace(/\*/g, "x") + "</div>");
                });
            }
        }, 80);
    });

    setInterval(function() {

//        console.log("timer: syncState");
        countdown.syncState();
    }, 5000);    

    $("#quickstart").click(function() {

        $("#quickstart").remove();

        //console.log($(".card.picked").length);

        while ($(".card.picked").length < 6) {

            var random = Math.floor(Math.random() * 24);
            $(".card").eq(random).click();
        }
    });

}

countdown.shuffle = function(array) {
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

countdown.generateTargetNumber = function() {

    var a = countdown.cards;

    var formulae = [
        "a * (b * (c + d))",
        "a * (b * (c - d))",
        "((a + b) * (c + d)) * e",
        "((a + b) * (c + d)) + e",
        "((a + b) * (c + d)) - e",
        "((a + b) * (c - d)) + e",
        "((a + b) * (c - d)) - e",
        "((a + b) * (c + d)) - (e * f)",
        "((a + b) * (c + d)) * (e + f)",
        "(a * b * c) + (d * e)",
        "(a * b * c) - (d * e)",
        "(a * b * c) + (d * e) + f",
        "(a * b * c) + (d * e) - f",
        "((a * b * c) + (d * e)) * f",
        "(a + b + c) * (d + e + f)",
        "(a + b + c + d) * (e + f)",
        "(a + b + c + d + e) * f",
    ]

    var symbols = [
        ["a", "b", "c", "d", "e", "f"],
        ["b", "c", "d", "e", "f", "a"],
        ["c", "d", "e", "f", "a", "b"],
        ["d", "e", "f", "a", "b", "c"],
        ["e", "f", "a", "b", "c", "d"],
        ["f", "a", "b", "c", "d", "e"],
    ]

    var options = [];

    $.each(formulae, function(i, f) {

        $.each(symbols, function(j, s) {

            var t = f;
            t = t.replace(s[0], a["n0"].n);
            t = t.replace(s[1], a["n1"].n);
            t = t.replace(s[2], a["n2"].n);
            t = t.replace(s[3], a["n3"].n);
            t = t.replace(s[4], a["n4"].n);
            t = t.replace(s[5], a["n5"].n);

            options.push({
                "formula": t,
                "result": eval(t)
            });
        });
    })

    //console.log(options);

    var validOptions = [];

    $.each(options, function(i, o) {

        if (o.result > 100 && o.result < 1000) {
            validOptions.push(o);
        }
    })

    console.log(validOptions);

    if (validOptions.length == 0) {

        console.log("there are no valid options");
        countdown.targetNumber = 101;
    } else {

        var i = Math.floor(Math.random() * validOptions.length);
        countdown.targetNumber = validOptions[i].result;
        countdown.solution = validOptions[i].formula;

        console.log("one solution is " + countdown.solution);
    }

    return countdown.targetNumber;
}

countdown.checkOperatorSnaps = function(opcard) {

    var x1 = parseInt($(opcard).css("left"));
    var y1 = parseInt($(opcard).css("top"));

    var x2 = x1 + parseInt($(opcard).css("width"));
    var y2 = y1 + parseInt($(opcard).css("height"));

    var x = (x1 + x2) / 2;
    var y = (y1 + y2) / 2;

    // console.log(x1);
    // console.log(x2);
    // console.log(y1);
    // console.log(y2);

    $(".number").each(function(i, c) {

        if ($(this).attr("n")) {
            // this is a possible operator/number collision, and therefore interesting

            console.log("possible collision");

            var nx = parseInt($(this).css("left"));
            var ny = parseInt($(this).css("top"));

            console.log(nx - x);

            if (Math.abs(nx - x) < 20) {

                $(this).addClass("activated");
            } else {

                $(this).removeClass("activated");
            }
        }
    })
}

countdown.sendState = function() {

    if (!countdown.target) {
        console.log("no point sending server state without a target of my own");
        return;
    }

    $(".number").each(function(i, n) {

        // console.log(".number being scraped for server communication");
        // console.log(i);
        // console.log(n);

        // console.log("id: " + $(this).attr("i"));

        countdown.cards[$(this).attr("i")] = {

            "id": $(this).attr("i"),
            "n": $(this).attr("n"),
            "x": $(this).css("left"),
            "y": $(this).css("top")
        }
    });

    // console.log("what am I sending to the server?");
    // console.log(countdown.cards);

    //console.log("> POST (sendState)");
    $.post( "http://127.0.0.1:3000/nserve", { 
        "g": "countdown",
        "i": 1,
        "target": countdown.target,
        "cards": countdown.cards

    }, function( data ) {

        // console.log("> server response:");
        // console.log(data);

        var d = JSON.parse(data);
        $( "#server-state" ).empty().append( JSON.stringify(d, undefined, 2) );
    });
}


countdown.syncState = function() {

//    console.log("> POST (syncState)");
    $.post( "http://127.0.0.1:3000/nserve", { 
        "g": "countdown",
        "i": 1,
    }, function( data ) {

        // console.log("> server response:");
        // console.log(data);

        var d = JSON.parse(data);
        $( "#server-state" ).empty().append( JSON.stringify(d, undefined, 2) );

        countdown.createFromState(d);
    });
}

countdown.createFromState = function(state) {

    // console.log("create from state:");
    // console.log(state);

    // a really basic way of sanitising the server state
    if (state.target && state.cards) {

        countdown.target = state.target;

        $("#quickstart").addClass("hidden");
        $("#play-button").addClass("hidden");
        $("#container").append("<div id='solve-button'>Show a solution</div>");

        $("#target-number").empty().append(countdown.target);

        $("#tableau").animate({
            top: 564
        });

        $("#instructions").empty().append("Rearrange the cards to make the number!");

        $("#instructions").animate({
            top: 524
        });

        $(".card").off("click");

        $.each(state.cards, function(i, s) {

            // console.log("number");
            // console.log(i);
            // console.log(s);

            if ($(".number[i=" + i + "]").length == 0) {

                if (s.n) {

                    $("#container").append("<div class='number flipped' n='" + s.n + "' i='" + i + "'>" + s.n + "</div>");
                } else {

                    $("#container").append("<div class='number flipped' i='" + i + "'>?</div>");
                }
            } else {

            }

            // console.log("please, move to x: " + s.x);
            // console.log("please, move to y: " + s.y);

            $(".number[i=" + i + "]").css("left", s.x);
            $(".number[i=" + i + "]").css("top", s.y);

            if (s.n) {

                $(".number[i=" + i + "]").css("width", 64);
                $(".number[i=" + i + "]").css("height", 86);
                $(".number[i=" + i + "]").css("padding-top", 42);
            } else {

                $(".number[i=" + i + "]").css("width", 60);
                $(".number[i=" + i + "]").css("height", 56);
            }
        });
    }
}

countdown.init = function(settings) {

    countdown.settings = settings;

    console.log("[init] calling newGame");
    console.log(countdown.settings);

    countdown.newGame();
}
