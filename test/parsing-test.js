// Parser: Definitions
const CLAUSE_BREAKS = [", ", "; ", ": ", "</cb> "];
const THOUGHT_BREAKS = /[!|.|.?][”|"]?$/g;
// Handle quotation: TODO: replace with regex
const PARAGRAPH_BREAK = /<pb\/>/g; // Done
const SECTION_BREAK = "<sb/>"; // Done
const UNIT_PAIRS = ["<ub>","</ub>"];// Done
const DEFAULT_PATH = ".tb:last";

// Animation Parameters

const DEFAULT_COLOR = '#013'; // black
const ONHOVER_COLOR = '#89a'; // #777
const OVERLAY_DEFAULT_COLOR = '#410';
const OVERLAY_ONHOVER_COLOR = '#976';

const TRANSITION_ONHOVER = 500;
const DELAY_SHARED = 500, TRANSITION_SHARED = 500;

const DELAY_1_2 = 1500;// automatically enter phase2 after 3 seconds in phase1 on the same element

const FADE_OPACITY = 0.1, TRANSITION_FADEOUT = 1000;
const DELAY_OVERLAY_FADEIN = 1000;
const TRANSITION_OVERLAY_FADEIN = 500;

// Typography
const TEXT_SIZE = 24, LINE_HEIGHT = 27;
// Layout
const CONTENT_WIDTH = 800, MARGIN_LEFT = 200, MARGIN_RIGHT = 200, MARGIN_TOP = 100;

// Animation Control
let myTimeouts = [], phaseLive=false;

// Tools

function wordCount(str) {
  return str.trim().split(/\s+/).length;
}

// End of Tools

function readTextFile(file, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText)
            }
        }
    }
    rawFile.send(null);
}


// Parsing Section
function removeGitDiffSyntags(content) {
  return content.replace(/(^-|^\+|^[ \t]|_)/g,""); // not needed: |_
}

function removeBreaks(content) {
  return content.replace(/(<ub> |<\/ub> |<sb\/> |<pb\/>)/g,"");
}

function removeEmptyElements(selector) {
  // remove redundant
  $(selector).each(function() {
     if( $(this)[0].innerHTML == "")  $(this)[0].remove();
  });
}

function getCurrentUnitIndex(dom) {
  const children = dom.closest('div[class$="div"]').find('.unit');
  for (var i = 0; i < children.length; i++) {
    if (children[i] == dom[0]) return i;
  }
  return false;
}

function wrapDirectChildrenToP(parent) {
  const children = parent.children();
  let p = document.createElement('p');
  for (var i = 0; i < children.length; i++) {
    if (children[i].tagName != 'P'){
      p.append(children[i]);
    } else if (i != 0 && p.children.length > 0) {
      console.log("append")
      $(p).insertBefore(children[i])
      p = document.createElement('p');
    }

  }

  if (p.children.length > 1) parent.append(p);
}

