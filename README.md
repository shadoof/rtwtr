# rtwtr : reading through writing through reading ...

# Notes: 

**git word-diff using "_" delimiter:**

`git diff --no-index --word-diff-regex=[^_]+ --word-diff=porcelain a_file.txt b_file.txt > ab_worddiff.txt`

**Output from run on page 1 for parsing:**

```
 1 diff --git a/a_file.txt b/b_file.txt
 2 index 8e4e45b..4e84f4c 100644
 3 --- a/a_file.txt
 4 +++ b/b_file.txt
 5 @@ -1,7 +1,4 @@
 6  _
 7 -This “writing through”_of Vilém Flusser’s ‘The Future of Writing,’_reconfiguring_it_so as to become_John Cayley’s ‘The Future of Language,’
 8 +This essay
 9  _will not consider_
10 -problems_concerning any possible future_for the teaching or philosophizing_of an art_of language
11 +the problems_concerning the future_of teaching_the art of writing
12  _in the face_of the growing importance_
13 -of non- or anti-linguistic messages
14 +of nonliterate messages
15  _in our surroundings,_
16 -although_those problems_have already become_significant_in the so-called developed countries.
17 +although those problems_will become_ever more important_both_in the so-called developed countries_and_in societies_where illiteracy_is still_widespread.
18  _<sb/>_
19 ~
20  _Instead,_it_proposes_to consider_a tendency_that_underlies_those problems:_namely,_
21 +the tendency_away from linear codes_such as writing_and_toward_two-dimensional codes_such as photographs, films, and TV,
22  _a tendency
23 -to deny or distrust_the fundamental linearity_of language_(as perceptible phenomenon)_in favor_of multi-dimensional codes_such as photographs, film, television, screen-based graphic design in the service of social and socialized media,_and,_generally,_a conception_of art and aesthetics
24  _that
25 -is dominated_by visuality,_by so-called “fine” as “visual” or “plastic” art_even_as and when_this world_of art_embraces_the conceptualism or “post-medium condition”_which_could,_in principle if not in practice,_be extended_to the arts_of language._<sb/>_
26 ~
27 -_This distrust and denial
28  _may be observed
29 -everywhere
30  _if_one_glances_even superficially_at the codified world_that_surrounds_us._<sb/>_
31 ~
32  _
33 -Literature_is_$50bn_behind art._<sb/>_
34 ~
35 -_The MoMAs_in every province and metropolis_are stuffed_to their gills_with hipsters, gleeful families and young “artists”_while_fewer and fewer deserted book malls_provide_desultory subterranean spaces_for retiree reading groups._<sb/>_
36 ~
37 -_The “future”_of language,_or rather,_of those gestures_which align symbols_to produce_our shared, collective, readable utterances,
38 +The future_of writing,_of that gesture_which_aligns_symbols_to produce texts,
39  _must be seen_against the background_
40 -of a long-standing tendency_to distrust_their alignment.
41 +of that tendency.
42  _<sb/>_
43 ~
44  _<pb/>_
45 ~
```

<br>

To Install:

$ npm install

<br>

To Run:

open index.html in a browser (using a local server is advisable)
