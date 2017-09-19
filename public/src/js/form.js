function selectType(id, type){
	var targetID = "#"+id;
	var questionID = id;//"qid" + Math.random().toString(36).substr(2, 5);
	var answerID = questionID + "-answer";
	var optRmBtnID = Math.random().toString(36).substr(2, 5);
	var optionID = "optid" + optRmBtnID;
	var lastID = questionID + "-last";

	var typeName = {
		single: "單選", 
		multiple: "多選", 
		text: "簡答", 
		textArea: "詳答",
		// textSet: "組題", 
		file: "檔案上傳"
	};

	var answerTemplate = {
		single: '<div id="'+questionID+'" class="question-pannel single-choice">\
		    		<span onclick="removeQuestion(\''+questionID+'\');" class="w3-bar-item w3-button w3-white w3-hover-opacity w3-hover-black w3-border w3-xlarge w3-right">×</span>\
			    	<div class="w3-dropdown-hover w3-cell typeSelection">\
						  <input type="button" name=\'questionType\' class="w3-button w3-black questionType" value="'+typeName["single"]+'">\
						  <div class="w3-dropdown-content w3-bar-block w3-border">\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'single\');">單選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'multiple\');">多選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'text\');">簡答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'textArea\');">詳答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'file\');">檔案上傳</li>\
						  </div>\
						</div>\
					  <h3 class="w3-cell"><input type="text" name="questionTitle" value="" placeholder="問題" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'問題\'" ></h3>\
					  <div id="'+answerID+'">\
					  	<div id="'+optionID+'">\
					  		<p>\
					  			<div class="radio-icon"></div>\
					  			<input type="text" name="option" class="option" placeholder=" 選項 " onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'選項\'" >\
					  			<span id="'+optRmBtnID+'" onclick="removeOption(id);" class="w3-bar-item w3-button w3-white w3-xlarge w3-right removeOpt">×</span>\
					  		</p>\
					  	</div>\
					  	<div id="'+lastID+'">\
					  		<p>\
					  			<div class="radio-icon"></div>\
					  			<button class="option" onclick="addOption(\''+questionID+'\',\'single\'); return false;">更多選項</button>\
					  		</p>\
					  	</div>\
					  </div>\
					  <div>\
					  	<p>\
					  		<input type="checkbox" id="required" name="required" class="w3-check">\
					  		<label>必填</label>\
					  	</p>\
					  </div>\
					</div>',
		multiple: '<div id="'+questionID+'" class="question-pannel multiple-choice">\
						<span onclick="removeQuestion(\''+questionID+'\');" class="w3-bar-item w3-button w3-white w3-hover-opacity w3-hover-black w3-border w3-xlarge w3-right">×</span>\
			    	<div class="w3-dropdown-hover w3-cell typeSelection">\
							<input type="button" name="questionType" class="w3-button w3-black questionType" value="'+typeName["multiple"]+'">\
						  <div class="w3-dropdown-content w3-bar-block w3-border">\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'single\');">單選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'multiple\');">多選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'text\');">簡答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'textArea\');">詳答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'file\');">檔案上傳</li>\
						  </div>\
						</div>\
					  <h3 class="w3-cell"><input type="text" name="questionTitle" value="" placeholder="問題" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'問題\'" ></h3>\
					  <div id="'+answerID+'">\
					  	<div id="'+optionID+'">\
					  		<p>\
					  			<div class="check-icon"></div>\
					  			<input type="text" name="option" class="option" placeholder=" 選項 " onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'選項\'" >\
					  			<span id="'+optRmBtnID+'" onclick="removeOption(id);" class="w3-bar-item w3-button w3-white w3-xlarge w3-right removeOpt">×</span>\
					  		</p>\
					  	</div>\
					  	<div id="'+lastID+'">\
					  		<p>\
					  			<div class="check-icon"></div>\
					  			<button class="option" onclick="addOption(\''+questionID+'\', \'multiple\'); return false;">更多選項</button>\
					  		</p>\
					  	</div>\
					  </div>\
					  <div>\
					  	<p>\
					  		<input type="checkbox" name="required" class="w3-check">\
					  		<label>必填</label>\
					  	</p>\
					  </div>\
					</div>',
		text:	'<div id="'+questionID+'" class="question-pannel text-answer">\
		    		<span onclick="removeQuestion(\''+questionID+'\');" class="w3-bar-item w3-button w3-white w3-hover-opacity w3-hover-black w3-border w3-xlarge w3-right">×</span>\
			    	<div class="w3-dropdown-hover w3-cell typeSelection">\
						  <input type="button" name=\'questionType\' class="w3-button w3-black questionType" value="'+typeName["text"]+'">\
						  <div class="w3-dropdown-content w3-bar-block w3-border">\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'single\');">單選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'multiple\');">多選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'text\');">簡答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'textArea\');">詳答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'file\');">檔案上傳</li>\
						  </div>\
						</div>\
					  <h3 class="w3-cell"><input type="text" name="questionTitle" value="" placeholder="問題" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'問題\'" ></h3>\
					  <div id="'+answerID+'">\
					  	<div>\
					  		<p>\
					  			<div class="empty-icon"></div>\
					  			<input type="text" name="skip" class="w3-input option" placeholder=" 答案 " onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'答案\'" disabled="disabled" >\
					  		</p>\
					  	</div>\
					  </div>\
					  <div>\
					  	<p>\
					  		<input type="checkbox" name="required" class="w3-check">\
					  		<label>必填</label>\
					  	</p>\
					  </div>\
					</div>',
		textArea:'<div id="'+questionID+'" class="question-pannel textarea-answer">\
		    		<span onclick="removeQuestion(\''+questionID+'\');" class="w3-bar-item w3-button w3-white w3-hover-opacity w3-hover-black w3-border w3-xlarge w3-right">×</span>\
			    	<div class="w3-dropdown-hover w3-cell typeSelection">\
						  <input type="button" name=\'questionType\' class="w3-button w3-black questionType" value="'+typeName["textArea"]+'">\
						  <div class="w3-dropdown-content w3-bar-block w3-border">\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'single\');">單選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'multiple\');">多選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'text\');">簡答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'textArea\');">詳答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'file\');">檔案上傳</li>\
						  </div>\
						</div>\
					  <h3 class="w3-cell"><input type="text" name="questionTitle" value="" placeholder="問題" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'問題\'" ></h3>\
					  <div id="'+answerID+'">\
					  	<div>\
					  		<p>\
					  			<div class="empty-icon"></div><div class="textarea">答案</div>\
					  		</p>\
					  	</div>\
					  </div>\
					  <div>\
					  	<p>\
					  		<input type="checkbox" name="required" class="w3-check">\
					  		<label>必填</label>\
					  	</p>\
					  </div>\
					</div>',
		file:	'<div id="'+questionID+'" class="question-pannel file-upload">\
		    		<span onclick="removeQuestion(\''+questionID+'\');" class="w3-bar-item w3-button w3-white w3-hover-opacity w3-hover-black w3-border w3-xlarge w3-right">×</span>\
			    	<div class="w3-dropdown-hover w3-cell typeSelection">\
						  <input type="button" name=\'questionType\' class="w3-button w3-black questionType" value="'+typeName["file"]+'">\
						  <div class="w3-dropdown-content w3-bar-block w3-border">\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'single\');">單選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'multiple\');">多選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'text\');">簡答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'textArea\');">詳答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'file\');">檔案上傳</li>\
						  </div>\
						</div>\
					  <h3 class="w3-cell"><input type="text" name="questionTitle" value="" placeholder="問題" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'問題\'" ></h3>\
					  <div id="'+answerID+'">\
				  		<p>\
				  			<div class="empty-icon"></div>\
				  			<button class="upload">上傳檔案</button>\
				  		</p>\
					  </div>\
					  <div>\
					  	<p>\
					  		<input type="checkbox" name="required" class="w3-check">\
					  		<label>必填</label>\
					  	</p>\
					  </div>\
					</div>'
		};
	$(targetID).replaceWith(answerTemplate[type]);
}

