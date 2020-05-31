# rt(w||w)tr
### reading through (writing or word-diff) through reading

Concept: John Cayley @shadoof  
Code: Sally Qianxun Chen @cqx931 and John Cayley  
v1.0: June 1, 2020  
HTML, CSS, JaveScript, JQuery

`rt(w||w)tr`\* is a generalizable framework and webapp reading instrument. It produces dynamic visualizations comparing two texts, or versions of a single text, where the texts are similarly structured and, most effectively, when they share phrases or sequences of natural language in their customary tokenized orthographies.

**`rt(w||w)tr`** ***is a transactable visualization of formal word-diff,  
configured for literary critical and language art purposes.***

The framework is based on a deployment of the Unix `diff` command, more specifically, the `word-diff` version that is built into `git`. The engine assumes the same `a` file and `b` file conventions, where, for example, `diffs` are itemized so as to enable successive changes – remove,  preserve, or add – to the `a` file until it matches the `b` file. The engine parses output from a `word-diff` command and this is enough to generate the webapp's visualizations. Conventional punctuation is the only thing needed to prepare the files for the engine so long as there are the same number of sentences in both files. These are reconceptualized as `units` in the framework. If the number of sentences is not equal, `unit` markup can be used to render the files meaningfully correspondent for the parser and the visualization engine.

### Transacting with the visualization

Launch the webapp on a server. Move your pointer over any sentence. Sequences that are shared by the overlying text and the corresponding underlying text will remain in the fully opaque blue-black of the overlay, with any added or changed words faded slightly. If your pointer is over a shared sequence, after a short delay, the sentence or unit will crossfade to the red-black of the underlying version. If your pointer is over any added or changed, less opaque text, nothing will happen – and you can pause to see exactly what has been changed or added – until, that is, you do move your pointer over a shared sequence. Once the underlying text's red-black words are crossfaded in, then, after a short delay, their less opaque but distinct text will take on full red-black opacity. Move the pointer off a sentence or unit to crossfade back to the overlay.

The section number in the upper left is also a drop-down menu giving access to any section, with previous and next buttons enclosing it.

### About this release

Note: This initial version is limited in that the `units` of the `a` file are expected to be longer or roughly the same length as their corresponding `b` file `units`. A later version of the engine will allow corresponding `units` of any length for either file.

The v1.0 release was produced with word-diff'd texts prepared by John Cayley for the following publication in the inaugural issue of The Digital Review:

```
 The Future of
              -Writing
-Vilém Flusser
              +Language   
```
Cayley, John, and Sally Qianxun Chen. ‘The Future of / -Writing / -Vilém Flusser / +John Cayley.’ *The Digital Review* 1 (June 7, 2020): n.p. <http://thedigitalreview.com/issue00/future-of-language/> (accessed June 7, 2020).


\* The full name for the webapp may be shortened to `rtwtr` particularly for path-naming purposes.

