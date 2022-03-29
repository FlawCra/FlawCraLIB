export default class FlawCraLIB {
	jQuery = require('jquery');
	SCCID = "8df0d68fcc1920c92fc389b89e7ce20f";

	/**
	 * @param  {string} songURL
	 * @description Get the stream URL of a Soundcloud song
	 * 
	 * @returns {string} stream URL
	 */
	static resolveSoundcloudSong(songURL) {
		var result = null;
		jQuery.ajax({
			url: "https://api.soundcloud.com/resolve/?url=" + songURL + "&client_id=" + SCCID,
			type: 'get',
			dataType: 'json',
			async: false,
			success: function (data) {
				result = JSON.parse(JSON.stringify(data)).stream_url + "?client_id=" + SCCID;
			}
		});
		return result;
	
	};

	/**
	 * @param  {number} joinYear
	 * @param  {number} joinMonth
	 * @param  {number} tweetCount
	 * @description Calculate an estimate of how many tweets a user posts per day
	 * 
	 * @returns {number} estimated tweet count
	 */
	static calcTweetsADay(joinYear, joinMonth, tweetCount) {
		var joinDate = new Date(joinYear, joinMonth);
		var nowDate = new Date();
		var Difference_In_Time = nowDate.getTime() - joinDate.getTime();
		var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
		var tweetsADay = Math.round(tweetCount / Difference_In_Days);
		return tweetsADay;
	};

	/**
	 * @param  {string} shortURL
	 * @description Shorten a URL using FlawCra URL Shortener
	 * 
	 * @returns {string} JSON response
	 */
	static shortURL(shortURL) {
		var result = null;
		jQuery.ajax({
			url: "https://cors.flawcra.cc/?" + "https://api.flawcra.cc/short/?url=" + shortURL,
			type: 'get',
			dataType: 'json',
			async: false,
			success: function (data) {
				result = JSON.parse(JSON.stringify(data));
			}
		});
		return result;
	
	};

	/**
	 * @param  {string} vidID
	 * @description Get the thumbnail URL of a YouTube video
	 * 
	 * @returns {string} thumbnail URL
	 */
	static getYTThumbnailURL(vidID) {
		jQuery.get('https://img.youtube.com/vi/' + vidID + '/maxresdefault.jpg')
			.done(function () {
				return 'https://img.youtube.com/vi/' + vidID + '/maxresdefault.jpg';
	
			}).fail(function () {
				return "Invalid Image";
			});
	};

	/**
	 * @param  {string} text
	 * @description Copy text to clipboard
	 * 
	 * @returns {boolean} true if successful, false if not
	 */
	static copyTextToClipboard(text) {
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
			return true;
		}
		navigator.clipboard.writeText(text).then(function () {
			return true;
		}, function (err) {
			return false;
		});
	};

	/**
	 * @param  {string} str
	 * @description Reverse a given string
	 * 
	 * @returns {string} reversed string
	 */
	static reverseString(str) {
		return str.split("").reverse().join("");
	};

	/**
	 * @param  {string} url
	 * @param  {method} callback=null
	 * @description Fetch and execute a script from a given URL and execute a callback function
	 */
	static loadJS(url, callback = null) {
		fetch("https://cors.flawcra.cc/?" + url).then(res => res.text().then(txt => {
			eval(txt);
			if (callback != null && typeof callback == "function") {
				callback(txt);
			}
		}));
	};
}

window.FlawCraLIB = FlawCraLIB;