const Tester = {
  dom: document.getElementById("getTextWidth"),
  end:"."
};

/* */

class contextReport {
  // Each contextReport is generated based on a reference point
  constructor(aspan, bspan, ref, predefinedAnchor) {
    this.sharedSpans = this.verifySharedSpans(aspan, bspan);
    if (this.sharedSpans == null) return;
    this.space = this.spaceDifference(aspan, bspan);
    this.dbug = 1;
    this.ref = ref;
    this.anchor = {};
    this.before = {
      a:{},
      b:{},
    };
    this.after = {
      a:{},
      b:{},
    };
    this.findAnchor(aspan, bspan, predefinedAnchor);
  }
  verifySharedSpans(aspan, bspan) {
    const shared_a = aspan.find('.shared');
    const shared_b = bspan.find('.shared');

    if (shared_a.length != shared_b.length) {
      console.error("Error! shared span numbers doesn't match", shared_a.length, shared_b.length)
    } else {
      if (shared_a.length > 0) {
        return shared_a;
      } else {
        // no shared spans
        return null;
      }
    }
  }
  findAnchor(aspan, bspan, predefinedAnchor) {

    this.anchor.id = predefinedAnchor ? predefinedAnchor.attr("id") : this.getAnchorFromMinDistanceToRef().id;
    this.generateFullReport(aspan, bspan, this.anchor.id);
    const whichSharedSpan = this.whichSS(this.anchor)
    this.adjustAnchorIfNotFit(whichSharedSpan,aspan, bspan);
  }
  whichSS(span){
    for (var i = 0; i < this.sharedSpans.length; i++) {
      if (this.sharedSpans[i] == span) return i;
    }
  }
  getAnchorFromMinDistanceToRef() {
    let distances = [];
    for (var i = 0; i < this.sharedSpans.length; i++) {
      const s = this.sharedSpans[i];
      const spanCenter = {
        x:s.offsetLeft + $(s).width()/2,
        y:s.offsetTop + $(s).height()/2
      }
      const distance = Math.abs(spanCenter.x - this.ref.x) + Math.abs(spanCenter.y - this.ref.y);
      this.dbug && console.log(distance, spanCenter.x, spanCenter.y, s.innerText);
      distances.push(distance);
    }
    this.dbug && console.log(distances);
    const minDistance = Math.min(...distances);

    let whichSharedSpan = distances.indexOf(minDistance);
    this.dbug && console.log(whichSharedSpan, this.sharedSpans[whichSharedSpan].innerText);
    //console.log(whichSharedSpan, this.sharedSpans[whichSharedSpan],this.sharedSpans);
    return this.sharedSpans[whichSharedSpan]
  }

  spaceDifference(aspan, bspan) {
    const aText = getAllContent(aspan.find('span:not(.tb)'));
    const bText = getAllContent(bspan.find('span:not(.tb)'));
    return calculateTextLength(aText) - calculateTextLength(bText)
  }

