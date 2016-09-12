var prods = [];
var prodsToBeAdded = [];

function getProducts() {
    var arr;
    $.ajax({
        url: "http://private-32dcc-products72.apiary-mock.com/product",
        success: function(response) {
            arr = response;
            for (var i in arr) {
                var item = arr[i];
                for (var key in item) {
                    if (key == "id") {
                        prods.push(item);
                    }
                };
                i++;
            }
        }
    });
};

function displayProds() {
    for (var i in prods) {
        var prod = prods[i];
        for (var key in prod) {
            if (key == 'id') {
                var product = "<div class='prod col-xs-12 col-sm-12 col-md-12 col-lg-12 " + prod['id'] + "'>";
                product += "<div class='prod-name col-xs-3 col-sm-6 col-md-6 col-lg-6'>" + prod['name'] + "</div>";
                product += "<div class='amount col-xs-5 col-sm-3 col-md-3 col-lg-3'>";
                product += "<span class='label-price'>Price: </span>";
                product += "<span class='currency'>$</span>";
                product += "<span class='price'>" + prod["price"] + "</span>";
                product += "</div>";
                product += "<button class='add glyphicon glyphicon-shopping-cart col-xs-4 col-sm-3 col-md-3 col-lg-3' data-id=" + prod['id'] + ">Add to cart</button>";
                product += "</div>";
                $(".add-to-cart").append(product);
            }
        }
    }
};

function addProds() {
    $('.add').on('click', function() {
        var selectedProd = $(this).attr('data-id');
        console.log(selectedProd + " clicked");

    });
}


$(document).ready(function() {
    getProducts();
});

$(document).ajaxComplete(function() {
    displayProds();
    addProds();
});
