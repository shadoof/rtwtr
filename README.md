# rt(w||w)tr\*
# reading through (writing or word-diff) through reading ...

Concept: John Cayley @shadoof  
Code: Sally Qianxun Chen @cqx931 and John Cayley  
v1.0: June 1, 2020  
HTML, CSS, JaveScript, JQuery

`rt(w||w)tr` is a generalizable framework and webapp reading instrument. It produces dynamic visualizations comparing two texts, or versions of a single text, where the texts are similarly structured and, most usefully, when they share phrases or sequences of natural language in their customary tokenized orthographies.

***It is a transactable visualization of formal word-diff,  
configured for literary critical and language art purposes.***

The framework is based on a deployment of the Unix `diff` command, more specifically, the `word-diff` version that is built into `git`. The engine assumes the same `a` file and `b` file conventions, where, for example, `diffs` are itemized so as to enable successive changes – remove,  preserve, or add – to the `a` file until it matches the `b` file. The engine parses output from a `word-diff` command and this is enough to gnerate the webapp's visualizations. Conventional punctuation is the only thing needed to prepare the files for the engine so long as there are the same number of sentences in both files. These are reconceptualized as `units` in the framework. If the number of sentences is not equal, `unit` markup can be used to render the files meaningfully correspondent for the parser and the visualization engine.

Note: This initial version is limited in that the `units` of the `a` file are expected to be longer or roughly the same length as their corresponding `b` file `units`. A later version of the engine will allow corresponding `units` of any length for either file.

The v1.0 release was produced with word-diff'd texts prepared by John Cayley for the following publication in the inaugural issue of The Digital Review:

```
 The Future of
              -Writing
-Vilém Flusser
              +Language   
```
[ add correct full biblographic with URL here: ]  
Cayley, John, and Sally Qianxun Chen. ‘The Future of / -Writing / -Vilém Flusser / +John Cayley.’ *The Digital Review* 1 (June 7, 2020): n.p. <http://thedigitalreview.com/issue00/future-of-language/index.html> (accessed June 7, 2020).

--
\* The full name for the engine may be shortened to `rtwtr` particularly for path-naming purposes.