function wrapAllDirentChildrenToP() {
  $('.page').each(function() {
    wrapDirectChildrenToP($(this).find('.adiv'));
    wrapDirectChildrenToP($(this).find('.bdiv'));
  })
}
function parseText(data, callback) {
  const lines = data.split("\n");
  // skip the top section
  lines.splice(0, 5);

  let contentToBeAppend = document.createElement('div');
  $(contentToBeAppend).attr("id", "content");

  let currentPage = 1, currentNo = 0;
  let match = false, inUnit = false, inP = {a:false, b:false};

  createNewPage(currentPage, contentToBeAppend);
  $('.menu li').addClass("current");

  for (var i = 0; i < lines.length; i++) {

    const line = lines[i].substr(1),
          type = lines[i][0];
    let content = lines[i],
        newSpan =  document.createElement("span");
    // clean up syntags
    content = removeGitDiffSyntags(content);
    content = removeBreaks(content);
    // fix space after sentence end
    content = content.replace(/(\S)$/g,"$1 ");

    // ignore empty lines
    if (line == " " || line == "") continue;
    newSpan.innerHTML = content;

    const currentAdiv = $(contentToBeAppend).find('#page' + currentPage +' .adiv'),
          currentBdiv =  $(contentToBeAppend).find('#page' + currentPage +' .bdiv');

    switch(type) {
      case "-":
         newSpan.id = "a" + currentNo;
         match = true;
         newSpan.classList += " hide";
         // hide = append a span (.hide)
         content != "" && currentAdiv.find(DEFAULT_PATH).append(newSpan);
        break;
      case " ":
          if (match == true) currentNo++;
          match = false;
          if (line == SECTION_BREAK) {
            // Handle section breaks
            if( i != lines.length -1) {
              // ignore last section break
              currentPage ++;
              createNewPage(currentPage, contentToBeAppend);
            }
            inP = {a:false, b:false};

          } else if (UNIT_PAIRS.indexOf(line) > -1) {
            // Handle unit
            const LocationA = inP.a ? currentAdiv.find("p:last") : currentAdiv;
            const LocationB = inP.b ? currentBdiv.find("p:last") : currentBdiv;

            if (line == UNIT_PAIRS[0]) {
              inUnit = true;
              const unit = "<span class='unit manual'><span class='tb'></span></span>";
              LocationA.append(unit);
              LocationB.append(unit);
            } else {
              // create a new tb:last
              const tb = "<span class='tb'></span>";
              LocationA.append(tb);
              LocationB.append(tb);
              inUnit = false;
            }

          } else {
            // shared  = append to both a span & b span
            newSpan.classList += " shared";
            newSpan.id = "a" + currentNo;
            if (content != "") {
              currentAdiv.find(DEFAULT_PATH).append(newSpan);
              const clone = newSpan.cloneNode(true);
              clone.id = "b" + currentNo;
              currentBdiv.find(DEFAULT_PATH).append(clone);
            }
            currentNo ++;
          }
        break;
      case "+":
          newSpan.id = "b" + currentNo;
          match = false;
          currentNo++;
          // add = append b span (display:none)
          content != "" && currentBdiv.find(DEFAULT_PATH).append(newSpan);
        break;
      case "~":
        // new line : no visual representation in the html
        if (match == true) currentNo++;
        match = false;
        break;
      default :
        //console.log("[Warning] Unparsable line", line);
    } // End of Switch

    if (line.match(THOUGHT_BREAKS)) {
      // Handle THOUGHT_BREAKS
      const tb = "<span class='tb'></span>";
      if(type == " " || type == "-") currentAdiv.find(".tb:last").parent().append(tb);
      if(type == " " || type == "+") currentBdiv.find(".tb:last").parent().append(tb);
    }
    if (line.match(PARAGRAPH_BREAK)) {
        // Handle paragraph breaks
        const unitHTML = "<p>"+ (inUnit ? "": "<span class='tb'></span>") +"</p>";
      if(type == " " || type == "-") {
        currentAdiv.append(unitHTML);
        inP.a = true;
      }
      if(type == " " || type == "+") {
        currentBdiv.append(unitHTML);
        inP.b = true;
      }
    }

  } // End of for loop


  // append content
  $(contentToBeAppend).append($('#overlay'));
  $('body').append(contentToBeAppend);
  initTester();
  removeEmptyElements('.tb')

  wrapAllDirentChildrenToP();
  // batch add class unit for tb
  $('.page p > span:not(unit)').addClass("unit");

  $('.bdiv .unit').each(function() {
    // go over all the units in b,
    // and if it's empty or there is no .shared span in b, add .toB class to corresponding aunit
    if (this.innerHTML == "" || $(this).find(".shared").length == 0)  {
      const aspan = getMatchingUnit(this, 'a');
      aspan.addClass('toB');
    }
  })
  // set current page
  $('#page1').addClass('current')

  callback();
}
// End of Parsing Section

