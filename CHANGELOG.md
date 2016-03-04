## v1.3.1 (2016-03-04)

Properly support relative module paths.

Previously you could use them, but they would be relative to where
`require-inject` was installed.  Now they're relative to your test script. 
(I failed to notice this for so long because, through sheer coicidence, the
relative path from my own test scripts was the same as the one from
`require-inject`, but that wouldn't ordinarily be the case.)

Many, many thanks to [@jcollado](https://github.com/jcollado) who provided
the patch, with tests and was kind enough to convince me that this really
wasn't working as intended.

