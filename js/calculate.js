function processJson(data) { 
	 $('#tuition_fees').text(data.tuition_fees);
	 $('#htotal').text(data.housing_val);
	 $('#atotal').text(data.aid_val);
	 $('#total_cost').text(data.total_cost);
	 $("#book_cost").text(data.books_val); 
	 $('#tuition_cost').text(data.tuition_val); 
	 $('#hope_tuition').text(data.hope_tuition_paid);
	 $('#tuition_type').text(data.tuition_type);
	 //$('#hope_book').text(data.hope_books_val);
   $('#hope_fee').text(data.hope_fee_val);
   $('#hope_coverd').html(data.hope_coverd_val);
	// if (data.tuition_val != "$0.00" )
	 //			 $('#error').text(''); 
	 $('#studentfee_cost').text(data.studentfee_val);  
}


function oldcalcCost(formData, jqForm, options) {	
          var queryString = $.param(formData); 
		   var headID = document.getElementsByTagName("head")[0];         
		   var newScript2 = document.createElement('script');
		   newScript2.charset = 'UTF-8';
		   newScript2.type = 'text/javascript';
		   newScript2.src = 'http://glacier.gsu.edu/calculator/calculate.cfm?'+queryString;
		   newScript2.id = 'js';
		   headID.appendChild(newScript2);
		   return false; 
}

function isNumeric(value) {
     if (value == null || !value.toString().match(/^[-]?\d*\.?\d*$/)) return false;
       return true;
}


function currency(num) {
		num = num.toString().replace(/\$|\,/g,'');
		if(isNaN(num))  num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num*100+0.50000000001);
		cents = num%100;
		num = Math.floor(num/100).toString();
		if(cents<10) cents = "0" + cents;
		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		   num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
		return (((sign)?'':'-') + '$' + num + '.' + cents);
}



