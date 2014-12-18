Constrepo
=========

Constrepo (latin) -- buzz

Constrepo is a webapp for generating names and tasks entirely from
software-engineering buzzwords.
Inspiration for this program came from such things as "Code-first Entity Framework"
and "Enterprise Architect".

The main purpose of this program was for me to play around with couchapps to gain
a familiarity with the platform.

Time Estimates
==============
** Basic functionality
2.5h
*** Create a "hello world" show function and deploy to ensure software stack is working
    CLOCK: [2014-12-17 Wed 15:59]--[2014-12-17 Wed 16:13] =>  0:14
.25h
*** Design and generate the word list json document
    CLOCK: [2014-12-17 Wed 16:26]--[2014-12-17 Wed 16:31] =>  0:05
    CLOCK: [2014-12-17 Wed 16:16]--[2014-12-17 Wed 16:24] =>  0:08
.5h
*** Write the client-side js to generate the names and tasks using the word list
    CLOCK: [2014-12-18 Thu 17:28]
    CLOCK: [2014-12-18 Thu 12:03]--[2014-12-18 Thu 12:30] =>  0:27
    CLOCK: [2014-12-18 Thu 00:22]--[2014-12-18 Thu 00:43] =>  0:21
    CLOCK: [2014-12-18 Thu 00:01]--[2014-12-18 Thu 00:17] =>  0:16
    CLOCK: [2014-12-17 Wed 19:28]--[2014-12-17 Wed 19:51] =>  0:23
1h
So I'm 0:39 in and I'm going to have to change directions.
I had decided to move the word selection to the server side to reduce
bandwidth and to avoid giving away the whole word list.
I wrote a show function that selected a random verb from the word list.
However, the same verb was always returned; I believe that this is
because show functions are not allowed to have side effects. In essence,
my page is getting cached.
Thus the only way to do this is to send the user the word list and
have client side js do it.

** Extended functionality
4h
*** Figure out how to do login/logout with evently
2h
*** Add a show function to modify word lists
1.5h

** Make it pretty
2h
*** Add Twitter Bootstrap
1h
*** Find jQuery plugin or something to make the table of words in the word list show function prettier
1h