function addOption(targetID, type){

	var optionType = {
		single: "radio-icon",
		multiple: "check-icon"
	}

	var answer = targetID+"-answer";
	var last = targetID+"-last";
	var grandpa = document.getElementById(answer);
	var lastNode = document.getElementById(last);
	var childID = Math.random().toString(36).substr(2, 5);
	var parID = 'optid'+ childID;
	var node = document.createElement('div');
	node.id = parID;

	var s = '<p>\
						<div class="'+optionType[type]+'"></div>\
						<input type="text" name="option" class="option"  placeholder=" 選項 " onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'選項\'" >\
						<span id="'+ childID +'" onclick="removeOption(id);" class="w3-bar-item w3-button w3-white w3-xlarge w3-right removeOpt">×</span>\
					</p>';
	node.innerHTML = s;
	grandpa.insertBefore(node, lastNode);
}

function removeOption(id){
	var child = "#"+id;
	var parent = "#optid"+id;
 	$(parent).remove();
}

function addQuestion(targetID){
	var last = document.getElementById(targetID);
	var questionID = "qid"+Math.random().toString(36).substr(2, 5);
	var grandpa = document.getElementById("form-edit");
	var node = document.createElement('div');

	var questionTemplate = {
		text: '<div id="'+questionID+'" class="question-pannel text-answer">\
		    		<span onclick="removeQuestion(\''+questionID+'\'); return false;" class="w3-bar-item w3-button w3-white w3-hover-opacity w3-hover-black w3-border w3-xlarge w3-right">×</span>\
			    	<div id="typeSelection" class="w3-dropdown-hover w3-cell typeSelection">\
							<input type="button" name="questionType" class="w3-button w3-black questionType" value="簡答">\
						  <div class="w3-dropdown-content w3-bar-block w3-border">\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'single\');">單選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'multiple\');">多選</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'text\');">簡答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'textArea\');">詳答</li>\
						    <li class="w3-bar-item w3-button" onclick="var qpid = $(this).parent().parent().parent().attr(\'id\'); selectType(qpid, \'file\');">檔案上傳</li>\
						  </div>\
						</div>\
					  <h3 class="w3-cell">\
					  	<input type="text" name="questionTitle" class="questionTitle" value="" placeholder="問題" onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'問題\'" >\
					  </h3>\
					  <div class="answer-text">\
					  	<div>\
					  		<p>\
					  			<div class="empty-icon"></div>\
					  			<input type="text" name="skip" class="w3-input option" placeholder=" 答案 " onfocus="this.placeholder = \'\'" onblur="this.placeholder = \'答案\'" disabled="disabled" >\
					  		</p>\
					  	</div>\
					  </div>\
					  <div>\
					  	<p>\
					  		<input type="checkbox" name="required" class="w3-check">\
					  		<label>必填</label>\
					  	</p>\
					  </div>\
					</div>'
	}

	node.innerHTML = questionTemplate['text'];
	var firstNode = node.firstChild;
	grandpa.insertBefore(firstNode, last);

}

