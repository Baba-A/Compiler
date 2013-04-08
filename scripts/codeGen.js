//ABUBAKAR BABA AWUMBILA
//COMPILER PROJECT - CODE GENERATION



   //VARIABLE DECLARATIONS
   var stringCodeArray = new Array(); //Array to store Hex string code
   var strings = new Array();  // array to store declared strings
   var codeGenScope = 0;   //keep track of scope in codegen
   var intScopeCounter = 0; 
   var stringScopeCounter = 0;
   var ifFlag = false;
   var ifFlagHelp = false;
   var ifScope = 0;
   var whilePointer = 0;
   var whileFlag = false
   var whileFlagHelp = false;
   var whileScope = 0;
   var whileTempToken = "";
   var whileTempToken1 = "";
   var pointerHelpVar = 0;
   

   

   //CODEGEN FUNCTION
   function codeGen()
   {



    //SET VAIABLE FOR EACH NEW COMPILE
    machineCode = new Array();
    codeIndex = 0;
    acc = 0;
    tempString = "";
    stringCode = "";
    intVarDecl = false;
    stringVarDecl = false;
    add = 0;
    curr = 0;
    varToCode = new Array();			
    tempAdd = "";
    tempType = "";
    tempType2 = "";
    tempChar = "";
    numOstrings = 0;
    numOExpr = 0;
    tExpr = 50;
    tempExpr = "";
    stringCodeArray = new Array();
    printy = new Array();
    ints = new Array();
    intHolder = new Array();
    printExpr = new Array();
    printStringExpr = false;
    tExprInit = 50;
    stringExprCurr = 50;
    charReassign = new Array();
    stringReassign = false;
    pointerArray = new Array();
    pointerChar = new Array();
    pointerCounter = 0;
    codeGenScope = 0;
    intScopeCounter = 0;
    stringScopeCounter = 0;
    ifFlag = false;
    ifFlagHelp = false;
    ifScope = 0;
    whilePointer = 0;
    whileFlag = false
    whileFlagHelp = false;
    whileScope = 0;
    whileTempToken = "";
    whileTempToken1 = "";
    strings = new Array();
    tokenIndex = 0;


    //MOVE AHEAD TO APPROPRIATE PLACE
    currentToken = getNextTokenCodeGen();
    currentToken = getNextTokenCodeGen();


    //GENERATE MACHINE CODE
    generateCode();


    currentToken = getNextTokenCodeGen();



    //BACKPATCH AND ASSIGN POINTERS AND ADDRESS VALUES FOR STRINGS
    if(numOstrings > 0)
    {

	 machineCode.push("00");


	for(i = 0; i < numOstrings; i++)
	{
	    machineCode.push("00");
	}



	for( n = 0; n < stringCodeArray.length; n++)
	{


		   pointerHelp();  //BACKPATCH POINTERS 
		   stringCodeSort( n );  //SORT STRING CODE
	           machineCode.push("00");

	}	


        //BACKPATCH STRING POINTERS
	for( n = 0; n < pointerChar.length; n++)
	{


		  stringPointerHelp();

	}

     }


	//BACKATCH PRINT EXPRESSIONS
	if(numOExpr > 0)
	{

	   machineCode.push("00");

	   for(i = 0; i < numOExpr; i++)
	   {
	      machineCode.push("00");
	   }


	 if(printStringExpr == true )
	 {

	   for( v = 0; v < printExpr.length; v++)
	   {


		   printExprAdd(); 
		   printExprSort( v );
	           machineCode.push("00");

	   }

	}
	else
	{
		printExprAdd();    

	}


	}


      if(currentToken.Type == "EOF")
      {

	
	 machineCode.push("00");
	
      }

  	  

      
      address();  // BACKPATCH REMAINING ADDRESSES



      printCode();  // PRINT MACHINE CODE


   } //END OF CODEGEN







