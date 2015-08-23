(function() {
    $(document).ready(function(){
        chrome.storage.local.get('localData', function (obj) {
            if(obj.hasOwnProperty('localData')) {
                var questions =  obj['localData']['questions'];
                var array = obj['localData']['array']
                allContentLoaded(questions, array, true);
                chrome.storage.local.get('selectedOptions', function(obj) {
                    var selectedOptions = obj['selectedOptions'];
                    for(var key in  selectedOptions) {
                        var question = selectedOptions[key]['question'];
                        var ele = $('input[name="' + question + '"]');
                        $.each(ele, function(k, val) {
                            val = $(val);
                            if(val.attr('value') == selectedOptions[key]['optionChoosed']) {
                                val.prop('checked', true)
                            }
                        });
                    }
                    chrome.storage.local.get('quizSubmited', function(obj) {
                        if(obj.hasOwnProperty('quizSubmited')) {
                            var quizSubmited =  obj['quizSubmited'];
                            if(quizSubmited) {
                                $('#submitanswers').trigger('click');
                            }
                        }
                    });
                });
            }
        });

		function wrapper(id, e, cb) {
			$(document).on(e, id, function(e){
				cb(e, $(this));
			});
		}

        var dataUrls = [];
				
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
            $('body').html("<img src='images/loading.gif'>");
        });

        var allContentLoaded = function(questions, arrayStored, loading) {
            var array = [];
            var size = 20;
            if(arrayStored != undefined) {
                array = arrayStored;
                size = array.length;	
            } else {
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
					//console.log(array);
				}
            }

            if(loading == undefined) {
                chrome.storage.local.set({'localData': {'questions': questions, 'array':array}});
            }

            var result = '<img src="images/geeksforgeeks-logo.png"><hr><div><ul>';
            for(i=0;i<size;i++) {
                result = result + '<li>';
                //console.log(questions[array[i]].question);
                result = result + (i+1) + '. ' + questions[array[i]].question + '<br>';
                for(var j =0; j< questions[array[i]].options.length ; j++){
                    result = result + '<input name = "' + (i) + '" type = "radio" value="' + (j+1) + '">' + '<d>' + questions[array[i]].options[j] + '</d><br>';
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
				
			$('body').html(result);
            // $("body").animate({ scrollTop: 0 });

            var changeOptions =  function(e, that) {
                var selectedOptions = []
                $.each($('input:checked'), function() {
                    var ele = $(this);
                    var optionChoosed = ele.val();
                    var question = ele.attr('name');
                    selectedOptions.push({'optionChoosed':optionChoosed, 'question':question});
                });
                chrome.storage.local.set({'selectedOptions': selectedOptions});
            }

            wrapper('d', "click", function(e, that) {
                $(that).prev().prop("checked", true);
                changeOptions(e, $(that).prev());
            });

            wrapper('input:radio', "change", changeOptions);

            wrapper('#reset', "click", function(e) {
                chrome.storage.local.clear();
                location.reload();
            });
			
			wrapper('#reset1', "click", function(e) {
                allContentLoaded(questions, array);
            });

            var submited = false;

            wrapper('#submitanswers', "click", function(e) {
                if(!submited) {
                    var score = [];
                    var s = 0;
                    chrome.storage.local.set({'quizSubmited': true});
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
                    $('ul').after('<font color="brown"><b>Your Score is: ' + s + '</b></font><br>');
                    // $("body").animate({ scrollTop: $(document).height()-$(window).height() });
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
