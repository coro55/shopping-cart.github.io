var prods = [];
var prodsToBeAdded = [];

function getProducts() {
    $.ajax({
        url: "http://private-32dcc-products72.apiary-mock.com/product",
        success: function(response) {
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
        for (var key in prod) {
            if (key === 'id') {
                var product = "<div class='prod col-xs-12 col-sm-12 col-md-12 col-lg-12 " + prod['id'] + "'>";
                product += "<div class='prod-name col-xs-3 col-sm-6 col-md-6 col-lg-6'>" + prod['name'] + "</div>";
                product += "<div class='amount col-xs-5 col-sm-3 col-md-3 col-lg-3'>";
                product += "<span class='label-price'>Price: </span>";
                product += "<span class='currency'>$</span>";
                product += "<span class='price'>" + prod["price"] + "</span>";
                product += "</div>";
                product += "<button class='add col-xs-4 col-sm-3 col-md-3 col-lg-3' data-id=" + prod['id'] + "><img src='res/shopping-cart.png' alt='cart'></img><span>Add to cart</span></button>";
                product += "</div>";
                $(".add-to-cart").append(product);
            }
        }
    }
};

function showEmptyCart() {
    if (prodsToBeAdded.length === 0) {
        $('.cart').append(emptyCart);
    }
};

function showFullCart() {
    $('.no-prods').remove();
    $('.cart').append(fullCart);
};

function calculateTotal() {
    var total = 0;
    $('.unit-val').each(function() {
        var price = Number($(this).text());
        total += price;
    });
    $('.amount-total').html(parseFloat(total).toFixed(2));
};

function updateQtyAndPrice() {
    $('.form-control').blur(function() {
        $('.form-control').trigger('change');
        console.log($(this).val());
    });
};

function addProds() {
    $('.add').on('click', function() {
        var clicked = [];
        if ($('.cart-products').length === 0) {
            showFullCart();
        };
        var selectedProd = $(this).attr('data-id');
        for (var i in prods) {
            var index = prods[i];
            if (selectedProd == index.id) {
                prodsToBeAdded.push(index);
                clicked.push(index);
            }
            $('.' + selectedProd + '').detach();
        };

        function hideTooltipIfEmpty() {
            for (var i in clicked) {
                var prod = clicked[i];
                if (prod.description == null) {
                    $('#' + prod.id + '').hide();
                }
            }
        };

        for (var i in clicked) {
            var prodInCart = clicked[i];
            var cartProd = "<div class='prod-in-cart col-lg-12 col-md-12 col-sm-12 col-xs-12 " + prodInCart.id + " data-id=" + prodInCart.id + "'>";
            cartProd += "<div class='prod-name col-lg-6 col-md-6 col-sm-6 col-xs-6'><span class='name'>" + prodInCart.name + "<img src='res/info.png' id=" + prodInCart.id + " class='tooltip-icon' alt='info'></img><div class='tooltip-text col-lg-2 col-md-2 col-sm-4 col-xs-4 " + prodInCart.id + "'>" + prodInCart.description + "</div></span></div>";
            cartProd += "<div class='quantity col-lg-2 col-md-2 col-sm-2 col-xs-2'><input type='text' value='1' class='form-control' data-unit='" + prodInCart.id + "'></div>";
            cartProd += "<div class='unit-price col-lg-4 col-md-4 col-sm-4 col-xs-4'><span class='currency'>$</span><span class='unit-val unit-" + prodInCart.id + "'>" + prodInCart.price + "</span>";
            cartProd += "<button class='remove glyphicon glyphicon-trash' data-remove-id='" + prodInCart.id + "'></button></div></div>";
            $('.added-prods').append(cartProd);
            hideTooltipIfEmpty();
        };

        function showTooltip(id) {
            $('.tooltip-icon').mouseenter(function() {
                id = $(this).attr('id');
                $('.tooltip-text.' + id + '').show();
            });
            $('.tooltip-icon').mouseleave(function() {
                $('.tooltip-text').hide();
            });
        };
        clicked = [];
        calculateTotal();
        showTooltip();
        updateQtyAndPrice();
    });
};

$(document).ready(function() {
    getProducts();
    showEmptyCart();
});

$(document).ajaxComplete(function() {
    displayProds();
    addProds();
});
