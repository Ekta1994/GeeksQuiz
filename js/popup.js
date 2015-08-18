(function() {
    $(document).ready(function(){
        $('#submit').click(function(e){
            e.preventDefault();
            $('.checkboxCategory').each(function(){
                if(this.checked) {
                    ajax($(this).attr('data-url'), 'get').done(function(data){
                        // $(data).find('.mtq_question_text-\d+-1')
                        var elements = $(data);
                        console.log(elements);
                        var found = elements.find('.mtq_question_text-1-1');
                        console.log(found.html());
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
