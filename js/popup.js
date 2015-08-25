(function() {
    $(document).ready(function(){

		function wrapper(id, e, cb) {
			$(document).on(e, id, function(e){
				cb(e, $(this));
			});
		}

        var dataUrls = [];
		
		var array = [];

		var oldHtml;
				
        wrapper('#submit', "click", function(e) {
            e.preventDefault();
			
            var questions = [];
            var checkboxCategory =  $('.checkboxCategory:checked');
            var contentLeftToLoad = {
                'totalSize': checkboxCategory.size(),
                'loaded': 0,

            };

            watch(contentLeftToLoad, 'loaded', function () {
                if(contentLeftToLoad.loaded == contentLeftToLoad.totalSize) {
                    allContentLoaded(questions);
                }
            });
			
			function timer (){
				alert('The time of 	quiz is over!!');
			}
			
            checkboxCategory.each(function() {
                var that = this;
                var dataUrl = $(this).attr('data-url');
                dataUrls.push(dataUrl);
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
						//console.log(match);
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
        });

        var allContentLoaded = function(questions) {
			
			var mintaken ,sectaken,iv;
			var ct = 0;
			var s = 59;
			var f  = 0;
			
            var size = 20;
			if ( questions.length < size)
				size = questions.length;
			// quiz will have 20 questions at max
			for(i=0;i<size;i++)
				array[i] = i;
			// randomizing this array
			
			if(questions.length < 20)   {
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
				var m = questions.length;
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
			
			var result = '<img src="images/geeksforgeeks-logo.png">  <hr><div><ul>';
			var instructions = [];
			
			instructions = 'Please read the below instructions carefully : <br><br> <ul> <li> The test will have maximum 20 questions </li> <li> The questions will only be from the category you have selected. </li>';
			instructions += '<li>A timer will be running displaying the time left for you at that instant.</li> <li> You will be given 10 minutes at maximum to complete the test. </li> ';
			instructions += '<li>If you wish to submit before the maximum time limit, click on <b><i> Submit </b></i> button. </li> <br></ul> ';
			
			instructions += '<div class="btn-group" role="group" style="padding: 5px;">\
                        <button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="startquiz">Start the quiz</button>\
                    </div>';
					
			instructions += '<div class="btn-group" role="group" style="padding: 5px;">\
							<button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="reset">Select the topics again</button>\
						</div>'
			
			result = result + instructions;
			
			$('body').html(result);
			
			var flag = 0;
			
			wrapper('#startquiz', "click", function(e) {
				
				var r = '<div style = "position: fixed; width : 100% ; height : 125px; padding : 10px; background-color: white;"> <div><img src="images/geeksforgeeks-logo.png"> </div>'
				r = r + '<div id="countdowntimer"><span id="ms_timer"></span></div></div>'
				
				//var result = '<br><br><br><br><br><br><br><br><div><ul>';
				
				var result = '<div style= "padding-top : 135px"><ul>';
				
                for(i=0;i<size;i++) {
                result = result + '<li>';
                //console.log(questions[array[i]].question);
                result = result + (i+1) + '. ' + questions[array[i]].question + '<br>';
					for(var j =0; j< questions[array[i]].options.length ; j++){
						result = result + '<div class = "opt"><input name = "' + (i) + '" type = "radio" value="' + (j+1) + '">' + '<span>'+ questions[array[i]].options[j] + '</span></div><br>';
					}
                result = result + '<br></li>';
				}
                
				result = result + '</ul><div>';
				 
				result = result + '\
					<div class="btn-group btn-group-justified" role="group">\
						<div class="btn-group" role="group" style="padding: 5px;">\
							<button class="btn btn-success" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id = "submitanswers">Submit Quiz</button>\
						</div>\
						<div class="btn-group" role="group" style="padding: 5px;">\
							<button class="btn btn-warning" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="reset1">Reset Selections</button>\
						</div>\
						<div class="btn-group" role="group" style="padding: 5px;">\
							<button class="btn btn-danger" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="reset">Exit Quiz</button>\
						</div>\
					</div>';
				result = result + '<br><br>';
				
				r = r + result;
				$('body').html(r);
				$("body").animate({ scrollTop: 0 });
				//$("body").animate({ scrollTop: $(document).height()-$(window).height() });
			
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
							alert("You have exceeded the time limit! The quiz without the time limit will be reloaded now.");
							//allContentLoaded(questions, array);
							clearInterval(iv);
						}
						
					}, 1000);
					display();
				};
								
				$("#ms_timer").each(countDown);
            });

            var changeOptions =  function(e, that) {
                var selectedOptions = []
                $.each($('input:checked'), function() {
                    var ele = $(this);
                    var optionChoosed = ele.val();
                    var question = ele.attr('name');
                    selectedOptions.push({'optionChoosed':optionChoosed, 'question':question});
                });
                // chrome.storage.local.set({'selectedOptions': selectedOptions});
            }

            wrapper('.opt', "click", function(e, that) {
                $(that).prev().prop("checked", true);
                changeOptions(e, $(that).prev());
            });

            wrapper('input:radio', "change", changeOptions);

            wrapper('#reset', "click", function(e) {
                $('body').html(oldHtml);
            });
			
			wrapper('#reset1', "click", function(e) {
				ct = 1;
				s = 59;
                allContentLoaded(questions, array);
            });

            var submited = false;

            wrapper('#submitanswers', "click", function(e) {
				clearInterval(iv);
                if(!submited) {
                    var score = [];
                    var s = 0;
                    // chrome.storage.local.set({'quizSubmited': true});
                    for(i = 0; i< size ; i++){
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
					
					mintaken = 0 - mintaken;
					sectaken = 59 - sectaken;
					
					var timeresult = "";
					
					if(flag == 0)  // by line 248, this should be set as 1 when time exceeds but dont know y not happening
						timeresult = 'Total time taken : ' + mintaken + " minutes " + sectaken + " seconds ";
					else if ( flag == 1)
						timeresult = "You exceeded the time limit"
					
                    $('ul').after('<font color="brown"><b><center>Total time taken : ' + mintaken + " minutes " + sectaken + " seconds " + '<center>Your Score is: ' + s + '/' + size + '</center></b></font><br>');
                    $("body").animate({ scrollTop: $(document).height()-$(window).height() });
                    submited = true;
                    wrapper('.discuss', 'click', function(e, that) {
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
                            $('body').html('<img src="images/geeksforgeeks-logo.png"><hr>' + data.find('.entry-content').html() + '<a class="back">Back to quiz</a>');
                            wrapper(".back", "click", function() {
                                location.reload();
                            });
                        });
                    });
                }
            });
        };

        $('.checkbox_text').click(function() {
            var checked = $(this).children('input').prop('checked');
            $(this).children('input').prop('checked', !checked);
        });
		
    });
    
    function ajax(urlpassed, requestType, dynamicData) {
        return $.ajax({
            url: urlpassed,
            type: requestType,
            data: dynamicData
        });
    }
}).call(this);
