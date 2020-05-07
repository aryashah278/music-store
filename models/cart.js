module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item, id){
        var storedItem = this.items[id];
        if(!storedItem){
            storedItem = this.items[id] = {item: item, qty:0, price:0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    this.remove = function(item, id, qtyRemoved=1){
        var storedItem = this.items[id];
        if(storedItem.qty < qtyRemoved){
            storedItem.qty = 0;
            storedItem.price = 0;
            this.totalQty-= storedItem.qty;
            this.totalPrice -= storedItem.item.price * qtyRemoved;
            delete this.items[id];
        }
        else{
            storedItem.qty-= qtyRemoved;
            if (storedItem.qty >= 0){
                storedItem.price = storedItem.item.price * storedItem.qty;
                this.totalQty-=qtyRemoved;
                this.totalPrice -= storedItem.item.price * qtyRemoved;
                if(storedItem.qty == 0){
                    delete this.items[id];
                } 
            }
        }    
    }

    this.removeAll = function(item, id) {
        var storedItem = this.items[id];
        this.remove(item, id, storedItem.qty);
    }

    

    this.generateArray = function(){
        var arr = [];
        for (var id in this.items){
            arr.push(this.items[id]);
        }
        
        return arr;
    };
};