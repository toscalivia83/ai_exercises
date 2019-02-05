## Coding Challenge
This document first gives overall instructions, then details each of the 
problems. If something is unclear, feel free to either make reasonable 
assumptions or ask for clarification.

---
## Overall Instructions
The challenge is composed of 3 problems.

## Problem 1: Hash Iterator
### Problem description
The first problem is to create a brute force 
[***hash***](https://en.wikipedia.org/wiki/Hash_function) iterator. This takes 
two inputs, **a salt** and **an integer X**, and generates a 
**10-character string** over the course of a large number of iterations.

In each iteration, your code will try to find a single character in the 
10-character string. Each iteration will proceed as follows:
 - Start with the salt, which is an ASCII encoded string
 - Append the iteration number to the salt, starting at 1 to form an input 
string for the hash function
 - Find the hexadecimal representation of the MD5 hash of this input string
(salt + iteration number)
 - If the hash starts with **X** zeros, where **X** is the integer from the 
input, you have a match
 - Once you have a match, you run 2 operations to work out a character of your 
output:
   - Find the character following the **X** zeros. This is the index of the 
match in the output hash string
   - In order to find the character that you put in this index position, find 
the result (**M**) of performing a modulo operation, with the divisor being the 
hash length (32 bits), on your current iteration number. The character 
in position **M** in the hash is the character in your output

This process is repeated until all 10 characters are found. Do not overwrite 
previously found characters.

### Example
**Input:**
```
machine-learning,4
```
**Expected output:**
```
f320e001d1
```
**Logic run-through:**
Your solution starts by appending `'1'` to the salt which gives  
(`"machine-learning1"`), and the hash of this is then 
found: `"e3aaf8288a4bd99222f8960f39e24816"`. This doesn’t start with 4 zeros, 
so the next iteration is conducted.

This continues iterating, and on the 281382nd iteration you hash 
`"machine-learning281382"` and get `"000045eeb68e49d94edb7c6faf93b301"`.
This has the specified 4 zeros at the beginning, and so is used to find a 
character of the output. 281382 modulo 32 is 6, and so the character with 
index 6 of the hash is used (assuming zero indexing), which is `'e'`. The 
number after the zeroes is 4, so the character of the output string to be 
updated is at index 4. Therefore, `'e'` goes in position 4, so the output 
string is `....e.....` (where `.` indicates an unknown character), again 
assuming zero indexing.

After 6854736 iterations, you should have filled all the positions in the 
string, and arrived at the string `f320e001d1`.

### Extra notes
- You are welcome to use external libraries
- Your answer should always be 10 characters long
- Use only the first result for each position
- Ignore non-numeric positions. For example, ignore a hash starting with `0000c`
- The output file should contain just the string (no newlines, no spaces or 
extra characters)

## Problem 2: Pathfinding
### Problem description
The second problem is to create a map and then find the shortest path from a 
start location to an end location. Think of it as being a pirate in search of 
treasure.

The input file, a coded message left behind by a fellow pirate, contains 
comma-separated coordinates, which detail your starting location, the location 
of the treasure, and the locations of dangerous reefs on the ocean, that you 
cannot sail over. The first correctly formatted coordinate in a file is your 
starting position, and the last correctly formatted coordinate is the location 
of the treasure. All other coordinates are reefs that you cannot sail through. 
Reefs alone define the extent of the map.

Before you can find the shortest path to the treasure, you need to process the 
information you have collected from your pirate buddies while sailing the seas. 

Start by developing a parsing function which takes the input file, and 
produces a map.

Each coordinate file contains data in the following form: `x4y1,x1y2,x5y2`. 
The first number is the x coordinate, the second is the y coordinate. Exclude 
any coordinates that are not in the specified format.

Once you have created the map, you’ll have to find the shortest way to get to 
the treasure. Use a 
[path-finding algorithm](https://en.wikipedia.org/wiki/Pathfinding) to find 
the steps that take you from the start position to the end location along the 
shortest route. You can only sail directly up, down, left or right (no 
diagonal sailing), and you are not allowed to sail outside of the map. 

Once you have found the shortest path, output the complete map to a file using 
the following legend:
- Sea: `.`
- Reef: `x`
- Start: `S`
- End (treasure): `E`
- Path to take: `O`

If you find that there is no path in the ocean, or that your start or end 
position doesn’t make sense (e.g. it lies outside the map), output the word 
“error” to the output file.

### Example
**Input:**
```
x0y0,x0y1,x1y1,
x3y2,x2y2
```
The start coordinate is hence x0y0, while the treasure lies at x2y2. We mark 
these as `S` and `E`. That gives us a map like this:
```
S...
xx..
..Ex
```
We find the shortest path that connects the start and end points by sailing 
through the ocean. We mark the path with `O`, which yields us the final map.
**Output file:**
```
SOO.
xxO.
..Ex
```

### Extra notes
- **For this problem, please find a suitable library to use for pathfinding, 
rather than implementing your own algorithm**
- If there are multiple shortest paths, output just one of them
- The oceans are vast. Coordinates may span multiple lines and maps can be 
quite large
- Coordinates are zero-indexed
- The origin of the coordinate axes is at the top left

## Problem 3: Scrabble
### Problem description
Create a program to find the best move in a game of scrabble. This is a test
of your ability to design and implement an algorithm to solve a problem. Unlike 
with the rest of the challenge - we request that you implement an algorithm to 
solve this part rather than using a library.

It is also designed to be harder - we do not expect everyone to whom we would
 offer a position to be able to solve it fully.

The input to your challenge is a 
[Scrabble](https://en.wikipedia.org/wiki/Scrabble) board and a panel of letter 
tiles. 
These are both detailed in a single file, where the last line describes your 
panel of letter tiles, and the rest of the file describes the scrabble board.

For example, imagine your tiles are `panelyy` and the board is as shown below:
![Scrabble Board](https://static.vecteezy.com/system/resources/previews/000/090/550/original/scrabble-board-free-fector-vector.jpg)

The corresponding input file would be:
```
---------------
---------------
---------------
--------smile--
-----------a---
-----------u---
-----------g-h-
-------birthday
-------------p-
-------------p-
-------------y-
---------------
---------------
---------------
---------------
panelyy
```
Your task is to find what to add to the board from your panel to achieve the 
highest score possible. Your output should be formed as 
`(x_start,y_start,vertical,word)`, where `x_start` and `y_start` are integer 
coordinates of the first tile of the word, `vertical` is a boolean (true if the 
word is vertical), and `word` is a string.

The scores for each letter are:
```
1:EAIONRTLSU
2:DG
3:BCMP
4:FHVWY
5:K
8:JX
10:QZ
```

Your solution should be a "play" as if it were your turn in Scrabble, using only 
the letters available to you in your panel.

To quote the Scrabble Wikipedia article:
> A proper play uses one or more of the player's tiles to form a continuous 
string of letters that make a word (the play's "main word") on the board, 
reading either left-to-right or top-to-bottom. The main word must either use the 
letters of one or more previously played words or else have at least one of its 
tiles horizontally or vertically adjacent to an already played word. If any 
words other than the main word are formed by the play, they are scored as well, 
and are subject to the same criteria of acceptability.

For the above board with the panel "panelyy", one of the top-scoring solutions 
is "yay", when placed vertically such that the last "y" makes the  word 
"smiley", with a score of 20.

The score of your move is calculated as the **sum of the score of every new word
which you create** as a result of your move. In this example move, the words 
"smiley" and "yay" are created. "smiley" has a score of **11**, and "yay" has a 
score of **9**. The total score for this move is therefore **20**. Note that
the **'y'** at the end of "smiley" and at the start of "yay" is counted 
**twice**, once for each word.

### Example
**Input:**
```
---------------
---------------
---------------
--------smile--
-----------a---
-----------u---
-----------g-h-
-------birthday
-------------p-
-------------p-
-------------y-
---------------
---------------
---------------
---------------
panelyy
```
**Output:**
```
(13,1,true,yay)
```

### Extra notes
- Please don’t use existing libraries designed to solve this problem. You may 
still use common libraries for I/O, data structures etc, just remember the 
core of this problem is making the algorithm yourself
- Words can only read left-to-right and top-to-bottom
- We have provided a dictionary of valid words, `dict.txt`. Please use this, 
without modification
- Whilst scrabble has locations which double or triple your letter or word 
score, assume these don’t exist for this problem
- Additionally, unlike regular scrabble you don’t get a bonus for using all 
your letters
- If there are multiple answers which give the same (best) score, output any 
one of them
- The top left corner of the board has coordinates 0,0

***Good Luck!***
