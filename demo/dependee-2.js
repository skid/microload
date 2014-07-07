(function(){
  var p = document.createElement('p');
  p.innerHTML = window.dependency1 && window.dependency2 ? "Dependee 2 loaded!" : "Dependee 2 can't load! Missing dependencies.";
  document.body.appendChild(p);
})();