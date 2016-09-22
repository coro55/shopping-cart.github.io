var selectedProds = JSON.parse(localStorage.getItem('prod'));

function getProdsFromLocal(){
    if (selectedProds.length !== 0){
        for (var i = 0; i < selectedProds.length; i++){
            $('.selected-products').append(selectedProds[i] + '<br>');
        }
    }
}