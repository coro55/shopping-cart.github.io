var prods = [];
var idAndPrice = {};
var exchangeRates = {};
//@return - the list of products to be displayed in cart
function getProducts() {
    return $.ajax({
        url: "http://private-32dcc-products72.apiary-mock.com/product",
        success: function (response) {
            $('.loader').hide();
            for (var i in response) {
                var item = response[i];
                prods.push(item);
                idAndPrice[item['id']] = item['price'];
                i++;
            }
        },
        error: function () {
            alert('Products not available');
        },
    });
}
//@return - the exchange rates to be used
function getExchangeRate() {
    return $.ajax({
        url: 'http://api.fixer.io/latest?base=USD',
        success: function (response) {
            exchangeRates = response.rates;
            exchangeRates.USD = 1;
        },
        error: function () {
            $('.currency-select').val('USD').trigger('change');
            exchangeRates.USD = 1;
            $('.currency-select').attr('disabled', 1);
        },
    });
}
// iterate through prods, create html elem and append it to the prods list
function displayProds() {
    for (var i in prods) {
        var prod = prods[i];
        var product = "<div class='prod col-xs-12 col-sm-12 col-md-12 col-lg-12 " + prod['id'] + "'>";
        product += "<div class='prod-name col-xs-3 col-sm-6 col-md-6 col-lg-6'>" + prod['name'] + "</div>";
        product += "<div class='amount col-xs-5 col-sm-3 col-md-3 col-lg-3'>";
        product += "<span class='label-price'>Price: </span>";
        product += "<span class='currency'></span>";
        product += "<span class='price sort-price default-" + prod['id'] + " default-price' data-price-id=" + prod['id'] + ">" + prod["price"] + "</span>";
        product += "</div>";
        product += "<button class='add add-btn col-xs-4 col-sm-3 col-md-3 col-lg-3' data-id=" + prod['id'] + "><img src='./checkout/resources/shopping-cart.png' alt='cart'></img><span>Add to cart</span></button>";
        product += "</div>";
        $(".add-to-cart").append(product);
    }
}
// displays the empty cart section - template created in data.js
function showEmptyCart() {
    $('.no-prods').remove();
    $('.full-cart').remove();
    $('.cart').append(emptyCart);
}
// displays the full cart sections - template created in data.js
function showFullCart() {
    $('.full-cart').remove();
    $('.no-prods').remove();
    $('.cart').append(fullCart);
}
// removes the prod in cart on button click and appends it back in the product list
function removeProds() {
    $('.remove').on('click', function () {
        var id = $(this).attr('data-remove-id');
        $('.prod-in-cart.' + id).remove();
        if ($('.prod-in-cart').length === 0) {
            showEmptyCart();
        }
        for (var i in prods) {
            var prod = prods[i];
            if (id == prod['id'] && $('.prod.' + prod['id']).length === 0) {
                var product = "<div class='prod col-xs-12 col-sm-12 col-md-12 col-lg-12 " + prod['id'] + "'>";
                product += "<div class='prod-name col-xs-3 col-sm-6 col-md-6 col-lg-6'>" + prod['name'] + "</div>";
                product += "<div class='amount col-xs-5 col-sm-3 col-md-3 col-lg-3'>";
                product += "<span class='label-price'>Price: </span>";
                product += "<span class='currency'></span>";
                product += "<span class='price sort-price default-price default-" + prod["id"] + "' data-price-id=" + prod["id"] + ">" + prod["price"] + "</span>";
                product += "</div>";
                product += "<button class='add add-btn col-xs-4 col-sm-3 col-md-3 col-lg-3' data-id=" + prod['id'] + "><img src='./checkout/resources/shopping-cart.png' alt='cart'></img><span>Add to cart</span></button>";
                product += "</div>";
                $(".add-to-cart").append(product);
            }
        }
    });
}
// on qty-input blur calculates the total price and replaces the current total with the new one
function calculateTotal() {
    $('.qty-input').blur(function () {
        var total = 0;
        $('.unit-val').each(function () {
            var price = Number($(this).text());
            total += price;
        });
        $('.amount-total').html(total.toFixed(2));
    });
}
// sets the qty min val to 1 and max val to 50; removes '.' from qty val 
function setMinMaxQty(input) {
    input.val(input.val().replace('.', ''));
    if (input.val() < 1) {
        input.val('1');
    } else if (input.val() > 50) {
        input.val('50');
    }
}
// on qty input blur it updates the price for each prod in cart, calculated in the selected currency
function updateQtyAndPrice() {
    $('.qty-input').blur(function () {
        $('.qty-input').trigger('change');
        var input = $(this);
        var prodId = $(this).attr('data-unit');
        var currency = $('.currency-select').val().toString();
        var price;
        var rate;
        var updatedPrice;
        setMinMaxQty(input);
        for (var i in prods) {
            var prod = prods[i];
            if (prod.id == prodId) {
                price = prod.price;
            }
        }
        rate = exchangeRates[currency];
        updatedPrice = Number(rate) * Number(price) * Number(input.val());
        $('.unit-' + prodId).html(updatedPrice.toFixed(2));
    });
    calculateTotal();
}
// checks if the tooltip for each prod in cart has text; if not, it hides it;
function hideTooltipIfEmpty(thisProd) {
    for (var i in thisProd) {
        prod = thisProd[i];
        if (prod.description == null) {
            $('#' + prod.id).hide();
        }
    }
}
// displays tooltip text on hover on the tooltip icon
function showTooltip(id) {
    $('.tooltip-icon').mouseenter(function () {
        id = $(this).attr('id');
        $('.tooltip-text.' + id).show();
    });
    $('.tooltip-icon').mouseleave(function () {
        $('.tooltip-text').hide();
    });
}
// on first prod added it displays the full cart; gets the selected prod's id, iterates through prods var and adds to thisProd the selected prod; adds thisProd to cart'
function addProds() {
    $('.add').on('click', function () {
        var thisProd = [];
        if ($('.cart-products').length === 0) {
            showFullCart();
        }
        var selectedProd = $(this).attr('data-id');
        for (var i in prods) {
            var index = prods[i];
            if (selectedProd == index.id) {
                thisProd.push(index);
            }
            $('.' + selectedProd).remove();
        }
        for (var j in thisProd) {
            var prodInCart = thisProd[j];
            var cartProd = "<div class='prod-in-cart col-lg-12 col-md-12 col-sm-12 col-xs-12 " + prodInCart.id + " data-id=" + prodInCart.id + "'>";
            cartProd += "<div class='prod-name col-lg-6 col-md-5 col-sm-5 col-xs-5'><span class='name'><span class='prod-name-cart'>" + prodInCart.name + "</span><img src='./checkout/resources/info.png' id=" + prodInCart.id + " class='tooltip-icon' alt='info'></img><div class='tooltip-text col-lg-2 col-md-2 col-sm-4 col-xs-4 " + prodInCart.id + "'>" + prodInCart.description + "</div></span></div>";
            cartProd += "<div class='quantity col-lg-2 col-md-3 col-sm-2 col-xs-2'><input type='number' value='1' class='form-control qty-input' data-unit='" + prodInCart.id + "'></div>";
            cartProd += "<div class='unit-price price col-lg-4 col-md-4 col-sm-5 col-xs-5'><span class='currency'></span><span data-price-id=" + prodInCart.id + " class='unit-val default-price default-" + prodInCart.id + " price unit-" + prodInCart.id + "'>" + prodInCart.price + "</span>";
            cartProd += "<button class='remove glyphicon glyphicon-trash' data-remove-id='" + prodInCart.id + "'></button></div></div>";
            $('.added-prods').append(cartProd);
            hideTooltipIfEmpty(thisProd);
        }
        thisProd = [];
        calculateTotal();
        showTooltip();
        updateQtyAndPrice();
    });
}
// creates an array containing id and price for each prod displayed in the list, sorts it and re-arranges the html prop elem in desc order based on price
function sortProds() {
    var arr = [];
    $('.sort-price').each(function () {
        arr.push([$(this).attr('data-price-id'), $(this).text()]);
    });
    arr.sort(function (a, b) {
        return b[1] > a[1];
    });
    for (var i = 0; i < arr.length; i++) {
        var prod = arr[i];
        var rowId = prod[0];
        $('.' + rowId).insertAfter('.add-to-cart > :last-child');
    }
}
// object containing symbols for each currency available in cart; if other currencies are needed, add here and in currency options list in index html
var currencySymbols = { "USD": "$", "EUR": "€", "GBP": "£" };
// changes the currency symbol displayed based on the currency select val
function changeCurrencySymbol() {
    var currencySymbol = $('.currency-select').val();
    $('.currency').html(currencySymbols[currencySymbol]);
}
// displayes prices in cart based on the currency exchange rate; overwritten by updateQtyAndPrice for prods in cart
function calculatePricesBasedOnCurrency() {
    $('.default-price').map(function () {
        var id = $(this).attr('data-price-id');
        var converted;
        var price = idAndPrice[id];
        var currency;
        currency = $('.currency-select').val();
        var exchange = Number(exchangeRates[currency]);
        converted = price * exchange;
        $('.default-' + id).text(converted.toFixed(2));
    });
}
// searches for currency=*** param in url and sets the currency select value to param value - works only if currency=*** is present in url and nothing else
function urlParam() {
    var availableCurrencies = {};
    var param = window.location.search.replace('?', '').toString();
    $('.currency-option').map(function () {
        var currency = $(this).text();
        availableCurrencies[currency] = currency;
    });
    if (param.match('currency')) {
        var currency = param.replace('currency=', '').toUpperCase();
        if (currency == availableCurrencies[currency]) {
            $('.currency-select').val(currency).trigger('change');
        } else {
            $('.currency-select').val('USD').trigger('change');
        }
    }
}

