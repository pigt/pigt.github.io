/* IOWA Gambling Task Version 0.16 
BY:  Ben Margevicius, ben@margevici.us
Usage: if you add ?email_results_to=you@somedomain.com in the query string
	   if you add ?mail_subject=subject for the email like study id it might be useful here.
EX: http://margevici.us/projects/igt/index.html?email_results_to=test@yahoo.com&mail_subject=A1234B4567
You don't have to do both.
http://margevici.us/projects/igt/index.html?email_results_to=test@yahoo.com

You can bookmark http://margevici.us/projects/igt/index.html?email_results_to=you@somewhere.com and create a shortcut for your subjects.

Please donate to the beer fund paypal: bdm4@po.cwru.edu


The MIT License (MIT)

Copyright (c) 2015 Ben Margevicius, margevici.us

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


var GAME_VERSION = "1.0",
    GAME_VERSION_DATE = new Date("November 30, 2017 17:25:00");
    
var MAXGAMES = 100; //maxium amount of plays 100
    
var CASHMAX = 6000; //Maximum amount of cash that can be won
    

var DECKA_WIN = 100, //how much did we win on Deck A click
    DECKB_WIN = 100, //how much did we win on Deck B click
    DECKC_WIN = 50, //how much did we win on Deck C click
    DECKD_WIN = 50; //how much did we win on Deck D click


//Penaly schedules. If lookup DECKN_PENALTY[deckNclicks] to get the preset penalty amount. 
var DECKA_PENALTY = [0, 0, -150, 0, -300, 0, -200, 0, -250, -350, 0, -350, 0, -250, -200, 0, -300, -150, 0, 0, 0, -300, 0, -350, 0, -200, -250, -150, 0, 0, -350, -200, -250, 0, 0, 0, -150, -300, 0, 0],
    DECKB_PENALTY = [0, 0, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1250, 0, 0, 0, 0, 0, 0, 0, 0],
    DECKC_PENALTY = [0, 0, -50, 0, -50, 0, -50, 0, -50, -50, 0, -25, -75, 0, 0, 0, -25, -75, 0, -50, 0, 0, 0, -50, -25, -50, 0, 0, -75, -50, 0, 0, 0, -25, -25, 0, -75, 0, -50, -75],
    DECKD_PENALTY = [0, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0, -250, 0, 0, 0, 0, 0];


var totalcash = 2000, //cash in the cash pile
    
    penalty = 0,   //penalty store for display
    
    netgain = 0,   //netgain store fpr display
    
    totalclicks = 0, //total clicks. if == to MAXGAMES stop playing  
    
    totaldeckAclicks = 0,
    totaldeckBclicks = 0,
    totaldeckCclicks = 0,
    totaldeckDclicks = 0,
    
    deckAclicks_i1 = 0,
    deckAclicks_i2 = 0,
    deckAclicks_i3 = 0,
    deckAclicks_i4 = 0,
    deckAclicks_i5 = 0,
    
    deckBclicks_i1 = 0,
    deckBclicks_i2 = 0,
    deckBclicks_i3 = 0,
    deckBclicks_i4 = 0,
    deckBclicks_i5 = 0,
    
    deckCclicks_i1 = 0,
    deckCclicks_i2 = 0,
    deckCclicks_i3 = 0,
    deckCclicks_i4 = 0,
    deckCclicks_i5 = 0,
    
    deckDclicks_i1 = 0,
    deckDclicks_i2 = 0,
    deckDclicks_i3 = 0,
    deckDclicks_i4 = 0,
    deckDclicks_i5 = 0,
    
    deckAclicks = 0, //clicks for deck A
    deckBclicks = 0, //clicks for deck B
    deckCclicks = 0, //clicks for deck C
    deckDclicks = 0; //clicks for deck D


var selectedCards = []; //stores the selections for output when the game is over.
    
var mail_attachment = ''; //the results of the test that gets emailed
    


//rewards preprogramed pentalties are higher for deck A & B.
$(function () {
    
    $("#testresults").hide();
    
    $(".spinner").hide();    
    
    $("#game_version").html(GAME_VERSION);
    
    
    $('#modal-splash').modal('show'); //show the instructions modal on first load
    

    
    $(".card").click(function () {
        
        totalclicks++; //increment our click counter.
        
        //Note in order to end the game the person has to click MAXGAMES + 1 times. This is ok becuase the person is just clicking away.
        if (totalclicks <= MAXGAMES) {

            var clicked = $(this).attr("id"); //Get the id of the clicked deck
            
            switch (clicked) {                //Do something with that clicked deck id.
                
                case "card-one":
                    
                    if (deckAclicks === DECKA_PENALTY.length) {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckAclicks = 0;
                    }
                    
                    penalty = DECKA_PENALTY[deckAclicks];   //get the penalty value
                    netgain = DECKA_WIN + penalty;          //get the net gain                    
                    
                    $("#winamt").html(DECKA_WIN);           //output our win amount                   
                    
                    deckAclicks++;                          //increment our position for penalty lookup
                    totaldeckAclicks++;
                    
                    selectedCards.push("A");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging                    
                    
                    break;

                case "card-two":
                    
                    if (deckBclicks === DECKB_PENALTY.length) {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckBclicks = 0;
                    }
                    
                    penalty = DECKB_PENALTY[deckBclicks]; //get the penalty value
                    netgain = DECKB_WIN + penalty;          //get the net gain                    
                    
                    $("#winamt").html(DECKB_WIN);           //output our win amount                   
                    
                    deckBclicks++;                        //increment our position for penalty lookup
                    totaldeckBclicks++;
                    
                    selectedCards.push("B");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging          
                    
                    break;

                case "card-three":
                    
                    if (deckCclicks === DECKC_PENALTY.length) {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckCclicks = 0;
                    }
                    
                    penalty = DECKC_PENALTY[deckCclicks]; //get the penalty value
                    netgain = DECKC_WIN + penalty;          //get the net gain                    
                    
                    $("#winamt").html(DECKC_WIN);           //output our win amount                   
                    
                    deckCclicks++;                        //increment our position for penalty lookup
                    totaldeckCclicks++;
                    
                    selectedCards.push("C");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging                    
                    
                    break;

                case "card-four":
                    
                    if (deckDclicks === DECKD_PENALTY.length) {
                        //if we are at the end of the array reset our position back to the beginning. this is described in variants of this test.
                        deckDclicks = 0;
                    }
                    
                    penalty = DECKD_PENALTY[deckDclicks]; //get the penalty value
                    netgain = DECKD_WIN + penalty;          //get the net gain                    
                    
                    $("#winamt").html(DECKD_WIN);           //output our win amount                   
                    
                    deckDclicks++;                        //increment our position for penalty lookup
                    totaldeckDclicks++;
                    
                    selectedCards.push("D");                //Add to our output of selected cards.
                    //$("#deck-one-clicks").html(deckoneclicks); debugging                    
                    
                    break;
            }
            

            $("#penaltyamt").html(penalty.toString());  //output the penalty
            $("#netgains").html(netgain.toString());    //output the net gain or loss
            
            totalcash += netgain;                       //increment our totals
            
            //change the color of the font if we win or lose
            if (netgain <= 0)
                $(".outputtext").css("color", "red");
            
            else
                $(".outputtext").css("color", "green");

            //if (totalcash < 0) totalcash = 0; //if total cash is negative make it 0.			               
            
            $("#totalmoney").html("£" + totalcash.toString());
            
            //calculate our cash bar and display
            var cashpilebarvalue = 100 * totalcash / CASHMAX;
            
            $("#cashpilebar").css("width", cashpilebarvalue.toString() + "%"); //grow or shrink the progress bar
            $("#cashpileamt").html("£" + totalcash);                            //change the label in the progress bar
            
            
            var interval = totalclicks / 20;
            
            switch (interval) {
                
                case 1 :
                    
                    deckAclicks_i1 = totaldeckAclicks;
                    deckBclicks_i1 = totaldeckBclicks;
                    deckCclicks_i1 = totaldeckCclicks;
                    deckDclicks_i1 = totaldeckDclicks;
                    
                    break;
                    
                case 2 :
                    
                    deckAclicks_i2 = totaldeckAclicks - deckAclicks_i1;
                    deckBclicks_i2 = totaldeckBclicks - deckBclicks_i1;
                    deckCclicks_i2 = totaldeckCclicks - deckCclicks_i1;
                    deckDclicks_i2 = totaldeckDclicks - deckDclicks_i1;
                    
                    break;
                    
                case 3 :
                    
                    deckAclicks_i3 = totaldeckAclicks - deckAclicks_i1 - deckAclicks_i2;
                    deckBclicks_i3 = totaldeckBclicks - deckBclicks_i1 - deckBclicks_i2;
                    deckCclicks_i3 = totaldeckCclicks - deckCclicks_i1 - deckCclicks_i2;
                    deckDclicks_i3 = totaldeckDclicks - deckDclicks_i1 - deckDclicks_i2;
                    
                    break;
                    
                case 4 :
                    
                    deckAclicks_i4 = totaldeckAclicks - deckAclicks_i1 - deckAclicks_i2 - deckAclicks_i3;
                    deckBclicks_i4 = totaldeckBclicks - deckBclicks_i1 - deckBclicks_i2 - deckBclicks_i3;
                    deckCclicks_i4 = totaldeckCclicks - deckCclicks_i1 - deckCclicks_i2 - deckCclicks_i3;
                    deckDclicks_i4 = totaldeckDclicks - deckDclicks_i1 - deckDclicks_i2 - deckDclicks_i3;
                    
                    break;
                    
                case 5 :
                    
                    deckAclicks_i5 = totaldeckAclicks - deckAclicks_i1 - deckAclicks_i2 - deckAclicks_i3 - deckAclicks_i4;
                    deckBclicks_i5 = totaldeckBclicks - deckBclicks_i1 - deckBclicks_i2 - deckBclicks_i3 - deckBclicks_i4;
                    deckCclicks_i5 = totaldeckCclicks - deckCclicks_i1 - deckCclicks_i2 - deckCclicks_i3 - deckCclicks_i4;
                    deckDclicks_i5 = totaldeckDclicks - deckDclicks_i1 - deckDclicks_i2 - deckDclicks_i3 - deckDclicks_i4;
                    
                    break;
            }
            
            
            if (totalclicks == MAXGAMES) {
                
                var prettyprnt = selectedCards.join(", ");        //setup pretty printing            
            
                //mail_attachment = prettyprnt.replace(/\s+/g, ""); //remove all white space
            
                var jsonObj = new Object();
        
                jsonObj.clicks = prettyprnt;

                jsonObj.total_clicks = totalclicks;

                jsonObj.clicks_a = totaldeckAclicks;
                jsonObj.clicks_b = totaldeckBclicks;
                jsonObj.clicks_c = totaldeckCclicks;
                jsonObj.clicks_d = totaldeckDclicks;

                jsonObj.clicks_a_i1 = deckAclicks_i1;
                jsonObj.clicks_b_i1 = deckBclicks_i1;
                jsonObj.clicks_c_i1 = deckCclicks_i1;
                jsonObj.clicks_d_i1 = deckDclicks_i1;

                jsonObj.clicks_a_i2 = deckAclicks_i2;
                jsonObj.clicks_b_i2 = deckBclicks_i2;
                jsonObj.clicks_c_i2 = deckCclicks_i2;
                jsonObj.clicks_d_i2 = deckDclicks_i2;

                jsonObj.clicks_a_i3 = deckAclicks_i3;
                jsonObj.clicks_b_i3 = deckBclicks_i3;
                jsonObj.clicks_c_i3 = deckCclicks_i3;
                jsonObj.clicks_d_i3 = deckDclicks_i3;

                jsonObj.clicks_a_i4 = deckAclicks_i4;
                jsonObj.clicks_b_i4 = deckBclicks_i4;
                jsonObj.clicks_c_i4 = deckCclicks_i4;
                jsonObj.clicks_d_i4 = deckDclicks_i4;

                jsonObj.clicks_a_i5 = deckAclicks_i5;
                jsonObj.clicks_b_i5 = deckBclicks_i5;
                jsonObj.clicks_c_i5 = deckCclicks_i5;
                jsonObj.clicks_d_i5 = deckDclicks_i5;

                jsonObj.total_cash = totalcash;

                mail_attachment = JSON.stringify(jsonObj);
                
                $("#modal-gameend").modal('show');

                //$("#testresults").html(jsonString);
                
                //window.alert(mail_attachment);
            }
        
        } else {
            $("#modal-gameend").modal('show');
        }
    });
    

    $("#btnsubmit").closest('form').on('submit', function(event) {
       
        event.preventDefault();
        
        $("#subject").val($("#number").val());
        
        $("#json").val(mail_attachment);
        
        this.submit();
        
    });

    
    //Allows the person to hide and see the results of the test in the output modal. This is useful if email errors out.
    /*$("#submit").click(function () {
        
        if ($("#testresults").is(":hidden")) {
            $("#testresults").fadeIn(function () { $("#viewresultsbtn").html("Hide results."); });
        
        } else {
            $("#testresults").fadeOut(function () { $("#viewresultsbtn").html("View results?"); });
        }
        
    });*/
});
