/**
 * Created by llan on 2017/6/9.
 */
(function($){
    let $label = $('.label');
    $label.hide();
    $('.count').on('click',(e)=>{
        e.preventDefault();
        $label.hide();
        let max = $('#max').val();
        if(max){
            $.ajax({
                type:'POST',
                url:'/result',
                data:{
                    max:max
                }
            });
        }else{
            $label.show();
        }
    });
})(jQuery);
