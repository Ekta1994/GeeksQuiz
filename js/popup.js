(function() {
    $(document).ready(function(){
		function wrapper(id, cb) {
			$(id).click(function(e){
				cb(e);
			});
		}
				
        wrapper('#submit', function(e){
            e.preventDefault();
            var questions = [];
            var contentLeftToLoad = {
                'totalSize': $('.checkboxCategory:checked').size(),
                'loaded': 0
            };
			
            $('.checkboxCategory:checked').each(function(){
                var that = this;
                ajax($(this).attr('data-url'), 'get').done(function(data){
                    var elements = $(data);
                    var found = elements.find('.mtq_question.mtq_scroll_item-1');
                    $.each(found, function(key, val){
                        val = $(val);
                        var question = val.children('.mtq_question_text').html();
                        var optionsHtml = val.find('.mtq_answer_text');
						var ans = val.find('.mtq_marker.mtq_correct_marker');
						var regexp = /mtq_marker-\d+-(\d+)-\d+/g
						ans = $(ans).attr('id')
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
							'answer': ans
                        });
                    });
                    ++contentLeftToLoad.loaded;
                });
				
				watch(contentLeftToLoad, 'loaded', function () {
					if(contentLeftToLoad.loaded == contentLeftToLoad.totalSize) {
						allContentLoaded();
					}
				});
            });

            var allContentLoaded = function() {
                array = [];
                var size = 20;
                if ( questions.length < size)
                    size = questions.length;
            
                // quiz will have 20 questions at max
                for(i=0;i<size;i++)
                    array[i] = i;
            
                // randomizing this array
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
            
                var result = '<div><ul>';
            
                for(i=0;i<size;i++){
                    result = result + '<li>';
                    //console.log(questions[array[i]].question);
                    result = result + (i+1) + '. ' + questions[array[i]].question + '<br>';
                    for(var j =0; j< questions[array[i]].options.length ; j++){
                        result = result + '<input name = "' + (i) + '" type = "radio" value="' + (j+1) + '">' + questions[array[i]].options[j] + '<br>';
                    }
                    result = result + '<br>';
                }
				
				result = result + "<p> Do you want to submit : </p>";
				result  = result +'<button type = "Submit" name = "Submit" id = "submitanswers">Submit</button>';
				
				result = result + '</div></ul>';
                $('body').html(result);
				
				var score = [];
				var s = 0;
				var marks = "";
				
				wrapper('#submitanswers', function(e) {
					for(i = 0; i< size ; i++){
						var ansSelected = $('input[name=' + i + ']:checked').attr('value');
						score.push(ansSelected);
						marks = marks + (i+1) + '. ' + questions[array[i]].question +'<br>';
						
						if ( ansSelected == questions[array[i]].answer){
							s++;
							//$('input[name=' + i + ']:checked').attr('value').css('color', '#ff0000');
							
							for( var j = 0; j < questions[array[i]].options.length ; j++)
							{
								if ((j+1) == questions[array[i]].answer){
									marks = marks + '<b><font color = "green" >&#10004' + '. ' + questions[array[i]].options[j] + '</font></b><br>';
								}
								else{
									marks = marks + (j+1) + '. ' + questions[array[i]].options[j] + '<br>';
								}
							}
							//marks = marks +  "Correct answer";
							
						}
						else{
							
							for( var j = 0; j < questions[array[i]].options.length ; j++)
							{
								if ((j+1) == questions[array[i]].answer){
									marks = marks + '<b><font color = "green" >&#10004' + '. ' + questions[array[i]].options[j] + '</font></b><br>';
								}
								else if ( (j+1) == ansSelected){
									marks = marks + '<b><font color = "red" >&#x2717' + '. ' + questions[array[i]].options[j] + '</font></b><br>';
								}
								else{
									marks = marks + (j+1) + '. ' + questions[array[i]].options[j] + '<br>';
								}
							}
							
							//marks = marks + "Incorrect answer, the correct answer is " + questions[array[i]].answer;
						}
						marks = marks + '<br><br>';
					}
					marks = marks + "<b>Your score is : " + s + '</b>';
					$('body').html(marks);
				});
            };
        });
		
        $('.checkbox_text').click(function() {
            var checked = $(this).prev().prop('checked');
            $(this).prev().prop('checked', !checked);
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