function calcCost(formData, jqForm, options) {	

           var form = jqForm[0]; 
           var enrollment = "";
           var aid_total = 0;
           var tuition_cost = 0;
           var tuition_type_val = "";
           var tuition_val = "[Please select enrollment, tuition classification, and status in the section above]";
           var residency=false;
           var hope_books = 0; 
           var hope_fee = 0;
           var hope_coverd = 0;
           var tuition_paid = 0;
           
           if(form.residency.value == "oos")  {tuition_type_val = " (Out-of-State) "; residency=true;}     
           if(form.residency.value == "is")  {tuition_type_val = " (In-State) "; residency=true;} 

        
           
           if (residency) {				   
					   if(form.entrystatus.value == "freshman") {
								 tuition_cost= 3768 * form.enrollment.value;
							  if (form.residency.value == "oos")                 
								  tuition_cost= 12873 * form.enrollment.value;
					   }
						 
						 
			
					   if(form.entrystatus.value == "transfer"){ 
							var t_cost= 0; 
			
							if(form.previousschool.value == "usg") { 
							   //if(form.yearyouenterd.value == "899")  t_cost = (form.residency.value == "is") ? '3768' : '12873';
							   if(form.yearyouenterd.value == "899")  t_cost = (form.residency.value == "is") ? '2428' : '9712'; 
							   if(form.yearyouenterd.value == "788")  t_cost = (form.residency.value == "is") ? '2248' : '8992'; 
							   if(form.yearyouenterd.value == "667")  t_cost = (form.residency.value == "is") ? '1946' : '7785';
							   if(form.yearyouenterd.value == "555")  t_cost = (form.residency.value == "is") ? '3768' : '12873';
							} 
									  
							if(form.previousschool.value != "usg")
							   t_cost = (form.residency.value == "is") ? '3768' : '12873';						 
									 
							tuition_cost = t_cost * form.enrollment.value;
					   } 
				   
				   
					   if(form.entrystatus.value == "transfer_oos") {          
							 tuition_cost= 3768 * form.enrollment.value;
						 if(form.residency.value == "oos") tuition_cost= 12873 * form.enrollment.value;             
					   }
           }
       
       
           var book_cost= form.enrollment.value * 500.00;          
           var studentfee_cost= form.enrollment.value * 1064.00;
           var insurance_cost=document.getElementById("tempinsurancecost").value;
           var tuition_fees_val = studentfee_cost + book_cost + tuition_cost + parseInt(insurance_cost) +0;
           //var tuition_fees_val = studentfee_cost + book_cost + tuition_cost + (parseInt(insurance_cost)*form.enrollment.value) +0;
           //alert(tuition_fees_val);
                  //alert(studentfee_cost +"+"+ book_cost +"+"+ tuition_cost +"+"+ insurance_cost +"+"+0);
           var housing_cost= form.enrollment.value * form.housing.value;
           var transportation_cost= form.enrollment.value * form.transportation.value;
           var mealplan_cost= form.enrollment.value * form.mealplan.value;           
           var housing_total_cost= transportation_cost + housing_cost  + mealplan_cost;
       
       
           if(isNumeric(form.grant.value) && form.grant.value.length >0) 
               aid_total = (parseInt(form.grant.value) +  aid_total) *1; 

           if(isNumeric(form.loan.value)  && form.loan.value.length >0) 
               aid_total = (parseInt(form.loan.value) +  aid_total) *1; 

           if(isNumeric(form.scholarships.value)  && form.scholarships.value.length >0) 
               aid_total = (parseInt(form.scholarships.value) +  aid_total) *1; 
                        
           if ( form.scholarship.value  == "hope" &&  form.residency.value == "is") {
                hope_fee = form.enrollment.value *  1064; 
                
                hope_coverd = currency(  ( tuition_cost  - (tuition_cost * .8737989) )  ) +" NOT covered by HOPE.";
                tuition_paid =  currency((tuition_cost * .8737989)) +" covered by HOPE.    "+ hope_coverd; 
                aid_total = (tuition_cost * .8737989) + aid_total; 
           }


           if ( form.scholarship.value  == "zell" &&  form.residency.value == "is" ) {
                hope_fee = form.enrollment.value *  1064; 
                hope_coverd = form.enrollment.value * 458.00; 
                hope_coverd = "";
                tuition_paid  =   currency(tuition_cost) +"  All tuition covered by Zell Miller Scholarship.  ";           
                aid_total = tuition_cost + aid_total; 
           }


           if (form.enrollment.value != "0"); 
		            enrollment=   t_cost = (form.enrollment.value == "1") ? ' (per semester) ' : ' (per school year) ';
		        
           if  (tuition_cost != 0)      
                 tuition_val = currency(tuition_cost) + enrollment; 
                 
            
                 
           var total_cost_val = studentfee_cost + book_cost + (parseInt(insurance_cost)*form.enrollment.value) + tuition_cost + housing_total_cost - aid_total;
       
   
		   data = {tuition_type: tuition_type_val, 
				  tuition_val: tuition_val , 
			    aid_val: currency(aid_total) ,
			    total_cost: currency(total_cost_val) ,
			    tuition_fees: currency(tuition_fees_val)  ,
			    housing_val: currency(housing_total_cost) , 
			    books_val: currency(book_cost) + enrollment  ,
			    hope_books_val: currency(hope_books) + enrollment ,
			    hope_tuition_paid: tuition_paid ,
			    hope_coverd_val: hope_coverd,
			    hope_fee_val: currency(hope_fee)  + ' in mandatory fees are  not covered. ' ,
			    studentfee_val: currency(studentfee_cost) + enrollment }   
			    
           processJson(data);
           return false;
}