//==================================================================================================================






  //GENERATE CODE ACCORDINGLY
  function generateCode()
  {


	//UPDATE SCOPE FOR CODEGEN
	if(currentToken.Type == "leftCurlyBracket")
	{
		codeGenScope++;
 		checkTokenCodeGen("leftCurlyBracket");

	}


        //UPDATE IF STATEMENT FLAG
	if(ifFlagHelp == true)
	{

	   if(ifScope == codeGenScope)
	   {
	       ifFlag = true;
	   }
	}


	//UPDATE WHILE STATEMENT FLAG
	if(whileFlagHelp == true)
	{

	   if(whileScope == codeGenScope)
	   {
	       whileFlag = true;
	   }
	}


	//GENERATE CODE FOR PRINT STATEMENTSS
	if(printChecker())
	{
		
	 
	      
	      if(peekAtToken(5).Type == "quote" )
	      { 
		numOExpr++;
                printStringExpr = true;

           	checkTokenCodeGen("print");
           	checkTokenCodeGen("leftParen");
		currentToken = getNextTokenCodeGen();


		while(currentToken.Type != "quote")
		{

		   tempExpr += currentToken.Token;
		   currentToken = getNextTokenCodeGen();


		}
		printExpr.push(tempExpr);
		tempExpr = "";
 
	


	   	machineCode.push("A0");
	   	machineCode.push("t" + tExpr);
	   	machineCode.push("A2");	
	   	machineCode.push("02");
	   	machineCode.push("FF");
	        tExpr++;
           	checkTokenCodeGen("quote");
           	checkTokenCodeGen("rightParen");
		generateCode();
	


	     } else if(peekAtToken(5).Type == "digit")
	     	    {
			checkTokenCodeGen("print");
        	   	checkTokenCodeGen("leftParen");

			numOExpr++;

			acc += parseInt(currentToken.Token);
			checkTokenCodeGen("digit");

			acc = acc.toString(16).toUpperCase();

	
			if(acc.length < 2)
			{
	
	            	   acc = "0" + acc;
			}
	


			machineCode.push("A9");
			machineCode.push(acc);
			machineCode.push("8D");			
	   		machineCode.push("t" + tExpr);
	   		machineCode.push("00");	



			while(currentToken.Type == "op")
			{
				checkTokenCodeGen("op")

				acc = 0;


				acc += parseInt(currentToken.Token);


				if(currentToken.Type == "digit")
				{

				checkTokenCodeGen("digit");
				
	
				acc = acc.toString(16).toUpperCase();
	
	
				if(acc.length < 2)
				{
		
		            	   acc = "0" + acc;
				}
	
			  	machineCode.push("A9");	
		   		machineCode.push(acc);
		   		machineCode.push("6D");
		   		machineCode.push("t" + tExpr);
		   		machineCode.push("00");	
		   		machineCode.push("8D");
		   		machineCode.push("t" + tExpr);
		   		machineCode.push("00");	

				}
				else if(currentToken.Type == "char")
				     {
					machineCode.push("AD");
					for( i = 0; i < varToCode.length; i++ )
					{
	
		   			if( codeGenScope > 0)
		  			 {
	   	      			if( currentToken.Token + codeGenScope == varToCode[i] )
	   	     			 {

         	 			        machineCode.push("t" + i);
	   	 			     }

		 		    }
		   		    else
		   		    {	

	   	     			 if( currentToken.Token == varToCode[i] )
	   	      		    {

         	         		machineCode.push("t" + i);
	   	      		    }
		   		}

			}
	
		
	   				machineCode.push("xx");
					machineCode.push("6D");
		   			machineCode.push("t" + tExpr);
		   			machineCode.push("00");
					machineCode.push("8D");
		   			machineCode.push("t" + tExpr);
		   			machineCode.push("00");


					checkTokenCodeGen("char");
				     }


				     



	
			}

			machineCode.push("AC");
			machineCode.push("t" + tExpr);
		   	machineCode.push("00");
		   	machineCode.push("A2");
		   	machineCode.push("01");
		   	machineCode.push("FF");

	                checkTokenCodeGen("rightParen");

			acc = 0;
			generateCode();		
		    }



	
	      printValidate();


	      if(tempType == "int   ")
	      {

           	checkTokenCodeGen("print");
           	checkTokenCodeGen("leftParen");

	   	machineCode.push("AC");


		for( i = 0; i < varToCode.length; i++ )
		{

		   if( codeGenScope > 0 && (intScopeCounter == codeGenScope))
		   {

	   	      if( currentToken.Token + codeGenScope == varToCode[i] || ( currentToken.Token == varToCode[i] ))
	   	      {

         	         machineCode.push("t" + i);
	   	      }

		   }
		   else if( codeGenScope == 0 )
		   {

	   	      if( currentToken.Token == varToCode[i] )
	   	      {

         	         machineCode.push("t" + i);
	   	      }
		   }
		   else
		   {

	   	      if( (currentToken.Token + (codeGenScope - 1))  == varToCode[i] || ( currentToken.Token == varToCode[i] ) || ( (currentToken.Token + codeGenScope) == varToCode[i] ))
	   	      {

         	         machineCode.push("t" + i);
	   	      }
		      

		   }

		}
	

	   	machineCode.push("xx");
	   	machineCode.push("A2");
	   	machineCode.push("01");
	   	machineCode.push("FF");

           	checkTokenCodeGen("char");
           	checkTokenCodeGen("rightParen");

	
      		tempType = "";	



	   	generateCode();



		}


	  if(tempType == "string")
	  {


           checkTokenCodeGen("print");
           checkTokenCodeGen("leftParen");


	   machineCode.push("AC");

		for( i = 0; i < varToCode.length; i++ )
		{

		   if( codeGenScope > 0 && (stringScopeCounter == codeGenScope))
		   {
	   	      if( currentToken.Token + codeGenScope == varToCode[i] )
	   	      {

         	         machineCode.push("t" + i);
	   	      }

		   }
		   else if( codeGenScope == 0 )
		   {

	   	      if( currentToken.Token == varToCode[i] )
	   	      {

         	         machineCode.push("t" + i);
	   	      }
		   }
		   else
		   {
	   	      if( (currentToken.Token + (codeGenScope - 1))  == varToCode[i]  || ( currentToken.Token == varToCode[i] ) || ( (currentToken.Token + codeGenScope) == varToCode[i] ))
	   	      {

         	         machineCode.push("t" + i);
	   	      }

		   }

		}

	   machineCode.push("xx");
	   machineCode.push("A2");
	   machineCode.push("02");
	   machineCode.push("FF");
	

	printy.push(currentToken.Token);


           checkTokenCodeGen("char");
           checkTokenCodeGen("rightParen");

    		tempType = "";	
	



	   generateCode();

	}



	}

	//ASSIGNMENT CODEGEN
	else if( currentToken.Type == "char" && peekAtToken(0).Type == "assign")
	     {
		
		if( codeGenScope > 0 && ((intScopeCounter == codeGenScope) || (stringScopeCounter == codeGenScope)))
		{

		   tempAdd = currentToken.Token + codeGenScope;
	  	   tempChar = currentToken.Token + codeGenScope;
		}
		else if(codeGenScope == 0)
		{

		   tempAdd = currentToken.Token;
	  	   tempChar = currentToken.Token;

		}
		else
		{
		

                  if((codeGenScope > 1) && ((intScopeCounter == codeGenScope) || (stringScopeCounter == codeGenScope)))
		  {			
		   tempAdd = currentToken.Token + (codeGenScope - 1);
	  	   tempChar = currentToken.Token + (codeGenScope - 1);
		  }
		 else
		 {
		   tempAdd = currentToken.Token;
	  	   tempChar = currentToken.Token;
		 }

		}
			    
		checkTokenCodeGen("char");
           	checkTokenCodeGen("assign");
		codeGenExpr();
	  	generateCode();

	     }

	     //VARIABLE DELARATION CODEGEN
	     else if( intChecker() || stringChecker() )
		  {
			if(intChecker())
			{

			    intVarDecl = true;
			    checkTokenCodeGen("char");
			    checkTokenCodeGen("char");
			    checkTokenCodeGen("char");

			    if( codeGenScope > 0)
			    {
			        ints.push(currentToken.Token + codeGenScope);
			        varToCode.push(currentToken.Token + codeGenScope);
				intScopeCounter++;

			    }
			    else
			    {

			    ints.push(currentToken.Token);
			    varToCode.push(currentToken.Token);
			    }

			    checkTokenCodeGen("char");
			    machineCode.push("A9");
			    machineCode.push("00");
			    machineCode.push("8D");
			    machineCode.push("t" + add);
			    add++;
			    machineCode.push("xx");


			    generateCode();
			}



			if(stringChecker())
			{
			    checkTokenCodeGen("char");
			    checkTokenCodeGen("char");
			    checkTokenCodeGen("char");
			    checkTokenCodeGen("char");
			    checkTokenCodeGen("char");
			    checkTokenCodeGen("char");

			    if( codeGenScope > 0)
			    {
			        strings.push(currentToken.Token + codeGenScope);
			        varToCode.push(currentToken.Token + codeGenScope);
				stringScopeCounter++;

			    }
			    else
			    {

			      strings.push(currentToken.Token);
			      varToCode.push(currentToken.Token);
			     }

			    checkTokenCodeGen("char");
			    machineCode.push("A9");
			    machineCode.push("00");
			    machineCode.push("8D");
			    machineCode.push("t" + add);
			    add++;
			    machineCode.push("xx");

	  		    generateCode();
			}





		  }

		  //IF STATEMENT CODEGEN
		  else if( ifChecker())
		       {

			   ifFlagHelp = true;

			   checkTokenCodeGen("if");
			   checkTokenCodeGen("leftParen");	





		       if((currentToken.Type == "char" ) && ( peekAtToken(0).Type != "rightParen"))
		       {

		   	  machineCode.push("AE");	




	        	  for( i = 0; i < varToCode.length; i++ )
			  {

		   	     if( codeGenScope > 0 && (intScopeCounter == codeGenScope))
		   	     {
	   	      		if( currentToken.Token + codeGenScope == varToCode[i])
	   	      		{

         	         		machineCode.push("t" + i);
	   	      		}

		   	    }
		   	    else if( codeGenScope == 0 )
		   	    {

	   	      		if( currentToken.Token == varToCode[i] )
	   	      		{

         	        	   machineCode.push("t" + i);
	   	      		}
		   	   }
		   	   else
		   	   {
	   	      		if( (currentToken.Token + (codeGenScope - 1))  == varToCode[i] || currentToken.Token == varToCode[i])
	   	      		{

         	         	   machineCode.push("t" + i);
	   	      		}

		   	   }

		         }


	   		   machineCode.push("xx");
			   machineCode.push("EC");

			   checkTokenCodeGen("char");
			   checkTokenCodeGen("condOp");


	        	  for( i = 0; i < varToCode.length; i++ )
			  {
		

		   	     if( codeGenScope > 0 && (intScopeCounter == codeGenScope))
		   	     {
	   	      		if( currentToken.Token + codeGenScope == varToCode[i])
	   	      		{

         	         		machineCode.push("t" + i);
	   	      		}

		   	    }
		   	    else if( codeGenScope == 0 )
		   	    {

	   	      		if( currentToken.Token == varToCode[i] )
	   	      		{

         	        	   machineCode.push("t" + i);
	   	      		}
		   	   }
		   	   else
		   	   {
	   	      		if( (currentToken.Token + (codeGenScope - 1))  == varToCode[i] || currentToken.Token == varToCode[i])
	   	      		{

         	         	   machineCode.push("t" + i);
	   	      		}

		   	   }

			  }



	   		   machineCode.push("xx");

			   checkTokenCodeGen("char");


			   machineCode.push("D0");
			   machineCode.push("qq");

                           pointerHelpVar = machineCode.length;



			}
			else if((currentToken.Type == "char" ) && ( peekAtToken(0).Type == "rightParen"))
			     {

				

						   checkTokenCodeGen("char");



			    }


			ifScope = codeGenScope;
			   checkTokenCodeGen("rightParen");

			while(  ifFlag != true )
			{

				generateCode();

			}


		        


			
	                 pointerHelpIf();
			

			 generateCode();



		      }

		      //WHILE LOOP CODEGEN
		      else if( whileChecker() )
		           {

				
 			     whileFlagHelp = true;

			     checkTokenCodeGen("while");
			     checkTokenCodeGen("leftParen");	





		      	     if((currentToken.Type == "char" ) && ( peekAtToken(0).Type != "rightParen"))
		       	     {


 				whilePointer = machineCode.length;

		   		machineCode.push("AE");	

				whileTempToken = currentToken.Token;


	        	 	 for( i = 0; i < varToCode.length; i++ )
			  	{

		   	   	  if( codeGenScope > 0 && (intScopeCounter == codeGenScope))
		   	     	  {
	   	      			if( currentToken.Token + codeGenScope == varToCode[i])
	   	      			{

         	         			machineCode.push("t" + i);
	   	      			}

		   	    	}
		   	    	else if( codeGenScope == 0 )
		   	    	{

	   	      			if( currentToken.Token == varToCode[i] )
	   	      			{
	
         	        		   machineCode.push("t" + i);
	   	      			}
		   	       }
		   	       else
		   	       {
	   	      			if( (currentToken.Token + (codeGenScope - 1))  == varToCode[i] || currentToken.Token == varToCode[i])
	   	      			{

         	         	  	 machineCode.push("t" + i);
	   	      			}

		   	       }

		            }


	   		   machineCode.push("xx");
			   machineCode.push("EC");

			   checkTokenCodeGen("char");
			   checkTokenCodeGen("condOp");



			   whileTempToken1 = currentToken.Token;

	        	  for( i = 0; i < varToCode.length; i++ )
			  {
		

		   	     if( codeGenScope > 0 && (intScopeCounter == codeGenScope))
		   	     {
	   	      		if( currentToken.Token + codeGenScope == varToCode[i])
	   	      		{

         	         		machineCode.push("t" + i);
	   	      		}

		   	    }
		   	    else if( codeGenScope == 0 )
		   	    {

	   	      		if( currentToken.Token == varToCode[i] )
	   	      		{

         	        	   machineCode.push("t" + i);
	   	      		}
		   	   }
		   	   else
		   	   {
	   	      		if( (currentToken.Token + (codeGenScope - 1))  == varToCode[i] || currentToken.Token == varToCode[i])
	   	      		{

         	         	   machineCode.push("t" + i);
	   	      		}

		   	   }

			  }



	   		   machineCode.push("xx");

			   checkTokenCodeGen("char");

			   machineCode.push("D0");
			   machineCode.push("qq");

			   pointerHelpVar = machineCode.length;			 

			

			   


			}
			else if((currentToken.Type == "char" ) && ( peekAtToken(0).Type == "rightParen"))
			     {

				

						   checkTokenCodeGen("char");



			    }//end


			whileScope = codeGenScope;
			   checkTokenCodeGen("rightParen");




			while(  whileFlag != true )
			{

				generateCode();

			}






		   	   machineCode.push("A2");	



	   		   machineCode.push("01");
			   machineCode.push("EC");

			   checkTokenCodeGen("char");
			   checkTokenCodeGen("condOp");


	        	  for( i = 0; i < varToCode.length; i++ )
			  {
		

		   	     if( codeGenScope > 0 && (intScopeCounter == codeGenScope))
		   	     {
	   	      		if( whileTempToken + codeGenScope == varToCode[i])
	   	      		{

         	         		machineCode.push("t" + i);
	   	      		}

		   	    }
		   	    else if( codeGenScope == 0 )
		   	    {

	   	      		if( whileTempToken == varToCode[i] )
	   	      		{

         	        	   machineCode.push("t" + i);
	   	      		}
		   	   }
		   	   else
		   	   {
	   	      		if( (whileTempToken + (codeGenScope - 1))  == varToCode[i] )
	   	      		{

         	         	   machineCode.push("t" + i);
	   	      		}

		   	   }

			  }



	   		   machineCode.push("xx");


			   machineCode.push("D0");
			   var test = 256;
		
		           if( whilePointer.toString(16).toUpperCase().length < 2)
			   {

			      machineCode.push("EF");

			   }
			   else
			   {

			      machineCode.push("EB");

			   }

		 	   pointerHelpIf();
			   pointerHelpIf();

			   generateCode();
   


		}



	 //UPDATE SCOPE ACCORDINGLY
  	 if(codeGenScope > 0)
   	 {

		if(currentToken.Type == "rightCurlyBracket")
		{
	   	checkTokenCodeGen("rightCurlyBracket");
	   	codeGenScope--;
		intScopeCounter--;
	        stringScopeCounter--;
		generateCode();
		}
  	}

   }