function pushProdsToLocal() {
    var ids = [];
    $('.prod-in-cart').each(function () {
        var item = [];
        var id = $('.qty-input', this).attr('data-unit');
        var name = $('.prod-name-cart', this).text();
        var qty = $('.qty-input', this).val();
        var price = $('.currency', this).text() + $('.unit-val', this).text();
        ids.push(id);
        sessionStorage.setItem(id+'-name', name);
        sessionStorage.setItem(id+'-qty', qty);
        sessionStorage.setItem(id+'-price', price);
    });
    sessionStorage.setItem('prodids', JSON.stringify(ids));
}

$(document).ready(function () {
    urlParam();
    getProducts();
    showEmptyCart();
    getExchangeRate();
    $('.continue').initialize(function () { $(this).click(function () { pushProdsToLocal(); }); });
    $('.currency-select').change(function () { calculatePricesBasedOnCurrency(); });
    $('.add').initialize(function () { addProds(); });
    $('.default-price').initialize(function () { calculatePricesBasedOnCurrency(); });
    $('.remove').initialize(function () { removeProds(); $(this).click(function () { calculateTotal(); }); });
    $('.prod-in-cart').initialize(function () { calculateTotal(); });
    $('.currency').initialize(function () { changeCurrencySymbol(); });
    $('.currency-options').click(function () { changeCurrencySymbol(); $('.qty-input').blur(); });
    $('.qty-input').initialize(function () { $('.qty-input').blur(); });
    $('.sort-price').initialize(function () { sortProds(); $('.qty-input').blur(); });
});

$(document).ajaxSuccess(function () {
    if ($('.prod').length === 0) { displayProds(); }
    $('.currency-select').trigger('change');
    sortProds();
});