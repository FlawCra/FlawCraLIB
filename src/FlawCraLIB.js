var jQuery = require("jQuery");

var FlawCraLIB = {};
(function (context) {
	if (!String.prototype.FlawCraLIBformat) {
		String.prototype.FlawCraLIBformat = function () {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] != 'undefined'
					? args[number]
					: match
					;
			});
		};
	};
	var SCCID = "8df0d68fcc1920c92fc389b89e7ce20f";
	FlawCraLIB.resolveSoundcloudSong = function (songURL) {
		var result = null;
		$.ajax({
			url: "https://api.soundcloud.com/resolve/?url=" + songURL + "&client_id=" + SCCID,
			type: 'get',
			dataType: 'json',
			async: false,
			success: function (data) {
				result = JSON.parse(JSON.stringify(data)).stream_url + "?client_id=" + SCCID;
			}
		});
		return result;

	}
	FlawCraLIB.calcTweetsADay = function (joinYear, joinMonth, tweetCount) {
		var joinDate = new Date(joinYear, joinMonth);
		var nowDate = new Date();
		var Difference_In_Time = nowDate.getTime() - joinDate.getTime();
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
		var tweetsADay = Math.round(tweetCount / Difference_In_Days);
		return tweetsADay;
	}
	FlawCraLIB.shortURL = function (shortURL) {
		var result = null;
		$.ajax({
			url: "https://cors.flawcra.cc/?"+"https://api.flawcra.cc/short/?url=" + shortURL,
			type: 'get',
			dataType: 'json',
			async: false,
			success: function (data) {
				result = JSON.parse(JSON.stringify(data));
			}
		});
		return result;

	}
	FlawCraLIB.getYTThumbnailURL = function (vidID) {
		$.get('https://img.youtube.com/vi/' + vidID + '/maxresdefault.jpg')
			.done(function () {
				return 'https://img.youtube.com/vi/' + vidID + '/maxresdefault.jpg';

			}).fail(function () {
				return "Invalid Image";

			})
	}
	FlawCraLIB.copyTextToClipboard = function (text) {
		if (!navigator.clipboard) {
			var elem = document.createElement('div');
			elem.style.cssText = 'display:none;';
			document.body.appendChild(elem);
			elem.innerText = text;
			var $temp = jQuery("<input>");
			jQuery("body").append($temp);
			$temp.val(jQuery(elem).text()).select();
			document.execCommand("copy");
			$temp.remove();
			return;
		}
		navigator.clipboard.writeText(text).then(function () {
			console.log('Async: Copying to clipboard was successful!');
		}, function (err) {
			console.error('Async: Could not copy text: ', err);
		});
	}
	FlawCraLIB.reverseString = function (str) {
		return str.split("").reverse().join("");
	}
	FlawCraLIB.loadJS = function (url, callback = null) {
		fetch("https://cors.flawcra.cc/?"+url).then(res => res.text().then(txt => {
			eval(txt);
			if(callback != null && typeof callback == "function") {
				callback(txt);
			}
		}));
	}
})(FlawCraLIB);

module.exports += jQuery;
module.exports += FlawCraLIB;