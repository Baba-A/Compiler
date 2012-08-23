<a href="http://babaawumbila.com/babaawumbila.com/projects/Compiler/Awumbila-Compiler-Chrome:Safari Version/compiler.html" target="_blank">Compiler</a>
========

I implemented a web based multi-pass compiler for a simple grammar developed in JavaScript. This compiler includes a lexer, parser, type checker, syntax tree and code generator.

View the finished project <a href="http://babaawumbila.com/babaawumbila.com/projects/Compiler/Awumbila-Compiler-FireFox Version/compiler.html" target="_blank"><font color="#ff4500"><b>Here</b></font></a> (Optimized for Firefox browser).  <br>

View the finished project <a href="http://babaawumbila.com/babaawumbila.com/projects/Compiler/Awumbila-Compiler-Chrome:Safari Version/compiler.html" target="_blank"><font color="#ff4500"><b>Here</b></font></a> (Optimized for Google Chrome and Safari browsers).  </li><br>

You can test the machine code generated in the <a href="http://www.3nfconsulting.com/students/compilers/sites/JCOS/index.html" target="_blank"><font color="#ff4500"><b>JRC Kernel</b></font></a>. Instructions on how to do this can be found in the readme file on the project website.<br>

For fun, I included a 'Your Momma' compile mode that returns output messages and errors in the form of 'your momma' jokes. As a result, I named the entire project the 'your Momma' compiler.<br>


This project is a <a href="http://en.wikipedia.org/wiki/Multi-pass_compiler" target="_blank"><font color="#ff4500"><b>multi-pass compiler</b></font></a> developed for a basic <a href="http://en.wikipedia.org/wiki/Grammar_%28computer_science%29" target="_blank"><font color="#ff4500"><b>formal grammar</b></font></a>  (the grammer is detailed on the project website). This compiler includes a lexer, <a href="http://en.wikipedia.org/wiki/Parse" target="_blank"><font color="#ff4500"><b>parser</b></font></a> and <a href="http://en.wikipedia.org/wiki/Code_generation_%28compiler%29" target="_blank"><font color="#ff4500"><b>code generator</b></font></a>. The purpose of the compiler is to take in an input program (source code) provided by the user, parse it according to the rules of the formal grammar (language ) and either generate errors if it fails to satisfy the rules of the grammar or generate machine code if it is a valid program. This machine code is generated in assembly language based on the <a href="http://babaawumbila.com/babaawumbila.com/projects/Compiler/Complier PDF's/6502-instruction-set.pdf" target="_blank"><font color="#ff4500"><b>op codes for the classic 6402 microprocessor</b></font></a>. <br>



This project was initially developed for a class I took in the spring semester of the 2010/2011 academic year (my junior year). After I had successfully completed the class requirements I decided to develop my compiler further for a more complex grammar/language.<br>

I improved the grammar by adding productions (making it more expressive ) and getting rid of unnecessary productions. I also added a text based <a href="http://en.wikipedia.org/wiki/Symbol_table" target="_blank"><font color="#ff4500"><b>symbol table</b></font></a> and an <a href="http://en.wikipedia.org/wiki/Abstract_syntax_tree" target="_blank"><font color="#ff4500"><b>abstract syntax tree</b></font></a> to the output. I improved the HTML web page to make it more user friendly by improving output functionality, adding test cases and a read-me amongst other things.<br>

The completed compiler has the following features and functionality: <br>

A lexar which takes the source code entered by the user, sorts it into individual tokens and stores it as an array.<br>

A parser which iterates through the source code token by token and makes sure it follows all the rules of the formal grammar. It generates useful error messages if the language fails to obey the rules of the formal grammar.<br>

A type-checker which ensures that variable types are used correctly in variable declarations and assignment statements. It also ensures that variables being used have been previously declared, have a correct value assigned to them and are being used in the correct type of expression. The type checker also keeps track of scope and implements rules pertaining to <a href="http://en.wikipedia.org/wiki/Scope_%28computer_science%29" target="_blank"><font color="#ff4500"><b>scope</b></font></a>.<br>

A symbol table which keeps track of variable declarations. It stores information such as the variable type, the scope in which it was declared and it's position in the source code.<br>


An abstract syntax tree which is used to facilitate code generation.<br>

A code generator which generates machine code for a parsed input program using the <a href="http://babaawumbila.com/babaawumbila.com/projects/Compiler/Complier PDF's/6502-instruction-set.pdf" target="_blank"><font color="#ff4500"><b>op codes for the classic 6402 microprocessor</b></font></a>.<br>
