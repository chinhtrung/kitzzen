var mongoose    = require("mongoose"),
    Campground  = require("./models/campground.js"),
    Comment     = require("./models/comment.js")

    
var data = [
        {
            name:"Granite Hill",
            image:"https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
            description:"Phasellus vehicula vestibulum accumsan. Aliquam lectus est, vulputate ut erat ut, pretium pharetra nibh. Pellentesque mattis quis odio id fringilla. Proin vehicula viverra nisl ac finibus. Integer id hendrerit ligula. Fusce magna ligula, faucibus et ultricies id, sodales sit amet risus. In vulputate mattis cursus. Integer luctus diam non nunc rhoncus euismod. Aliquam vestibulum malesuada turpis. Nunc pretium magna id iaculis facilisis. Suspendisse pulvinar, est in egestas tempor, nulla quam consectetur nibh, eget venenatis lacus lacus pulvinar enim. Sed sed sapien in dolor placerat molestie. Cras aliquam venenatis cursus. Fusce porta vestibulum arcu, ut efficitur nunc scelerisque at. Phasellus scelerisque ac dolor a condimentum.",
            author: {username: "Peanut"}
        },
        {
            name:"Campground with trees",
            image:"https://farm9.staticflickr.com/8577/16263386718_c019b13f77.jpg",
            description:"Duis semper faucibus rhoncus. Pellentesque varius nisl enim, eget maximus nisi dictum sed. Nullam congue dui nec ligula dignissim molestie. In erat metus, pretium in quam sollicitudin, sagittis pulvinar elit. Nunc imperdiet scelerisque rhoncus. In posuere pulvinar eleifend. Curabitur vitae nisl sit amet mi tempor efficitur quis nec arcu. Ut finibus magna eros, vitae tincidunt libero pharetra in. Curabitur commodo ante eu augue commodo mollis. Cras iaculis eget turpis ac pretium. Proin et finibus arcu, et blandit nunc. Morbi imperdiet, nisl consectetur condimentum sagittis, est nulla lacinia erat, sed convallis arcu libero in nibh.",
            author: {username: "Huni"}
        },
        {
            name:"Sunshine on the morning",
            image:"http://images.huffingtonpost.com/2015-03-19-1426803829-9735139-8f524af8ef2b50a4dab24786229c28c11.jpg",
            description:"Vestibulum est erat, consequat non arcu eu, aliquam ornare odio. Etiam quis eros eget diam ultricies gravida. Proin imperdiet, ante a dictum convallis, enim dolor blandit augue, pulvinar accumsan lectus nisl vitae dui. Proin luctus ex est, tristique vestibulum eros elementum ut. Nullam vitae tortor ultricies, laoreet ligula vitae, tempus dui. Quisque id sapien facilisis, semper urna et, maximus justo. Maecenas in varius magna. Sed blandit mi vel turpis vulputate, nec aliquam purus gravida. Nam eget magna non magna luctus porta ac sit amet risus.",
            author: {username: "Bang/wolf"}
        },
        {
            name:"Be with me",
            image:"http://www.readersdigest.ca/wp-content/uploads/2016/05/7-reasons-why-you-should-go-camping-this-summer.jpg",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "Faker"}
        }
    ];
    
function seedDB(){
    // remove all campgrounds
    // Campground.remove({},function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log("removed campgrounds!");
    // });
    // add a few campgrounds
    // data.forEach(function(seed){
    //     Campground.create(seed,function(err,campground){
    //         if(err){
    //             console.log(err);
    //         }else{
    //             console.log("added a campground");
    //             // create a comment
    //             Comment.create(
    //                 {
    //                     text:"This place is great, but I wish there was internet",
    //                     author: "Homer"
    //                 },function(err,comment){
    //                     if(err){
    //                         console.log(err);
    //                     }else{
    //                         campground.comments.push(comment);
    //                         campground.save();
    //                         console.log("Created new comment");
    //                     }
    //                 });
    //         }
    //     });
    // });
    // add a few comments
};

module.exports = seedDB;