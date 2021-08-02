$('#food-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search="){
    search = "all";
  }
  $.get('/foods?' + search, function(data) {
    document.querySelectorAll('.food-post').forEach(each => each.classList.add('hidden'));
    data.forEach(function(food) {
      let selectedFood = document.querySelector(`#food-id-${food._id}`);
      selectedFood.classList.remove('hidden');
    });
  });
});

$('#food-search').submit(function(event) {
  event.preventDefault();
});
