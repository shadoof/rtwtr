# rtwtr : reading through writing through reading ...

# Notes: 

Text preparation workflow goes like this:

1. Plain text a & b files (which may have some inline html) are prepared from a word-processed essay (in this case).
2. The texts are pre-processed (I do this in BBEdit but this could quite easily be scripted or incorporated into webapp preprocessing, down the line) so that it is marked up with break-marking tags which target the results we want from a form of git's word-diff command. I run the following replace-all greps on the plain text files:
	* `([\S]+\s) -> \1_`
	* `([“‘”’\;,:\)\(\?\.\!]) -> _\1_` (there's surely a better formulation)
3. The marked up texts are now in a\_file.text and b\_file.text, so we run this command on them (see below for sample output).
	```
	git diff --no-index --word-diff-regex=[^_]+ --word-diff=porcelain a_file.txt b_file.txt > ab_worddiff.txt
	```
4. The a and b files can now be laid out in spans by parsing this ab\_worddiff.txt output in the webapp.
	

#break-marking tags

**some definitions:**

**shared span** = a run of one or more matching 'words' (as defined by word-diff) that is shared in the a\_file and b\_file. The rendered positions of shared spans in the a\_file become potential **anchors** or registration points for the units from the b\_file when they are faded in. **units** are sequences of spans that are either marked as equivalent in different **sections** of the files ***(there must be an equal number of units in each a\_file and b\_file section)*** or defined by `<tb/>` level tags or punctuatiion (see below). That is:

If no units are marked explicitly, then units are defined by <tb/> tags.

`_,_ or _;_ or _:_ and/or <cb/> = "comma" or "clause" break.` Allows for this to be matched by word-diff and thus to rebase the forward looking diff algorithm. This is removed on rendering with no effect on html. (Anything either side of this tag is in the same `<p></p>`.) Used 'inline' with "\_" either side: "\_<cb/>\_"

`_._ or _?_ or _!_ or <tb/> = "thought" break.` As above. It tag, then on its own line. Used for conventional sentences. By default, defines **units** for sections which have an equal number of sentences/thoughts.

`<pb/> = "paragraph" break.` As above, but on its own line in a source file with no delimiters. Simply renders a new `<p></p>` (or equivalent) in the html.

`<ub></ub> A tag pair that overrides unit definition` That is, the visualization "units" for a screen or section. Needs to be a tag pair so as to be able to enclose (exceptionally) more than one <cb/> or <pb/> and or </tb> and their shared spans. Currently coded as `_<ub>_` and `_</ub>_`.

`<sb/> = "screen" or "section" break.` On its own line in the source file. Marks generation and separate rendering of a new screen.

#rtwtr git word diff

**git word-diff using "_" delimiter:**

`git diff --no-index --word-diff-regex=[^_]+ --word-diff=porcelain a_file.txt b_file.txt > ab_worddiff.txt`

**Output from run on page 1 for parsing:**

```
 1 diff --git a/a_file.txt b/b_file.txt
 2 index a6e7ea2..af02400 100644
 3 --- a/a_file.txt
 4 +++ b/b_file.txt
 5 @@ -1,10 +1,8 @@
 6  This _
 7 -“_writing _through_”_ _of _Vilém _Flusser_’_s __‘_The _Future _of _Writing,_’_ _reconfiguring _it _so _as _to _become _John _Cayley_’_s __‘_The _Future _of _Language,_’_ 
 8 +essay 
 9  _will _not _consider _
10 +the 
11  _problems _concerning 
12 -any _possible _future _for 
13  _the _
14 -teaching _or _philosophizing 
15 +future 
16  _of _
17 -an 
18 +teaching _the 
19  _art _of _
20 -language 
21 +writing 
22  _in _the _face _of _the _growing _importance _of _non_
23 --_ _or _anti_-_linguistic 
24 +literate 
25  _messages _in _our _surroundings, _although _those _problems _
26 -have _already 
27 +will 
28  _become _
29 -significant 
30 +ever _more _important _both 
31  _in _the _so_-_called _developed _
32 -countries.
33 +countries _and _in _societies _where _illiteracy _is _still _widespread.
34 ~
35  _<sb/>
36 ~
37  _Instead, _it _proposes _to _consider _a _tendency _that _underlies _those _problems: _namely, _the _tendency _
38 -to _deny _or _distrust _the _fundamental _linearity _of _language _(as _perceptible _phenomenon) 
39 +away _from _linear _codes _such _as _writing 
40  _and _toward _
41 -multi
42 +two
43  _-_dimensional _codes _such _as _photographs, _films, 
44 -TV, _screen_-_based _graphic _design _in _the _service _of _social 
45  _and _
46 -socialized _media, _and, _generally, 
47 +TV, 
48  _a _
49 -conception _of _art _and _aesthetics 
50 +tendency 
51  _that 
52 -is _dominated _by _visuality, _by _so_-_called __“_fine_”_ _as __“_visual_”_ _or __“_plastic_”_ _art _even _as _and _when _this _world _of _art _embraces _the _conceptualism _or __“_post_-_medium _condition_”_ _which _could, _in _principle _if _not _in _practice, _be _extended _to _the _arts _of _language.
53 ~
54 -This _distrust _and _denial 
55  _may _be _observed 
56 -everywhere 
57  _if _one _glances _even _superficially _at _the _codified _world _that _surrounds _us.
58 -Literature _is _$50bn _behind _art.
59 ~
60 -The _MoMAs _in _every _province _and _metropolis _are _stuffed _to _their _gills _with _hipsters, _gleeful _families _and _young __“_artists_”_ _while _fewer _and _fewer _deserted _book _malls _provide _desultory _subterranean _spaces _for _retiree _reading _groups.
61 ~
62  _<sb/>
63 ~
64  _The _
65 -“_future_”_ 
66 +future 
67  _of _
68 -language, _or _rather, 
69 +writing, 
70  _of _
71 -those _gestures 
72 +that _gesture 
73  _which _
74 -align 
75 +aligns 
76  _symbols _to _produce _
77 -our _shared, _collective, _readable _utterances, 
78 +texts, 
79  _must _be _seen _against _the _background _of _
80 -a _long_-_standing _tendency _to _distrust _their _alignment.
81 +that _tendency.
82 ~
83  _<sb/>
84 ~
85  _<pb/>
86 ~
87  _
88 ~
```

<br>

To Install:

$ npm install

<br>

To Run:

open index.html in a browser (using a local server is advisable)
