// Definitions
const CLAUSE_BREAKS = [", ", "; ", ": ", "</cb> "];
const THOUGHT_BREAKS = [".", "?", "!", "</tb>"]; // Done
const PARAGRAPH_BREAK = "<pb/>"; // Done
const SECTION_BREAK = "<sb/>"; // Done
const UNIT_PAIRS = ["<ub>","</ub>"];// Done

const DEFAULT_PATH = ".tb:last";

// Typography
const TEXT_SIZE = 22, LINE_HEIGHT = 30;
// Layout
const CONTENT_WIDTH = 800, MARGIN_LEFT = 200;

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
  return content.replace(/(^-|^\+|^[ \t])/g,""); // not needed: |_
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

function linguisticParsing(content){
  // might not need this
  const elements = content.split(/\s+/);
  let parsedContent = "";
  for (var i = 0; i < elements.length; i++) {
    // if (elements[i] = ) {
      parsedContent += "<span class='min'>" + elements[i] + "</span>"
    // }
  }
  //console.log(parsedContent);
  return content;
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
            currentPage ++;
            createNewPage(currentPage, contentToBeAppend);
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
  $('.adiv > p > span').mouseenter(function() {
    const spanIdx = getCurrentIndexInDirectParent($(this));
    const pIdx = getCurrentIndexInDirectParent($(this).parent());
    const currentPage = $(this).parent().parent().parent();

    const bspan = currentPage.find('.bdiv').children().eq(pIdx).children().eq(spanIdx);
    $('.bdiv p > span').css("opacity","0");
    anime(bspan, $(this));
    $('#overlay').css("opacity","1");

  //  bspan.css("opacity","0.8");

  })

  $('.adiv > p > span').mouseleave(function() {
    $('.bdiv p > span').css("opacity","0");
    $('#overlay').css("opacity","0");
  })


  // menu
  $('.menu li').click(function() {
    //console.log(this.innerText)
    $('.page').removeClass('current')
    $('#page'+ this.innerText).addClass('current')
  })

}
// End of Parsing Section

// Visualization Section
function createNewPage(index, wrapper) {
  const page = $('#template .page').clone()[0];
  page.id = "page" + index;
  $(wrapper).append(page);
  // populate menu
  $('.menu ul').append("<li>"+ index + "</li>");
}


function basicAnalyze(aspan, bspan, mousePosition) {
  const dbug = 0;
  // if no mouse position is provided, default reference point is the center
  const ref = {
    x:mousePosition ? mousePosition.x : aspan.width()/2,
    y:mousePosition ? mousePosition.y : aspan.height()/2 + aspan[0].offsetTop - TEXT_SIZE
  }
  dbug && console.log("Reference point:", ref);
  return new contextReport(aspan, bspan, ref);
}

// function getAnchorIndex(aspan, bspan) {
//   const sharedInB = bspan.find('.shared'),
//         sharedInA = aspan.find('.shared');
//   if (sharedInB.length == sharedInA.length) {
//     return parseInt(getAnchorId(aspan,bspan).replace(/[a-zA-Z ]/g,""));
//     // closest
//   } else {
//     console.log("Error: The number of shared span doesn't match", sharedInA.length, sharedInB.length)
//   }
//
// }





function anime(bspan, aspan) {
  // !! Jquery offset() is different from native javascript offset values

  let context = basicAnalyze(aspan, bspan);
  if (context.sharedSpans == undefined) {
    // no shared spans, do nothing
    return;
  }

  $(context.anchor).addClass("anchor");

  const hoverAnchor = document.getElementById("anchor");

  // TODO: space issue
  $('#anchor').text(context.anchor.content);
  $('#beforeAnchor').text(context.before.b.content);
  $('#afterAnchor').text(context.after.b.content);

  const indent = getIndent(context.before.indent, CONTENT_WIDTH);
  // ! 4px gap between p and span
  document.getElementById("overlay").style.top = (aspan[0].offsetTop-4 + indent.lines*LINE_HEIGHT) + "px";
  document.getElementById("overlay").style.textIndent = (indent.left + context.anchor.offsetLeft) + "px";

}

function getIndent(total, unit) {
  let lines = 0, left = 0;
  while (total > unit) {
    total -= unit;
    lines ++;
  }
  left = total;
  return {
    lines: lines,
    left:left
  };
}

// End of Visualization Section

readTextFile("../data/ab_worddiff.txt", parseText);
