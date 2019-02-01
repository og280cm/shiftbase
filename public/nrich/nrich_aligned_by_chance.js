var nrich = {

	settings: {},
	rect: function(x, y, l, r, t, colour1, colour2) {

		var xoff1 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI));
		var xoff2 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (0.5 * Math.PI));
		var xoff3 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.0 * Math.PI));
		var xoff4 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.5 * Math.PI));

		var yoff1 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI));
		var yoff2 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (0.5 * Math.PI));
		var yoff3 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.0 * Math.PI));
		var yoff4 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.5 * Math.PI));

		var gradx = x + (Math.random() * (xoff3 - xoff1));
		var grady = y + (Math.random() * (yoff3 - yoff1));

		var grd = ctx.createRadialGradient(gradx, grady, 1, gradx, grady, l);

		grd.addColorStop(0, colour1);
		grd.addColorStop(0.2, colour1);
		grd.addColorStop(1, colour2);
		ctx.fillStyle=grd;
		ctx.strokeStyle="rgba(40,40,40,1)";

		ctx.beginPath();
		ctx.moveTo(x + xoff1, y + yoff1);
		ctx.lineTo(x + xoff2, y + yoff2);
		ctx.lineTo(x + xoff3, y + yoff3);
		ctx.lineTo(x + xoff4, y + yoff4);
		ctx.lineTo(x + xoff1, y + yoff1);
		ctx.closePath();

		ctx.fill();
		ctx.stroke();
	},
	splash: function() {

		console.log("NRICH ident for " + time);

		canvas = document.getElementById('nrich-canvas');
		ctx = canvas.getContext('2d');
		cw = window.innerWidth;
		ch = window.innerHeight;
		canvas.width = cw;
		canvas.height = ch;

		var time = 60;
		var t = 0;

		nrich.settings.turningspeed = 0.312;
		nrich.settings.spiralsparcity = 0.1482;
		nrich.settings.spiralbasicspace = 2.62;
		nrich.settings.spiralbasicscale = 0.0096;
		nrich.settings.spiralspacerate = 1.12;
		nrich.settings.spiralscalerate = 2.38;

		nrich.settings.backgroundcolour = '#222';

// orange
		// nrich.settings.squarecolour1 = '#f05e23';
		// nrich.settings.squarecolour2 = '#f3a228';
		// nrich.settings.squarebordercolour1 = '#000';
		// nrich.settings.squarebordercolour2 = '#000';

		var timer = setInterval(function() {

			if (t <= 40) {

				ctx.fillStyle = nrich.settings.backgroundcolour;
		    	ctx.fillRect(0, 0, cw, ch);

				var i = 0; 

				var ox = (cw * 0.4);
				var oy = (ch * 0.44);

				console.log("t = " + t);

				while (i < t) {

					i += 1;

					var i1 = Math.pow(i, nrich.settings.spiralspacerate);
					var i2 = Math.pow(i, nrich.settings.spiralscalerate);

					var slide = Math.pow(i / t, 2);

					// slide            - makes sure the squares keep slide back toward the origin
					// spiralbasicspace - linear spacing rate from the center
					// i1               - r to the power of spiralspacerate, for some exponential spacing
					// (5 + i)          - just rotating the spiral a bit, to position the inner bit
					// spiralsparcity   - controls how far apart the squares are
					// Math.PI          - what kind of spiral would this be without our friend pi

					var xbearing = Math.sin((5 + i) * nrich.settings.spiralsparcity * Math.PI);
					var x = (slide * nrich.settings.spiralbasicspace * i1) * xbearing;

					var ybearing = Math.cos((5 + i) * nrich.settings.spiralsparcity * Math.PI);
					var y = (slide * nrich.settings.spiralbasicspace * i1) * ybearing;

					var xpos = ox + x - (i * nrich.settings.spiralbasicscale);
					var ypos = oy + y - (i * nrich.settings.spiralbasicscale);

					// choosing the colours is a bit of a schlep because I want a radial gradient within each square,
					// with a slightly random element to it, but I also want a linear gradient across the whole spiral.

					// the lowlight colour is the same in each bit, but the highlight can be lerped from cyan to 
					// lilac depending on the current angle

					// this is almost cyan
//					nrich.settings.squarecolour1 = '#91cef8';
					// this is a bit of a lilac
//					nrich.settings.squarecolour1 = '#c6a4fc';

					// This is a nice deep lavender
					nrich.settings.squarecolour2 = '#8182bc';

						// this will be in the range 0 to 1
						var colourwave = 0.5 + (0.25 * (ybearing - xbearing));
						//console.log(colourwave);

						// 
						var r = 198 + Math.floor((145 - 198) * colourwave);
						var g = 164 + Math.floor((183 - 164) * colourwave);
						var b = 252 + Math.floor((248 - 252) * colourwave);

						nrich.settings.squarecolour1 = '#' + r.toString(16) + g.toString(16) + b.toString(16);
						//console.log(nrich.settings.squarecolour1);

					// nrich.rect(xpos, ypos, (3 + (i2 * nrich.settings.spiralbasicscale)), i, t, nrich.settings.squarebordercolour1, nrich.settings.squarebordercolour2);
					nrich.rect(xpos, ypos, (1 + (i2 * nrich.settings.spiralbasicscale)), i, t, nrich.settings.squarecolour1, nrich.settings.squarecolour2);
				}

				ctx.fillStyle = '#fff';
				ctx.font = "70px Arial";
				ctx.fillText("NRICH", ox + 94, oy + 42);

				ctx.fillStyle = '#fff';
				ctx.font = "24px Verdana";
				ctx.fillText("@nrichmaths", ox + 94, oy + 78);
			}

			t++;

			if (t > time) {
				$("#nrich").hide();
				clearTimeout(timer);
			}
		}, 100);
	},
	permittedSettings: function(settings) {

		console.log("[permittedSettings] settings");
		console.log(settings);

		$(".nrich-settings-apply").click(function() {

			$("#nmenu").removeClass("expanded");

			$(".nrich-setting").remove();

			$(".nrich-settings-header").animate({
				"top": "0px"
			}, 1);

			$(".nrich-settings-full-screen").animate({
				"top": "0px"
			}, 1);

			$(".nrich-settings-header").addClass("hidden");
			$(".nrich-settings-apply").addClass("hidden");
			$(".nrich-settings-full-screen").addClass("hidden");

			console.log("applying these settings");
			console.log(settings.current);

			var urlString = settings.url + "?";
			var settingCount = 0;

			$.each(settings.current, function(i, s) {
				urlString += "" + i + "=" + s;

				console.log("i = " + i + " length = " + Object.keys(settings.current).length);

				if (settingCount < Object.keys(settings.current).length-1) {
					urlString += "&";
				}

				settingCount++;
			});

			console.log(urlString);
			window.location.replace(urlString);

			settings.apply(settings.current);
		});

		$(".nrich-settings-full-screen").click(function() {

			console.log("settings.url");
			console.log(settings.url);

			var urlString = settings.url + "?";
			var settingCount = 0;

			$.each(settings.current, function(i, s) {
				urlString += "" + i + "=" + s;

				console.log("i = " + i + " length = " + Object.keys(settings.current).length);

				if (settingCount < Object.keys(settings.current).length-1) {
					urlString += "&";
				}

				settingCount++;
			});

			window.open(urlString);
		});

		$("#nsettings").click(function() {

			if( $("#nmenu").is(':animated') ) {
				return;
			}

			if ($("#nmenu").is(".expanded")) {

				console.log("remove expanded");
				$("#nmenu").removeClass("expanded");

				$("#nmenu").animate({
					"top": "-556px"
				}, 2400);

			    $({deg: 0}).animate({deg: 360}, {
			        duration: 2400,
			        step: function(now) {
			            $("#nsettings").css({
			                transform: 'rotate(' + now + 'deg)'
			            });
			        }
			    });

			} else {
				console.log("add expanded");
				$("#nmenu").addClass("expanded");

				if ($("#nmenu").is(".prepared")) {
				} else {
					$("#nmenu").addClass("prepared");

					$.each(settings.options, function(i, s) {

						console.log(s);

						var settingHtml = "<div class='nrich-setting'><div class='nrich-setting-name'>" + i + "</div>";

						$.each(s, function(j, o) {

							console.log("settings for " + i + " are currently " + settings.current[i]);
							if (settings.current[i] == o) {

								settingHtml += "<div class='nrich-setting-option active'>" + o + "</div>";
							} else {

								settingHtml += "<div class='nrich-setting-option'>" + o + "</div>";
							}
						})

						settingHtml += "</div>"

						$("#nmenu").append(settingHtml);
					});

					$(".nrich-setting").each(function(i, s) {

						$(this).css("top", 144 + (64 * i) + "px");

						var settingName = $(this).find(".nrich-setting-name").html();
						var settingOptions = $(this).find(".nrich-setting-option");

						$(settingOptions).click(function() {
							console.log("settingName: " + settingName);
							console.log("clicked " + $(this).html());

							$(settingOptions).removeClass("active");
							$(this).addClass("active");
							settings.current[settingName] = $(this).html();
							console.log(settings.current);

							// $(".nrich-settings-apply").removeClass("hidden");
						    $(".nrich-settings-apply").fadeIn(1800);
						})
					});
				}

				$("#nmenu").animate({top: 0}, 2400);

			    $({deg: 0}).animate({deg: 360}, {
			        duration: 2400,
			        step: function(now) {
			            $("#nsettings").css({
			                transform: 'rotate(' + -now + 'deg)'
			            });
			        }
			    });
			}
		});
	}
}
