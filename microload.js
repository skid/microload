/**
 * @preserve
 * Micro async script loader.
 * Puts a function named `microload` in the window namespace.
 * Usage:

     microload('/script_1.js', 'script_2.js', ['dependancy_1.js', 'dependee_1.js'], function(){
       // Do something once done.
     });
 
 * The `microload` function accepts strings and arrays. The last argument can be a callback.
 * Strings are loaded in parallel. Arrays of strings are loaded in succession (these are good for dependencies).
 * 
 * The loader also protects you from loading the same script twice, for example like this:
     
     microload("/script.js", "/another_script.js");
     microload("/script.js", "/yet_another_script.js");
 *
**/
(function (){
  var loading = {};

  function load(src, fn){
    var script, link;

    if(src in loading) {
      loading[src].push(fn);
    }
    else {
      if( src.substr(-4) === '.css' ) {
        script = document.createElement('link');
        script.rel = "stylesheet";
        script.async = true;
        script.href = src;
      }
      else {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = src;
      }
      script.onload = script.onreadystatechange = function() {
        var callbacks = loading[src], fn;
        delete loading[src];

        if (!script.readyState || (script.readyState === 'complete' || script.readyState === 'loaded')) {
          script.onload = script.onreadystatechange = null;
          while(fn = callbacks.shift()) {
            fn();
          }
          return;
        }
        // The ready state changed to something else. This is an error.
        console && console.log("Microload encountered an error.");
      };

      loading[src] = [fn];
      document.head.appendChild(script);
    }
  }

  window.microload = function(){
    var arg, i=0, callback = arguments[arguments.length - 1];

    (typeof callback !== 'function') && (callback = {});
    (callback.loading === undefined) && (callback.loading = 0);

    function done(){
      --callback.loading === 0 && typeof callback === 'function' && callback();
    }

    while(arg = arguments[i++]){
      // Strings are loaded asynchronously
      if(typeof arg === 'string') {
        callback.loading++;
        load(arg, done);
      }

      // Arrays of strings are loaded in succession because they depend on each other
      else if(typeof arg === 'object' && typeof arg.pop === 'function') {
        (function(arg){
          var next = arg.shift();
          if(!next) return done();

          ++callback.loading;
          load(next, function(){
            if( arg.length ) --callback.loading; // Decrement loading since we're not calling done() yet
            microload(arg, callback);
          });
        })(arg.slice());
      }
    }
  }
})();
