$(document).ready(function(){
    $("#delete-confirmation").hide();
    $('#delete-request').click(function(){
        $('#delete-confirmation').fadeToggle('fast');
    });
    $(".hidden-button").hide();
    $('.add-reply').click(function(){
        $('.hidden-button').fadeIn('fast');
        $('.cancel-button').click(function(){
            $('.hidden-button').hide();
        });
    });
});

function runEmojiPicker() {
    let tepr = document.querySelector("#trigger-emoji-picker-rating");
    let epr = document.querySelector("#emoji-picker-rating");
    tepr.addEventListener("click", ()=>{epr.classList.toggle("hidden")});

    let epRating = document.querySelector('#emoji-picker-rating emoji-picker');
    let textRating = document.querySelector('#textarea-rating');
    console.dir(epr);
    epRating.addEventListener('emoji-click', event => {
        let emo = event.detail.unicode;
        textRating.value += emo;
    });

    document.addEventListener('click', function(event) {
        let isClickInsideElement = tepr.contains(event.target) || epr.contains(event.target);
        if (!isClickInsideElement) {
            epr.classList.add("hidden");
        }
    });
}

window.onload = function () {
    runEmojiPicker();
}
