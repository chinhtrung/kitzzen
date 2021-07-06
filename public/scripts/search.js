$('#food-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search="){
    search = "all";
  }
  $.get('/foods?' + search, function(data) {
    $('#food-grid').html('');
    data.forEach(function(food) {
      $('#food-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ food.image }">
            <div class="caption">
              <h3>${ food.name }</h3>
              <h5>
                <strong>$ ${ food.price }</strong> by <a href="/users/${ food.author.id }"> ${ food.author.username }</a>
              </h5>
              <hr class="style13">
              <p>${ food.description.slice(0,100) }...</p>
              <p>
                <div>
                  <div class="ui primary labeled button" tabindex="0">
                    <button class="ui basic primary button">
                      <a href="/foods/${ food._id }"><i class="book icon"></i> View</a>
                    </button>
                    <div class="ui basic blue left pointing label">
                      ${food.seen}
                    </div>
                  </div>
                </div>
              </p>
            </div>
          </div>
        </div>
      `);
    });
  });
});

$('#food-search').submit(function(event) {
  event.preventDefault();
});
