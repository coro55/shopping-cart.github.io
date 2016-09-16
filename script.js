var prods = [];

function getProducts() {
    return $.ajax({
        url: "http://private-32dcc-products72.apiary-mock.com/product",
        success: function (response) {
            for (var i in response) {
                var item = response[i];
                prods.push(item);
                i++;
            }
        }
    });
};

function displayProds() {
    for (var i in prods) {
        var prod = prods[i];
        var product = "<div class='prod col-xs-12 col-sm-12 col-md-12 col-lg-12 " + prod['id'] + "'>";
        product += "<div class='prod-name col-xs-3 col-sm-6 col-md-6 col-lg-6'>" + prod['name'] + "</div>";
        product += "<div class='amount col-xs-5 col-sm-3 col-md-3 col-lg-3'>";
        product += "<span class='label-price'>Price: </span>";
        product += "<span class='currency'></span>";
        product += "<span class='price default-" + prod['id'] + " default-price' data-qty-id=" + prod['id'] + ">" + prod["price"] + "</span>";
        product += "</div>";
        product += "<button class='add col-xs-4 col-sm-3 col-md-3 col-lg-3' data-id=" + prod['id'] + "><img src='res/shopping-cart.png' alt='cart'></img><span>Add to cart</span></button>";
        product += "</div>";
        $(".add-to-cart").append(product);
    }
};

function showEmptyCart() {
    $('.no-prods').remove();
    $('.full-cart').remove();
    $('.cart').append(emptyCart);
};

function showFullCart() {
    $('.full-cart').remove();
    $('.no-prods').remove();
    $('.cart').append(fullCart);

};

$('remove').each(function () { $(this).click() })

function removeProds() {
    // $('.remove').each(function() {
    $('.remove').on('click', function () {
        var id = $(this).attr('data-remove-id');
        $('.prod-in-cart.' + id).remove();
        if ($('.prod-in-cart').length === 0) {
            showEmptyCart();
        }
        for (var i in prods) {
            var prod = prods[i];
            if (id == prod['id'] && $('.prod.' + prod['id']).length == 0) {
                var product = "<div class='prod col-xs-12 col-sm-12 col-md-12 col-lg-12 " + prod['id'] + "'>";
                product += "<div class='prod-name col-xs-3 col-sm-6 col-md-6 col-lg-6'>" + prod['name'] + "</div>";
                product += "<div class='amount col-xs-5 col-sm-3 col-md-3 col-lg-3'>";
                product += "<span class='label-price'>Price: </span>";
                product += "<span class='currency'></span>";
                product += "<span class='price'>" + prod["price"] + "</span>";
                product += "</div>";
                product += "<button class='add col-xs-4 col-sm-3 col-md-3 col-lg-3' data-id=" + prod['id'] + "><img src='res/shopping-cart.png' alt='cart'></img><span>Add to cart</span></button>";
                product += "</div>";
                $(".add-to-cart").append(product);
            }
        }
    });

    // });
};

function calculateTotal() {
    var total = 0;
    $('.unit-val').each(function () {
        var price = Number($(this).text());
        total += price;
    });
    $('.amount-total').html(total.toFixed(2));
};

function updateTotal() {
    $('.form-control').blur(function () {
        calculateTotal();
    });
};

function updateQtyAndPrice() {
    $('.form-control').blur(function () {
        $('.form-control').trigger('change');
        if ($(this).val() < 1) {
            $(this).val('1');
        } else {
            $(this).val($(this).val().replace('.', ''));
        }
        var prodId = $(this).attr('data-unit');
        var price;
        for (var i in prods) {
            var prod = prods[i];
            if (prod.id == prodId) {
                price = prod.price;
            }
        }
        var updatedPrice = Number(price) * Number($(this).val());
        $('.unit-' + prodId).html(updatedPrice.toFixed(2));
    });
    updateTotal();
};

