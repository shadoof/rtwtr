// Parser: Definitions
const PUNCTUATION = /[.,;:]/; // no &lt; or &gt;
const PUNCTUATIONLF = /[“”‘’!"#$%&'()*+,-–—./:;<=>?@[\]^_{|}~`]\n/;
const CLAUSE_BREAKS = [", ", "; ", ": ", "</cb> "];
const THOUGHT_BREAKS = /([!.?][”"]?)|(<tb\/>)+$/g;
const PARAGRAPH_BREAK = /<pb\/>/g;
const SECTION_BREAK = "<sb/>";
const UNIT_PAIRS = /<ub>|<\/ub>/g;
const VERSE_PAIRS = /<verse>|<\/verse>/g;
const DEFAULT_PATH = ".tb:last";

// Tools

function wordCount(str) {
  return str.trim().split(/\s+/).length;
}

function readTextFile(file, callback)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
    {
      if(rawFile.status === 200 || rawFile.status == 0)
      {
        var allText = rawFile.responseText;
        callback(allText);
      }
    }
  }
  rawFile.send(null);
}
// End of Tools

// Parsing Section
function removeGitDiffSyntags(content) {
  return content.replace(/(^-|^\+|^[ \t])/g,"");
}

function removeBreaks(content) {
  return content.replace(/(<ub> |<\/ub> |<sb\/> |<pb\/>|<tb\/>)/g,"");
}

function removeEmptyElements(selector) {
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
      $(p).insertBefore(children[i])
      p = document.createElement('p');
    }

  }

  if (p.children.length > 0) parent.append(p);
}

function wrapAllDiretChildrenToP() {
  $('.page').each(function() {
    wrapDirectChildrenToP($(this).find('.adiv'));
    wrapDirectChildrenToP($(this).find('.bdiv'));
  })
}

function createNewPage(index, wrapper) {
  const page = $('#template .page').clone()[0];
  page.id = "page" + index;
  $(wrapper).append(page);
  // Populate menu - not needed for viajsdiff fork
  // $('.menu select').append("<option value='" + index +"'>"+ index + "</option>");
}


