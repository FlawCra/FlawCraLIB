import Sha256 from "./Sha256.js";
import jQuery from "jquery";

/**
 * @description Main class of FlawCraLIB
 */
export default class FlawCraLIB {
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
  }

  /**
   * @param  {string} shortURL
   * @description Shorten a URL using FlawCra URL Shortener
   *
   * @returns {string} JSON response
   */
  static shortURL(shortURL) {
    let result = null;
    jQuery.ajax({
      url: `https://cors.flawcra.cc/?https://api.flawcra.cc/short/?url=${shortURL}`,
      type: "get",
      dataType: "json",
      async: false,
      success: function (data) {
        result = JSON.parse(JSON.stringify(data));
      },
    });
    return result;
  }

  /**
   * @param  {string} text
   * @description Copy text to clipboard
   *
   * @returns {Promise<boolean>} true if successful, false if not
   */
  static async copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      const elem = document.createElement("div");
      elem.style.cssText = "display:none;";
      document.body.appendChild(elem);
      elem.innerText = text;
      const $temp = jQuery("<input>");
      jQuery("body").append($temp);
      $temp.val(jQuery(elem).text()).select();
      document.execCommand("copy");
      $temp.remove();
      return true;
    }
    return await navigator.clipboard.writeText(text).then(
      // skipcq: JS-0111
      function () {
        return true;
      },
      function () {
        return false;
      }
    );
  }

  /**
   * @param  {string} str
   * @description Reverse a given string
   *
   * @returns {string} reversed string
   */
  static reverseString(str) {
    return str.split("").reverse().join("");
  }

  /**
   * @param  {string} url
   * @param  {function} callback=null
   * @description Fetch and execute a script in a safe context from a given URL and execute a callback function
   */
  static loadSafeJS(url, callback = null) {
    fetch(`https://cors.flawcra.cc/?${url}`).then((res) =>
      res.text().then((txt) => {
        (function (code, cb) {
          FlawCraLIB.safeEval(code).then(() => {
            if (cb !== null && typeof cb === "function") {
              cb(code);
            }
          });
        })(txt, callback);
      })
    );
  }

  /**
   * @param  {string} name
   * @param  {string} url
   * @description Get a parameter by name from a given URL
   */
  static getParameterByName(name, url) {
    let replacedName = name.replace(/[\[\]]/g, "\\$&");
    replacedName = replacedName.replace(/\//g, "");
    const regex = new RegExp(`[?&]${replacedName}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);

    if (!results) return null;
    else if (!results[2]) return "";
    else if (results[2]) {
      results[2] = results[2].replace(/\//g, "");
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * @param {string} untrustedCode
   * @description Evaluate a string as JavaScript
   */
  static safeEval(untrustedCode) {
    return new Promise(function (resolve, reject) {
      const blobURL = URL.createObjectURL(
        new Blob(
          [
            "(",
            function () {
              const _postMessage = postMessage;
              const _addEventListener = addEventListener;

              (function (obj) {
                let current = obj;
                const keepProperties = [
                  // Required
                  "Object",
                  "Function",
                  "Infinity",
                  "NaN",
                  "undefined",
                  "caches",
                  "TEMPORARY",
                  "PERSISTENT",
                  // Optional, but trivial to get back
                  "Array",
                  "Boolean",
                  "Number",
                  "String",
                  "Symbol",
                  // Optional
                  "Map",
                  "Math",
                  "Set",
                ];

                do {
                  Object.getOwnPropertyNames(current).forEach(function (name) {
                    if (keepProperties.indexOf(name) === -1) {
                      delete current[name];
                    }
                  });

                  current = Object.getPrototypeOf(current);
                } while (current !== Object.prototype);
              })(this);

              _addEventListener("message", function (e) {
                const func = new Function("", `return (${e.data}\\n);`);
                _postMessage(func());
              });
            }.toString(),
            ")()",
          ],
          { type: "application/javascript" }
        )
      );

      const worker = new Worker(blobURL);

      URL.revokeObjectURL(blobURL);

      worker.onmessage = function (evt) {
        worker.terminate();
        resolve(evt.data);
      };

      worker.onerror = function (evt) {
        reject(new Error(evt.message));
      };

      worker.postMessage(untrustedCode);

      setTimeout(function () {
        worker.terminate();
        reject(new Error("The worker timed out."));
      }, 1000);
    });
  }

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

if (typeof window !== "undefined") window.FlawCraLIB = FlawCraLIB;
