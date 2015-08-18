(function() {
    $(document).ready(function(){
        $('#submit').click(function(e){
            e.preventDefault();
			var questions = [];   
                $('.checkboxCategory').each(function(){
                if(this.checked) {
                    ajax($(this).attr('data-url'), 'get').done(function(data){
                        var elements = $(data);
                        var found = elements.find('.mtq_question.mtq_scroll_item-1');
                                    
                                 $.each(found, function(key, val){
                                 val = $(val);
                                 var question = val.children('.mtq_question_text').html();
                                 var optionsHtml = val.find('.mtq_answer_text');
                                 var options = [];
                                 $.each(optionsHtml, function(key, val){
                                 val = $(val);
                                 options.push(val.html());
                                 });
                        	 questions.push({
                        	 'question': question,
                        	 'options': options
                        	 });
                	        });
			});
		        }
		});
			
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
			
			//console.log(array);
			
			var result = '<div><ul>';
			
			for(i=0;i<size;i++){
				result = result + '<li>';
				//console.log(questions[array[i]].question);
				result = result + (i+1) + '. ' + questions[array[i]].question + '<br>' ; 
					for(var j =0; j< questions[array[i]].options.length ; j++){
						result = result + '<input name = "' + (j+1) + '" type = "radio">' + questions[array[i]].options[j] + '<br>';
					}
				result = result + '<br>';
			}
        $('body').html(result);
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
            data: dynamicData,
	    async: false
        });
    }
}).call(this);
