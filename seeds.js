const Food = require("./models/food.js"),
    Rating = require("./models/rating.js"),
    Comment = require("./models/comment.js");

// configure dotenv
require('dotenv').load();

const userOne = {
    username: process.env.USER_ONE,
    id: process.env.USER_ONE_ID,
    avatar: process.env.USER_ONE_AVATAR
};
const userTwo = {
    username: process.env.USER_TWO,
    id: process.env.USER_TWO_ID,
    avatar: process.env.USER_TWO_AVATAR
};
const userThree = {
    username: process.env.USER_THREE,
    id: process.env.USER_THREE_ID,
    avatar: process.env.USER_THREE_AVATAR
};
const userFour = {
    username: process.env.USER_FOUR,
    id: process.env.USER_FOUR_ID,
    avatar: process.env.USER_FOUR_AVATAR
};
const userFive = {
    username: process.env.USER_FIVE,
    id: process.env.USER_FIVE_ID,
    avatar: process.env.USER_FIVE_AVATAR
};

const dummyLocationGeo = [
    {
        type: "Point",
        coordinates: [-84.512023, 39.102779]
    },
    {
        type: "Point",
        coordinates: [-84.518641, 39.134270]
    },
    {
        type: "Point",
        coordinates: [-84.512023, 40.142564]
    },
    {
        type: "Point",
        coordinates: [-87.989622, 39.134270]
    }
];

const foods = [
    {
        name: "Blueberry on the Cake",
        price: "89",
        image: "https://images.unsplash.com/photo-1506459225024-1428097a7e18",
        description: "Phasellus vehicula vestibulum accumsan. Aliquam lectus est, vulputate ut erat ut, pretium pharetra nibh. Pellentesque mattis quis odio id fringilla. Proin vehicula viverra nisl ac finibus. Integer id hendrerit ligula. Fusce magna ligula, faucibus et ultricies id, sodales sit amet risus. In vulputate mattis cursus. Integer luctus diam non nunc rhoncus euismod. Aliquam vestibulum malesuada turpis. Nunc pretium magna id iaculis facilisis. Suspendisse pulvinar, est in egestas tempor, nulla quam consectetur nibh, eget venenatis lacus lacus pulvinar enim. Sed sed sapien in dolor placerat molestie. Cras aliquam venenatis cursus. Fusce porta vestibulum arcu, ut efficitur nunc scelerisque at. Phasellus scelerisque ac dolor a condimentum.",
        author: userOne
    },
    {
        name: "🍕🍕🍕 The italian pizza",
        price: "20",
        image: "https://images.unsplash.com/photo-1458642849426-cfb724f15ef7",
        description: "Duis semper faucibus rhoncus. Pellentesque varius nisl enim, eget maximus nisi dictum sed. Nullam congue dui nec ligula dignissim molestie. In erat metus, pretium in quam sollicitudin, sagittis pulvinar elit. Nunc imperdiet scelerisque rhoncus. In posuere pulvinar eleifend. Curabitur vitae nisl sit amet mi tempor efficitur quis nec arcu. Ut finibus magna eros, vitae tincidunt libero pharetra in. Curabitur commodo ante eu augue commodo mollis. Cras iaculis eget turpis ac pretium. Proin et finibus arcu, et blandit nunc. Morbi imperdiet, nisl consectetur condimentum sagittis, est nulla lacinia erat, sed convallis arcu libero in nibh.",
        author: userTwo
    },
    {
        name: "Sunshine on the dimsum",
        price: "30",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb",
        description: "Vestibulum est erat, consequat non arcu eu, aliquam ornare odio. Etiam quis eros eget diam ultricies gravida. Proin imperdiet, ante a dictum convallis, enim dolor blandit augue, pulvinar accumsan lectus nisl vitae dui. Proin luctus ex est, tristique vestibulum eros elementum ut. Nullam vitae tortor ultricies, laoreet ligula vitae, tempus dui. Quisque id sapien facilisis, semper urna et, maximus justo. Maecenas in varius magna. Sed blandit mi vel turpis vulputate, nec aliquam purus gravida. Nam eget magna non magna luctus porta ac sit amet risus.",
        author: userOne
    },
    {
        name: "Sweet blueberry, waffle and honey 🍯",
        price: "15",
        image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userThree
    },
    {
        name: "a yellow tasty hotdog with lime",
        price: "22",
        image: "https://images.unsplash.com/photo-1612392061787-2d078b3e573c",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userFour
    },
    {
        name: "Egg and bacon on the charcoal 🥚🍳🥓",
        price: "15",
        image: "https://images.unsplash.com/photo-1606851094291-6efae152bb87",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userOne
    },
    {
        name: "Color berries",
        price: "25",
        image: "https://images.unsplash.com/photo-1444459094717-a39f1e3e0903",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userThree
    },
    {
        name: "Bring me back to the nature 🥗😍🥕",
        price: "14",
        image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userFour
    },
    {
        name: "Hamburgicianer is it? 🍔",
        price: "18",
        image: "https://images.unsplash.com/photo-1530554764233-e79e16c91d08",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userThree
    },
    {
        name: "🍫 Do you want some?",
        price: "5",
        image: "https://images.unsplash.com/photo-1553452118-621e1f860f43",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userTwo
    },
    {
        name: "Egg on the sandwiches",
        price: "20",
        image: "https://images.unsplash.com/photo-1593584785033-9c7604d0863f",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userThree
    },
    {
        name: "Hot and yummy bbq 😭🌶️🥓",
        price: "30",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userThree
    },
    {
        name: "Rectangle pizza for breakfast with tomato",
        price: "12",
        image: "https://images.unsplash.com/photo-1547558840-8ad6c8e662a2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userTwo
    },
    {
        name: "😋 Udon on the go 😋",
        price: "15",
        image: "https://images.unsplash.com/photo-1617421753170-46511a8d73fc",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userThree
    },
    {
        name: "My sweet flavor",
        price: "5",
        image: "https://images.unsplash.com/photo-1558326567-98ae2405596b",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userOne
    },
    {
        name: "Next definition of taco 🌮🌮🌮",
        price: "12",
        image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis metus justo, sit amet tincidunt libero facilisis id. Maecenas auctor et tellus in viverra. Donec ultricies consectetur ipsum, ac laoreet purus gravida vitae. Donec at lacus ut nunc feugiat vulputate. Praesent mi nisi, luctus eget ante ac, sagittis malesuada odio. Donec ut rutrum nisi, semper lacinia arcu. Sed id risus metus. Vestibulum quis accumsan felis. Nunc varius accumsan neque, non gravida nisi tristique eu. Phasellus ac interdum mauris. Integer ornare lobortis sagittis.",
        author: userFour
    }
];

const addOnFoods = () => {
    foods.forEach((each) => {
        each["location"] = "this location";
        each["geometry"] = dummyLocationGeo[Math.round(Math.random() * (dummyLocationGeo.length - 1))];
        each["matchingPlaceName"] = "your location will be here";
    })
}

const seedDB = async () => {
    // remove all foods
    Food.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("removed foods!");
    });
    // remove all comments
    Comment.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("removed comments!");
    });
    // remove all ratings
    Rating.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("removed ratings!");
    });

    addOnFoods();

    // add seeds
    foods.forEach((seed) => {
        Food.create(seed, (err, food) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Added new food");
                // create a comment
                Comment.create(
                    {
                        text: "When can I pick it up? It looks yummy",
                        author: userFive
                    }, (err, comment) => {
                        if (err) {
                            console.log(err);
                        } else {
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