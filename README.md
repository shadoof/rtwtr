# rtwtr : reading through writing through reading ...

Notes: 

`git diff --no-index --word-diff=porcelain a_file.txt b_file.txt`

produces the kind of output we will work with.
<br>

# Sample of Output from this command:
```
diff --git a/a_file.txt b/b_file.txt
index 16005d6..efdef91 100644
--- a/a_file.txt
+++ b/b_file.txt
@@ -1,7 +1,4 @@
 This 
-“writing through” of Vilém Flusser’s ‘The Future of Writing’ – reconfiguring it so as to become John Cayley’s ‘The Future of Language’ –
+essay
  will not consider 
+the
  problems concerning
-any possible future for
  the 
-teaching or philosophizing
+future
  of 
-an
+teaching the
  art of 
-language
+writing
  in the face of the growing importance of 
-non- or anti-linguistic
+nonliterate
  messages in our surroundings, although those problems 
-have already
+will
  become 
-significant
+ever more important both
  in the so-called developed 
-countries.
~
-It
+countries and in societies where illiteracy is still widespread.
~
+Instead, it
  proposes to consider a tendency that underlies those problems: 
-namely a tendency to deny or distrust
+namely,
  the 
-fundamental linearity of language (as perceptible phenomenon) in favor of multi-dimensional
+tendency away from linear codes such as writing and toward two-dimensional
  codes such as photographs, 
-film, television, screen-based graphic design in the service of social
+films,
  and 
-socialized media, and, generally,
+TV,
  a 
-conception of art and aesthetics
+tendency
  that
-is dominated by visuality, by so-called “fine” as “visual” or “plastic” art even as and when this world of art embraces the conceptualism or “post-medium condition” which could, in principle if not in practice, be extended to the arts of language.
~
-This distrust and denial
  may be observed
-everywhere
  if one glances even superficially at the codified world that surrounds us.
-Literature is $50bn behind art.
~
-The MoMAs in every province and metropolis are stuffed to their gills with hipsters, gleeful families and young “artists” while fewer and fewer deserted book malls provide desultory subterranean spaces for retiree reading groups.
~
 The 
-“future”
+future
  of 
-language – or rather
+writing,
  of 
-those gestures
+that gesture
  which 
-align
+aligns
  symbols to produce 
-our shared, collective, readable utterances –
+texts,
  must be seen against the background of 
-a long-standing tendency to distrust their alignment.
+that tendency.
~
 <pb/>
~

```

Or, with a special delimiter:

<br>

To Install:

$ npm install

<br>

To Run:

open index.html in a browser (using a local server is advisable)
