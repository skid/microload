(function(){
  window.dependency1 = true;
  var p = document.createElement('p');
  p.innerHTML = "Dependency 1 loaded!";
  document.body.appendChild(p);
})();