function removeQuestion(id){
	var targetID = "#"+id;
 	$(targetID).remove();
}

function createStudentForm(id){
	//post = create, put = update
	var url = "/projects/"+id+"/student-form";
	// console.log(url);
	var data = {};			//object
  var title = ""; 		//string
  var questions = []; //array
  var question = {}; 	//object
  var options = [];		//array
  var option = {};		//objecg
  var required = "";	//string

  var type = {
  	"單選": "single", 
		"多選": "multiple", 
		"簡答": "text", 
		"詳答": "textArea",
		"檔案上傳": "file"
  }
	console.log("student form edit complete!");

  var input = document.querySelectorAll("#form-edit input");
  // console.log(input);

 	input.forEach(function(element){

 		// console.log(element.name+":"+element.value);

 		if(element.name == "title"){
 			title = element.value;
 			data["title"] = title ;
 			// console.log(data)
 		}
 		else if(element.name == "questionType"){
 			question = {}; 	//object
		  options = [];		//array
 			// console.log(element.value);
 			// console.log(type[element.value]);
 			question.questionType = type[element.value];
 		}
 		else if(element.name == "questionTitle"){
 			question.questonTitle = element.value;
 		}
 		else if(element.name == "option"){
 			// console.log(type[element.type]);
 			option = {};		//objecg
 			option.option = element.value; //{ "option": "option1"}
 			// console.log(option);
 			options.push(option);
 			// console.log("options",options)
 		}
 		else if(element.name == "required"){
 			question.subQuestions = {};
 			question.options = options;
 			
 			required = element.checked;
 			console.log(required.toString());
 			question.required = required.toString();

 			// console.log("question", question);
 			questions.push(question);
 			//console.log("questions", questions);
 		}
 		else if(element.name == ""){
 			console.log("err", element);
 		}
 	});
 	// console.log("questions",questions);
 	data.title = title;
 	data.questions = questions;
 	console.log("data",JSON.stringify(data));

	$.ajax({
    url: url,
    dataType: 'json',
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(data),
	  processData: false,
	  success: function( data, textStatus, jQxhr ){
	    $('#response pre').html( JSON.stringify( data ) );
	  },
	  error: function( jqXhr, textStatus, errorThrown ){
	    console.log( errorThrown );
	  }
	});

}

function updateStudentForm(id){
	//post = create, put = update
	var url = "/projects/"+id+"/student-form";
	var data = {};			//object
  var title = ""; 		//string
  var questions = []; //array
  var question = {}; 	//object
  var options = [];		//array
  var option = {};		//objecg
  var required = "";	//string

  var type = {
  	"單選": "single", 
		"多選": "multiple", 
		"簡答": "text", 
		"詳答": "textArea",
		"檔案上傳": "file"
  }

  var input = document.querySelectorAll("#form-edit input");

 	input.forEach(function(element){
 		if(element.name == "title"){
 			title = element.value;
 			data["title"] = title ;
 		}
 		else if(element.name == "questionType"){
 			question = {}; 	//object
		  options = [];		//array
 			question.questionType = type[element.value];
 		}
 		else if(element.name == "questionTitle"){
 			question.questonTitle = element.value;
 		}
 		else if(element.name == "option"){
 			option = {};		//object
 			option.option = element.value; //{ "option": "option1"}
 			options.push(option);
 		}
 		else if(element.name == "required"){
 			question.subQuestions = {};
 			question.options = options;
 			
 			required = element.checked;
 			question.required = required.toString();

 			questions.push(question);
 		}
 		else if(element.name == ""){
 			console.log("err", element);
 		}
 	});
 	data.title = title;
 	data.questions = questions;

	$.ajax({
    url: url,
    dataType: 'json',
    type: 'put',
    contentType: 'application/json',
    data: JSON.stringify(data),
	  processData: false,
	  success: function( data, textStatus, jQxhr ){
	    $('#response pre').html( JSON.stringify( data ) );
	  },
	  error: function( jqXhr, textStatus, errorThrown ){
	    console.log( errorThrown );
	  }
	});

}