//==================================================================================================================





   //GENERATE CODE FOR EXPRESSIONS
   function codeGenExpr()
   {

	//GENERATE COD FOR STRING EXPRESSIONS
	if(currentToken.Type == "digit" )
	{			

	    acc += parseInt(currentToken.Token);

	    checkTokenCodeGen("digit");



	    codeGenIntExpr();


	for( p = 0; p < ints.length; p++)
	{
	
	   if(ints[p] == tempChar)
	   {

	           intHolder[p] = acc;

	   }

	}	

	acc = acc.toString(16).toUpperCase();


	if(acc.length < 2)
	{

            acc = "0" + acc;
	}



	machineCode.push("A9");
        machineCode.push(acc.toUpperCase());
	machineCode.push("8D");

	for( i = 0; i < varToCode.length; i++ )
	{

	
	   if( tempAdd == varToCode[i] )
	   {

         	   machineCode.push("t" + i);
	   }

	}

	machineCode.push("xx");

	acc = 0;

	}




        //GENRATE CODE FOR STRING EXPRESSIONS
	else if(currentToken.Type == "quote")
	     {  


  
		if(currentToken.Type == "quote")
		{

		   codeGenStringExpr();

		}

	



	


	machineCode.push("A9");
	machineCode.push("yy");
	machineCode.push("8D");


	for( i = 0; i < varToCode.length; i++ )
	{
	    if( tempChar == varToCode[i] )
	     {

       	       machineCode.push("t" + i);
  	   }

	}
	

   	machineCode.push("xx");


	     }

	     //GENERATE CODE FOR IDS
	     else if(currentToken.Type == "char")
		  {
	

			codeGenId();

		   }

   }