  adjustAnchorIfNotFit(whichSharedSpan,aspan, bspan) {
    // However, the content of b may not fit into the space
    let attempt = 0
    while (this.before.indent < 0 || this.after.indent < 0) {
      attempt ++;
      if (attempt > this.sharedSpans.length) break; // avoid getting stuck in the while loop
      if (this.before.indent < 0 && this.after.indent >= 0) {
        const gap = this.before.indent;
        whichSharedSpan ++;
        this.dbug && console.log(whichSharedSpan-1, "-> ", whichSharedSpan);
        if (whichSharedSpan < this.sharedSpans.length) {
          const id = this.sharedSpans[whichSharedSpan].id;
          this.generateFullReport(aspan, bspan, id);
          if (this.after.indent < 0 && this.before.indent >= 0) {
            this.dbug && console.log("choose one from two situations")
            if (this.after.indent >=  gap) break;
            else {
              // go back
              whichSharedSpan --;
              const id = this.sharedSpans[whichSharedSpan].id;
              this.generateFullReport(aspan, bspan, id);
            }

          }
          this.dbug && console.log("adjust +", id)
        } else if (whichSharedSpan - 2 >= 0){
          // try going to another direction
          whichSharedSpan -= 2;
          const id = this.sharedSpans[whichSharedSpan].id;
          this.generateFullReport(aspan, bspan, id);

        } else {
          if (this.spaceDifference > - 5) {
            // fix
            this.dbug && console.log("Todo")
          } else {
            // move a
            this.dbug && console.log("Not enough space for b, no solution found.")
          }
          break;
        }
      } else if(this.after.indent < 0 && this.before.indent >= 0) {
        const gap = this.after.indent;
        whichSharedSpan --;
        if (whichSharedSpan >= 0) {
          const id = this.sharedSpans[whichSharedSpan].id;
          this.dbug && console.log("adjust -", id)
          this.generateFullReport(aspan, bspan, id);

          if (this.before.indent < 0 && this.after.indent >= 0) {
            this.dbug && console.log("choose one from two situations")
            if (this.before.indent >=  gap) break;
            else {
              // go back
              whichSharedSpan --;
              const id = this.sharedSpans[whichSharedSpan].id;
              this.generateFullReport(aspan, bspan, id);
            }
          }
        } else {
          // calculateTextLength()
          this.dbug && console.log("Not enough space for b after, no solution found.")
          break;
        }
      } else if(this.after.indent < 0 && this.before.indent < 0){
        this.dbug && console.log("B span is larger than A span!",this.before.indent, this.after.indent)
        // get the first shared span
        whichSharedSpan  = 0;
        const id = this.sharedSpans[whichSharedSpan].id;
        this.generateFullReport(aspan, bspan, id);
        break;
      }
    }
  }
  findTheBestAnchorIfNotFit(whichSharedSpan,aspan, bspan) {
    //TODO: replace adjustAnchor
  }
  generateFullReport(aspan, bspan, anchorId) {
    this.getAnchorInfo(anchorId);
    this.generateContext("a", aspan, this.anchor.idx);
    this.generateContext("b", bspan, this.anchor.idx);
    this.calculateIndents();
  }
  calculateIndents() {
    this.before.indent = this.before.a.length - this.before.b.length
    this.after.indent = this.after.a.length - this.after.b.length
  }
  generateContext(t, parent, idx) {
    this.before[t] = this.analysis("before", t, parent, idx);
    this.after[t] = this.analysis("after", t, parent, idx);
  }

  analysis(section, t, parent, idx) {
    const getChildren = section == "before" ? getChildrenBefore: getChildrenAfter;
    const spans = getChildren(parent.find('span:not(.tb)'), t + idx);
    const content = getAllContent(spans);
    return {
      spans: spans,
      content: content,
      length: calculateTextLength(content)
    }
  }

  getIdxFromId(id){
    return parseInt(id.replace(/[a-zA-Z ]/g,""));
  }
  getAnchorInfo(id) {
    this.anchor = $('#' + id)[0];
    this.anchor.idx = parseInt(id.replace(/[a-zA-Z ]/g,""));
    this.anchor.content = this.anchor.innerText;
  }

}


function getChildrenBefore(children, key) {
  if (typeof key == "number") {
    return children.slice(0, key);
  } else if (typeof key == "string") {
    for (var i = 0; i < children.length; i++) {
      if (children[i].id == key) {
        return children.slice(0, i);
      }
    }
  }
}

function getChildrenAfter(children, key) {
  if (typeof key == "number") {
    return children.slice(key+1, children.length);
  } else if (typeof key == "string") {
    for (var i = 0; i < children.length; i++) {
      if (children[i].id == key) {
        return children.slice(i+1, children.length);
      }
    }
  }
}

function getAllContent(spans) {
  let all = "";

  for (var i = 0; i < spans.length; i++) {
    if (spans[i].innerText == undefined) {
      this.dbug && console.log("Error! Can't retrieve innerText.")
    } else {
      all += spans[i].innerText;
    }
  }
  return all;
}

function calculateTextLength(text) {
  Tester.dom.innerText = text + Tester.end;
  return Tester.dom.clientWidth - Tester.trim;
}

function initTester(){
  Tester.dom.innerText = Tester.end;
  Tester.trim = Tester.dom.clientWidth;
}
