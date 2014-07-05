(function(){
  if(!window.dependency1 || !window.dependency2) {
    console.log("Dependee can't load! Missing dependencies.");
  }
  else {
    console.log("Dependee loaded!");
  }
})();