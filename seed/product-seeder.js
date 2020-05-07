var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/music-store', {useNewUrlParser: true});


var products = [
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/Jackson/291_6902_574-1400x1000.jpg",
        title: "Jackson Pro Series Monarkh",
        description: "Jackson Pro Series Monarkh SC Ash Ebony Fingerboard Charcoal Ash",
        category: "Guitar",
        price: 750,
        stock: 10
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1100x550/catalog/product_images/ARBW4650RCTK-1__17520-1100x550.jpg",
        title: "Mapex ARBW4650RCTK Armory Series Drum",
        description: "Mapex ARBW4650RCTK Armory Series Exterminator Snare Drum 6.85mm Maple - 14x6.5",
        category: "Drum",
        price: 259,
        stock: 4
    }),
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/product_images/095-5500-021__37773-1400x1000.jpg",
        title: "Fender FB-55 Banjo",
        description: "Fender FB-55 5 String Banjo Natural Finish",
        category: "Banjo",
        price: 550,
        stock: 5
    }),
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/Washburn/M3SWK-1400x1000.jpg",
        title: "Demo - Washburn M3SWK-D F-Style Mandolin",
        description: "Demo - Washburn M3SWK-D F-Style Mandolin Carved Solid Sitka Spruce Top",
        category: "Mandolin",
        price: 649,
        stock: 6
    }),
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/Charvel/296_9041_576-1400x1000.jpg",
        title: "Charvel Pro Mod DK24",
        description: "Charvel Pro Mod DK24 HH FR Maple Fingerboard Snow White",
        category: "Guitar",
        price: 850,
        stock: 5
    }),
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1100x550/catalog/product_images/_1269608497__32310-1100x550.jpg",
        title: "Mapex MPBC4550CXN MPX Series Drum",
        description: "Mapex MPBC4550CXN MPX Series Birch Snare Drum in Natural Gloss",
        category: "Drum",
        price: 139,
        stock: 6
    }),
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/B10-1400x1000.jpg",
        title: "Washburn B10 5-string Banjo",
        description: "Washburn B10 5-string Banjo Mahogany back and sides Sunburst Gloss",
        category: "Banjo",
        price: 139,
        stock: 6
    }),
    new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/Fender/IMG_6719-1400x1000.jpg",
        title: "Fender American Original 50s Telecaster",
        description: "Fender American Original 50s Telecaster Maple Fingerboard Butterscotch Blonde",
        category: "Guitar",
        price: 1850,
        stock: 6
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1100x550/catalog/Fender/DSC_0035-1100x550.jpg",
        title: "Fender American Professional Stratocaster",
        description: "Fender American Professional Stratocaster Electric Guitar Rosewood Fingerboard Sonic Gray SN# US19094746",
        category: "Guitar",
        price: 1450,
        stock: 2
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1100x550/catalog/ESP/EC1000FM_STP-1100x550.jpg",
        title: "Esp Ltd EC1000 Flame",
        description: "Esp Ltd EC1000 Flame Top See Thru Purple Electric Guitar Seymour Duncan Pickups",
        category: "Guitar",
        price: 999,
        stock: 3
    }),new Product({
        imagePath : "https://www.worldmusicsupply.com/image/cache/1400x1000/catalog/product_images/Untitled_2__28978-1400x1000.jpg",
        title: "ESP Ltd EC256 Electric Guitar",
        description: "ESP Ltd EC256 Electric Guitar Lemon Drop",
        category: "Guitar",
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