// Visualization Section
function getMatchingUnit(span, target) {
  const unitIdx = getCurrentUnitIndex($(span));
  const currentPage = $(span).closest('.page');
  const c_span = currentPage.find(target== "a" ? '.adiv' : '.bdiv').find('.unit').eq(unitIdx);
  // console.log(pIdx, spanIdx, bspan)
  return c_span;
}

function clearTimeouts(timeouts) {
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
}

// function phase2(target) {
//   if (phaseLive) return;
//   let aspan = target.parent();
//   if (!aspan.parent().is("p")) aspan = aspan.parent();
//
//   console.log("phase2", target, target.id);
//   phaseLive = true;
//   animate(getMatchingBFromA(aspan), aspan, target)
// }

function phase2(thisDom, target) {
  if (phaseLive) return;
  const bspan = getMatchingUnit(thisDom);

  console.log("phase2", thisDom, bspan)
  phaseLive = true;
  animate(bspan, $(thisDom), target);
}


function createNewPage(index, wrapper) {
  const page = $('#template .page').clone()[0];
  page.id = "page" + index;
  $(wrapper).append(page);
  // populate menu
  $('.menu select').append("<option value='" + index +"'>"+ index + "</option>");

}

function basicAnalyze(aspan, bspan, predefinedAnchor) {
  const dbug = 0;
  // TODO: take mousePosition as reference point?
  const ref = {
    x:aspan.width()/2,
    y:aspan.height()/2 + aspan[0].offsetTop - TEXT_SIZE
  }
  // console.log(predefinedAnchor);
  return new contextReport(aspan, bspan, ref, predefinedAnchor);
}

function animate(bspan, aspan, predefinedAnchor) {
  // !! Jquery offset() is different from native javascript offset values
  clearOverlay();
  // fade a unit
  $(aspan).css({
    opacity: FADE_OPACITY,
    transition : 'opacity '+ TRANSITION_FADEOUT/1000 + 's ease-in-out'
  });
  console.log(aspan, bspan);
  let context = basicAnalyze(aspan, bspan, predefinedAnchor);
  console.log(context);

  if (context.sharedSpans == undefined) {
    if (bspan.children().length > 0) {
      console.log("show b without an anchor")
      cloneContentToAfterB(bspan.children());
      repositionOverlay(aspan[0].offsetTop, aspan[0].offsetLeft);
      displayOverlay();
    } else {
      console.log("no shared spans, do nothing")
    }
    return;
  }

  $(context.anchor).addClass("anchor");
  const hoverAnchor = document.getElementById("anchor");
  // fill the overlay layer


  $('#anchor').text(context.anchor.content);
  $('#anchor').addClass("shared");

  cloneContentToAfterB(context.after.b.spans, context);
  repositionOverlay(aspan[0].offsetTop, aspan[0].offsetLeft);
  if (context.before.indent < -5 && context.space > 0 && aspan[0].offsetTop == context.anchor.offsetTop) {
    // if there is enough space overall but not enough space before
    // && anchor is in the first line
    console.log("layout b without anchor")
    $('#beforeAnchorA').text(context.before.b.content);
    $('#beforeAnchorA').css("opacity","1");
  } else {
    $('#beforeAnchorA').text(context.before.a.content); // fake before a to get the right spacing
    layoutBeforeB(context.before, hoverAnchor, aspan[0].offsetLeft, aspan[0].offsetTop);
  }

  // display
  displayOverlay();
}

function cloneContentToAfterB(children, context){
  for (var i = 0; i < children.length; i++) {
    const span = children.eq(i).clone();
    span.attr("id", "");
    $('#afterAnchor').append(span);
  }

  // if not enought space for b after
  if (context && context.after.indent < 0) {
      $('#overlay p').css({
        "margin-right": context.after.indent < -50 ? "-100px" : "-50px" // tmp
      })
  } else {
    $('#overlay p').css({
      "margin-right": "-15px" // tmp wrapping
    })
  }
}
function clearOverlay() {
  // clear overlay
  //console.log("clear overlay")
  $('#overlay').css("opacity","0");
  $('#beforeAnchorA').css("opacity","0");
  $('#overlay span').text("");
  clearTimeouts(myTimeouts);
}

