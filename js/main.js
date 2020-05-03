//Запрос
window.onload = function() {

    let bag = {}; 
    let goods = {};

// save cart
    function localBagFromStorage() {
        if (localStorage.getItem('bag') != undefined) {
            bag = JSON.parse(localStorage.getItem('bag'));
            console.log(bag);
        }
    }

    localBagFromStorage();

    let getJSON = function(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            let status = xhr.status;
            if(status === 200) {
                callback(null, xhr.response)
            } else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    }
// Обработка запроса
    getJSON('https://spreadsheets.google.com/feeds/list/1Xia9AeEj0iJsRTavDTw-bniuO2fWrjIji-h_OipOUAk/1/public/full?alt=json', function(err, data) {
        console.log(data);
        if(err !== null) {
            console.log(err);
        } else {
            data = data['feed']['entry'];
            console.log(data);
            goods = arrayHelper(data);
            console.log(goods);
            document.querySelector('.shop-field').innerHTML = showGoods(data);
            showBag();
        }
    });
//функция добавления елементов на сайт
    function showGoods(data) {
        let out = '';
        for(let i = 0; i < data.length; i++) {
            if (data[i]['gsx$show']['$t'] == 1) {
                out +='<div class="col-lg-3 col-md-3 col-sm-2 text-center">';
                out +='<div class="goods">';         
                out +='<h5>' + data[i]['gsx$name']['$t'] + '</h5>';            
                out +='<img src="' + data[i]['gsx$image']['$t'] + '" alt="" width=100px>';             
                out +='<p class="cost">Price: ' + data[i]['gsx$cost']['$t'] + '</p>';             
                out +='<p class="description">' + data[i]['gsx$description']['$t'] + '</p>';
                out +='<p><button class="btn-buy" name="add-to-card" data="' + data[i]['gsx$id']['$t'] + '">BUY</button></p>';         
                out +='</div>';         
                out +='</div>'; 
            }     
        }
        return out;
    }

    document.onclick = function(e) {
        if (e.target.attributes.name != undefined) {
            if (e.target.attributes.name.nodeValue == 'add-to-card') {
                addToBag(e.target.attributes.data.nodeValue);
            } else if (e.target.attributes.name.nodeValue == 'delete-good') {
                delete bag[e.target.attributes.data.nodeValue];
                showBag();
                localStorage.setItem('bag', JSON.stringify(bag));
            } else if (e.target.attributes.name.nodeValue == 'add-good') {
                bag[e.target.attributes.data.nodeValue]++;
                showBag();
                localStorage.setItem('bag', JSON.stringify(bag));
            } else if (e.target.attributes.name.nodeValue == 'remove-good') {
                if (bag[e.target.attributes.data.nodeValue] > 1) {
                    bag[e.target.attributes.data.nodeValue]--;
                } else {
                    delete bag[e.target.attributes.data.nodeValue];
                }
                showBag();
                localStorage.setItem('bag', JSON.stringify(bag));
            } else if (e.target.attributes.name.nodeValue == 'buy') {  //Code for php mail start
                // let name = document.getElementById('customer-name').value;
                // let email = document.getElementById('customer-email').value;
                // let phone = document.getElementById('customer-phone').value;
                // getJSON('php mail/mail.php', function(err, data) {
                //     console.log(data);
                //     if (err !== null) {

                //     } else {

                //     }
                //});
///Fetch 
                let clientInfo = {
                    name: document.getElementById('customer-name').value,
                    email: document.getElementById('customer-email').value,
                    phone: document.getElementById('customer-phone').value,
                    bag: bag,
                }

                fetch('php_mail/mail.php',
                {
                    method: "POST",
                    body: JSON.stringify(clientInfo),
                })
                .then(function(res) {
                    console.log(res);
                })

            }
        }
    }


    function addToBag(elem) {
        if(bag[elem] !== undefined) {
            bag[elem]++;
        } else {
            bag[elem] = 1;
        }
        console.log(bag);
        showBag();
        localStorage.setItem('bag', JSON.stringify(bag));
    }

    function arrayHelper(arr) {
        let out = {};
        for (let i = 0; i < arr.length; i++) {
            let temp = {};
            temp['name'] = arr[i]['gsx$name']['$t'];
            temp['image'] = arr[i]['gsx$image']['$t'];
            temp['cost'] = arr[i]['gsx$cost']['$t'];
            temp['description'] = arr[i]['gsx$description']['$t'];
            temp['quantity'] = arr[i]['gsx$quantity']['$t'];
            temp['show'] = arr[i]['gsx$show']['$t'];
            out[arr[i]['gsx$id']['$t']] = temp;
        }
        return out;
    }

    function showBag() {
        let ul = document.querySelector('.bag');
        ul.innerHTML = '';
        let sum = 0;
        for (let key in bag) {
            let liList = document.createElement('li');

            let btnDeletGood = document.createElement('button');
            btnDeletGood.setAttribute('class', 'delete-good');
            btnDeletGood.setAttribute('name', 'delete-good');
            btnDeletGood.setAttribute('data', key);
            btnDeletGood.innerHTML = 'x';

            let btnAddGood = document.createElement('button');
            btnAddGood.setAttribute('class', 'add-good');
            btnAddGood.setAttribute('name', 'add-good');
            btnAddGood.setAttribute('data', key);
            btnAddGood.innerHTML = '+';

            let btnRemoveGood = document.createElement('button');
            btnRemoveGood.setAttribute('class', 'remove-good');
            btnRemoveGood.setAttribute('name', 'remove-good');
            btnRemoveGood.setAttribute('data', key);
            btnRemoveGood.innerHTML = '-';

            let goodsInBag = document.createElement('div');
            goodsInBag.setAttribute('class', 'good-in-bag');
            goodsInBag.innerHTML = goods[key]['name'];
            liList.append(goodsInBag);

            let countGoods = document.createElement('div');
            countGoods.setAttribute('class', 'count-goods');
            countGoods.innerHTML =  'x ' + bag[key] + ' ';
            countGoods.append(btnAddGood);
            countGoods.prepend(btnRemoveGood);
            liList.append(countGoods);

            let amountGoods = document.createElement('div');
            amountGoods.setAttribute('class', 'amount');
            amountGoods.innerHTML =  goods[key]['cost']*bag[key] + ' $ ';
            liList.append(amountGoods);

            liList.append(btnDeletGood);
            sum += goods[key]['cost']*bag[key];
            ul.append(liList);
        }
        ul.append('Total: ' + sum);

        let buyBag = document.createElement('button');
            buyBag.setAttribute('class', 'buy-bag');
            buyBag.setAttribute('name', 'buy-bag');
            buyBag.innerHTML = 'BUY';
        ul.append(buyBag);
    }


}

