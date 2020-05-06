var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/music-store', {useNewUrlParser: true});


var products = [
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/Jackson/291_6902_574-1400x1000.jpg",
        title: "Jackson Pro Series Monarkh",
        description: "Jackson Pro Series Monarkh SC Ash Ebony Fingerboard Charcoal Ash",
        price: 749.99,
        stock: 10
    }),
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/Charvel/296_9041_576-1400x1000.jpg",
        title: "Charvel Pro Mod DK24",
        description: "Charvel Pro Mod DK24 HH FR Maple Fingerboard Snow White",
        price: 850,
        stock: 5
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/Fender/IMG_6719-1400x1000.jpg",
        title: "Fender American Original 50s Telecaster",
        description: "Fender American Original 50s Telecaster Maple Fingerboard Butterscotch Blonde",
        price: 1850,
        stock: 6
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1100x550/catalog/Fender/DSC_0035-1100x550.jpg",
        title: "Fender American Professional Stratocaster",
        description: "Fender American Professional Stratocaster Electric Guitar Rosewood Fingerboard Sonic Gray SN# US19094746",
        price: 1450,
        stock: 2
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1100x550/catalog/ESP/EC1000FM_STP-1100x550.jpg",
        title: "Esp Ltd EC1000 Flame",
        description: "Esp Ltd EC1000 Flame Top See Thru Purple Electric Guitar Seymour Duncan Pickups",
        price: 999,
        stock: 3
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/product_images/Untitled_2__28978-1400x1000.jpg",
        title: "ESP Ltd EC256 Electric Guitar",
        description: "ESP Ltd EC256 Electric Guitar Lemon Drop",
        price: 400,
        stock: 4
    }),   
];
var done = 0;
for(var i=0; i<products.length; i++){
    products[i].save()
        .then(result => {
            done++;
            if(done === products.length){
                exit();
            }
        })
        .catch(error => console.error(error))
}

function exit(){
    mongoose.disconnect();
}