function repositionOverlay(top, left) {
  const overlay = document.getElementById("overlay");
  overlay.style.top = top + "px";
  overlay.style.textIndent = left + "px";
}

function displayOverlay() {
  $('#overlay').css({
    color: OVERLAY_ONHOVER_COLOR
  })
  $('#overlay .shared').css({
    color: OVERLAY_DEFAULT_COLOR
  })

  const myTimeout = setTimeout(function(){
    $('#overlay').css({
      opacity:1,
      // "z-index":3,
      transition:'opacity '+ TRANSITION_OVERLAY_FADEIN/1000 + 's ease-in-out'
    })
  }, DELAY_OVERLAY_FADEIN)
  myTimeouts.push(myTimeout);
}

function layoutBeforeB(before, anchor, offsetALeft, offsetATop) {
  const content = before.b.content;
  const words = content.split(" ");
  const reverseWords = words.reverse();
  let cursor = handleMultiLineAnchor(anchor);
  //console.log(cursor);
  // clear previous layout
  $('#beforeAnchorB').empty();
  offsetArray = [];

  // TMP: allow extra space to margin left
  const extraSpace = before.indent < 0 ? 50 : 0;

  for (var i = 0; i < reverseWords.length; i++) {
     const word = reverseWords[i];
     if (word == "") continue; // skip empty ones
     const textL = calculateTextLength(word + " ")
     cursor.x -= textL;
     if (cursor.x < MARGIN_LEFT - extraSpace) {
       //console.log("new line")
       cursor.y -= LINE_HEIGHT
       cursor.x += CONTENT_WIDTH
       // right align
       if (cursor.x + textL > CONTENT_WIDTH + MARGIN_LEFT) {
         cursor.x = CONTENT_WIDTH + MARGIN_LEFT - textL;
       }

     }
     //console.log(newSpan.innerText, cursor);
     offsetArray.push({
       text:word,
       left: cursor.x,
       top: cursor.y
     });

     // console.log(cursor,  offsetALeft+MARGIN_LEFT, offsetATop)
  }

  offsetArray.reverse();

  // split these two into two functions
  let index = 0;

  for (var i = 0; i < before.b.spans.length; i++) {
    const currentSpan = before.b.spans[i];
    const wrapperSpan = document.createElement('span');
    $('#beforeAnchorB').append(wrapperSpan);
    if (currentSpan.classList.contains("shared")) {
      wrapperSpan.classList.add("shared");
    }
    const spanWords = currentSpan.innerText.split(" ");
    for (var j = 0; j < spanWords.length; j++) {
      const word = spanWords[j];
      if (word == "") continue;
      if (offsetArray[index].text == word) {
        const newSpan = document.createElement('span');
        newSpan.innerText = word + " ";
        $('#beforeAnchorB > span:last').append(newSpan);

        if (offsetArray[index].top == offsetATop + MARGIN_TOP) {
          // left might need adjustment
          if (offsetArray[index].left < offsetALeft + MARGIN_LEFT) {
            console.log("off", word, offsetArray[index].left);
            // adjust the whole line for the rest
            const offLeft = 7 + offsetALeft + MARGIN_LEFT - offsetArray[index].left;
            offsetArray = adjustOffLeft(offsetArray, index, offLeft)
          }
        }
        $(newSpan).offset({
          left:offsetArray[index].left,
          top: offsetArray[index].top
        })
        index ++;
      }
    } // End of spanWord for loop
  }
}

function adjustOffLeft(array, index, offLeft) {
  const thisLine = array[index].top;
  for (var i = index; i < array.length; i++) {
    if (array[i].top == thisLine) {
      array[i].left += offLeft;
    }
    else if(array[i].top < thisLine) break;
  }
  return array;
}

