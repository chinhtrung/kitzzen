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

function runEmojiPicker(selector) {
    let toggleButton = document.querySelector(`#trigger-emoji-picker-${selector}`);
    let pickerContainer = document.querySelector(`#emoji-picker-${selector}`);
    let selectedPicker = document.querySelector(`#emoji-picker-${selector} emoji-picker`);
    let textRating = document.querySelector(`#textarea-${selector}`);

    if (toggleButton && pickerContainer && selectedPicker && textRating) {
        toggleButton.addEventListener("click", ()=>{pickerContainer.classList.toggle("hidden")});
        selectedPicker.addEventListener('emoji-click', event => {
            let emo = event.detail.unicode;
            textRating.value += emo;
        });

        document.addEventListener('click', function(event) {
            let isClickInsideElement = toggleButton.contains(event.target) || pickerContainer.contains(event.target);
            if (!isClickInsideElement) {
                pickerContainer.classList.add("hidden");
            }
        });
    }
}

window.onload = function () {
    let addEmoPicker = ["rating", "comment"];
    addEmoPicker.forEach(each => {runEmojiPicker(each)});
}
