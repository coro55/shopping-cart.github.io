var selectedProds = JSON.parse(sessionStorage.getItem('prodids'));
function getProdsFromLocal(){
    if (selectedProds.length !== 0){
        for (var i in selectedProds){
            var id = selectedProds[i];
            $('.selected-products').append('<div class="row"><div class="prod-name col-xs-6 col-sm-5">'+ sessionStorage.getItem(id + '-name') +'</div><div class="prod-qty col-xs-2 col-sm-3">'+ sessionStorage.getItem(id + '-qty') +'</div><div class="prod-price col-xs-4 col-sm-4">'+ sessionStorage.getItem(id + '-price') +'</div></div>');
        }
    }
}

getProdsFromLocal();