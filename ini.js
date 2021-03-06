"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

$(document).ready(function() {
   $("#fileinput").change(botonPulsado);
   $("#botonRefrescar1").click(resetPagina);
   $("#botonRefrescar2").click(resetPagina);
   $("#botonTest").click(abrirTest);
   var dropZone = document.getElementById('drop_zone');
   dropZone.addEventListener('dragover', handleDragOver, false);
   dropZone.addEventListener('dragleave', handleDragLeave, false);
   dropZone.addEventListener('drop', handleFileSelect, false);
});

function handleFileSelect(evt) {
   evt.stopPropagation();
   evt.preventDefault();
   var files = evt.dataTransfer.files; // FileList object.
   calculate(files[0]);
   evt.target.style.background = "#CCCCCC";
}

function handleDragOver(evt) {
   evt.stopPropagation();
   evt.preventDefault();
   evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.  
   evt.target.style.background = "#0099CC"; //cambia de color cuando estas encima
}

function handleDragLeave(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.  
  evt.target.style.background = "#CCCCCC"; //cambia de color cuando estas encima
}

function botonPulsado(evt) {
  var f = evt.target.files[0]; 
  calculate(f);
}

function abrirTest(evt) {
   document.location.href='./test/index.html';
}

function resetPagina() {
  localStorage.clear();
  window.location.reload(true);
}

function calculate(f) {
  if (f) {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      var tokens = lexer(contents);
      var pretty = tokensToString(tokens);
      out.className = 'unhidden';
      drop_zone.className = 'hidden';
      fileinput.className = 'hidden';
      botonRefrescar1.className = 'unhiddenButton';
      botonRefrescar2.className = 'unhiddenButton';
      nombresAutores.className = 'unhidden';
	  Cuerpo.className = 'fondoFicheroAbierto';
      entrada.innerHTML = '\n' + contents;
      salida.innerHTML = pretty;
      if (window.localStorage) {
		localStorage.entrada = contents;
        localStorage.salida = pretty;
      }
    }    
    r.readAsText(f); // Leer como texto
  } else { 
    alert("Fallo al leer el fichero");
  }
}

function tokensToString(tokens) {
   var r = '';
   for(var i in tokens) {
     var t = tokens[i];
     var s = JSON.stringify(t, undefined, 2);    
     s = _.template(underscoreTemplate.innerHTML, {t: t, s: s});
     r += s;
   }
   return '<ol>'+r+'</ol>';
}

function lexer(input) {
  var blanks         = /^\s+/;
  var iniheader      = /^\[([^\]\r\n]+)\]/;
  var comments       = /^[;#](.*)/;
  var nameEqualValue = /^([^=;#\r\n]+)=((?:[^;#\r\n]*\\\n)*[^;#\r\n]*)/;
  var any            = /^(.|\n)+/;

  var out = [];
  var m = null;

 while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'comments', match: m });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index+m[0].length);
      m[0] = m[0].replace(/\\\n/,' ');
      m[2] = m[2].replace(/\\\n/,' ');
      out.push({ type: 'nameEqualValue', match: m });
    }
    else if (m = any.exec(input)) {
      out.push({ type: 'error', match: m });
      input = '';
    }
    else {
      alert("Error Fatal!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}

window.onload = function() {
  // If the browser supports localStorage and we have some stored data
  if (window.localStorage && localStorage.entrada && localStorage.salida) {
    document.getElementById("entrada").innerHTML = localStorage.entrada;
    document.getElementById("salida").innerHTML = localStorage.salida;
    document.getElementById("drop_zone").className = 'hidden';
    document.getElementById("fileinput").className = 'hidden';
    document.getElementById("Cuerpo").className = 'fondoFicheroAbierto';
    document.getElementById("out").className = 'unhidden';
    document.getElementById("botonRefrescar1").className = 'unhiddenButton';
    document.getElementById("botonRefrescar2").className = 'unhiddenButton';
  }
};