function addProds() {
    $('.add').on('click', function () {
        var clicked = [];
        if ($('.cart-products').length === 0) {
            showFullCart();
        };
        var selectedProd = $(this).attr('data-id');
        for (var i in prods) {
            var index = prods[i];
            if (selectedProd == index.id) {
                clicked.push(index);
            }
            $('.' + selectedProd).remove();
        };

        function hideTooltipIfEmpty() {
            for (var i in clicked) {
                var prod = clicked[i];
                if (prod.description == null) {
                    $('#' + prod.id).hide();
                }
            }
        };

        for (var i in clicked) {
            var prodInCart = clicked[i];
            var cartProd = "<div class='prod-in-cart col-lg-12 col-md-12 col-sm-12 col-xs-12 " + prodInCart.id + " data-id=" + prodInCart.id + "'>";
            cartProd += "<div class='prod-name col-lg-6 col-md-6 col-sm-6 col-xs-6'><span class='name'>" + prodInCart.name + "<img src='res/info.png' id=" + prodInCart.id + " class='tooltip-icon' alt='info'></img><div class='tooltip-text col-lg-2 col-md-2 col-sm-4 col-xs-4 " + prodInCart.id + "'>" + prodInCart.description + "</div></span></div>";
            cartProd += "<div class='quantity col-lg-2 col-md-2 col-sm-2 col-xs-2'><input type='number' value='1' class='form-control' data-unit='" + prodInCart.id + "'></div>";
            cartProd += "<div class='unit-price price col-lg-4 col-md-4 col-sm-4 col-xs-4'><span class='currency'></span><span class='unit-val price unit-" + prodInCart.id + "'>" + prodInCart.price + "</span>";
            cartProd += "<button class='remove glyphicon glyphicon-trash' data-remove-id='" + prodInCart.id + "'></button></div></div>";
            $('.added-prods').append(cartProd);
            hideTooltipIfEmpty();
        };

        function showTooltip() {
            $('.tooltip-icon').mouseenter(function () {
                var id = $(this).attr('id');
                $('.tooltip-text.' + id).show();
            });
            $('.tooltip-icon').mouseleave(function () {
                $('.tooltip-text').hide();
            });
        };
        clicked = [];
        calculateTotal();
        showTooltip();
        updateQtyAndPrice();
    });
};

var currencySymbols = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£"
};

function changeCurrencySymbol() {
    var currencySymbol = $('.currency-select').val();
    $('.currency').html(currencySymbols[currencySymbol]);
};

var exchangeRates = {};

function getExchangeRate() {
    return $.ajax({
        url: 'http://api.fixer.io/latest?base=USD',
        success: function (response) {
            exchangeRates = response.rates;
            exchangeRates.USD = 1;
        }
    });
}

function calculatePricesInNewCurrency() {
    $('.default-price').each(function () {
        var converted;
        var price = Number($(this).text());
        var id = $(this).attr('data-qty-id');
        var currency;
        $('.currency-select').change(function () {
            currency = $(this).val();
            var exchange = Number(exchangeRates['' + currency + '']); 
            converted = price * exchange;
            $('.default-' + id).html(converted.toFixed(2));         
        });
    });
}

$(document).ready(function () {
    getProducts();
    showEmptyCart();
    getExchangeRate();
    $('.add').initialize(function () {
        addProds();
    });

    $('.remove').initialize(function () {
        removeProds();
        $(this).click(function () {
            calculateTotal()
        });
    });

    $('.prod-in-cart').initialize(function () {
        calculateTotal();
    });

    $('.currency').initialize(function () {
        changeCurrencySymbol();
    });
    $('.currency-options').click(function () {
        changeCurrencySymbol();
        
    });
});

$(document).ajaxSuccess(function () {
    if ($('.prod').length === 0) {
        displayProds();
    }
    addProds();
    calculatePricesInNewCurrency();
});


// TODO - currency select & functionlity - done only for prods not in cart - bug - not working after prod remove
// TODO - currency parameter in url
// TODO - refactor css using less
// TODO - sort prods shown based on price