$(document).ready(function(){ 
      //submit form when calculate button is pressed
      $('#calc').ajaxForm({ 
				// dataType identifies the expected content type of the server response 
				dataType:  'json', 
				// success identifies the function to invoke when the server response 
				// has been received 
			    beforeSubmit:  calcCost  // pre-submit callback 
			}); 
			
      $('.boxyinfo').click(function() {
            $('#boxyresult').remove(); 
            new Boxy("<div id='boxyresult'>Loading.....</div>", {y:10,  cache:true, title: "Info", closeable: true});
            var info_url="info.html #"+this.id;
            $('#boxyresult').load(info_url);
            return false;
       });			
 
	    //submit form a dropdown is changed
	    var options = { 
					// dataType identifies the expected content type of the server response 
					dataType:  'json', 
					// success identifies the function to invoke when the server response 
					// has been received 
					beforeSubmit:  calcCost  // pre-submit callback 
		  }; 
    
      $("select").change(function () {        
		      $('#calc').ajaxSubmit(options);		
      });
      
      $("input").keyup(function () {        
		      $('#calc').ajaxSubmit(options);		
      });
      
      
});


function numer(thisv){  
   if ( thisv.id == 'txt_numberincollege_dep' && thisv.value > $('#txt_numberinfamily_dep').val() )  {
       alert("Number in college cannot exceed number in  household.");
       thisv.value =''; 
       return false; 
     }
    thisv.value = thisv.value.replace(/[^0-9\.]/g,'');
    
}






/************************************************************************
*validate the form prevent empt f to show Previous Schools 
************************************************************************/

 function validate(formData, jqForm, options) { 
		// fieldValue is a Form Plugin method that can be invoked to find the 
		// current value of a field 
		// 
		// To validate, we can capture the values of both the username and password 
		// fields and return true only if both evaluate to true 
	     var enrollmentValue = $('select[@name=enrollment]').fieldValue(); 
       var entrystatusValue = $('select[@name=entrystatus]').fieldValue(); 
       var residencyValue = $('select[@name=residency]').fieldValue(); 


       var tuition_fees_submitValue = $('input[@name=tuition_fees_submit]').fieldValue(); 
	 
			if (tuition_fees_submitValue[0])	 
			document.getElementById('ttotal').innerHTML="&nbsp;&nbsp;<img src='ajax-loader.gif' />";
			  
			// usernameValue and passwordValue are arrays but we can do simple 
			// "not" tests to see if the arrays are empty 
			if (enrollmentValue == 0 || entrystatusValue == "" || residencyValue == "") { 
				 $('#error').text('Please enter a value for  Enrollment , Status and Residency'); 
				//return false; 
			} 
  }




/************************************************************************
*toggle to show Previous Schools 
************************************************************************/
function toggle(lmnt) {	

        var selObj1 = document.getElementById('residency');
		    var selObj2 = document.getElementById('entrystatus');
		    var selObj3 = document.getElementById('scholarship');
	     	var el = document.getElementById(lmnt);
                var vt = document.getElementById("visatypecon");
                var vt1 = document.getElementById("visatype");
                var age = document.getElementById("agecon");
                var age1 = document.getElementById("age");
                var prevschool=document.getElementById("previousschool");

        var do_toggle=false;
        
        
        if (selObj1.selectedIndex == 1 && selObj2.selectedIndex == 2 ) do_toggle=true;  
        if (selObj1.selectedIndex == 2 && selObj2.selectedIndex == 2 ) do_toggle=true;      
        if (lmnt=='hope' && selObj3.selectedIndex == 1) do_toggle=true;
        if (lmnt=='hope' && selObj3.selectedIndex == 2) do_toggle=true;
        if (lmnt=='resident_hope' && selObj1.selectedIndex == 1 ) do_toggle=true;
        


		
		if (  do_toggle ) {		
		   			el.style.display = '';
		}
		else {
				el.style.display = 'none';
		}
                
         if (lmnt=='resident_hope'){
                  if (selObj1.selectedIndex == 2)
                           vt.style.display='';
                  else{
                           vt.style.display="none";
                           age.style.display="none";
                           vt1.selectedIndex=0;
                           age1.selectedIndex=0;
                           document.getElementById("tempinsurancecost").value=0;
                           document.getElementById("ins_label").style.display='none';
                           document.getElementById("ins_value").style.display='none';
                  }
                
         }
         /*if (lmnt=='previousschool'){
                  if (prevschool.value=="usg"){
                           document.getElementById("semesterdiv").style.display='';
                  }
                  else if (prevschool.value=="o"){
                           document.getElementById("yearyouenterd").selectedIndex=0;
                           document.getElementById("semesterdiv").style.display='none';
                  }
         }*/
         if (lmnt=='previousschool'){
                  if (prevschool.value=="usg"){
                           document.getElementById("yearyouentered").selectedIndex=0;
                           document.getElementById("semesterdiv").style.display='';
                  }
                  else if (prevschool.value=="o"){
                           document.getElementById("yearyouentered").selectedIndex=0;
                           document.getElementById("semesterdiv").style.display='none';
                  }
         }
}