function parseDiff(lines, callback) {

  // console.log(lines); // DEBUGGING
  // if there is no div #content, create one
  let contentToBeAppend = $('#content')[0];
  if (contentToBeAppend == undefined) {
    contentToBeAppend = document.createElement('div');
    $(contentToBeAppend).attr("id", "content");
  }

  let currentPage = 1, currentNo = 0;
  let match = false, inUnit = false, inVerse = false, inP = {a:false, b:false};

  createNewPage(currentPage, contentToBeAppend);
  // $('.menu li').addClass("current");

  for (var i = 0; i < lines.length; i++) {

    const line = lines[i].value;
    const type = lines[i].type;

    let content = line,
      newSpan =  document.createElement("span");
    // Clean up syntags
    // not needed: content = removeGitDiffSyntags(content);
    content = removeBreaks(content);
    // Fix space after sentence end:
    // The following is needed in some form
    // due to diffWords handling of adds or removes at the end of lines:
    // content = content.replace(/(\S)$/g,"$1 ");
    // DEBUGGING - fix is, see below, to add a space to
    // the content (innerHTML) of all THOUGHT-BREAKS:

    // Ignore empty lines
    if (line == "") continue; // actually keep spaces parsed by js diff: || line == " "
    newSpan.innerHTML = content;

    const currentAdiv = $(contentToBeAppend).find('#page' + currentPage +' .adiv'),
      currentBdiv =  $(contentToBeAppend).find('#page' + currentPage +' .bdiv');

    switch(type) {
    case "-":
      newSpan.id = "a" + currentNo;
      match = true;
      newSpan.classList += " hide";
      content != "" && currentAdiv.find(DEFAULT_PATH).append(newSpan);
      break;
    case " ":
      if (match == true) currentNo++;
      match = false;
      if (line == SECTION_BREAK) {
        // Handle section breaks
        if (i != lines.length - 1) {
          // Ignore last section break
          currentPage ++;
          createNewPage(currentPage, contentToBeAppend);
        }
        inP = {a:false, b:false};

      } else if (line.match(UNIT_PAIRS)) {
        // Handle unit
        const LocationA = inP.a ? currentAdiv.find("p:last") : currentAdiv;
        const LocationB = inP.b ? currentBdiv.find("p:last") : currentBdiv;

        if (line == "</ub>") {
          // Create a new tb:last
          const tb = "<span class='tb'></span>";
          LocationA.append(tb);
          LocationB.append(tb);
          inUnit = false;
        } else if (line == "<ub>"){
          inUnit = true;
          const customClassName = /class=["|'](.*?)["|']/g.exec(line);
          let unit = "<span class='unit manual ";
          unit += customClassName != null ? customClassName[1] : "";
          unit += "'><span class='tb'></span></span>";
          LocationA.append(unit);
          LocationB.append(unit);
        }

      } else if (line.match(VERSE_PAIRS)) {
        if (line == "</verse>") {

          inVerse = false;
        } else {
          inVerse = true;
          // console.log(i+6, line, "Verse Begin")
          //add verse class to the current p
        }
      } else {
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
      content != "" && currentBdiv.find(DEFAULT_PATH).append(newSpan);
      break;
    // not needed case "~":
      // new line : no visual representation in the html
      // if (match == true) currentNo++;
      // match = false;
      // break;
    default :
        //console.log("[Warning] Unparsable line", line);
    } // End of Switch


    if (line.match(THOUGHT_BREAKS)) {
      console.log("TB", line);
      // Handle THOUGHT_BREAKS
      newSpan.innerText += " "; // DEBUGGING: simplest way?
      const tb = "<span class='tb'></span>";
      if(type == " " || type == "-") currentAdiv.find(".tb:last").parent().append(tb);
      if(type == " " || type == "+") currentBdiv.find(".tb:last").parent().append(tb);
    }
    if (line.match(PARAGRAPH_BREAK)) {
      // Handle paragraph breaks
      //console.log(i+6, line, inVerse);
      let unitHTML = "<p class='" + (inVerse? "verse": "")+"'>";
      unitHTML += inUnit ? "": "<span class='tb'></span>"
      unitHTML += "</p>";
      if (type == " " || type == "-") {
        currentAdiv.append(unitHTML);
        inP.a = true;
      }
      if (type == " " || type == "+") {
        currentBdiv.append(unitHTML);
        inP.b = true;
      }
    }

  } // End of for loop

  // Append content
  $(contentToBeAppend).append($('#overlayContentBefore'));
  $(contentToBeAppend).append($('#overlay'));
  $(contentToBeAppend).append($('#overlayContentAfter'));
  $('body').append(contentToBeAppend);

  initTester();
  removeEmptyElements('.tb')

  wrapAllDiretChildrenToP();
  // TODO: post parsing wrapping is problematic here for finding the corresponding place to add "verse" class
  // Batch add class unit for tb
  $('.page p > span:not(unit)').addClass("unit");

  $('.bdiv .unit').each(function() {
    // Go over all the units in b,
    // and if it's empty or there is no .shared span in b, add .toB class to corresponding a unit
    if (this.innerHTML == "" || $(this).find(".shared").length == 0)  {
      const aspan = getMatchingUnit(this, 'a');
      aspan.addClass('toB');
    }
  })
  // Set current page
  $('#page1').addClass('current')

  callback();
}

// End of Parsing Section

// master branch reads in a file of porcelain diffs
//
// readTextFile("data/tests/diff_eg.txt", function(data){
//   parseText(data, postParsing);
// });

const textName = "via";
var currenta = 1, currentb = 2, numOfTexts = 5;
// starts here:
readab(textName, currenta, currentb);

function readab(textName, a, b) {
  readTextFile(`data/${textName}${a}.txt`, (data) => {afile = data;
    readTextFile(`data/${textName}${b}.txt`, (data) => {bfile = data;
      parseDiff(tagFriendlyWordDiff(afile,bfile), postParsing);
    });
  });
}

function tagFriendlyWordDiff(a, b) {
  let diffs = Diff.diffWordsWithSpace(a, b);
  let lines = [];
  let misplacedOpenTag = false;
  let type = " ";
  for (let i = 0; i < diffs.length; i++) {
    type = getType(diffs[i]);
    let span = diffs[i].value;
    let l = lines.length;
    // sharedHyphen handling >
    if (type == " " && span.indexOf("-") == 0) {
      let spcIndex = span.indexOf(" ");
      let suffix = span.substr(0,spcIndex);
      span = span.substr(spcIndex + 1);
      lines[l-1].value += suffix;
      lines[l-2].value += suffix;
    }
    // < end sharedHyphen handling
    // misplacedOpenTag handling >
    if (misplacedOpenTag) {
      let tagCloseIndex = span.indexOf(">");
      if (tagCloseIndex != -1) {
        span = "<" + span;
        misplacedOpenTag = false;
      }
    }
    misplacedOpenTag = span.indexOf("<") == span.length - 1;
    if (misplacedOpenTag) span = span.slice(0, span.length - 1);
    // < end misplacedOpenTag handling
    let badPattern = span.search(PUNCTUATIONLF);
    while (badPattern != -1) {
      let tagOnLine = span.slice(0, badPattern + 1);
      pushLineObj(lines, tagOnLine, type);
      span = span.slice(badPattern + 2);
      badPattern = span.search(PUNCTUATIONLF);
    }
    if (span != "") pushLineObj(lines, span, type);
  }
  return lines;
}

function getType(diffsObj) {
  let type = " ";
  if (diffsObj.added == true) type = "+";
  else if (diffsObj.removed == true) type = "-";
  return type;
}

function pushLineObj(arr, value, type) {
  let lineObj = {};
  lineObj.type = type;
  lineObj.value = value;
  arr.push(lineObj);
}
