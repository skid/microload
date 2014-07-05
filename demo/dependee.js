(function(){
  var p = document.createElement('p');
  p.innerHTML = window.dependency1 && window.dependency2 ? "Dependee loaded!" : "Dependee can't load! Missing dependencies.";
  document.body.appendChild(p);
})();