//==================================================================================================================




  //GENERATE CODE FOR IDS
  function codeGenId()
  {
  
	if(currentToken.Type == "char")
	{


	     for( x = 0; x < charArray.length; x++)
	     {

		if(currentToken.Token == charArray[x])
		{
		    tempType2 = typeArray[x];

		}

	     }
	}


	if(tempType2 ==  "int   ")
	{

		

		for( s = 0; s < ints.length; s++)
	 	{
	
 			if(ints[s] == currentToken.Token)
   		 	{
  	
		             acc += parseInt(intHolder[s]);

	
		  	}
		}

		checkTokenCodeGen("char");

		
		for( p = 0; p < ints.length; p++)
		{
	
		   if(ints[p] == tempChar)
		   {

		           intHolder[p] = acc;

		   }

		}	

		acc = acc.toString(16).toUpperCase();


		if(acc.length < 2)
		{

            	acc = "0" + acc;
		}



		machineCode.push("A9");
     	        machineCode.push(acc.toUpperCase());
		machineCode.push("8D");

		for( i = 0; i < varToCode.length; i++ )
		{
		   if( tempAdd == varToCode[i] )
		   {

	         	   machineCode.push("t" + i);
		   }

		}

		machineCode.push("xx");
	
		acc = 0;

         }





	if(tempType2 ==  "string")
	{

		
		numOstrings++;
		for( z = 0; z < strings.length; z++)
	 	{
	
 			if(strings[z] == currentToken.Token)
   		 	{
		
			   pointerChar.push(currentToken.Token);

	
		  	}
		}


		checkTokenCodeGen("char");

		
		machineCode.push("A9");
		machineCode.push("zz");
		machineCode.push("8D");


		for( i = 0; i < varToCode.length; i++ )
		{
	  	  if( tempChar == varToCode[i] )
	    	 {

       	      	 machineCode.push("t" + i);
  	   	}

		}
		

   		machineCode.push("xx");
       	  }



    }


		
