// Animation Parameters

const DEFAULT_COLOR = '#013'; // black
const ONHOVER_COLOR = '#89a'; // #777
const OVERLAY_DEFAULT_COLOR = '#410';
const OVERLAY_ONHOVER_COLOR = '#976';

const TRANSITION_ONHOVER = 800;
// TRANSITION_SHARED = time over which default color highlights the shared spans
// DELAY_SHARED = delay before the shared spans are enabled
// TODO: could there be a slight delay (prob 200) before ANY mouseover action is started?
// (this would allow the reader to start with pointer one shared span in phase and have time
// to move to a preferred [nearby] shared span)
const DELAY_SHARED = 1000, TRANSITION_SHARED = 800; // 500s -> 800s

const DELAY_1_2 = 2200; // 1500 automatically enter phase2 after 3 seconds in phase1 on the same element

const FADE_OPACITY = 0.1, TRANSITION_FADEOUT = 1000;
const DELAY_OVERLAY_FADEIN = 1000, TRANSITION_OVERLAY_FADEIN = 800;
const DELAY_DEFAULT_B = 2000, TRANSITION_DEFAULT_B = 800;

// Typography
const TEXT_SIZE = 24, LINE_HEIGHT = 27;
// Layout
const CONTENT_WIDTH = 800, MARGIN_TOP = 100, MARGIN_RIGHT = 200, MARGIN_LEFT = 200;

// Animation Control
let myTimeouts = [], phaseLive=false;

// Animation Debug
const debug = false;

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

function phase2(thisDom, target) {
  if (phaseLive) return;
  const bspan = getMatchingUnit(thisDom);

  debug && console.log("phase2", thisDom, bspan)
  phaseLive = true;
  animate(bspan, $(thisDom), target);
}

function checkCustomClassNames(aspan) {
  // if there is any custom class names defined for aspan, pass it to overlay
  // only for unit level
  const allClasses = aspan[0].classList;
  let customClassNames = "";
  const parserClassNames = ['tb', 'unit', 'active', 'manual', 'toB'];

  for (var i = 0; i < allClasses.length; i++) {
    if (parserClassNames.indexOf(allClasses[i]) < 0 ) customClassNames += " " + allClasses[i];
  }

  $('#overlay')[0].className = customClassNames;
  // TODO: add this to getTextWidth as well & clear class on mouse out
}

function animate(bspan, aspan, predefinedAnchor) {
  // !! Jquery offset() is different from native javascript offset values
  clearOverlay();
  // Fade out a unit
  $(aspan).css({
    opacity: FADE_OPACITY,
    transition : 'opacity '+ TRANSITION_FADEOUT/1000 + 's ease-in-out'
  });
  // console.log(aspan, bspan);
  let context = basicAnalyze(aspan, bspan, predefinedAnchor);
  debug && console.log(context);

  checkCustomClassNames(aspan);

  if (context.sharedSpans == undefined) {
    if (bspan.children().length > 0) {
      debug && console.log("show b without an anchor")
      cloneContentToAfterB(bspan.children());
      repositionOverlay(aspan[0].offsetTop, aspan[0].offsetLeft);
      displayOverlay();
    } else {
      debug && console.log("no shared spans, do nothing")
    }
    return;
  }

  $(context.anchor).addClass("anchor");
  const hoverAnchor = document.getElementById("anchor");

  // Fill the overlay layer
  $('#anchor').text(context.anchor.content);
  $('#anchor').addClass("shared");

  cloneContentToAfterB(context.after.b.spans, context);
  repositionOverlay(aspan[0].offsetTop, aspan[0].offsetLeft);
  if (context.before.indent < -5 && context.space > 0 && aspan[0].offsetTop == context.anchor.offsetTop) {
    // If there is enough space overall but not enough space before
    // && anchor is in the first line
    debug && console.log("layout b without anchor")
    cloneContentToBeforeAnchorA(context.before.b.spans);
    $('#beforeAnchorA').css("opacity","1");
  } else {
    cloneContentToBeforeAnchorA(context.before.a.spans); // fake before a to get the right spacing
    layoutBeforeB(context.before, hoverAnchor, aspan[0].offsetLeft, aspan[0].offsetTop);
  }

  displayOverlay();
}
function cloneContentToBeforeAnchorA(children) {
  for (var i = 0; i < children.length; i++) {
    const span = children.eq(i).clone(); // keep inline style
    span.attr("id", "");
    $('#beforeAnchorA').append(span);
  }
}
function cloneContentToAfterB(children, context){
  for (var i = 0; i < children.length; i++) {
    const span = children.eq(i).clone();
    span.attr("id", "");
    $('#afterAnchor').append(span);
  }

  // If not enought space for b after
  if (context && context.after.indent < 0) {
      $('#overlay p').css({
        "margin-right": context.after.indent < -50 ? "-100px" : "-50px" // tmp
      })
  } else {
    // console.log((!context || context.after.content == undefined));
    $('#overlay p').css({
      "margin-right": (!context || context.after.b.content == undefined || context.after.b.content == "")  ?  "0px" :"-15px" // tmp wrapping
    })
  }
}

