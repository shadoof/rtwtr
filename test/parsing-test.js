// Definitions
const CLAUSE_BREAKS = ["_,_", "_;_", "_:_", "</cb>"];
const THOUGHT_BREAKS = ["_._", "_?_", "_!_", "</tb>"]; // Done
const PARAGRAPH_BREAK = "<pb/>"; // Done
const SECTION_BREAK = "<sb/>"; // Done
const UNIT_PAIRS = ["<ub>","</ub>"];// Done

const DEFAULT_PATH = ".tb:last";

// Tools
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

function endsWithAny(str, array){
  for (let i = 0; i < array.length; i++) {
    const word = array[i];
    if (str.endsWith(word)) return true;
  }
  return false;
}
// Parsing Section
function removeGitDiffSyntags(content) {
  return content.replace(/(^-|^\+|_)/g,"");
}

function removeBreaks(content) {
  return content.replace(/(<ub>|<\/ub>|<sb\/>|<pb\/>)/g,"");
}

function removeEmptyElements(selector) {
  // remove redundant
  $(selector).each(function() {
     if( $(this)[0].innerHTML == "")  $(this)[0].remove();
  });
}

function getCurrentIndexInDerectParent(dom) {
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
  let contentToBeAppend = document.createElement('div');
  $(contentToBeAppend).attr("id", "content");

  let currentPage = 1, currentNo = 0, match = false;

  createNewPage(currentPage, contentToBeAppend);

  for (var i = 0; i < lines.length; i++) {

    const line = lines[i].substr(1),
          type = lines[i][0];
    let content = line,
        newSpan =  document.createElement("span");

    // clean up syntags
    // content = content.replace(/_(,|;|:|.|\?|!)_/g,"$1 ");
    content = removeGitDiffSyntags(content);
    content = removeBreaks(content);

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
            if (content != "") {
              currentAdiv.find(DEFAULT_PATH).append(newSpan);
              currentBdiv.find(DEFAULT_PATH).append(newSpan.cloneNode(true));
            }
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
  $('body').append(contentToBeAppend);
  removeEmptyElements('.tb')
  // set current page
  $('#page1').addClass('current')

  $('.adiv > p > span').mouseover(function() {
    const spanIdx = getCurrentIndexInDerectParent($(this));
    const pIdx = getCurrentIndexInDerectParent($(this).parent());
    const currentPage = $(this).parent().parent().parent();

    const bspan = currentPage.find('.bdiv').children().eq(pIdx).children().eq(spanIdx);
    $('.bdiv p > span').hide();
    bspan.show();
  })

  $('.adiv > p > span').mouseout(function() {
    $('.bdiv p > span').hide();
  })
  $('.menu li').click(function() {
    console.log(this.innerText)
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

function getClosestSharedSpan() {
  // TODO
  // return closest;
}

function repositionB(element, anchor) {
  // TODO
  // KEY: get offsetLeft
  // Element defines which level we are working with: it can be <cb> or <ub>
}

// End of Visualization Section

readTextFile("../data/ab_worddiff.txt", parseText);
