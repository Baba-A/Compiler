// ABUBKAR BABA AWUMBILA
//COMPILER PROJECT - YOUR MOMMA MODE PARSER FILE



    // Global variables
    var tokens = new Array(); //Token Array
    var tokenIndex = 0;
    var currentToken = "";
    var errorCount = 0;

    var EOF = new TokenObject();  //End of File Token Object
    	EOF.Token = "$";
	EOF.Type = "EOF";


    var inStatementList = false; //Boolean variable used to check if the parser is currently in the statement list function
    var type = new Array(); //Array used to store symbol table type data
    var charArray = new Array(); //Array used to store symbol table id data
    var bracketCount = 0; //Integer variable to keep track of bracket count
    var ast = new YourMommatree();  //Creates an object that builds the abstract syntax tree
    var scope = new YourMommascope(); //Creates an object to keep track of the scope
    var typeCheck = new YourMommachecker(); //Creates an object to type check over the ASt
    var inIntExpr = false; //Declares an initializes a variable that indicates if parser is in IntExpr

    
    

    //INIT FUNCTION
    function init()
    {
        // Clear the message box.
        document.getElementById("taOutput").value = "";
        document.getElementById("stOutput").value = "";
        document.getElementById("cgOutput").value = "";
        // Set the initial values for our globals.
        tokens = "";
        tokenIndex = 0;
        currentToken = ' ';
        errorCount = 0;    
        typeArray = new Array();    
    }

    //YOUR MOMMA BUTTON COMPILE FUNCTION
    function yourMommabtnCompile_click()
    {        
        // This is executed as a result of the usr pressing the 
        // "your momma mode" button between the two text areas, above.  
        // Note the <input> element's event handler: onclick="yourMommabtnCompile_click();
        init();
 
	
        putMessage("Currently Compiling Your Momma\n");
        // Grab the tokens from the lexer . . .
        tokens = tokenSorter();
        putMessage("Lex returned [" + listOfTokens() + "]\N");
        // . . . and parse!



	//Variables used to create the symbol table
	typeArray = new Array();
	typeCounter = 0;
	charArray = new Array();
	scopeArray = new Array();	
	positionArray = new Array();


        YourMommaparse(); // generates errors in your momma mode
    }

    //LIST OF TOKENS FUNCTION
    function listOfTokens() 
    {
 
	//Iterates through the token array and returns the token for each token object
	var i = 0;
	var tokenList = lex();
 	for (i = 0; i < tokens.length; i++)
	{
	   tokenList[i] = tokens[i].Token;
	}
	return tokenList;
    }
    

    //PUT MESSAGE FUNCTION
    function putMessage(msg)
    {
        document.getElementById("taOutput").value += msg + "\n";
    }



    //PARSE FUNCTION
    function YourMommaparse()
    {

	typeCheck = new YourMommachecker();




        putMessage("Parsing Your Momma Right Now\n");
        // Grab the next token
        currentToken = getNextToken();
        // A valid parse derives the program production, so begin there.
        YourMommaparseProgram();
        // Report the results.
        putMessage("\nParsing found " + errorCount + " error(s).\n\n");   
        putMessage("\nPARSED YOUR MOMMA LAST NIGHT!!!\n\n");  
	//Print the symbol table

	

	YourMommaprintSymbolTable();

	ast = new YourMommatree(); //Creates an instance of the AST function
	typeCheck = new YourMommachecker();  //Creates an instance of the Type Checker
	inIntExpr = false; //Sets the inIntExpr flag to false
	inStatementList = false; //Sets the inStatementList flag to false


        if(errorCount == 0)
	{
	  codeGen();
	}



    
    }
    


    //PARSE PROGRAM FUNCTION
    function YourMommaparseProgram()
    {
        // A program production can only be a statement, so parse the statement production.
	parseStatement();
	

	//Parse the End of File token
	YourMommareachedEOF();

    }




   //REACHED EOF FUNCTION - checks to see if the current token is the end of file token
    function YourMommareachedEOF()
    {
	if(currentToken.Type == "EOF")
	{
	   putMessage("\nEnd Of File Reached. I.E. I JUST LEXED AND PARSED YOUR MOM!!!");
	}
	else
	{
	errorCount++;
	putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE END OF FILE TOKEN \n.");
	} 
    }


    //PARSESTATEMENT FUNCTION
    function YourMommaparseStatement()
    {
	
	//Creates a Statement node in the AST
	ast.makeNode( "Statement" , "null" , "NonTerminal", scope.depth);



	//Checks for print production and parses it
        if(YourMommaprintChecker())
	{
	   
 	   //Creates a print node in the AST
	   ast.makeNode( "print", "null" , "NonTerminal", scope.depth);

	   //checks for print syntax and parses Expr
	   YourMommacheckToken("print");
	   YourMommacheckToken("leftParen");

	   if( currentToken.Type == "char" )
	   {

		typeCheck.checkUninitVar();

	    }



	   YourMommaparseExpr();
	   YourMommacheckToken("rightParen");

	   //Moves up tree if the current node has no children (a leaf node)
	   ast.moveUpTree();

	} 
	
	//Checks for assignment expression production and parses it
	else if(currentToken.Type == "char" && peekAtToken(0).Type == "assign")
	     {

			//Makes sure if Id is declared in symbol table			
			if(typeCheck.checkDecl() == true)
			{
			      //Nothing to see here, Move along good sir
			}
			else
			{
			       errorCount++;   
			       putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE MESSED UP A SIMPLE VARIABLE DECLARATION \n.");   

			}
			
			//Checks if the type of declared variable is correct
			typeCheck.checkType();   

		   //Parses Id
		   YourMommaparseId();

		   //Creates a leaf node that is an id
		   ast.makeNode( currentToken.Token ,"null" , "Terminal", scope.depth);
		   
		   YourMommacheckToken("assign");

		   //Checks if an id on right-side of assignment is correct type according to symbol
		   typeCheck.checkTypeAfterAssign();

	
		   typeCheck.saveVar();



		  if(currentToken.Type == "char")
   		  {


			if(typeCheck.checkDecl() == true)
			{
			      //Nothing to see here, Move along good sir
			}
			else
			{
			       errorCount++;   
			       putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE END OF FILE TOKEN \n.");   

			}

		}

		   //Compares the left and right-hand side of assignment and makes sure that the types are the same
		   if(typeCheck.checkAssign() == false)
		   {

			errorCount++;
			putMessage("\n ERROR: YOUR MOMMA IS SO DUMBE SHE DOESN'T KNOW HOW TO MATCH SIMPLE VARIABLE TYPES \n.");   

		   }

		   
		   YourMommaparseExpr();

		
	     }
	     
	     //Checks for variable declaration production and parses it
	     else if( YourMommaintChecker() || YourMommastringChecker() /*|| boolChecker() */)
		  {

		      YourMommaparseVarDecl();

		  } 
		  //Checks for statement list production and parse it
		  else if( currentToken.Type == "leftCurlyBracket")
		       {

			  YourMommacheckToken("leftCurlyBracket");
			 
			  //Increases scope if there is an open bracket
			  scope.openScope();

			  //Sets the inStatementList to true
			  inStatementList = true;
			 

			  YourMommaparseStatementList();
			   
			  
			  YourMommacheckToken("rightCurlyBracket");
			  
			  //Increases scope if there is a closed bracket
			  scope.closeScope();

		       }
		       
		       // Checks for an if exression and parses it
		       else if( YourMommaifChecker() )
			    {
		                ast.makeNode( "if", "null" , "NonTerminal", scope.depth);


				//Parse if
				YourMommacheckToken("if");


				YourMommacheckToken("leftParen");
				YourMommaparseCondExpr();
				YourMommacheckToken("rightParen");


				//Parse Statement List
				YourMommacheckToken("leftCurlyBracket");
			 
			  	//Increases scope if there is an open bracket
			  	scope.openScope();

			  	//Sets the inStatementList to true
			  	inStatementList = true;
			 

			  	YourMommaparseStatementList();
			   
			  
				YourMommacheckToken("rightCurlyBracket");
			  
				//Increases scope if there is a closed bracket
				scope.closeScope();
				


				ast.moveUpTree();
	

			    }

			    //CHecks to see if it's a while expression and then parses it
			    else if( YourMommawhileChecker() )
			    {
		                ast.makeNode( "while", "null" , "NonTerminal", scope.depth);


				//Parse if
				YourMommacheckToken("while");


				YourMommacheckToken("leftParen");
				YourMommaparseCondExpr();
				YourMommacheckToken("rightParen");


				//Parse Statement List
				YourMommacheckToken("leftCurlyBracket");
			 
			  	//Increases scope if there is an open bracket
			  	scope.openScope();

			  	//Sets the inStatementList to true
			  	inStatementList = true;
			 

			  	YourMommaparseStatementList();
			   
			  
				YourMommacheckToken("rightCurlyBracket");
			  
				//Increases scope if there is a closed bracket
				scope.closeScope();
				


				ast.moveUpTree();
	

			    }

			    //Anything else is an invalid statement
			    else
		            {
			   	errorCount++;
			   	putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE CAN'T WRITE A VALID STATEMENT\n.");
		       	    } 

    }




    //PARSE CONDITIONAL EXPRESSION FUNCTION
    function YourMommaparseCondExpr()
    {

	

        ast.makeNode( "CondExpr" ,"null" , "NonTerminal", scope.depth);


	//Makes sure if Id is declared in symbol table			
	if(typeCheck.checkDecl() == true)
	{
	      //Nothing to see here, Move along good sir
	}
	else
	{
	       errorCount++;   
	       putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE CAN'T BE DECLARED IN THE CURRENT SCOPE\n.");   

	}
			
	//Checks if the type of declared variable is correct
	typeCheck.checkType();   


	typeCheck.checkUninitVar();

	YourMommaparseId();

	//putMessage("\n\n\n\n\n\n " + currentToken.Type);


	if(peekAtToken(0).Type == "assign")
	{


		   //Creates a leaf node that is a cond op
        ast.makeNode( (currentToken.Token + peekAtToken(0).Token) ,"null" , "Terminal", scope.depth);


	YourMommacheckToken("condOp");



	typeCheck.saveVar();



	if(currentToken.Type == "char")
   	{


		if(typeCheck.checkDecl() == true)
		{
		      //Nothing to see here, Move along good sir
		}
		else
		{
		       errorCount++;   
		       putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE CAN'T BE DECLARED IN THE CURRENT SCOPE\n.");   

		}

	}


	YourMommaparseId();


	}
	else
	{

	}


	ast.moveUpTree();

    }


    //PARSE STATEMENT LIST FUNCTION
    function YourMommaparseStatementList()
    {


	//Makes Statement List Node in AST
	ast.makeNode( "statement list" ,"null" , "NonTerminal" , scope.depth);


	//Keeps PArsing Until it see's the right curly Bracket.
	if(currentToken.Type != "rightCurlyBracket")
	{

	    YourMommaparseStatement();


	    // Keeps Recursively parsing statemnt list but stops when it sees an error (This prevents infinite recursion)
	    if(errorCount == 0)
	    {

		ast.moveUpTree();

	    YourMommaparseStatementList();

	    }
	
	}
	
		ast.moveUpTree();
	   
    }
	     

     //PARSE EXPRESSION FUNCTION
      function YourMommaparseExpr()
      {

	//Creates a Expr node in the AST
	ast.makeNode( "Expr", "null" ,"NonTerminal", scope.depth);


	//Checks for integer expression and parses it
	if(currentToken.Type == "digit")
	{

	   YourMommaparseIntExpr();
	   
	   //Sets inIntExpr to false
	   inIntExpr = false;


	}
	   //Checks for String expression and parses it
	   else if(currentToken.Type == "quote")
	   {
	   
	      YourMommaparseStringExpr();
	   
	   }
	      //Checks for id and parses it
              else if(currentToken.Type == "char")
	      {
	      
		YourMommaparseId();
	      
	      }
		//Anything else is an invalid expression
		else
		   {
		   
		      errorCount++;
		   
		      putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE CAN'T WRITE A VALID EXPRESSION\n.");
		   
		   }

		ast.moveUpTree();
	}	



    //PARSE INTEGER EXPRESSION FUNCTION
    function YourMommaparseIntExpr()
    {

	//Sets inIntExpr to true
	inIntExpr = true; 
	
	//Creates an intExpr node in the AST 
	ast.makeNode( "intExpr","null" , "NonTerminal", scope.depth);


	if (currentToken.Type == "digit")
	{
		//Creates an int node in the AST
		ast.makeNode( currentToken.Type , "null" ,"NonTerminal", scope.depth);
		
		//Creates a leaf node that is a digit
		ast.makeNode( currentToken.Token, "null" , "terminal", scope.depth); 
 
		ast.moveUpTree();

		YourMommacheckToken("digit");
	}


	if(currentToken.Type == "op") 
	{
		//Creates an op node in the AST		
		ast.makeNode( currentToken.Type , "null" ,"NonTerminal", scope.depth);
		
		//Creates either a "+" or "-" leaf node
		ast.makeNode( currentToken.Token, "null" ,"terminal", scope.depth); 
		
		ast.moveUpTree();

	    	YourMommacheckToken("op");

	    	YourMommaparseExpr();
	 
  	}

 	ast.moveUpTree();
	
    }


    //PARSE String EXPRESSION FUNCTION
    function YourMommaparseStringExpr()
    {

	//If a StringExpr follows an operator then it is an error
	if(inIntExpr == true)
	{
		errorCount++;
		putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE CAN'T WRITE A VALID INTEGER EXPRESSION\n.");

	}

	//Creates a stringExpr node in the AST
	ast.makeNode( "stringExpr", "null" ,"NonTerminal", scope.depth);


	YourMommacheckToken("quote");


	//Ensure that there are only characters between quotes
	if (currentToken.Type == "char" || currentToken.Type == "space"  )	
	{	

	   YourMommaparseCharList();

	} 

	YourMommacheckToken("quote");

	ast.moveUpTree();

    }



    //PARSE CHAR LIST FUNCTION
    function YourMommaparseCharList()
    {
	
	//Creates a charList node in the AST
	ast.makeNode( "charList" , "null" ,"NonTerminal", scope.depth);

	if (currentToken.Type == "char")
	{	
	
	   //Creates a char type node in the AST
	   ast.makeNode( currentToken.Type,"null" ,"NonTerminal", scope.depth);
	   
	   //Creates a character node in the AST
	   ast.makeNode( currentToken.Token, "null" ,"Terminal", scope.depth);
	   
	   ast.moveUpTree();

	   YourMommacheckToken("char");
	   
	   YourMommaparseCharList();
		
	} 
	   else if(currentToken.Type == "space")
	   {

	   //Creates a space type node in the AST
	   ast.makeNode( currentToken.Type, "null" ,"NonTerminal", scope.depth);
	   
	   //Creates a space node in the AST
	   ast.makeNode( currentToken.Token, "null" ,"Terminal", scope.depth);

	   ast.moveUpTree();

		
	   YourMommacheckToken(" ");
		
	   YourMommaparseCharList();
	   }

	ast.moveUpTree();
    
    }




    //PARSEID FUCNTION
    function YourMommaparseId()
    {

	//Makes sure that parse is in intExpr
	if(inIntExpr == true)
	{

		typeCheck.type = "";

		typeCheck.checkType();

		if(typeCheck.type != "int   ")
		{
		   
		   errorCount++;
		   
		   putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE CAN'T WRITE A VALID EXPRESSION\n.");
		
		}

	}

	//Creates an Id node that is in AST
	ast.makeNode( "Id" , "null" , "NonTerminal", scope.depth);


	//If the parser is currently in the statement list function, it is possible to have other characters after an id. Don't check for characters after id
	if(inStatementList == true)
	{
	    
	    //Creates a id node in the AST
	    ast.makeNode( currentToken.Type , "null" ,"NonTerminal", scope.depth);
	    
	    //Creates a character node in the AST (leaf node)
	    ast.makeNode( currentToken.Token ,"null" , "Terminal", scope.depth);
	    
	    ast.moveUpTree();
	    
	    YourMommacheckToken("id");
	    
	    ast.moveUpTree();
	    
	    return true;
	}
	
	else
	{
	    //make sure each id is only one character
	    if(currentToken.Type == "char" && peekAtToken(0).Type != "char" )
	    {
		//Creates a char type node in the AST 
	        ast.makeNode( currentToken.Type , "null" ,"NonTerminal", scope.depth);
	        
		//Creates a character node in the AST
		ast.makeNode( currentToken.Token ,"null" , "Terminal", scope.depth);
	        
		ast.moveUpTree();

	        YourMommacheckToken("id");

		ast.moveUpTree();

	        return true;
	    }
	    
	    else 
	    {
	       errorCount++;
	    
	       putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE AT THE ID\n.");
	    
	       return false;
	    }

	}

    }





    //PARSE VARIABLE DECLARATION FUNCTION
    function YourMommaparseVarDecl()
    {

	 //Creates a VarDecl node in the AST
	 ast.makeNode( "VarDecl" ,"null" , "NonTerminal", scope.depth);

	//Populate the symbol table
	YourMommasymbolTable();

	//Parse variable declaration based on variable type (int or char)
	if(YourMommaintChecker())
	{

	   //Creates a type node in the AST
	   ast.makeNode("type" ,"null" , "NonTerminal", scope.depth);
	   
	   //Creates an int node in the AST
	   ast.makeNode( "int", "varDecl", "Terminal", scope.depth);
	   ast.moveUpTree();

	   YourMommacheckToken("char");
	   YourMommacheckToken("char");
	   YourMommacheckToken("char");

	   //Makes sure the ID that is declared is used
	   typeCheck.checkUnusedId();

	   if(YourMommaparseId())
	   {
                putMessage("Parsed an integer variable Declaration");
	   }
	   else 
	   {
		errorCount++;
		putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE CAN'T WRITE A VALID VARIABLE DECLARATION\n.");
	   }
	}
	else if(YourMommastringChecker())
             {
	   	 
		 //Creates a type node in the AST
		 ast.makeNode("type" ,"null" , "NonTerminal", scope.depth);
	   	 
		 //Creates a string node in the AST
		 ast.makeNode( "string", "varDecl", "Terminal", scope.depth);
		 ast.moveUpTree();


	         YourMommacheckToken("char");
	         YourMommacheckToken("char");
	         YourMommacheckToken("char");
	         YourMommacheckToken("char");
	         YourMommacheckToken("char");
	         YourMommacheckToken("char");

	  	 typeCheck.checkUnusedId();
	         
		 if(YourMommaparseId())
		 {

		        putMessage("Parsed a string variable Declaration");
	         }
	         else
	         {
		      errorCount++;
		      putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE CAN'T WRITE A VALID VARIABLE DECLARATION\n.");
	         }
	     }

	    	    else
	   	    {
			 errorCount++;
			 putMessage("\n ERROR: YOUR MOMMA IS SO DUMB, SHE CAN'T WRITE A VALID VARIABLE DECLARATION\n.");
	   	    }


	ast.moveUpTree();
    }






    //INTCHECKER FUNCTION	
    function YourMommaintChecker()
    {
	//peeks ahead to see if current character sequence is an int (for variable declarartion)
	if(currentToken.Token == "i" && peekAtToken(0).Token == "n" && peekAtToken(1).Token == "t" )
	{
	   return true;
	}
	else { return false; }

    }


    //STRINGCHECKER FUNCTION
    function YourMommastringChecker()
    {
	//peeks ahead to see if current character sequence is a char (for variable declarartion)
	if(currentToken.Token == "s" && peekAtToken(0).Token == "t" && peekAtToken(1).Token == "r" && peekAtToken(2).Token == "i" && peekAtToken(3).Token == "n" && peekAtToken(4).Token == "g")
	{
	   return true;
	}
	else { return false; }

    }




    //PRINT CHECKER FUNCTION
    function YourMommaprintChecker()
    {
	//peeks ahead to see if current character sequence is a "print" (for a print statement)

	if(currentToken.Token == "p" && peekAtToken(0).Token == "r" && peekAtToken(1).Token == "i" && peekAtToken(2).Token == "n" && peekAtToken(3).Token == "t" )
	{
	   return true;
	}
	else { return false; }

    }



    //IF CHECKER FUNCTION
    function YourMommaifChecker()
    {
	//peeks ahead to see if current character sequence is an "if" (for an if statement)

	if(currentToken.Token == "i" && peekAtToken(0).Token == "f" )
	{
	   return true;
	}
	else { return false; }

    }



    //PRINT CHECKER FUNCTION
    function YourMommawhileChecker()
    {
	//peeks ahead to see if current character sequence is a "print" (for a print statement)

	if(currentToken.Token == "w" && peekAtToken(0).Token == "h" && peekAtToken(1).Token == "i" && peekAtToken(2).Token == "l" && peekAtToken(3).Token == "e" )
	{
	   return true;
	}
	else { return false; }

    }





    //CHECK TOKEN FUNCTION
    function YourMommacheckToken(expectedKind)
    {
 
	//Check to valiudate that we have the expected type of token	
	switch(expectedKind)
	{
 
		//For Digits
		case "digit" : putMessage("Expecting a digit");
			       if(currentToken.Token == "0" || currentToken.Token == "1" || currentToken.Token == "2" || currentToken.Token == "3" ||
			          currentToken.Token == "4" || currentToken.Token == "5" || currentToken.Token == "6" || currentToken.Token == "7" ||
			          currentToken.Token == "8" || currentToken.Token == "9" )
			       {
				    putMessage("Got a digit.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE DIGIT\n."  );
			       }
			       break;
 
		//For operations
		case "op" : putMessage("Expecting an operator");
			       if(currentToken.Token == "+" || currentToken.Token == "-" )
			       {
				    putMessage("Got an operator.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE OPERATOR\n." );
			       }
			       break;


		//For conditional operations
		case "condOp" : putMessage("Expecting a conditional operator");
			       if((currentToken.Token == "=" && peekAtToken(0).Token == "=" )  )
			       {
				    currentToken = YourMommagetNextToken();
				    putMessage("Got a conditional operator.");

			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE CONDITIONAL OPERATOR\n." );
			       }
			       break;
 

		//For characters	
		case "char" : putMessage("Expecting a character");
			       if(currentToken.Token == "a" || currentToken.Token == "b" || currentToken.Token == "c" || currentToken.Token == "d" ||
			          currentToken.Token == "e" || currentToken.Token == "f" || currentToken.Token == "g" || currentToken.Token == "h" ||
			          currentToken.Token == "i" || currentToken.Token == "j" || currentToken.Token == "k" || currentToken.Token == "l" ||
			          currentToken.Token == "m" || currentToken.Token == "n" || currentToken.Token == "o" || currentToken.Token == "p" ||
			          currentToken.Token == "q" || currentToken.Token == "r" || currentToken.Token == "s" || currentToken.Token == "t" ||
			          currentToken.Token == "u" || currentToken.Token == "v" || currentToken.Token == "w" || currentToken.Token == "x" ||
			          currentToken.Token == "y" || currentToken.Token == "z" )
			       {
				    putMessage("Got a character.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE CHARACTER\n."  );
			       }
			       break;
 
 
		//For ids
		case "id" : putMessage("Expecting an ID");
			       if(currentToken.Token == "a" || currentToken.Token == "b" || currentToken.Token == "c" || currentToken.Token == "d" ||
			          currentToken.Token == "e" || currentToken.Token == "f" || currentToken.Token == "g" || currentToken.Token == "h" ||
			          currentToken.Token == "i" || currentToken.Token == "j" || currentToken.Token == "k" || currentToken.Token == "l" ||
			          currentToken.Token == "m" || currentToken.Token == "n" || currentToken.Token == "o" || currentToken.Token == "p" ||
			          currentToken.Token == "q" || currentToken.Token == "r" || currentToken.Token == "s" || currentToken.Token == "t" ||
			          currentToken.Token == "u" || currentToken.Token == "v" || currentToken.Token == "w" || currentToken.Token == "x" ||
			          currentToken.Token == "y" || currentToken.Token == "z" )
			       {
				    putMessage("Got an ID.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE ID\n." );
			       }
			       break;
 
 
		//For print
		case "print" : putMessage("Expecting a print");
			       if(currentToken.Token == "p" && peekAtToken(0).Token == "r" && peekAtToken(1).Token == "i" && peekAtToken(2).Token == "n" && peekAtToken(3).Token == "t" )
			       {
				    putMessage("Got a print.");
				    currentToken = YourMommagetNextToken();
				    currentToken = YourMommagetNextToken();
				    currentToken = YourMommagetNextToken();
				    currentToken = YourMommagetNextToken();
				    
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE ENTIRE PRINT CHARACTER SEQUENCE\n." );
			       }
			       break;



		//For while
		case "while" : putMessage("Expecting a while");
			       if(currentToken.Token == "w" && peekAtToken(0).Token == "h" && peekAtToken(1).Token == "i" && peekAtToken(2).Token == "l" && peekAtToken(3).Token == "e" )
			       {
				    putMessage("Got a while.");
				    currentToken = YourMommagetNextToken();
				    currentToken = YourMommagetNextToken();
				    currentToken = YourMommagetNextToken();
				    currentToken = YourMommagetNextToken();
				    
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE ENTIRE WHILE CHARACTER SEQUENCE\n."  );
			       }
			       break;



		//For if
		case "if" : putMessage("Expecting an if");
			       if(currentToken.Token == "i" && peekAtToken(0).Token == "f" )
			       {
				    putMessage("Got an if.");
				    currentToken = YourMommagetNextToken();
		
				    
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE ENTIRE IF CHARACTER SEQUENCE\n." );
			       }
			       break;
 

		//For left parenthesis
		case "leftParen" : putMessage("Expecting a left parenthesis");
			       if(currentToken.Token == "(")
			       {
				    putMessage("Got a left parenthesis.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE LEFT PARENTHESIS\n."  );
			       }
			       break;
 
 
 
		//For right parenthesis
		case "rightParen" : putMessage("Expecting a right parenthesis");
			       if(currentToken.Token == ")")
			       {
				    putMessage("Got a right parenthesis.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE RIGHT PARENTHESIS\n." );
			       }
			       break;
 
 
		//For left curly bracket
		case "leftCurlyBracket" : putMessage("Expecting a left curly bracket");
			       if(currentToken.Token == "{")
			       {
				    putMessage("Got a left curly bracket.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE RIGHT PARENTHESIS\n." );
			       }
			       break;
 
 
		//For right curly bracket
		case "rightCurlyBracket" : putMessage("Expecting a right curly bracket");
			       if(currentToken.Token == "}")
			       {
				    putMessage("Got a right curly bracket.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE RIGHT CURLY BRACKET\n." );
			       }
			       break;
 
 
		//For assignment operator
		case "assign" : putMessage("Expecting an assignment operator.");
			       if(currentToken.Token == "=")
			       {
				    putMessage("Got an assignment operator.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE ASSIGNMENT OPPERATOR\n.");
			       }
			       break;
 
		//For quotation marks
		case "quote" : putMessage("Expecting a quotation mark");
			       if(currentToken.Token == "\"")
			       {
				    putMessage("Got a quotation mark.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE QUOTE\n." );
			       }
			       break;


		//For space character
		case " " : putMessage("Expecting a space character.");
			       if(currentToken.Token == " ")
			       {
				    putMessage("Got a space character.");
			       }
			       else
			       {
				    errorCount++;
			            putMessage("\n ERROR: YOUR MOMMA IS SO FAT, SHE ATE THE SPACE CHARACTER\n.");
			       }
			       break;
 
 
	}
 
	//After checking the current token, consume and asssigne the next token to the current token slot(variable)
	currentToken = YourMommagetNextToken();
 
}




    //GET NEXT TOKEN FUNCTION
    function YourMommagetNextToken()
    {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length)
        {
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
            putMessage("\nCurrent token:" + thisToken.Token);
            tokenIndex++;
        }
        return thisToken;
    }
 
 


    //PEEK AHEAD FUNCTION
    function peekAtToken( peekNumber )
    {
 
 
        var thatToken = EOF;    // Let's assume that we're at the EOF.
 
        if (tokenIndex < tokens.length)
        {
            // If we're not at EOF, then peek ahead by the peak number
            thatToken = tokens[tokenIndex + peekNumber];
        }
 
        return thatToken;
    }






    //SYMBOL TABLE FUNCTION
    function YourMommasymbolTable()
    {




	  //If variable type is an int, populate the symbol table accordingly
	  if(YourMommaintChecker())
	  {
		typeArray[typeCounter] = "int   "; 

		positionArray[typeCounter] = tokenIndex + 3;

		charArray += peekAtToken(2).Token;

	        putMessage("\n ADDED YOUR MOMMA TO THE SYMBOL TABLE\n");

		typeCounter += 1;
	  }

	  //If variable type is a char, populate the symbol table accordingly
	  if(YourMommastringChecker())
	  {
		typeArray[typeCounter] = "string";
		
		positionArray[typeCounter] = tokenIndex + 6;

		charArray += peekAtToken(5).Token;

	        putMessage("\n ADDED YOUR MOMMA TO THE SYMBOL TABLE\n");

		typeCounter += 1;

	  }

	}




    //PRINT SYMBOL TABLE FUNCTION
    function YourMommaprintSymbolTable()
    {
	putMessageSymbolTable("==============================================")
	putMessageSymbolTable("= JUST PARSED YOUR MOM ON THIS SYMBOL TABLE =")
	putMessageSymbolTable("==============================================")
	putMessageSymbolTable("\nTYPE:   |  VARIABLE:  |  SCOPE:  | POSITION:");
	putMessageSymbolTable("----------------------------------------------");

	
	for(var i = 0; i < charArray.length; i++)
	{

	putMessageSymbolTable( typeArray[i] + "  |     " + charArray[i] + "       |    " + scopeArray[i] + "     |      " + positionArray[i]);

	}

	putMessageSymbolTable("==============================================")

     }




    //Node object
    function YourMommatree()
    {

	this.root = null;  // The root node of the ast
	this.current = {}; // The current node of teh ast


	//Functin to make a new node
	this.makeNode = function( token, type, kind, scope )
			{

			 	var node = { token: token,
					     parent: {},
					     children: [],
					     scope: scope,
					     kind: kind,
					     type: type
					   }


			//MAke the root node and its children
			if( this.root ==null )
			{

			     this.root = node;
			}
			else {
			         node.parent = this.current;

				 this.current.children.push(node);

			      }

			
			//Make the current Node
		       if( kind == "NonTerminal")
		       {

			    this.current = node;
			}
	

			}

	

	//Move up the tree
	this.moveUpTree = function()
			  {

				if( (this.current.parent != null) && (this.current.token != undefined))
				{
				      this.current = this.current.parent;
				}
				else
				{
				    error++;
				    putMessage("\n Error: This will never happen. If it does, its your fault \n");
				}
			  };

	


    };



   //SCOPE FUNCTION
   function YourMommascope()
   {

	this.depth = 0;

	//open a new scope
	this.openScope = function()
			 {

			     this.depth += 1;

			  }

	//close the current scope
	this.closeScope = function()
			  {
			     if(this.depth > 0)
			     {

    				     this.depth -= 1;
			     }

			   }

   };


   //Type Checker goes through the AST and makes sure the usage of variables accords to the symbol table
   function YourMommachecker()
   {


	this.type = "";   //Keeps track of teh type of variable before the = operator
	this.type2 = "";  //Keeps track of teh type of variable after the = operator
	this.initialized = false;  //Boolean flag for initialized variables
	this.used = false;  // Boolean flags for used variables
	this.varAfterAssign = "";


	//Ensures that a variable is declared in the same scope brfore use
	this.sameScope = function()
			    {

				for( i = 0; i < (charArray.length+1); i++)
				{

				   if(scopeArray[i] == scope.depth)
				   {

					if(intChecker())
					{
						if( (peekAtToken(2).Token == charArray[i]) )
						{
							return true;
						}
						else
						{



							return false;
						}
					}




					if(stringChecker())
					{
						if( (peekAtToken(5).Token == charArray[i]) )
						{
							return true;
						}
						else
						{
							return false;
						}
					}

				    }
				    

				}
			   }



	//ensudres that a variable is not declared twice in the same scope
	this.checkDecl = function()
			 {

				for( i = 0; i < (charArray.length+1); i++)
				{


				
				   if(scopeArray[i] <= scope.depth)
				   {

					if(currentToken.Token == charArray[i])
					{
						return true;
					}
					else
					{
	
					}


				    }
				    else
				    {

				    }
				    

				}

			}



	//records the type of variables before the = operator
	this.checkType = function()
			   {


				for( i = 0; i < (charArray.length+1); i++)
				{

				   if(scopeArray[i] <= scope.depth)
				   {

					if(currentToken.Token == charArray[i])
					{

						this.type = typeArray[i];
					}
					     

				    }
				    

				}

		
			   }


	//records the type of variabls after the = operator
	this.checkTypeAfterAssign = function()
			   {


				for( i = 0; i < (charArray.length+1); i++)
				{

				   if(scopeArray[i] == scope.depth)
				   {

					if(currentToken.Token == charArray[i])
					{

						this.type2 = typeArray[i];
					}
					     

				    }
				    

				}

		
			   }


	this.saveVar = function()
      		       {

			  this.varAfterAssign = currentToken.Type;
			}




	//Make sure the right kind of value is being assigned to variables
	this.checkAssign = function()
			   {

				if(this.varAfterAssign == "char")
				  {

				if(inStatementList == true)
				{

				this.checkUninitVar();

				}

					if(this.type == this.type2)
					{
						return true;
				        }
				        else
				        {
					   return false;
				        }
				}

				if( this.type == "int   " )
				{

				    if(this.varAfterAssign == "digit")
				     {

					return true;
				     }
				     else
				     {
					return false
				      }
				}

				

				if(this.type == "string")
				{
				    if(this.varAfterAssign == "quote")
				     {

					return true;
				     }
				     else
				     {
					return false;
				      }
				}



			   }





	//checks for unitialized variables
	this.checkUninitVar = function()
			     {

				for( i = tokenIndex; i > -1; i--)
				{

					if((tokens[i].Token == "{" ) || (tokens[i].Token == "}" ) )	
					{

						break;

					}
					

						if(tokens[i].Token == "=")
						{
	
						   if(tokens[i-1].Token == currentToken.Token)
						   {

				
							this.initialized = true;

							break;
						    }

						}

				}



				if(this.initialized == false)
				{

				    putMessage("\nWARNING: I'M GONNA PARSE YOUR MOMMA TONIGHT. DON'T SAY I DIDN'T WARN YOU.\n");

				    

				} 



			     }


	//checks for unused variables
	this.checkUnusedId = function()
			     {
	
				for( i = tokenIndex; i< tokens.length; i++)
				{

					if((tokens[i].Token == "{" ) || (tokens[i].Token == "}" ) )	
					{

						break;

					}
					
				
					 if(tokens[i].Token == currentToken.Token)
					  {
			
						this.used = true;

						break;
					    }

		   
					
				    

				}



				if(this.used == false)
				{

				    putMessage("\nWARNING: I'M GONNA PARSE YOUR MOMMA TONIGHT. DON'T SAY I DIDN'T WARN YOU.\n");

				    

				} 


				this.used = false;

			   }

				    				



}



//End of YOUR MOMMA Parser!!!!!!!