//==================================================================================================================



   //GENERATE CODE FOR INT EXPRESSIONS
   function codeGenIntExpr()
   {



	if(currentToken.Token == "+" )
	{


	  if(peekAtToken(0).Type == "digit")
	  {
	    acc += parseInt(peekAtToken(0).Token);
	    checkTokenCodeGen("op");
	    checkTokenCodeGen("digit");
	    codeGenIntExpr();
	   }
	   else if(peekAtToken(0).Type == "char" )
		{
		    

			for( r = 0; r < ints.length; r++)
	 		{	

 			   if(ints[r] == peekAtToken(0).Token)
   		 	  {

		             acc += parseInt(intHolder[r]);
	    	 	     checkTokenCodeGen("op");
	   		     checkTokenCodeGen("digit");
	    		     codeGenIntExpr();
	
		  	  }

			}	
		
			
		}  



	}




   }

   

//==================================================================================================================



   //GENERATE CODE FOR STRING EXPRESSIONS
   function codeGenStringExpr()
   {

      checkTokenCodeGen("quote");

	numOstrings++;

	while(currentToken.Type != "quote")
	{
	   tempString += currentToken.Token;
           checkTokenCodeGen("char");

	}


	stringCode = "";

	for( i = 0; i < tempString.length; i++ )
	{


	    stringCode += tempString.charCodeAt(i).toString(16).toUpperCase();

	}

	tempString = "";


           checkTokenCodeGen("char");

	   var temp = stringCode;
	   stringCode = "";


	for( i = 0; i < temp.length; i += 2)
	{
	
	    stringCode += temp[i] + temp[i+1];
	}	   

	stringCodeArray.push( stringCode);




   } 



