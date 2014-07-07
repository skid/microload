/**
 * @preserve
 * Micro async script loader.
 * Puts a function named `microload` in the window namespace.
 * Usage:

     microload('/script_1.js', 'script_2.js', ['dependancy_1.js', 'dependee_1.js'], function(){
       // Do something once done.
     });
 
 * The `microload` function accepts strings and arrays of strings. The last argument can be a callback.
 * Strings are loaded in parallel. Arrays of strings are loaded in succession (these are good for dependencies).
 * 
 * The loader also protects you from loading the same script twice, for example like this:
     
     microload("/script.js", "/another_script.js");
     microload("/script.js", "/yet_another_script.js");
 *
**/
(function (){
  var loading = {}, loaded  = {};

  function load(src, fn){
    var script;
    
    if(src in loaded){
      // If the src is already loaded we need to defer the execution to allow the "loaded" counter  
      // to increment. Otherwise we'll execute the callback once for each already loaded src.
      return setTimeout(fn, 0);
    }
    
    if(src in loading) {
      // If we're waiting for the src to load, just push the callback in the queue.
      // All the callbacks in the queue will be executed at once when it loads.
      return loading[src].push(fn);
    }

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
        loaded[src] = (new Date).getTime();

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
          if(!next) {
            return done();
          }

          ++callback.loading;
          load(next, function(){
            if( arg.length ) {
              // Decrement loading since we're not calling done() yet
              --callback.loading;
            }
            microload(arg, callback);
          });
        })(arg.slice());
      }
    }
  }
  
  // Expose the scripts functions for later reference
  window.microload.loaded = loaded;
})();
