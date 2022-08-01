import Sha256 from "./Sha256.js";
import jQuery from "jquery";

export default class FlawCraLIB {
	static soundcloudId = "8df0d68fcc1920c92fc389b89e7ce20f";

	/**
	 * @param  {string} songURL
	 * @description Get the stream URL of a Soundcloud song
	 * 
	 * @returns {string} stream URL
	 */
	static resolveSoundcloudSong(songURL) {
		let result = null;
		jQuery.ajax({
			url: "https://api.soundcloud.com/resolve/?url=" + songURL + "&client_id=" + soundcloudId,
			type: 'get',
			dataType: 'json',
			async: false,
			success: function (data) {
				result = JSON.parse(JSON.stringify(data)).stream_url + "?client_id=" + soundcloudId;
				console.log(soundcloudId)
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
		const joinDate = new Date(joinYear, joinMonth);
		const nowDate = new Date();
		const Difference_In_Time = nowDate.getTime() - joinDate.getTime();
		const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
		const tweetsADay = Math.round(tweetCount / Difference_In_Days);
		return tweetsADay;
	};

	/**
	 * @param  {string} shortURL
	 * @description Shorten a URL using FlawCra URL Shortener
	 * 
	 * @returns {string} JSON response
	 */
	static shortURL(shortURL) {
		let result = null;
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
			const elem = document.createElement('div');
			elem.style.cssText = 'display:none;';
			document.body.appendChild(elem);
			elem.innerText = text;
			const $temp = jQuery("<input>");
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
	 * @param  {function} callback=null
	 * @description Fetch and execute a script in a safe context from a given URL and execute a callback function
	 */
	static loadSafeJS(url, callback = null) {
		fetch("https://cors.flawcra.cc/?" + url).then(res => res.text().then(txt => {
			(function(code, cb) {
				FlawCraLIB.safeEval(code).then(r => {
					if (cb != null && typeof cb == "function") {
						cb(code);
					}
				});
			})(txt, callback);
		}));
	};

	/**
	 * @param  {string} url
	 * @param  {function} callback=null
	 * @description Fetch and execute a script from a given URL and execute a callback function
	 */
	static loadJS(url, callback = null) {
		fetch("https://cors.flawcra.cc/?" + url).then(res => res.text().then(txt => {
			(function(code, cb) {
				eval(code);
				if (cb != null && typeof cb == "function") {
					cb(code);
				}
			})(txt, callback);
		}));
	};
	
	/**
	 * @param  {string} name
	 * @param  {string} url
	 * @description Get a parameter by name from a given URL
	 */
	static getParameterByName(name, url) {
		name = name.replace(/[\[\]]/g, '\\$&')
		name = name.replace(/\//g, '')
		const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			  results = regex.exec(url);

		if (!results) return null
		else if (!results[2]) return ''
		else if (results[2]) {
			results[2] = results[2].replace(/\//g, '')
		}
		
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	};

	/**
	 * @param {string} untrustedCode
	 * @description Evaluate a string as JavaScript
	 */
	static safeEval(untrustedCode) {
		return new Promise(function (resolve, reject)
		{
			const blobURL = URL.createObjectURL(new Blob([
					"(",
					function () {
						const _postMessage = postMessage;
						const _addEventListener = addEventListener;

						(function (obj) {
							"use strict";

							let current = obj;
							const keepProperties =
								[
									// Required
									'Object', 'Function', 'Infinity', 'NaN', 'undefined', 'caches', 'TEMPORARY', 'PERSISTENT',
									// Optional, but trivial to get back
									'Array', 'Boolean', 'Number', 'String', 'Symbol',
									// Optional
									'Map', 'Math', 'Set',
								];

							do {
								Object.getOwnPropertyNames(current).forEach(function (name) {
									if (keepProperties.indexOf(name) === -1) {
										delete current[name];
									}
								});

								current = Object.getPrototypeOf(current);
							}
							while (current !== Object.prototype)
								;

						})(this);

						_addEventListener("message", function (e) {
							const f = new Function("", "return (" + e.data + "\n);");
							_postMessage(f());
						});
					}.toString(),
					")()"],
				{type: "application/javascript"}));

			const worker = new Worker(blobURL);

			URL.revokeObjectURL(blobURL);

			worker.onmessage = function (evt)
			{
				worker.terminate();
				resolve(evt.data);
			};

			worker.onerror = function (evt)
			{
				reject(new Error(evt.message));
			};

			worker.postMessage(untrustedCode);

			setTimeout(function ()
			{
				worker.terminate();
				reject(new Error('The worker timed out.'));
			}, 1000);
		});
	};

	/**
	 * @param   {string} msg - (Unicode) string to be hashed.
	 * @param   {Object} [options]
	 * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
	 *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' ≡ 'abc') .
	 * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
	 *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
	 * @returns {string} Hash of msg as hex character string.
	 * @description Generate a Sha256 of a given input
	 * @example
	 *   const hash = FlawCraLIB.sha256_hash('abc'); // 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
	 */
	static sha256_hash(msg, options) {
		return Sha256.hash(msg, options);
	}
}

if(typeof(window) != "undefined") window.FlawCraLIB = FlawCraLIB;