//==================================================================================================================

   

   //BACKPATCH ADDRESS SPACE
   function address()
   {

	var curr = 0;


	while( curr <  add  )
	{

       for(i = 0; i < machineCode.length; i++)
       {



	   if( machineCode[i] == ("t" + curr))
	   {
		if((machineCode.length + curr).toString("16").length < 2)
		{

			machineCode[i] = "0" + (machineCode.length + curr).toString("16").toUpperCase();
		}
		else
		{
			machineCode[i] = (machineCode.length + curr).toString("16").toUpperCase();
		}
	        machineCode[i + 1] = "00";
	   }

	}
	
	curr++;

	}




   }


   function printExprAdd()
   {



       for(y = 0; y < machineCode.length; y++)
       {


	   if( machineCode[y] == ("t" + stringExprCurr))
	   {

		if(machineCode.length.toString("16").length < 2)
		{
			machineCode[y] = "0" + (machineCode.length.toString("16").toUpperCase());
		}
		else
		{
			machineCode[y] = machineCode.length.toString("16").toUpperCase();
		}


	   }


	}
	
	stringExprCurr++;

	

   }
	
//==================================================================================================================


    //CHECK TOKEN FUNCTION FOR CODEGEN
    function checkTokenCodeGen(expectedKind)
    {
 
	//Check to valiudate that we have the expected type of token	
	switch(expectedKind)
	{
 
		//For Digits
		case "digit" : //putMessage("Expecting a digit");
			       if(currentToken.Token == "0" || currentToken.Token == "1" || currentToken.Token == "2" || currentToken.Token == "3" ||
			          currentToken.Token == "4" || currentToken.Token == "5" || currentToken.Token == "6" || currentToken.Token == "7" ||
			          currentToken.Token == "8" || currentToken.Token == "9" )
			       {
				    //putMessage("Got a digit.");
			       }
			       else
			       {
				    errorCount++;
			            //putMessage("Token is not a digit. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
		//For operations
		case "op" : //putMessage("Expecting an operator");
			       if(currentToken.Token == "+" || currentToken.Token == "-" )
			       {
				    //putMessage("Got an operator.");
			       }
			       else
			       {
				    errorCount++;
			            //putMessage("Token is not an operator. \nError Position: " + tokenIndex + "." );
			       }
			       break;


		//For conditional operations
		case "condOp" : //putMessage("Expecting a conditional operator");
			       if((currentToken.Token == "=" && peekAtToken(0).Token == "=" ) || (currentToken.Token == "!" && peekAtToken(0).Token == "=" ) )
			       {
				    currentToken = getNextTokenCodeGen();
				    //putMessage("Got a conditional operator.");

			       }
			       else
			       {
				    errorCount++;
			            //putMessage("Token is not a conditional operator. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 

		//For characters	
		case "char" : //putMessage("Expecting a character");
			       if(currentToken.Token == "a" || currentToken.Token == "b" || currentToken.Token == "c" || currentToken.Token == "d" ||
			          currentToken.Token == "e" || currentToken.Token == "f" || currentToken.Token == "g" || currentToken.Token == "h" ||
			          currentToken.Token == "i" || currentToken.Token == "j" || currentToken.Token == "k" || currentToken.Token == "l" ||
			          currentToken.Token == "m" || currentToken.Token == "n" || currentToken.Token == "o" || currentToken.Token == "p" ||
			          currentToken.Token == "q" || currentToken.Token == "r" || currentToken.Token == "s" || currentToken.Token == "t" ||
			          currentToken.Token == "u" || currentToken.Token == "v" || currentToken.Token == "w" || currentToken.Token == "x" ||
			          currentToken.Token == "y" || currentToken.Token == "z" )
			       {
				    //putMessage("Got a character.");
			       }
			       else
			       {
				    errorCount++;
			            //putMessage("Token is not a character. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
 
		//For ids
		case "id" :// putMessage("Expecting an ID");
			       if(currentToken.Token == "a" || currentToken.Token == "b" || currentToken.Token == "c" || currentToken.Token == "d" ||
			          currentToken.Token == "e" || currentToken.Token == "f" || currentToken.Token == "g" || currentToken.Token == "h" ||
			          currentToken.Token == "i" || currentToken.Token == "j" || currentToken.Token == "k" || currentToken.Token == "l" ||
			          currentToken.Token == "m" || currentToken.Token == "n" || currentToken.Token == "o" || currentToken.Token == "p" ||
			          currentToken.Token == "q" || currentToken.Token == "r" || currentToken.Token == "s" || currentToken.Token == "t" ||
			          currentToken.Token == "u" || currentToken.Token == "v" || currentToken.Token == "w" || currentToken.Token == "x" ||
			          currentToken.Token == "y" || currentToken.Token == "z" )
			       {
				    //putMessage("Got an ID.");
			       }
			       else
			       {
				    errorCount++;
			          //  putMessage("Token is not an ID. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
 
		//For print
		case "print" : //putMessage("Expecting a print");
			       if(currentToken.Token == "p" && peekAtToken(0).Token == "r" && peekAtToken(1).Token == "i" && peekAtToken(2).Token == "n" && peekAtToken(3).Token == "t" )
			       {
				   // putMessage("Got a print.");
				    currentToken = getNextTokenCodeGen();
				    currentToken = getNextTokenCodeGen();
				    currentToken = getNextTokenCodeGen();
				    currentToken = getNextTokenCodeGen();
				    
			       }
			       else
			       {
				    errorCount++;
			           // putMessage("Character Sequence is not a print. \nError Position: " + tokenIndex + "." );
			       }
			       break;



		//For while
		case "while" : //putMessage("Expecting a while");
			       if(currentToken.Token == "w" && peekAtToken(0).Token == "h" && peekAtToken(1).Token == "i" && peekAtToken(2).Token == "l" && peekAtToken(3).Token == "e" )
			       {
				   // putMessage("Got a while.");
				    currentToken = getNextTokenCodeGen();
				    currentToken = getNextTokenCodeGen();
				    currentToken = getNextTokenCodeGen();
				    currentToken = getNextTokenCodeGen();
				    
			       }
			       else
			       {
				    errorCount++;
			            //putMessage("Character Sequence is not a while. \nError Position: " + tokenIndex + "." );
			       }
			       break;



		//For if
		case "if" :// putMessage("Expecting an if");
			       if(currentToken.Token == "i" && peekAtToken(0).Token == "f" )
			       {
				   // putMessage("Got an if.");
				    currentToken = getNextTokenCodeGen();
		
				    
			       }
			       else
			       {
				    errorCount++;
			           // putMessage("Character Sequence is not an if. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 

		//For left parenthesis
		case "leftParen" : //putMessage("Expecting a left parenthesis");
			       if(currentToken.Token == "(")
			       {
				   // putMessage("Got a left parenthesis.");
			       }
			       else
			       {
				    errorCount++;
			           // putMessage("Token is not a left parenthesis. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
 
 
		//For right parenthesis
		case "rightParen" : //putMessage("Expecting a right parenthesis");
			       if(currentToken.Token == ")")
			       {
				   // putMessage("Got a right parenthesis.");
			       }
			       else
			       {
				    errorCount++;
			           // putMessage("Token is not a right parenthesis. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
 
		//For left curly bracket
		case "leftCurlyBracket" : //putMessage("Expecting a left curly bracket");
			       if(currentToken.Token == "{")
			       {
				   // putMessage("Got a left curly bracket.");
			       }
			       else
			       {
				    errorCount++;
			            //putMessage("Token is not a left curly bracket. \nError Position: " + tokenIndex + "." );
			       }
			       break;	putMessageCodeGen( machineCode[i] + "  ");
 
 
		//For right curly bracket
		case "rightCurlyBracket" : //putMessage("Expecting a right curly bracket");
			       if(currentToken.Token == "}")
			       {
				   // putMessage("Got a right curly bracket.");
			       }
			       else
			       {
				    errorCount++;
			           // putMessage("Token is not a right curly bracket. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
 
		//For assignment operator
		case "assign" :// putMessage("Expecting an assignment operator.");
			       if(currentToken.Token == "=")
			       {
				  //  putMessage("Got an assignment operator.");
			       }
			       else
			       {
				    errorCount++;
			          //  putMessage("Token is not an assignment operator. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
		//For quotation marks
		case "quote" : //putMessage("Expecting a quotation mark");
			       if(currentToken.Token == "\"")
			       {
				   // putMessage("Got a quotation mark.");
			       }
			       else
			       {
				    errorCount++;
			           // putMessage("Token is not a quotation mark. \nError Position: " + tokenIndex + "." );
			       }
			       break;


		//For space character
		case " " : //putMessage("Expecting a space character.");
			       if(currentToken.Token == " ")
			       {
				   // putMessage("Got a space character.");
			       }
			       else
			       {
				    errorCount++;
			           // putMessage("Token is not a space character. \nError Position: " + tokenIndex + "." );
			       }
			       break;
 
 
	}
 
	//After checking the current token, consume and asssigne the next token to the current token slot(variable)
	currentToken = getNextTokenCodeGen();
 
}




    //GET NEXT TOKEN FUNCTION
    function getNextTokenCodeGen()
    {
        var thisToken = EOF;    // Let's assume that we're at the EOF.
        if (tokenIndex < tokens.length)
        {
            // If we're not at EOF, then return the next token in the stream and advance the index.
            thisToken = tokens[tokenIndex];
           // putMessageSymbolTable("\nCurrent token:" + thisToken.Token);
            tokenIndex++;
        }
        return thisToken;
    }






    function putMessageCodeGen(msg)
    {
        document.getElementById("cgOutput").value += msg;
    }



  function printCode()
  {


	putMessageCodeGen("==================================");
	putMessageCodeGen( "\n");
	putMessageCodeGen("=========== MACHINE CODE: ============");
	putMessageCodeGen( "\n");
	putMessageCodeGen("==================================");

	putMessageCodeGen( "\n");
	putMessageCodeGen( "\n");

    for( i = 0; i < machineCode.length; i++)
    {

	putMessageCodeGen( machineCode[i] + "  ");

    }
  }


  
  //CHOOSE THE TYPE OF PRINT STATEMENT
  function printValidate()
  {
     for( i = 0; i < charArray.length; i++)
     {
	if(peekAtToken(5).Token	== charArray[i])
	{
	    tempType = typeArray[i]
	 }
      }
  }	


//==================================================================================================================

  // BACKPATCH STRING POINTERS
  function pointerHelp()
  {


		  for(k = 0; k < machineCode.length; k++)
      	  	 {



	   		if( machineCode[k] == "yy")
	   		{



				if(machineCode.length.toString(16).length < 2)
				{

					machineCode[k] = "0" + machineCode.length.toString(16).toUpperCase();
					pointerArray.push("0" + machineCode.length.toString(16).toUpperCase());
					
				}
				else
				{
	
					machineCode[k] = machineCode.length.toString(16).toUpperCase();
					pointerArray.push(machineCode.length.toString(16).toUpperCase());
					
				}
				
			k = machineCode.length;		
	  		}

			

	   	}

   }	


//==================================================================================================================


  //BACKPATCH POINTERS FOR IF STATEMENTS
  function pointerHelpIf()
  {


		  for(c = 0; c < machineCode.length; c++)
      	  	 {



	   		if( machineCode[c] == "qq")
	   		{



				if((machineCode.length - pointerHelpVar).toString(16).length < 2)
				{

					machineCode[c] = "0" + (machineCode.length - pointerHelpVar).toString(16).toUpperCase();
					
				}
				else
				{
	
					machineCode[c] = (machineCode.length - pointerHelpVar).toString(16).toUpperCase();
					
				}
				
			c = machineCode.length;		
	  		}

			

	   	}	




	
	


  }

//==================================================================================================================



  //BACKPATCH PRINT STRING POINTERS
  function stringPointerHelp()
  {

		 for(a = 0; a < machineCode.length; a++)
      	  	 {



	   		if( machineCode[a] == "zz")
	   		{


				if(machineCode.length.toString(16).length < 2)
				{

					machineCode[a] = "0" + pointerArray[pointerCounter];
					
				}
				else
				{
	
					machineCode[a] = pointerArray[pointerCounter];
					
				}
				
			a = machineCode.length;		
	  		}

			

	   	}

    pointerCounter++;


 }

//==================================================================================================================


  //SORT STRING CODE INTO MACHINE CODE
  function stringCodeSort( i )
  {

	this.i = i;
	var temp = stringCodeArray[this.i];
	

	for( l = 0; l < temp.length; l+=2)
	{
	

	   machineCode.push( temp[l] + temp[l+1] );
	   
	   

	}

	temp = "";

  } 
	


//==================================================================================================================

  function printExprSort( j )
  {

	this.j = j;
	var temp = printExpr[this.j];
	

	for( u = 0; u < temp.length; u++)
	{
	

	   machineCode.push( temp.charCodeAt(u).toString(16).toUpperCase() );
	   
	   

	}

	temp = "";
   }




//==================================================================================================================

//END OF CODE GEN


	

