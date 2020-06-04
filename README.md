# rt(w||w)tr
### reading through (writing or word-diff) through reading

Concept: John Cayley @shadoof  
Code: Sally Qianxun Chen @cqx931 and John Cayley  
v1.0.1: June 4, 2020  
HTML, CSS, JaveScript, JQuery  
Licensing information below

`rt(w||w)tr`\* is a generalizable framework and webapp reading instrument. It produces dynamic visualizations comparing two texts, or versions of a single text, where the texts are similarly structured and, most effectively, when they share phrases or sequences of natural language in their customary tokenized orthographies.

**`rt(w||w)tr`** ***is a transactable visualization of formal word-diff,  
configured for literary critical and language art purposes.***

The framework is based on a deployment of the Unix `diff` command, more specifically, the `word-diff` version that is built into `git`. The engine assumes the same `a` file and `b` file conventions, where, for example, `diffs` are itemized so as to enable successive changes – remove,  preserve, or add – to the `a` file until it matches the `b` file. The engine parses output from a `word-diff` command and this is enough to generate the webapp's visualizations. Conventional punctuation is the only thing needed to prepare the files for the engine so long as there are the same number of sentences in both files. These are reconceptualized as `units` in the framework. If the number of sentences is not equal, `unit` markup can be used to render the files meaningfully correspondent for the parser and the visualization engine.

### Transacting with the visualization

Launch the webapp on a server. Move your pointer over any sentence. Sequences that are shared by the overlying text and the corresponding underlying text will remain in the fully opaque blue-black of the overlay, with any added or changed words faded slightly. If your pointer is over a shared sequence, after a short delay, the sentence or unit will crossfade to the red-black of the underlying version. If your pointer is over any added or changed, less opaque text, nothing will happen – and you can pause to see exactly what has been changed or added – until, that is, you do move your pointer over a shared sequence. Once the underlying text's red-black words are crossfaded in, then, after a short delay, their less opaque but distinct text will take on full red-black opacity. Move the pointer off a sentence or unit to crossfade back to the overlay.

The section number in the upper left is also a drop-down menu giving access to any section, with previous and next buttons enclosing it.

### About the code in the 1.x releases

Note: This initial version is limited in that the `units` of the `a` file are expected to be longer or roughly the same length as their corresponding `b` file `units`. A later version of the engine will allow corresponding `units` of any length for either file.

The v1.0.x releases were produced with word-diff'd texts prepared by John Cayley for the following publication in the inaugural issue of The Digital Review:

```
 The Future of
              -Writing
-Vilém Flusser
              +Language   
```
Cayley, John, and Sally Qianxun Chen. ‘The Future of / -Writing / -Vilém Flusser / +John Cayley.’ *The Digital Review* 1 (June 7, 2020): n.p. <http://thedigitalreview.com/issue00/future-of-language/> (accessed June 7, 2020).


\* The full name for the webapp may be shortened to `rtwtr` particularly for path-naming purposes.

## Licenses
The code for this project, by Sally Qianxun Chen with John Cayley is licensed under GNU GPL-3.0 the terms of which are set out in the LICENSE file.

With respect to some of its sources, the ***TDRv1.0.x releases*** of this project, that is, 'The Future of / -Writing / -Vilém Flusser / +Language / +John Cayley' are licensed as follows:

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />Versions of the work, TDRv1.0.x, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

