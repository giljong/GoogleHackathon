function setCookie(name, value, expiredays){
 var todayDate = new Date();
  todayDate.setDate (todayDate.getDate() + expiredays);
  document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
}


$(function(){

 cookiedata = document.cookie;

 if(cookiedata.indexOf('notice_layer=done') < 0){  //오늘 하루 이 창을 열지 않음 클릭 체크
      layer_popup("#notice_layer");
 }


 });

   function layer_popup(el){

       var $el = $(el);        //레이어의 id를 $el 변수에 저장
       var isDim = $el.prev().hasClass('dimBg');   //dimmed 레이어를 감지하기 위한 boolean 변수

       isDim ? $('.dim-layer').fadeIn() : $el.fadeIn();

       var $elWidth = ~~($el.outerWidth()),
           $elHeight = ~~($el.outerHeight()),
           docWidth = $(document).width(),
           docHeight = $(document).height();

       // 화면의 중앙에 레이어를 띄운다.
       if ($elHeight < docHeight || $elWidth < docWidth) {
           $el.css({
               marginTop: -$elHeight /2,
               marginLeft: -$elWidth/2
           })
       } else {
           $el.css({top: 0, left: 0});
       }

       $el.find('a.btn-layerClose').click(function(){
         setCookie("notice_layer", "done", 1);
           isDim ? $('.dim-layer').fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
           return false;
       });

       $('.layer .dimBg').click(function(){
           $('.dim-layer').fadeOut();
           return false;
       });

   }