function clearOverlay() {
  //console.log("clear overlay")
  $('#overlay').css("opacity","0");
  $('#overlay')[0].className = "";

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

  const fadeInTimeout = setTimeout(function(){
    $('#overlay').css({
      opacity:1,
      // "z-index":3,
      transition:'opacity '+ TRANSITION_OVERLAY_FADEIN/1000 + 's ease-in-out'
    })

    const defaultBTimeout = setTimeout(function(){
      $('#overlay').css({
        color: OVERLAY_DEFAULT_COLOR,
        transition:'color '+ TRANSITION_DEFAULT_B/1000 + 's ease-in-out'
      })
    }, DELAY_DEFAULT_B)
    myTimeouts.push(defaultBTimeout);

  }, DELAY_OVERLAY_FADEIN)
  myTimeouts.push(fadeInTimeout);

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
     if (word == "") continue; // Skip empty ones
     const textL = calculateTextLength(word + " ")
     cursor.x -= textL;
     if (cursor.x < MARGIN_LEFT - extraSpace) {
       //console.log("new line")
       cursor.y -= LINE_HEIGHT
       cursor.x += CONTENT_WIDTH
       // Right align
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
      if (offsetArray[index].text === word) {
        const newSpan = document.createElement('span');
        newSpan.innerText = word + " ";
        $('#beforeAnchorB > span:last').append(newSpan);

        if (offsetArray[index].top == offsetATop + MARGIN_TOP) {
          // Offset left might need adjustment
          if (offsetArray[index].left < offsetALeft + MARGIN_LEFT) {
            // console.log("off", word, offsetArray[index].left);
            // Adjust the whole line for the rest
            const offLeft = 7 + offsetALeft + MARGIN_LEFT - offsetArray[index].left;
            offsetArray = adjustOffLeft(offsetArray, index, offLeft)
          }
        } 
        $(newSpan).offset({
          left:offsetArray[index].left,
          top: offsetArray[index].top
        })
        index ++;
      } else {
        console.warn("doesn't match", offsetArray[index].text, word)
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
    // Multi line anchor, split to spans;
    const anchorWords = anchor.innerText.split(" ");
    $(anchor).empty();
    for (var i = 0; i < anchorWords.length; i++) {
      const word = anchorWords[i];
      if (word == "") continue; // Skip empty ones
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

function basicAnalyze(aspan, bspan, predefinedAnchor) {
  const dbug = 0;
  const ref = {
    x:aspan.width()/2,
    y:aspan.height()/2 + aspan[0].offsetTop - TEXT_SIZE
  }
  // console.log(predefinedAnchor);
  return new contextReport(aspan, bspan, ref, predefinedAnchor);
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
  // Loop through all the a unit in the paragraph and render a report
  $('.adiv .unit').each(function(){
    console.log($(this).closest('.page')[0].id, getCurrentUnitIndex($(this)));
    const bspan = getMatchingUnit(this);
    basicAnalyze($(this), bspan);
  })
}

function postParsing() {
  initializeCSS();
  postMenuPopulation();
  // User Interaction
  $('.adiv .unit:not(.hidden)').mouseenter(function(){
    const unitOnHover = $(this);
    debug && console.log("phase1")
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
      debug && console.log("evaluate for phase2")
      unitOnHover.addClass("active");
      // if already on hover shared span
      const currentOnHover = unitOnHover.find('.shared:hover');
      if (unitOnHover.hasClass("toB") || currentOnHover.length != 0) {
        debug && console.log(unitOnHover.find('.shared:hover'))
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
    debug && console.log("mouseout")
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

  // test()
}
