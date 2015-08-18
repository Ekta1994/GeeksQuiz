(function() {
    $(document).ready(function(){
        $('#submit').click(function(e){
            e.preventDefault();
            $('.checkboxCategory').each(function(){
                if(this.checked) {
                    ajax($(this).attr('data-url'), 'get').done(function(data){
                        var elements = $(data);
                        var found = elements.find('.mtq_question.mtq_scroll_item-1');
                        var questions = [];                        
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
                        console.log(questions);
                        var result = '<div><ul>';
                        $.each(questions, function(key, val) {
                            ++key;
                            result = result + '<li>';
                            result = result + key + ' ' + val.question + '<br>';                            
                            $.each(val.options, function(k, val) {
                                result = result + '<input name="' + key + '" type="radio">' + val + '<br>';
                            })
                            result = result + '</li>';
                        });
                        result = result + '</ul></div>';
                        $('body').html(result);
                    });
                }
            })
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
