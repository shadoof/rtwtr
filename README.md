# rtwtr : reading through writing through reading ...

# Notes: 

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

# Or, with a special delimiter:

`git diff --no-index --word-diff-regex=[^_]+ --word-diff=porcelain a_file_delimited.txt b_file_delimited.txt > abworddiff_delimited.txt`

**(looks like we might be working with this one)** produces:

```
diff --git a/a_file_delimited.txt b/b_file_delimited.txt
index 2466f8d..0becf71 100644
--- a/a_file_delimited.txt
+++ b/b_file_delimited.txt
@@ -1,7 +1,4 @@
-This “writing through”_of Vilém Flusser’s ‘The Future of Writing’_– reconfiguring_it_so as to become_John Cayley’s ‘The Future of Language’ –
+This essay
 _will not consider_
-problems_concerning any possible future_for the teaching or philosophizing_of an art_of language
+the problems_concerning the future_of teaching_the art of writing
 _in the face_of the growing importance_
-of non- or anti-linguistic messages
+of nonliterate messages
 _in our surroundings,_
-although_those problems_have already become_significant_in the so-called developed countries.
~
-It
+although those problems_will become_ever more important_both_in the so-called developed countries_and_in societies_where illiteracy_is still_widespread.
~
+Instead,_it
 _proposes_to consider_a tendency_that_underlies_those problems:_namely,_
+the tendency_away from linear codes_such as writing_and_toward_two-dimensional codes_such as photographs, films, and TV,
 _a tendency
-to deny or distrust_the fundamental linearity_of language_(as perceptible phenomenon)_in favor_of multi-dimensional codes_such as photographs, film, television, screen-based graphic design in the service of social and socialized media,_and,_generally,_a conception_of art and aesthetics
 _that
-is dominated_by visuality,_by so-called “fine” as “visual” or “plastic” art_even_as and when_this world_of art_embraces_the conceptualism or “post-medium condition”_which_could,_in principle if not in practice,_be extended_to the arts_of language.
~
-This distrust and denial
 _may be observed
-everywhere
 _if_one_glances_even superficially_at the codified world_that_surrounds_us.
~
-Literature_is_$50bn_behind art.
~
-The MoMAs_in every province and metropolis_are stuffed_to their gills_with hipsters, gleeful families and young “artists”_while_fewer and fewer deserted book malls_provide_desultory subterranean spaces_for retiree reading groups.
~
-The “future”_of language_– or rather_of those gestures_which align symbols_to produce_our shared, collective, readable utterances –
+The future_of writing,_of that gesture_which_aligns_symbols_to produce texts,
 _must be seen_against the background_
-of a long-standing tendency_to distrust_their alignment.
+of that tendency.
~
 <pb/>
~

```

<br>

To Install:

$ npm install

<br>

To Run:

open index.html in a browser (using a local server is advisable)
