(function() {

	var oldHtml, mintaken = 0 ,sectaken = 0, flag = 0, questions = [], array = undefined;

	function wrapper(id, e, cb, params) {
		$(document).on(e, id, function(e){
			cb(e, $(this), params);
		});
	}

	$(document).ready(function(){

		/*
		 * Checks the checkbox when user clicks on hovered area.
		 */
		wrapper('.checkbox_text', "click", function(e, that) {
			var input = that.prev().children('input');
			var checked = input.prop('checked');
			input.prop('checked', !checked);
		});
			
		/*
		 * Function triggered when user submits it's prefered topics
		 */	
		wrapper('#submit', "click", submitTopics);
	});

	function submitTopics(e) {
		e.preventDefault();
		var checkboxCategory =  $('.checkboxCategory:checked');
		var contentLeftToLoad = {
			'totalSize': checkboxCategory.size(),
			'loaded': 0,
		};

		if(contentLeftToLoad.totalSize == 0) {
			$('#myModal').modal('show');
			return;
		}

		/*
			* Looks for changes in "contentLeftToLoad" object property "loaded".
		 */
		watch(contentLeftToLoad, 'loaded', function () {
			if(contentLeftToLoad.loaded == contentLeftToLoad.totalSize) {
				allContentLoaded(questions);
			}
		});
		
		checkboxCategory.each(function() {
			var that = this;
			var dataUrl = $(this).attr('data-url');
			ajax(dataUrl, 'get').done(function(data){
				var elements = $(data);
				var found = elements.find('.mtq_question.mtq_scroll_item-1');
				$.each(found, function(key, val){
					val = $(val);
					var question = val.children('.mtq_question_text').html();
					var optionsHtml = val.find('.mtq_answer_text');
					var ans = val.find('.mtq_marker.mtq_correct_marker');
					var regexp = /mtq_marker-\d+-(\d+)-\d+/g;
					ans = $(ans).attr('id');
					var discuss = val.find('.mtq_answer_table').next().next().children('a').attr('href');
					var match = regexp.exec(ans);
					ans = match[1];
					var options = [];
					$.each(optionsHtml, function(key, val){
						val = $(val);
						options.push(val.html());
					});
					
					questions.push({
						'question': question,
						'options': options,
						'answer': ans,
						'discuss': discuss
					});
				});
				++contentLeftToLoad.loaded;
			});
		});
		oldHtml = $('body').html();
		$('body').html("<img src='images/loading.gif'>");
	}

	function allContentLoaded() {
		if(array === undefined) {
			array = generateRandomArray(questions.length);
		}
			
		var result = '\
			<div style = "z-index: 1000; position: fixed; width : 100% ; height : 125px; padding : 10px; background-color: white;">\
				<div>\
					<center>\
						<img src="images/geeksforgeeks-logo.png" align="middle">\
					</center>\
				</div>\
			</div>\
			<div class="questions" style= "padding-top : 135px">\
				<div style="margin-right: 80px; margin-left: 80px;">\
					Please read the below instructions carefully : \
					<ul>\
						<li> The test will have maximum 20 questions </li>\
						<li> The questions will only be from the category you have selected. </li>\
						<li>A timer will be running displaying the time left for you at that instant.</li>\
						<li> You will be given 10 minutes at maximum to complete the test. </li> \
						<li>If you wish to submit before the maximum time limit, click on <b><i> Submit </b></i> button. </li>\
					</ul>\
					<div class="btn-group" role="group" style="padding: 5px;">\
		 				<button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="startquiz">Start the quiz</button>\
		 			</div>\
		 			<div class="btn-group" role="group" style="padding: 5px;">\
		 				<button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="reset">Select the topics again</button>\
		 			</div>\
				</div>\
			</div>';
		// instructions = '<div>\
  //           	Please read the below instructions carefully : <br><br> <ul> <li> The test will have maximum 20 questions </li> <li> The questions will only be from the category you have selected. </li>';
		// instructions += '<li>A timer will be running displaying the time left for you at that instant.</li> <li> You will be given 10 minutes at maximum to complete the test. </li> ';
		// instructions += '<li>If you wish to submit before the maximum time limit, click on <b><i> Submit </b></i> button. </li> <br></ul> ';
			
		// instructions += '<div class="btn-group" role="group" style="padding: 5px;">\
		// 			<button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="startquiz">Start the quiz</button>\
		// 		</div>';
				
		// instructions += '<div class="btn-group" role="group" style="padding: 5px;">\
		// 				<button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="reset">Select the topics again</button>\
		// 			</div></div>'
		
		$('body').html(result);
		
		wrapper('#startquiz', "click", startquiz);
	};

	function startquiz (e, that) {

		var result = '<div style = "z-index: 1000; position: fixed; width : 100% ; height : 125px; padding : 10px; background-color: white;"><div><center><img src="images/geeksforgeeks-logo.png" align="middle"></center></div>'
		result = result + '<div id="countdowntimer"><span id="ms_timer"></span></div></div>';
		result = result + '<div class="questions" style= "padding-top : 135px">';
		var toLoad = { 'images': [] };
		for(i=0;i<array.length;i++) {
			result = result + '';
			var question = questions[array[i]].question;
			var regexp = /src="(.+?)"/gmi;
			var match;
			while((match = regexp.exec(question)) != null) {
				toLoad.images.push(match[1]);
			};
			result = result + '<div style="margin-right: 80px; margin-left: 80px;">' + (i+1) + '. ' + questions[array[i]].question + '<br>';
			for(var j =0; j< questions[array[i]].options.length ; j++){
				var option = questions[array[i]].options[j];
				while((match = regexp.exec(option)) != null) {
					toLoad.images.push(match[1]);
				};
				result = result + '<input name = "' + (i) + '" type = "radio" value="' + (j+1) + '">' + '<span class = "opt" >'+ questions[array[i]].options[j] + '</span><br>';
			}
			result = result + '<br></div>';
		}
		result = result + '</div>';
		result = result + '\
			<div class="btn-group btn-group-justified" role="group">\
				<div class="btn-group" role="group" style="padding: 5px;">\
					<button class="btn btn-success" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id = "submitanswers" data-submitted=0>Submit Quiz</button>\
				</div>\
				<div class="btn-group" role="group" style="padding: 5px;">\
					<button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="reset1">Reset Selections</button>\
				</div>\
				<div class="btn-group" role="group" style="padding: 5px;">\
					<button class="btn btn-danger" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="reset">Exit Quiz</button>\
				</div>\
			</div>';
		result = result + '<br><br>';
		result = result + '\
			<div id="myModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
				<div class="modal-dialog" role="document">\
					<div class="modal-content">\
    					<div class="modal-header">\
        					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>\
        					<h3 id="myModalLabel">Time over</h3>\
    					</div>\
    					<div class="modal-body">\
        					<p>You have exceeded the time limit! But you can continue to take the test but it will not be evaluated.</p>\
    					</div>\
    					<div class="modal-footer">\
        					<button class="btn" data-dismiss="modal" aria-hidden="true">Close</button>\
    					</div>\
    				</div>\
    			</div>\
			</div>';
		$('body').html(result);
		
		for (var i = 0; i < toLoad.images.length; ++i) {
        	request(toLoad.images[i], i);
    	}

    	function request(site, i) {
        	var queues = {};
        	var http_request = new XMLHttpRequest();
        	http_request.responseType = 'blob';
        	http_request.open("GET", site, true);
        	http_request.onreadystatechange = function () {
            	var done = 4, ok = 200;
            	if (http_request.readyState == done && http_request.status == ok) {
                	var img = document.createElement('img');
  					img.src = window.URL.createObjectURL(this.response);
  					$('img[src="' + toLoad.images[i] + '"]').replaceWith(img);             
	            }
        	};
	        http_request.send();
    	}

		$("body").animate({ scrollTop: 0 });
		// $("body").animate({ scrollTop: $(document).height()-$(window).height() });
		mintaken = 0;
		sectaken = 0;
		var iv;
		var ct = array.length;
		var s = 0;
		var countDown = function() {
			var elem = $(this);
			var display = function() {
				var b =  '<div align = "center"> ' + ct + " minutes " + s + " seconds " + '</div><hr>';
				//elem.text( ct + " minutes " + s + " seconds ");
				elem.html(b);
				mintaken = ct;
				sectaken = s;
				
				if( s == 0){
					ct--;
					s = 60;
				}
				s--;
			}
			
			iv = setInterval(function() {
				display();
				if ( ct == -1 )
				{
					flag = 1;
					elem.html('<div align = "center">Time Over</div><hr>');
					$('#myModal').modal('show');
					clearInterval(iv);
				}
				
			}, 1000);
			display();
		};
		
		$("#ms_timer").each(countDown);
		
		$(".opt").mouseover(function () {
			$(this).css("font-weight", "bold");
		});
			
		$(".opt").mouseout(function () {
			$(this).css("font-weight", "normal");
		});

		var changeOptions =  function(e, that) {
			var selectedOptions = []
			$.each($('input:checked'), function() {
				var ele = $(this);
				var optionChoosed = ele.val();
				var question = ele.attr('name');
				selectedOptions.push({'optionChoosed':optionChoosed, 'question':question});
			});
		}

		wrapper('.opt', "click", function(e, that) {
			$(that).prev().prop("checked", true);
			changeOptions(e, $(that).prev());
		});

		wrapper('input:radio', "change", changeOptions);
		wrapper('#reset', "click", function(e) {
			questions = [];
			array = undefined;
			clearInterval(iv);
			$('body').html(oldHtml);
		});
		
		wrapper('#reset1', "click", function(e) {
			ct = 1;
			s = 59;
			clearInterval(iv);
			allContentLoaded(questions, array);
		});

		wrapper('#submitanswers', "click", submitAnswers, iv);
				
	}

	function submitAnswers (e, that, iv) {
		clearInterval(iv);
		var submited = parseInt($('#submitanswers').attr('data-submitted'));
		if(!submited) {
			var score = [];
			var s = 0;
			// chrome.storage.local.set({'quizSubmited': true});
			for(i = 0; i< array.length ; i++){
				var ansSelected = $('input[name=' + i + ']:checked').attr('value');
				$.each($('input[name=' + i + ']'), function (key, val) {
					val = $(val).next();
					val.text((key+1) + '. ' + val.text())
					val.css('font-weight', 'bold');
					if(key+1 == questions[array[i]].options.length) {
						val.html(val.html() + '<br><br><a class="discuss" data-url="' + questions[array[i]].discuss + '" >Discuss</a>');
						val.html(val.html() + '<br>' + '<font color="green"><b>Solution is option: ' + questions[array[i]].answer + '</b></font>');
						if(ansSelected != questions[array[i]].answer && ansSelected != undefined) {
							val.html(val.html() + '<br>' + '<font color="red"><b>Incorrect, Option Selected: ' + ansSelected + '</b></font>');
						}
						if(ansSelected == questions[array[i]].answer) {
							++s;
							val.html(val.html() + '<br>' + '<font color="green"><b>Correct</b></font>');
						}
					}
				});
				$('input[name=' + i + ']').remove();
			}
			if(sectaken > 0) {
				mintaken = array.length - mintaken - 1;
				sectaken = 60 - sectaken;
			} else {
				mintaken = array.length - mintaken;
			}
			
			var timeresult = "";
			if(flag == 0)  // by line 248, this should be set as 1 when time exceeds but dont know y not happening
				timeresult = 'Total time taken : ' + mintaken + " minutes " + sectaken + " seconds ";
			else if ( flag == 1)
				timeresult = "You exceeded the time limit";			
			$('.questions').after('<font color="brown"><b><center>' + timeresult + '<center>Your Score is: ' + s + '/' + array.length + '</center></b></font><br>');
			$("body").animate({ scrollTop: $(document).height()-$(window).height() });
			$('#submitanswers').attr('data-submitted', 1);
			wrapper('.discuss', "click", function(e, that) {
				ajax(that.attr('data-url'), 'get').done(function(data) {
					data = $(data);
					data.find('script').each(function() {
						$(this).remove();
					});
					data.find('a').each(function() {
						var that = $(this);
						if(that.text() == "Quiz of this Question") {
							that.remove();
						}
					});
					var result = '\
						<div style = "z-index: 1000; position: fixed; width : 100% ; height : 125px; padding : 10px; background-color: white;">\
							<div>\
								<center>\
									<img src="images/geeksforgeeks-logo.png" align="middle">\
								</center>\
							</div>\
						</div>\
						<div class="questions" style= "padding-top : 135px">\
							<div style="margin-right: 80px; margin-left: 80px;">'
							+ data.find('.entry-content').html() +
							'<div class="btn-group pull-right" style="margin-right: 80px; margin-left: 50px; margin-bottom: 50px" role="group">\
            					<div class="btn-group" role="group">\
                					<button class="btn btn-success" type="submit" id="back">Back</button>\
            					</div>\
        					</div>\
        					</div>\
						</div>';
					var body = $('body').html();
					$('body').html(result);
					$("body").animate({ scrollTop: 0 });
					wrapper('#back', "click", function() {
						$('body').html(body);
					});
				});
			});
		}
	}

	function generateRandomArray (length) {
		var size = 20;
		var array = [];
		if ( length < size)
				size = length;
		// quiz will have 20 questions at max
		for(i=0;i<size;i++)
			array[i] = i;
		// randomizing this array
		
		if(length < 20)   {
			var counter = array.length, temp, index;
			// While there are elements in the array
			while (counter > 0) {
				// Pick a random index
				index = Math.floor(Math.random() * counter);
				// Decrease counter by 1
				counter--;
				// And swap the last element with it
				temp = array[counter];
				array[counter] = array[index];
				array[index] = temp;
			}
			    
		} else {
			var m = length;
			var stream=[];
			for(var i=0;i<m;i++)
				stream[i] = i;				
			for(i=0;i<size;i++)
				array[i] = stream[i];
				
			min = 10;
			max = 100000;				
			for(var j=size; j<m ;j++){
					
				var n = Math.floor(Math.random() * (max - min + 1)) + min;
				n = parseInt(n);
				n = n%(j+1);
					
				if(n<size)
					array[n] = stream[j];
			}					
			var low = 0, high = 9;
			while (low<9){
				var temp = array[low];
				array[low] = array[high];
				array[high] = temp;
				low++;
				high++;
			}
		}
		return array;
	}

	function ajax(urlpassed, requestType, dynamicData) {
		return $.ajax({
			url: urlpassed,
			type: requestType,
			data: dynamicData
		});
	}
}).call(this);
