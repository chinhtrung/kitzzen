var mongoose    = require("mongoose"),
    Food        = require("./models/campground.js"),
    Comment     = require("./models/comment.js");
    
var foods = [
        {
            name:"Blueberry on the Cake",
            price: "89",
            image:"https://images.unsplash.com/photo-1506459225024-1428097a7e18",
            description:"Phasellus vehicula vestibulum accumsan. Aliquam lectus est, vulputate ut erat ut, pretium pharetra nibh. Pellentesque mattis quis odio id fringilla. Proin vehicula viverra nisl ac finibus. Integer id hendrerit ligula. Fusce magna ligula, faucibus et ultricies id, sodales sit amet risus. In vulputate mattis cursus. Integer luctus diam non nunc rhoncus euismod. Aliquam vestibulum malesuada turpis. Nunc pretium magna id iaculis facilisis. Suspendisse pulvinar, est in egestas tempor, nulla quam consectetur nibh, eget venenatis lacus lacus pulvinar enim. Sed sed sapien in dolor placerat molestie. Cras aliquam venenatis cursus. Fusce porta vestibulum arcu, ut efficitur nunc scelerisque at. Phasellus scelerisque ac dolor a condimentum.",
            author: {username: "UserOne"}
        },
        {
            name:"🍕🍕🍕 The italian pizza",
            price: "20",
            image:"https://images.unsplash.com/photo-1458642849426-cfb724f15ef7",
            description:"Duis semper faucibus rhoncus. Pellentesque varius nisl enim, eget maximus nisi dictum sed. Nullam congue dui nec ligula dignissim molestie. In erat metus, pretium in quam sollicitudin, sagittis pulvinar elit. Nunc imperdiet scelerisque rhoncus. In posuere pulvinar eleifend. Curabitur vitae nisl sit amet mi tempor efficitur quis nec arcu. Ut finibus magna eros, vitae tincidunt libero pharetra in. Curabitur commodo ante eu augue commodo mollis. Cras iaculis eget turpis ac pretium. Proin et finibus arcu, et blandit nunc. Morbi imperdiet, nisl consectetur condimentum sagittis, est nulla lacinia erat, sed convallis arcu libero in nibh.",
            author: {username: "UserTwo"}
        },
        {
            name:"Sunshine on the dimsum",
            price: "30",
            image:"https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
            description:"Vestibulum est erat, consequat non arcu eu, aliquam ornare odio. Etiam quis eros eget diam ultricies gravida. Proin imperdiet, ante a dictum convallis, enim dolor blandit augue, pulvinar accumsan lectus nisl vitae dui. Proin luctus ex est, tristique vestibulum eros elementum ut. Nullam vitae tortor ultricies, laoreet ligula vitae, tempus dui. Quisque id sapien facilisis, semper urna et, maximus justo. Maecenas in varius magna. Sed blandit mi vel turpis vulputate, nec aliquam purus gravida. Nam eget magna non magna luctus porta ac sit amet risus.",
            author: {username: "UserOne"}
        },
        {
            name:"Sweet blueberry, waffle and honey 🍯",
            price: "15",
            image:"https://images.unsplash.com/photo-1506084868230-bb9d95c24759",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserThree"}
        },
        {
            name:"a yellow tasty hotdog with lime",
            price: "22",
            image:"https://images.unsplash.com/photo-1612392061787-2d078b3e573c",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserFour"}
        },
        {
            name:"Egg and bacon on the charcoal 🥚🍳🥓",
            price: "15",
            image:"https://images.unsplash.com/photo-1606851094291-6efae152bb87",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserOne"}
        },
        {
            name:"Color berries",
            price: "25",
            image:"https://images.unsplash.com/photo-1444459094717-a39f1e3e0903",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserThree"}
        },
        {
            name:"Bring me back to the nature 🥗😍🥕",
            price: "14",
            image:"https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserFour"}
        },
        {
            name:"Hamburgicianer is it? 🍔",
            price: "18",
            image:"https://images.unsplash.com/photo-1530554764233-e79e16c91d08",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserThree"}
        },
        {
            name:"🍫 Do you want some?",
            price: "5",
            image:"https://images.unsplash.com/photo-1553452118-621e1f860f43",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserFive"}
        },
        {
            name:"Egg on the sandwiches",
            price: "20",
            image:"https://images.unsplash.com/photo-1593584785033-9c7604d0863f",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserThree"}
        },
        {
            name:"Hot and yummy bbq 😭🌶️🥓",
            price: "30",
            image:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserThree"}
        },
        {
            name:"Rectangle pizza for breakfast with tomato",
            price: "12",
            image:"https://images.unsplash.com/photo-1547558840-8ad6c8e662a2",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserTwo"}
        },
        {
            name:"😋 Udon on the go 😋",
            price: "15",
            image:"https://images.unsplash.com/photo-1617421753170-46511a8d73fc",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserThree"}
        },
        {
            name:"My sweet flavor",
            price: "5",
            image:"https://images.unsplash.com/photo-1558326567-98ae2405596b",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserOne"}
        },
        {
            name:"Next definition of taco 🌮🌮🌮",
            price: "12",
            image:"https://images.unsplash.com/photo-1504544750208-dc0358e63f7f",
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
            author: {username: "UserFour"}
        }
    ];
    
function seedDB(){
    // remove all foods
    Food.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("removed foods!");
    });
    // remove all comments
    Comment.remove({},function(err){
        if(err){
            console.log(err);
        }
        console.log("removed comments!");
    });

    // add seeds
    foods.forEach(function(seed){
        Food.create(seed,function(err,food){
            if(err){
                console.log(err);
            }else{
                console.log("Added new food");
                // create a comment
                Comment.create(
                    {
                        text:"When can I pick it up? It looks yummy",
                        author: "Homer"
                    },function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            food.comments.push(comment);
                            food.save();
                            console.log("Added new comment");
                        }
                    }
                );
            }
        });
    });
    // add a few comments
};

module.exports = seedDB;