//Код для jQuery
// $(document).ready(function(){
//     $.getJSON("https://spreadsheets.google.com/feeds/list/1Xia9AeEj0iJsRTavDTw-bniuO2fWrjIji-h_OipOUAk/1/public/full?alt=json", function(data) {
//         data = data['feed']['entry'];
//         showGoods(data);
//     }); 

//     function showGoods(data) {
//         let out = '';
//         for(let i = 0; i < data.length; i++) {
//             if (data[i]['gsx$show']['$t'] == 1) {
//                 out +='<div class="col-lg-3 col-md-3 col-sm-2 text-center">';
//                 out +='<div class="goods">';         
//                 out +='<h5>' + data[i]['gsx$name']['$t'] + '</h5>';            
//                 out +='<img src="' + data[i]['gsx$image']['$t'] + '" alt="" width=100px>';             
//                 out +='<p class="cost">Price:' + data[i]['gsx$cost']['$t'] + '</p>';             
//                 out +='<p class="description">' + data[i]['gsx$description']['$t'] + '</p>';             
//                 out +='</div>';         
//                 out +='</div>'; 
//             }     
//         }
//         $('.shop-field').html(out);
//     }
// })
