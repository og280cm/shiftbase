var nrich = {

	// This does two things - draw the ident on startup using canvas, and runs the options menu

	settings: {},

	colours: {
		// upper primary
		pinks: [[247, 162, 120], [255, 124, 196], [217, 89, 127]],
		// lower primary
		oranges: [[249, 204, 99], [226, 111, 145], [249, 137, 34]],
		// upper secondary
		blues: [[198, 164, 252], [125, 174, 255], [129, 130, 188]],
		// lower secondary
		greens: [[158, 164, 252], [111, 252, 228], [85, 224, 212]],

		options: ["pinks", "oranges", "blues", "greens"]
	},
	rect: function(x, y, l, r, t, colour1, colour2) {

		// This finds four points on a circle, pi/2 apart, in order to make a square.
		// There is a bit of rotation added based on the time that the thing has been running (-t * 0.5),
		//     which will affect all squares in the spiral simultaneously.
		// The rotation per square is r * turningspeed * pi/2

		var xoff1 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI));
		var xoff2 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (0.5 * Math.PI));
		var xoff3 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.0 * Math.PI));
		var xoff4 = l * Math.sin((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.5 * Math.PI));

		var yoff1 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI));
		var yoff2 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (0.5 * Math.PI));
		var yoff3 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.0 * Math.PI));
		var yoff4 = l * Math.cos((-t * 0.5) + (nrich.settings.turningspeed * r * 0.5 * Math.PI) + (1.5 * Math.PI));

		var gradx = x + xoff1 + (Math.random() * (xoff3 - xoff1));
		var grady = y + yoff1 + (Math.random() * (yoff3 - yoff1));

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
	splash: function(pallette, useClouds) {

		console.log("NRICH ident for " + time);

		canvas = document.getElementById('nrich-canvas');
		ctx = canvas.getContext('2d');
		cw = 700; // window.innerWidth;
		ch = 598; // window.innerHeight;
		canvas.width = cw;
		canvas.height = ch;

		var time = 60;
		var t = 0;

		var numClouds = 300;
		var clouds = [];

		if (useClouds) {

			var image1 = document.getElementById('cloud1');
			var image2 = document.getElementById('cloud2');
			var image3 = document.getElementById('cloud3');
			var image4 = document.getElementById('cloud4');

			for (var i = 0; i < numClouds; i++) {
				clouds.push({
					x: (Math.random() * 1280) - 570,
					y: (Math.random() * 240) + 60,
					r: (Math.random() * 40) + 100,
					vx: (Math.random() * 1.4) - 1.50,
					vy: (Math.random() * 0.54) + 0.08,
					vr: (Math.random() * 0.44) + 1.88,
					img: [image1, image2, image3, image4][Math.floor(Math.random() * 4)],
					o: ['#181818','#202020','#282828'][Math.floor(Math.random() * 3)],
				});
			}

			// for (var i = 0; i < 600; i++) {
			// 	clouds.push({
			// 		x: (Math.random() * 1280) - 570,
			// 		y: (Math.random() * 580) - 280,
			// 		r: (Math.random() * 40) + 100,
			// 		vx: (Math.random() * 0.64) - 0.32,
			// 		vy: (Math.random() * 3.44) + 0.44,
			// 		vr: (Math.random() * 0.44) + 1.88,
			// 		o: ['#b8b8b8','#c8c8c8','#e8e8e8'][Math.floor(Math.random() * 3)],
			// 		size: (Math.random() * 2.4) + 1.4
			// 	});
			// }
		}

		nrich.settings.turningspeed = 0.348;
		nrich.settings.spiralsparcity = 0.1662;
		nrich.settings.spiralbasicspace = 2.62;
		nrich.settings.spiralbasicscale = 0.0066;
		nrich.settings.spiralspacerate = 1.12;

		nrich.settings.backgroundcolour = '#222';

		if (pallette) {

			nrich.colourset = nrich.colours[pallette];
		} else {

			nrich.colourset = nrich.colours[nrich.colours.options[Math.floor(Math.random() * nrich.colours.options.length)]];
		}

		var timer = setInterval(function() {

			if (t <= 40) {

				ctx.fillStyle = nrich.settings.backgroundcolour;
		    	ctx.fillRect(0, 0, cw, ch);

				// Simply positioning the origin of the spiral relative to the viewport
				var ox = (cw * 0.4);
				var oy = (ch * 0.44);

				if (cw < 660) {
					console.log(cw);
					ox -= (0.44 * (660 - cw)) 
				}

				//console.log("t = " + t);

				if (useClouds) {

					for (var i = 0; i < numClouds; i++) {

						var c = clouds[i];
							ctx.beginPath();
							ctx.fillStyle = c.o;
							ctx.drawImage(c.img, 0, 0, 256, 256, ox + c.x, oy + c.y, c.r, c.r);
							ctx.fill();

						c.x += c.vx;
						c.y += c.vy;
						c.r += c.vr;
					}

					// for (var i = 0; i < numClouds; i++) {

					// 	var c = clouds[i];
					// 	ctx.beginPath();
					// 	ctx.fillStyle = c.o;
					// 	//ctx.drawImage(c.img, 0, 0, 256, 256, ox + c.x, oy + c.y, c.r, c.r);
					// 	//ctx.fill();
					// 	ctx.arc(ox + c.x, oy + c.y, c.size, 0, 2 * Math.PI);

					// 	ctx.fill();

					// 	c.x += c.vx;
					// 	c.y += c.vy;
					// 	c.r += c.vr;

					// 	c.vx += (Math.random() * 0.64) - 0.32;
					// }
				}

				var i = 0; 

				while (i < t) {

					i += 1;

					var i1 = Math.pow(i, nrich.settings.spiralspacerate);

					var slide = Math.pow(i / t, 2);

					var exponentialSizeComponent = Math.pow(1.1188, (i + 40));

					// slide            - makes sure the squares keep slide back toward the origin
					// spiralbasicspace - linear spacing rate from the center
					// i1               - r to the power of spiralspacerate, for some exponential spacing
					// (5 + i)          - just rotating the spiral a bit, to position the inner bit
					// spiralsparcity   - controls how far apart the squares are
					// Math.PI          - what kind of spiral would this be without our friend pi

					var spiralrot = 8.2;

					var xbearing = Math.sin((spiralrot + i) * nrich.settings.spiralsparcity * Math.PI);
					var x = (slide * nrich.settings.spiralbasicspace * i1) * xbearing;

					var ybearing = Math.cos((spiralrot + i) * nrich.settings.spiralsparcity * Math.PI);
					var y = (slide * nrich.settings.spiralbasicspace * i1) * ybearing;

					var xpos = ox + x - (i * nrich.settings.spiralbasicscale);
					var ypos = oy + y - (i * nrich.settings.spiralbasicscale);

					// choosing the colours is a bit of a schlep because I want a radial gradient within each square,
					// with a slightly random element to it, but I also want a linear gradient across the whole spiral.

					// the lowlight colour is the same in each bit, but the highlight can be lerped from cyan to 
					// lilac depending on the current angle

						// this will be in the range 0 to 1
						var colourwave = 0.5 + (0.25 * (ybearing - xbearing));

						var r = nrich.colourset[0][0] + Math.floor((nrich.colourset[1][0] - nrich.colourset[0][0]) * colourwave);
						var g = nrich.colourset[0][1] + Math.floor((nrich.colourset[1][1] - nrich.colourset[0][1]) * colourwave);
						var b = nrich.colourset[0][2] + Math.floor((nrich.colourset[1][2] - nrich.colourset[0][2]) * colourwave);

						// console.log(nrich.colourset[0]);
						// console.log(r);
						// console.log(g);
						// console.log(b);

						var squarecolour1 = '#' + r.toString(16) + g.toString(16) + b.toString(16);
						var squarecolour2 = '#' + nrich.colourset[2][0].toString(16) + nrich.colourset[2][1].toString(16) + nrich.colourset[2][2].toString(16);

						// console.log(squarecolour1);
						// console.log(squarecolour2);

					// nrich.rect(xpos, ypos, (3 + (i2 * nrich.settings.spiralbasicscale)), i, t, nrich.settings.squarebordercolour1, nrich.settings.squarebordercolour2);
					nrich.rect(xpos, ypos, (1 + (exponentialSizeComponent * nrich.settings.spiralbasicscale)), i, t, squarecolour1, squarecolour2);
				}

				ctx.fillStyle = '#fff';
				ctx.font = "74px Arial";
				ctx.fillText("NRICH", ox + 100, oy + 42);

				ctx.fillStyle = '#fff';
				ctx.font = "24px Verdana";
				ctx.fillText("@nrichmaths", ox + 100, oy + 82);
			}

			t++;

			if (t > time) {
				clearTimeout(timer);

				if ($("#nrich").length > 0) {
					
					console.log("applying settings due to time");
					$("#nrich").remove();
					nrich.prepareMenu();
					nrich.settings.apply(nrich.settings.current);
				}
			}
		}, 100);

	    $("#nrich").click(function() {

			console.log("applying settings due to click");
			$("#nrich").remove();
			nrich.prepareMenu();
			nrich.settings.apply(nrich.settings.current);
	    });
	},
	prepareMenu: function() {

		$.each(nrich.settings.options, function(i, s) {

			console.log(s);

			var settingHtml = "<div class='nrich-setting'><div class='nrich-setting-name'>" + nrich.nicename(i) + "</div>";

			$.each(s, function(j, o) {

				var optionHtml;
				var addedStyles = "";

				console.log("o = " + o);

				if (o == "[form]") {

					optionHtml = "<input class='nrich-settings-form " + i + "' val='' />";
					addedStyles += " form";

				} else {
					optionHtml = nrich.nicename(o);
				}

				//console.log("settings for " + i + " are currently " + settings.current[i]);
				if (nrich.settings.current[i] == o) {

					settingHtml += "<div class='nrich-setting-option " + addedStyles + " active'>" + optionHtml + "</div>";
				} else {

					settingHtml += "<div class='nrich-setting-option " + addedStyles + "'>" + optionHtml + "</div>";
				}
			})

			settingHtml += "</div>"

			$("#nmenu").append(settingHtml);
		});

		// now I've created the DOM represeting the settings menu, I still need to prime it

		$(".nrich-setting").each(function(i, s) {

			$(this).css("top", 120 + (62 * i) + "px");

			var settingName = nrich.nastyname($(this).find(".nrich-setting-name").html());
			var settingOptions = $(this).find(".nrich-setting-option");

			// console.log("priming DOM for setting " + i + " " + $(s).html());

			$(settingOptions).click(function() {
				// console.log("settingName: " + settingName);
				// console.log("clicked " + nrich.nastyname($(this).html()));

				$(settingOptions).removeClass("active");
				$(this).addClass("active");
//
				if ($(this).is(".form") == false) {

					// nrich.settings.current[settingName] = nrich.nastyname($(this).html());
				}

				// console.log("nrich.settings.current");
				// console.log(nrich.settings.current);

				// $(".nrich-settings-apply").removeClass("hidden");
//			    $(".nrich-settings-apply").fadeIn(1800);
			});

			var settingsForms = $(this).find(".nrich-settings-form");

			$(settingsForms).change(function() {
				console.log("changed a setting");
				//settings.current[settingName] = $(this).val();
			});
		});

	},
	nicename: function(string) {

		console.log(string);

		var s = string;

		// console.log("typeof s is ");
		// console.log(typeof s[0]);

		if (typeof s[0] == "string") {

			s = s[0].toUpperCase() + s.substring(1);
		}	else {
			//s = s;
		}

		return ("" + s).replace("-", " ");
	},
	nastyname: function(string) {

		var s = string;

		// console.log("typeof s is ");
		// console.log(typeof s[0]);

		if (typeof s[0] == "string") {
			s = ("" + s[0]).toLowerCase() + ("" + s).substring(1);
		} else {
			//s = s
		}

		return ("" + s).replace(" ", "-");
	},
	getSettingsFromMenu: function() {

		console.log("getSettingsFromMenu")

		console.log("existing settings are: ");
		console.log(nrich.settings.options);

		var newops = {};

		$(".nrich-setting").each(function(i, n) {

			var name = $(n).find(".nrich-setting-name");
			var active = $(n).find(".active");

			name = nrich.nastyname(name.html());
			console.log("name: " + name);

			if ($(active).find("input").length > 0) {
				console.log("this is an input");

				active = $(active).find("input").val();
				console.log("active: " + active);
			} else {

				console.log("this is a regular clickable div");

				active = nrich.nastyname(active.html());
				console.log("active: " + active);
			}

			if (active != undefined) {

				console.log("this setting is defined");
				newops[name] = active;
			}
		});

		return newops;
	},
	permittedSettings: function(settings) {

		console.log("[permittedSettings] settings");
		console.log(settings);

		nrich.settings = settings;

		$(".nrich-apply-same-window").click(function() {

			var o = nrich.getSettingsFromMenu();

			console.log(o);

			settings.current = o;

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

				// if (s[0] == "<") {

				// 	console.log("probably a form");
				// }

				urlString += "" + i + "=" + s;

				console.log("i = " + i + " length = " + Object.keys(settings.current).length);

				if (settingCount < Object.keys(settings.current).length-1) {
					urlString += "&";
				}

				settingCount++;
			});

			console.log("urlString");
			console.log(urlString);

			window.location.replace(urlString);

			//nrich.settings.apply(nrich.settings.current);
		});

		$(".nrich-apply-new-window").click(function() {

			console.log("settings.url");
			console.log(settings.url);

			var o = nrich.getSettingsFromMenu();

			console.log(o);

			settings.current = o;

			// var urlString = settings.url + "?";
			var urlString = "responsive.html?";
			var settingCount = 0;

			$.each(settings.current, function(i, s) {

				// if (s[0] == "<") {

				// 	console.log("probably a form");
				// }

				urlString += "" + i + "=" + s;

				console.log("i = " + i + " length = " + Object.keys(settings.current).length);

				if (settingCount < Object.keys(settings.current).length-1) {
					urlString += "&";
				}

				settingCount++;
			});

			console.log("urlString");
			console.log(urlString);

			window.open(urlString, 'popup_window', 'fullscreen=yes');
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
