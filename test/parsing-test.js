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

function createNewPage(index) {
  const page = $('#template .page').clone()[0];
  page.id = "page" + index;
  $('#content').append(page);
}

function parseText(data) {
  let a_file = [], b_file = [];
  const lines = data.split("\n")

  // skip the top section
  lines.splice(0, 5);

  let currentPage = 1, currentNo = 0, unit = false;
  createNewPage(currentPage);

  for (var i = 0; i < lines.length; i++) {

    const line = lines[i],
          type = line[0];
    let content = line,
        newSpan =  document.createElement("span");
    // remove syntags
    content = content.replace(/(^-|^\+)/g,"");
    content = content.replace(/(_|<sb\/>|<pb\/>)/g," ");

    newSpan.innerText = content;

    switch(type) {
      case "-":
         newSpan.id = "a" + currentNo;
         unit = true;
         newSpan.classList += " hide";
         $('#page' + currentPage +' .adiv').append(newSpan);
         // hide = append a span (.hide)
        break;
      case " ":
          if (unit == true) currentNo++;
          unit = false;
          if (line ==" _<pb/>_") {
            currentPage ++;
            createNewPage(currentPage);
          } else {
            $('#page' + currentPage +' .adiv').append(newSpan);
            // unchanged  = append a span
          }

        break;
      case "+":
          newSpan.id = "b" + currentNo;
          unit = false;
          currentNo++;
          $('#page' + currentPage +' .bdiv').append(newSpan);
          // add = append b span (display:none)
        break;
      case "~":
        // new line
        if (unit == true) currentNo++;
        unit = false;
        break;
      default :
        //console.log("[Warning] Unparsable line", line);
    }

  }
}

readTextFile("../data/abworddiff_delimited.txt", parseText);