function updateAgeCosts(){
         var agedrpdwn=document.getElementById("age");
         if (agedrpdwn.selectedIndex!=0){
                  document.getElementById("ins_label").style.display='';
                  document.getElementById("ins_value").style.display='';
                  var agecost=0;
                  var age=agedrpdwn.options[agedrpdwn.selectedIndex].value;
                  //agecost=agecost*document.getElementById("calc").enrollment.value;
                  var enr=document.getElementById("calc").enrollment.value;
                  if (enr==1){
                           if (age=="26oryounger") agecost=474;
                           else if (age=="27to34") agecost=639;
                           else if (age=="35orolder") agecost=1161;
                           else agecost=0;
                  }
                  else if (enr==2){
                       if (age=="26oryounger") agecost=1102;
                           else if (age=="27to34") agecost=1433;
                           else if (age=="35orolder") agecost=2700;
                           else agecost=0;    
                  }
                  document.getElementById("insurance_cost").innerHTML=formatCurrency(agecost);
                  document.getElementById("tempinsurancecost").value=agecost;
         }
}



/************************************************************************
*DOMinclude_config
************************************************************************/
DOMinccfg={
// CSS classes
// trigger DOMinclude
  triggerClass:'DOMpop',
// class of the popup
  popupClass:'popup',
// class of the link when the popup 
// is open
  openPopupLinkClass:'popuplink',
// text to add to the link when the 
// popup is open 
  displayPrefix:'(X)',
// filter to define which files should
// not open in an iframe
  imagetypes:'jpg|JPG|JPEG|jpeg|gif|GIF|png|PNG',
// dimensions of the popup
  frameSize:[290,180]
}










/*
//Grants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**Grants
//Grants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**Grants
//Grants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**Grants
*/
 function formatCurrency(num) {
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + '$' + num ); //+ '.' + cents
}
 
 
var arrDepStudentIncome = [];
arrDepStudentIncome[1] = 0;
arrDepStudentIncome[2] = 4;
arrDepStudentIncome[3] = 638;
arrDepStudentIncome[4] = 1873.1;
arrDepStudentIncome[5] = 5994;
arrDepStudentIncome[6] = 14750.5;

var arrDepStudentParentIncome = [];
arrDepStudentParentIncome[1] = 0;
arrDepStudentParentIncome[2] = 2136.96;
arrDepStudentParentIncome[3] = 4622.4;
arrDepStudentParentIncome[4] = 7094.4;
arrDepStudentParentIncome[5] = 13955.24;
arrDepStudentParentIncome[6] = 17557.32;
arrDepStudentParentIncome[7] = 21210.442;
arrDepStudentParentIncome[8] = 24665.6;
arrDepStudentParentIncome[9] = 38281.5;

var arrIndStudentIncomeWithDep = [];
arrIndStudentIncomeWithDep[1] = 24.36;
arrIndStudentIncomeWithDep[2] = 6466.44;
arrIndStudentIncomeWithDep[3] = 14094.53;
arrIndStudentIncomeWithDep[4] = 21919.59;
arrIndStudentIncomeWithDep[5] = 29775.94;
arrIndStudentIncomeWithDep[6] = 57121.48;

