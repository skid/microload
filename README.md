# Microload

Microload is a very small asynchronous script and stylesheet loader.  

```
microload('dependency_1.js', ['dependee_1.js', 'dependee_2.js', 'mystyles.css'], function(){
  console.log("Scripts Loaded");
});
```

The microload function accepts *strings*, *arrays of strings* and an optional *function* as the last argument.

Each string will be treated as a URL to a script or a stylesheet, depending on the extension. Each URL will be loaded consecutively. Microload won't attempt to load the **second** argument until the **first** argument is already loaded.

Microload also accpets arrays of URLs as arguments. These work just the same, except that all the URLs in the array will be loaded in parallel. In the next example we are loading jQuery and underscore in parallel (since they don't depend on other librares) and only after they are both loaded, we load our application scripts.

```
microload(['jquery.js', 'underscore.js'], ['application-1.js', 'application-2.js'], 'application-1-dependee.js');
```

Finally, if the last argument is a function, microload will execute it once all resources are succesfully loaded.

```
microload(['jquery.js', 'underscore.js'], 'application.js', 'application-dependee.js', function(){
  // Run something once everything is loaded
  application.init();
});
```

**DO NOT** do the following:

```
microload('script-1.js', function(){
  // This will wait for script-1.js to load
});
microload('script-1.js', function(){
  // This will be executed BEFORE script-1.js loads
});
```

## License

MIT