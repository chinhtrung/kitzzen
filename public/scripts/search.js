$('#campground-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search="){
    search = "all";
  }
  $.get('/campgrounds?' + search, function(data) {
    $('#campground-grid').html('');
    data.forEach(function(campground) {
      $('#campground-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ campground.image }">
            <div class="caption">
              <h3>${ campground.name }</h3>
              <h5><strong>$ ${ campground.price }</strong> by <a href="/users/${ campground.author.id }"> ${ campground.author.username }</a>, ${ campground.timestring }</h5>
              <h5>${ campground.location }</h5>
              <hr class="style13">
              <p>${ campground.description.slice(0,100) }...</p>
              <p>
                <div>
                  <div class="ui primary labeled button" tabindex="0">
                    <button class="ui basic primary button">
                      <a href="/campgrounds/${ campground._id }"><i class="find icon"></i> View</a>
                    </button>
                    <div class="ui basic blue left pointing label">
                      ${campground.seen}
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

$('#campground-search').submit(function(event) {
  event.preventDefault();
});