var arrIndStudentIncomeWithoutDep = [];
arrIndStudentIncomeWithoutDep[1] = 1158.1;
arrIndStudentIncomeWithoutDep[2] = 10888.9;
arrIndStudentIncomeWithoutDep[3] = 14625.9;
arrIndStudentIncomeWithoutDep[4] = 18880.8;
arrIndStudentIncomeWithoutDep[5] = 23128.6;
arrIndStudentIncomeWithoutDep[6] = 35430.4;
        



//BoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxy
//BoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxy
//BoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxy
function loadboxy()  {
		// grantbox = new Boxy($('#grantForms').html(), {title: "Determine  Grant Amount", closeable: true});
		 //$('#grantForms').html("")
		// $("#dv_npc_s0").css("display","block");
		// $("#dv_npc_s1").css("display","none");    
    // $("#dv_npc_s1").css("display","none");
    // $("#dv_npc_s2").css("display","none");
    // $("#dv_npc_s2").css("display","none");
    $('#dv_npc_s0').remove();
    $('#dv_npc_s1').remove();
    $('#dv_npc_s2').remove();
    $('#iv_npc_s2').remove();
    $('#results').remove();
    
    //alert($('#dv_npc_s1').html());
    grantbox = new 	Boxy.load("grant.html",  {y:10,cache:true, title: "Determine  Grant Amount", closeable: true} );

}

//BoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxy
//BoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxy
//BoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxyBoxy



var dependency = "0";  //Independent =1 dependent=0
var efcValue ="";
function Gostep1(thisframe) {
    //alert(Boxy.get(thisframe).getTitle());
    //Boxy.get(thisframe).hide();
    //Boxy.get(thisframe).setContent($('#dv_npc_s1').html(), {title: "Determining dependency", closeable: true});
    $("#dv_npc_s0").css("display","none");
    $("#dv_npc_s1").css("display","block");
    // Boxy.get(thisframe).load("rss.html",  {cache:false} );    
 }