function handleMultiLineAnchor(anchor) {
  if ($(anchor).height() > LINE_HEIGHT) {
    // multi line anchor, split to spans;
    const anchorWords = anchor.innerText.split(" ");
    $(anchor).empty();
    for (var i = 0; i < anchorWords.length; i++) {
      const word = anchorWords[i];
      if (word == "") continue; // skip empty ones
      const newSpan = document.createElement('span');
      newSpan.innerText = word + " ";
      anchor.append(newSpan);
    }
    const firstWord = anchor.children[0];
    return {
      x:$(firstWord).offset().left,
      y:$(firstWord).offset().top
    }
  } else {
    return {
        x:$(anchor).offset().left,
        y:$(anchor).offset().top
      }
  }

}

function getIndent(total, unit, anchor) {
  let lines = 0, left = total + anchor.offsetLeft;
  while (left > unit) {
    left -= unit;
    lines ++;
  }
  return {
    lines: lines,
    left:left
  };
}

function initializeCSS() {
  $('#content').css({
    width: CONTENT_WIDTH,
    "margin-left": MARGIN_LEFT,
    "margin-right": MARGIN_RIGHT,
    "margin-top": MARGIN_TOP,
    "font-size": TEXT_SIZE + "px",
    "line-height": LINE_HEIGHT + "px"
  })
  $('#getTextWidth').css({
    "font-size": TEXT_SIZE + "px",
    "line-height": LINE_HEIGHT + "px"
  })
}

function test() {
  // loop through all the a unit in the paragraph and render a report
  $('.adiv .unit').each(function(){
    console.log($(this).closest('.page')[0].id, getCurrentUnitIndex($(this)));
    const bspan = getMatchingUnit(this);
    basicAnalyze($(this), bspan);
  })
}

function postParsing() {
  initializeCSS();
  // user interaction
  $('.adiv .unit:not(.hidden)').mouseenter(function(){
    const unitOnHover = $(this);
    console.log("phase1")
    unitOnHover.find('span.shared, span.hide').css({
      color: ONHOVER_COLOR,
      transition : 'color '+ TRANSITION_ONHOVER/1000 + 's ease-in-out'
    });

    const sharedSpanTimeout = setTimeout(function(){
      unitOnHover.find('span.shared').css({
        color: DEFAULT_COLOR,
        transition : 'color '+ TRANSITION_SHARED/1000 + 's ease-in-out'
      });
    }, DELAY_SHARED)

    myTimeouts.push(sharedSpanTimeout);

    const phase1Timeout = setTimeout(function(){
      console.log("evaluate for phase2")
      unitOnHover.addClass("active");
      // if already on hover shared span
      const currentOnHover = unitOnHover.find('.shared:hover');
      if (unitOnHover.hasClass("toB") || currentOnHover.length != 0) {
        console.log(unitOnHover.find('.shared:hover'))
        phase2(unitOnHover, currentOnHover);
      }
    }, DELAY_1_2, unitOnHover
    );

    myTimeouts.push(phase1Timeout);
  });

  $(document).on('mouseover','.adiv .unit.active .shared',function(e){
    // mouseover shared spans to go to phase 2
    phase2($(e.target).closest('.unit'), $(e.target));
  });

  $('.adiv > p > span, .adiv, #overlay').mouseleave(function() {
    console.log("mouseout")
    phaseLive = false;
    $('.adiv > p > span').removeClass("active");
    $('.adiv > p > span').removeClass("hidden");
    $('.adiv span').removeClass("anchor");
    $('.adiv > p .unit').css("opacity", 1);
    $('.adiv > p .unit span').css("color", DEFAULT_COLOR);
    // clear settimeout
    clearTimeouts(myTimeouts);
    $('#overlay').css({
      opacity:0,
      // "z-index":1
    });

  })
  // End of User Interaction
  //test()
}
// End of Visualization Section

readTextFile("../data/ab_worddiff.txt", function(data){
  parseText(data, postParsing);
});
