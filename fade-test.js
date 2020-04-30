var runs = 0, fades = 0; htmltext = 0, texts = [];

window.onload = function() {
//  init();
  bOffsets = getBOffets();
  console.log("bOffsets: " + bOffsets);
  repositonB(bOffsets);
}

function getBOffets() {
  aSpans = document.querySelectorAll('.text.a');
  bSpans = document.querySelectorAll('.text.b');
  //console.log('num of spans: ' + aSpans.length);
//  spans.forEach(getBOffet);
  bOffsets = [];
  for (var i = 0; i < aSpans.length; i++) {
    bOffsets[i] = getBOffet(aSpans[i],bSpans[i]);
  }
  return bOffsets;
}

function getBOffet(aSpan,bSpan) {
  aRect = aSpan.getBoundingClientRect();
  bRect = bSpan.getBoundingClientRect();
  aCenter = aRect.top + window.pageYOffset + aRect.height/2;
  // console.log(aRect.top, bRect.top, aRect.height, window.pageYOffset)
  bOffset = aCenter - (bRect.top + window.pageYOffset + ((bRect.bottom - bRect.top)/2));
  return bOffset;
//  var position = {
//    top: rect.top + window.pageYOffset,
//    left: rect.left + window.pageXOffset
//  };
}

function repositonB(bOffsets) {
  divs = document.querySelectorAll('.bdiv');
  //console.log('num of bdivs: ' + divs.length);
//  spans.forEach(getBOffet);
  for (var i = 0; i < divs.length; i++) {
    console.log(window.pageYOffset + ", " + bOffsets[i]);
    divs[i].style.top =  bOffsets[i] + "px";
  }
}

function toggleAll(id) {
  //console.log("id: " + id);
  if (id == null) {
    texts = document.querySelectorAll('.text');
  } else {
    texts = document.querySelectorAll(id);
  }
  texts.forEach(toogleFade);
}

function toogleFade(text) {
  text.classList.toggle('a');
//  text.classList.remove('alwaysOn');
  text.classList.toggle('b');
//  console.log('toogleFade number: ' + ++fades);
}

// function() {init(); getText();};

//function init() {
//  document.getElementById("content").addEventListener("click", newHTML);
//}
//

function fadeAndGo(para) {
//  let text = document.querySelector('.alWaysOn');
//  if (text) {
//    text.classList.toggle('always)n');
//  }
  getText();
  goParaWithDelay(para);
}

function goPara(para) {
  location.href = para;
}

function goParaWithDelay(para) {
  setTimeout(function() {location.href = para;}, 2500);
}

function newHTML() {
  document.getElementById('content').innerHTML = htmltexts[htmltext++];
  setTimeout(getText, 100);
//  setTimeout(function() {
//    document.getElementById('blue').style.color = 'blue';
//  }, 3000);
}

function getText(e) {
  if (e == null) {
   texts = document.querySelectorAll('.text');
  } else {
   texts = document.querySelectorAll(e);
  }
  texts.forEach(fade);
//  setTimeout(function() {
//    document.getElementById('blue').style.color = 'blue';
//  }, 3000);
  console.log('getText run number: ' + ++runs);
}

function fade(text) {
//  text.classList.toggle('readable');
  text.classList.remove('alwaysOn');
  text.classList.toggle('invisible');
  console.log('fade number: ' + ++fades);
}
