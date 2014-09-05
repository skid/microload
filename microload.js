/**
 * @preserve
 * Micro async script loader.
 * https://github.com/skid/microload
**/
(function (){
  var loaded = {};

  function load(src, fn){
    var script, ext = src.substr(src.lastIndexOf('.')).split(/\?|\#/)[0];

    if(src in loaded){
      return fn();
    }

    if(ext === '.css') {
      script = document.createElement('link');
      script.rel = "stylesheet";
      script.async = true;
      script.href = src;
    }
    else if(ext === '.js') {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = src;
    }

    script.onload = script.onreadystatechange = function() {
      if (!script.readyState || (script.readyState === 'complete' || script.readyState === 'loaded')) {
        script.onload = script.onreadystatechange = null;
        loaded[src] = (new Date).getTime();
        fn();
      }
      else {
        // The ready state changed to something else. This is an error.
        throw new Error("Unable to load " + src);
      }
    };

    document.head.appendChild(script);
  }

  window.microload = function(){
    var arg, args, counter, i = 0;

    args = Array.prototype.slice.call(arguments);
    arg  = args.shift();
    
    // If it's a function, everything was loaded, so execute the callback
    if('function' === typeof arg) {
      return arg();
    }
    
    // It's a string, load consecutively
    else if('string' === typeof arg){
      load(arg, function(){
        microload.apply(window, args);
      });
    }
    
    // It's an array, load in parallel
    else if('[object Array]' === Object.prototype.toString.call(arg)){
      counter = arg.length;
      while(url = arg[i++]){
        load(url, function(){
          --counter === 0 && microload.apply(window, args);
        });
      }
    }
  }
  
  // Expose the scripts functions for later reference
  window.microload.loaded = loaded;
})();
