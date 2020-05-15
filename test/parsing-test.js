// Definitions
const CLAUSE_BREAKS = [", ", "; ", ": ", "</cb> "];
const THOUGHT_BREAKS = [". ", "? ", "! ", "</tb>"]; // Done; space after needed
const PARAGRAPH_BREAK = "<pb/>"; // Done
const SECTION_BREAK = "<sb/>"; // Done
const UNIT_PAIRS = ["<ub>","</ub>"];// Done

const DEFAULT_PATH = ".tb:last";

// Typography
const TEXT_SIZE = 20, LINE_HEIGHT = 23;
// Layout
const CONTENT_WIDTH = 800, MARGIN_LEFT = 200;

let myTimeouts = [], phaseLive=false;
// Tools

function endsWithAny(str, array){
  for (let i = 0; i < array.length; i++) {
    const word = array[i];
    if (str.endsWith(word)) return true;
  }
  return false;
}

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
  return content.replace(/(<ub> |<\/ub> |<sb\/> |<pb\/> )/g,"");
}

function removeEmptyElements(selector) {
  // remove redundant
  $(selector).each(function() {
     if( $(this)[0].innerHTML == "")  $(this)[0].remove();
  });
}

function getCurrentIndexInDirectParent(dom) {
  const children = dom.parent().children();
  for (var i = 0; i < children.length; i++) {
    if (children[i] == dom[0]) return i;
  }
  return false;
}

