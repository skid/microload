(function(){
  var p = document.createElement('p');
  p.innerHTML = window.dependency1 && window.dependency2 ? "Dependee 3 loaded!" : "Dependee 3 can't load! Missing dependencies.";
  document.body.appendChild(p);
})();