function loadGrantold() {
    $("#results").css("display","block"); 
    $("#dv_npc_s1").css("display","none");    
    $("#dv_npc_s1").css("display","none");
    $("#iv_npc_s2").css("display","none");
    $("#dv_npc_s2").css("display","none");
    efcValue = getefc();
    var grant= getGrant(efcValue);
    //alert ("the efc is : " +efcValue   +"     The grant will be : "+grant);
    $("#grantamount").html(formatCurrency(grant)+"    debug: efc is : "+efcValue);
    //$('#grantamountval').val(formatCurrency(grant));

 }

 
  function GoPrevious() {
    $("#dv_npc_s1").css("display","block");
    $("#dv_npc_s0").css("display","none");
    $("#dv_npc_s2").css("display","none");
    $("#iv_npc_s2").css("display","none");
 }

 
 function Gostep2() {
    $("#results").css("display","none");
    $("#dv_npc_s0").css("display","none");
    $("#dv_npc_s1").css("display","none");    
    dependency = $('input:radio[name=dependency]:checked').val(); 
   if (dependency == "0"){ $("#dv_npc_s2").css("display","block");}else{ $("#iv_npc_s2").css("display","block");}
 }
 
 
 
 function loadGrant(thisframe) {
     efcValue = getefc();
    // alert(efcValue);
     var grant= getGrant(efcValue);
    // alert(grant);
     $('#grant').val(grant);
     Boxy.get(thisframe).hide(); 
     $('a#grantlabel').text('Calculated Grant Amount:');
    
     $("#grantlink").effect("highlight", {}, 3000);
     //$("#grant").effect("highlight", {}, 3000);
     // $("#grant").fadeIn("slow").css("background-color").val("FFFF99");
    	 var options = { 
					// dataType identifies the expected content type of the server response 
					dataType:  'json', 
					// success identifies the function to invoke when the server response 
					// has been received 
					beforeSubmit:  calcCost  // pre-submit callback 
		  }; 
		  $('#calc').ajaxSubmit(options);		
 }

 
 
  function getGrant(efc) {
  
              var y=0;
              if (efc * 1 == 0) {
                 y = 5550;
                 } else if (efc * 	1  >= 1 && efc * 1 <=  100	) {	
                          y =		5500;
                 } else if (efc * 	101  >= 1 && efc * 1 <=  200	) {   
                          y =		5400;
                 } else if (efc * 	201  >= 1 && efc * 1 <=  300	) {   
                          y =		5300;
                 } else if (efc * 	301  >= 1 && efc * 1 <=  400	) {   
                          y =		5200;
                 } else if (efc * 	401  >= 1 && efc * 1 <=  500	) {   
                          y =		5100;
                 } else if (efc * 	501  >= 1 && efc * 1 <=  600	) {   
                          y =		5000;
                 } else if (efc * 	601  >= 1 && efc * 1 <=  700	) {   
                          y =		4900;
                 } else if (efc * 	701  >= 1 && efc * 1 <=  800	) {   
                          y =		4800;
                 } else if (efc * 	801  >= 1 && efc * 1 <=  900	) {   
                          y =		4700;
                 } else if (efc * 	901  >= 1 && efc * 1 <=  1000	) {   
                          y =		4600;
                 } else if (efc * 	1001  >= 1 && efc * 1 <=  1100	) {   
                          y =		4500;
                 } else if (efc * 	1101  >= 1 && efc * 1 <=  1200	) {   
                          y =		4400;
                 } else if (efc * 	1201  >= 1 && efc * 1 <=  1300	) {   
                          y =		4300;
                 } else if (efc * 	1301  >= 1 && efc * 1 <=  1400	) {   
                          y =		4200;
                 } else if (efc * 	1401  >= 1 && efc * 1 <=  1500	) {   
                          y =		4100;
                 } else if (efc * 	1501  >= 1 && efc * 1 <=  1600	) {   
                          y =		4000;
                 } else if (efc * 	1601  >= 1 && efc * 1 <=  1700	) {   
                          y =		3900;
                 } else if (efc * 	1701  >= 1 && efc * 1 <=  1800	) {   
                          y =		3800;
                 } else if (efc * 	1801  >= 1 && efc * 1 <=  1900	) {   
                          y =		3700;
                 } else if (efc * 	1901  >= 1 && efc * 1 <=  2000	) {   
                          y =		3600;
                 } else if (efc * 	2001  >= 1 && efc * 1 <=  2100	) {   
                          y =		3500;
                 } else if (efc * 	2101  >= 1 && efc * 1 <=  2200	) {   
                          y =		3400;
                 } else if (efc * 	2201  >= 1 && efc * 1 <=  2300	) {   
                          y =		3300;
                 } else if (efc * 	2301  >= 1 && efc * 1 <=  2400	) {   
                          y =		3200;
                 } else if (efc * 	2401  >= 1 && efc * 1 <=  2500	) {   
                          y =		3100;
                 } else if (efc * 	2501  >= 1 && efc * 1 <=  2600	) {   
                          y =		3000;
                 } else if (efc * 	2601  >= 1 && efc * 1 <=  2700	) {   
                          y =		2900;
                 } else if (efc * 	2701  >= 1 && efc * 1 <=  2800	) {   
                          y =		2800;
                 } else if (efc * 	2801  >= 1 && efc * 1 <=  2900	) {   
                          y =		2700;
                 } else if (efc * 	2901  >= 1 && efc * 1 <=  3000	) {   
                          y =		2600;
                 } else if (efc * 	3001  >= 1 && efc * 1 <=  3100	) {   
                          y =		2500;
                 } else if (efc * 	3101  >= 1 && efc * 1 <=  3200	) {   
                          y =		2400;
                 } else if (efc * 	3201  >= 1 && efc * 1 <=  3300	) {   
                          y =		2300;
                 } else if (efc * 	3301  >= 1 && efc * 1 <=  3400	) {   
                          y =		2200;
                 } else if (efc * 	3401  >= 1 && efc * 1 <=  3500	) {   
                          y =		2100;
                 } else if (efc * 	3501  >= 1 && efc * 1 <=  3600	) {   
                          y =		2000;
                 } else if (efc * 	3601  >= 1 && efc * 1 <=  3700	) {   
                          y =		1900;
                 } else if (efc * 	3701  >= 1 && efc * 1 <=  3800	) {   
                          y =		1800;
                 } else if (efc * 	3801  >= 1 && efc * 1 <=  3900	) {   
                          y =		1700;
                 } else if (efc * 	3901  >= 1 && efc * 1 <=  4000	) {   
                          y =		1600;
                 } else if (efc * 	4001  >= 1 && efc * 1 <=  4100	) {   
                          y =		1500;
                 } else if (efc * 	4101  >= 1 && efc * 1 <=  4200	) {   
                          y =		1400;
                 } else if (efc * 	4201  >= 1 && efc * 1 <=  4300	) {   
                          y =		1300;
                 } else if (efc * 	4301  >= 1 && efc * 1 <=  4400	) {   
                          y =		1200;
                 } else if (efc * 	4401  >= 1 && efc * 1 <=  4500	) {   
                          y =		1100;
                 } else if (efc * 	4501  >= 1 && efc * 1 <=  4600	) {   
                          y =		1000;
                 } else if (efc * 	4601  >= 1 && efc * 1 <=  4700	) {   
                          y =		900;
                 } else if (efc * 	4701  >= 1 && efc * 1 <=  4800	) {   
                          y =		800;
                 } else if (efc * 	4801  >= 1 && efc * 1 <=  4900	) {   
                          y =		700;
                 } else if (efc * 	4901  >= 1 && efc * 1 <=  5000	) {   
                          y =		600;
                 } else if (efc * 	5001  >= 1 && efc * 1 <=  5100	) {   
                          y =		555;
                 } else if (efc * 	5101  >= 1 && efc * 1 <=  5200	) {   
                          y =		555;
                 } else if (efc * 	5201  >= 1 && efc * 1 <=  5273	) {   
                          y =		555;
                 } else if (efc  	 > 5273	) {   
                          y =		0; }
 
return y
 }
 
  function getefc() {
      var returnValue = 0;
      // If student is dependent  
      if (dependency == "0"){
         
                //var parentIncomeIndex = $('input:radio[name=rb_parentincome_dep]:checked').val(); 
                var parentIncomeIndex =    $('select.rb_parentincome_dep option:selected').val(); 
                parentIncomeIndex = (parentIncomeIndex * 1)+1;
               
                var studentIncomeIndex =    $('select.rb_applicantincome_dep option:selected').val();  
                studentIncomeIndex = (studentIncomeIndex * 1)+1;
              
              
                var parentContr = arrDepStudentParentIncome[parentIncomeIndex];
                var studentContr = arrDepStudentIncome[studentIncomeIndex];
                
                 // get number of persons in college
                var numberOfStudentInCollege =  $('#txt_numberincollege_dep').val() *1; 
                returnValue = parentContr/numberOfStudentInCollege + studentContr;
               
                
                
      }   
      else {      
              var hasDependent  =  $('input:radio[name=rb_indhasdependents]:checked').val();  
              //var studentIncomeIndex = $('input:radio[name=rb_parentincome_ind]:checked').val();
              var studentIncomeIndex =    $('select.rb_parentincome_ind option:selected').val();  
              var numberInCollege =  $('#txt_numberincollege_ind').val() * 1; 

              studentIncomeIndex = (studentIncomeIndex * 1)+1;
              var studentContr = 0;                
              if(hasDependent == '1') {                
                    // With children
                     studentContr =   arrIndStudentIncomeWithDep[studentIncomeIndex];
              }
              else {
                    // Without children
                    studentContr = arrIndStudentIncomeWithoutDep[studentIncomeIndex];
              }                
              returnValue = studentContr/numberInCollege;
          
      }
      return  returnValue;
 }
 
 /*
//Grants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**Grants
//Grants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**Grants
//Grants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**GrantsGrants**Grants
*/