function parseText(data) {
  const lines = data.split("\n");
  // skip the top section
  lines.splice(0, 5);
  // Cayley's preprocessing
  for (var i = 0; i < lines.length; i++) {
    lines[i] = lines[i].replace(/^  /," ").replace(/(\S)$/,"$1 ").replace(/> $/,">");
  }
  let contentToBeAppend = document.createElement('div');
  $(contentToBeAppend).attr("id", "content");

  let currentPage = 1, currentNo = 0, match = false;

  createNewPage(currentPage, contentToBeAppend);

  for (var i = 0; i < lines.length; i++) {

    const line = lines[i].substr(1),
          type = lines[i][0];
    let content = lines[i],
        newSpan =  document.createElement("span");

    // clean up syntags
    content = removeGitDiffSyntags(content);
    content = removeBreaks(content);
    // fix space after & before punctuatiion
    // NOT NEEDED content = content.replace(/([,;:.\?!])$/g,"$1 ");
    // content = content.replace(/^ ([,;:.\?!])/g,"$1");
    newSpan.innerText = content;

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
          } else if (line == PARAGRAPH_BREAK) {
            // Handle paragraph breaks
            currentAdiv.append("<p></p>");
            currentBdiv.append("<p></p>");
          } else if (UNIT_PAIRS.indexOf(line) > -1) {
            // Handle unit
            if (line == UNIT_PAIRS[0]) {
              const unit = "<span class='unit manual'><span class='tb'></span></span>";
              currentAdiv.find("p:last").append(unit);
              currentBdiv.find("p:last").append(unit);
            } else {
              const tb = "<span class='tb'></span>";
              currentAdiv.find("p:last").append(tb);
              currentBdiv.find("p:last").append(tb);
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

    // Handle THOUGHT_BREAKS
    if(endsWithAny(line, THOUGHT_BREAKS)) {
      const tb = "<span class='tb'></span>";
      currentAdiv.find(".tb:last").parent().append(tb);
      currentBdiv.find(".tb:last").parent().append(tb);
    }

  } // End of for loop

  // append content
  $(contentToBeAppend).append($('#overlay'));
  $('body').append(contentToBeAppend);
  initTester();
  removeEmptyElements('.tb')
  // set current page
  $('#page1').addClass('current')

  // user interaction
  $('.adiv > p > span:not(.hidden)').mouseenter(function(){
    const spanOnHover = $(this);
    console.log("phase1")
    spanOnHover.addClass("active");
    const phase1Timeout = setTimeout(function(){phase3(spanOnHover)}, 3000, spanOnHover);
    myTimeouts.push(phase1Timeout);

  });

  $(document).on('click','.adiv .active .shared',function(e){
    phase2($(e.target));
  });

  $('.adiv > p > span, .adiv').mouseleave(function() {
    console.log("mouseout")
    phaseLive = false;
    $('.adiv > p > span').removeClass("active");
    $('.adiv > p > span').removeClass("hidden");

    $('.adiv span').removeClass("anchor");
    // clear settimeout
    clearTimeouts(myTimeouts);
    $('#overlay').css("opacity","0");

  })
  // End of User Interaction

  // Menu
  $('.menu li').click(function() {
    //console.log(this.innerText)
    $('.page').removeClass('current')
    $('#page'+ this.innerText).addClass('current')
  })

}
// End of Parsing Section
function getMatchingBFromA(aspan) {
  const spanIdx = getCurrentIndexInDirectParent($(aspan));
  const pIdx = getCurrentIndexInDirectParent($(aspan).parent());
  const currentPage = $(aspan).parent().parent().parent();
  const bspan = currentPage.find('.bdiv').children().eq(pIdx).children().eq(spanIdx);

  return bspan;
}

function clearTimeouts(timeouts) {
  for (var i = 0; i < timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }
}
function phase2(target) {
  if (phaseLive) return;
  let aspan = target.parent();
  if (!aspan.parent().is("p")) aspan = aspan.parent();

  console.log("phase2", target, target.id);
  phaseLive = true;
  $(aspan).addClass("hidden");
  animate(getMatchingBFromA(aspan), aspan, target)
}

function phase3(thisDom) {
  if (phaseLive) return;
  const bspan = getMatchingBFromA(thisDom);

  console.log("phase3", thisDom)
  phaseLive = true;
  $(thisDom).addClass("hidden");
  animate(bspan, $(thisDom));
}

// Visualization Section
function createNewPage(index, wrapper) {
  const page = $('#template .page').clone()[0];
  page.id = "page" + index;
  $(wrapper).append(page);
  // populate menu
  $('.menu ul').append("<li>"+ index + "</li>");
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
  // clear overlay
  console.log("clear overlay")
  $('#overlay').css("opacity","0");
  $('#overlay span').text("");
  clearTimeouts(myTimeouts);

  let context = basicAnalyze(aspan, bspan, predefinedAnchor);
  if (context.sharedSpans == undefined) {
    console.log("no shared spans, do nothing")
    return;
  }

  $(context.anchor).addClass("anchor");

  const hoverAnchor = document.getElementById("anchor");
  // fill the overlay layer
  $('#beforeAnchorA').text(context.before.a.content); // fake before a to get the right spacing
  $('#anchor').text(context.anchor.content);
  $('#afterAnchor').text(context.after.b.content);

  const overlay = document.getElementById("overlay");
  overlay.style.top = (aspan[0].offsetTop) + "px";
  overlay.style.textIndent = (aspan[0].offsetLeft) + "px";

  layoutBeforeB(context.before.b.content, hoverAnchor);

  // display
  const myTimeout = setTimeout(function(){
    $('#overlay').animate({opacity:1}, {
    duration:10, // TODO: need to solve overlay issue if we want a duration for the css animation
    complete:function() {
      //console.log("complete")
    }})
  }, 1000)
  myTimeouts.push(myTimeout);

}

function layoutBeforeB(content, anchor) {
  const words = content.split(" ");
  words.reverse();
  let cursor = handleMultiLineAnchor(anchor);
  console.log(cursor);
  // clear previous layout
  $('#beforeAnchorB').empty();

  for (var i = 0; i < words.length; i++) {
     const word = words[i];
     if (word == "") continue; // skip empty ones
     const newSpan = document.createElement('span');
     newSpan.innerText = word + " ";
     const textL = calculateTextLength(newSpan.innerText)
     cursor.x -= textL;
     if (cursor.x < MARGIN_LEFT) {
       console.log("new line")
       cursor.y -= LINE_HEIGHT
       cursor.x += CONTENT_WIDTH
       // right align
       if (cursor.x + textL > CONTENT_WIDTH + MARGIN_LEFT) {
         cursor.x = CONTENT_WIDTH + MARGIN_LEFT - textL;
       }

     }
     //console.log(newSpan.innerText, cursor);
     $('#beforeAnchorB').append(newSpan);
     $(newSpan).offset({
       left: cursor.x,
       top: cursor.y
     })

  }

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

// End of Visualization Section

readTextFile("../data/ab_worddiff.txt", parseText);
