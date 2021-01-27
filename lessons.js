// Vue Object holding all the information that is displayed in the html {{}} tags
new Vue({
    el: "#app",
    data: {
        showProduct: true,
        products: products,

        // FORM
        form: {
            name: null,
            phone: null
        },

        //Checkout
        cart: [],
        errors: [],
    },

    computed: {
        //*********************************************************** */
        //Sort Price
        //*********************************************************** */

        sortedAscendingPrice() {
            function compare(a, b) {
                if (a.price > b.price) return 1;
                if (a.price < b.price) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        sortedDescendingPrice() {
            function compare(a, b) {
                if (a.price < b.price) return 1;
                if (a.price > b.price) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        //*********************************************************** */
        //Sort Title
        //*********************************************************** */
        sortedAscendingTitle() {
            function compare(a, b) {
                if (a.title > b.title) return 1;
                if (a.title < b.title) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        sortedDescendingTitle() {
            function compare(a, b) {
                if (a.title < b.title) return 1;
                if (a.title > b.title) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        //*********************************************************** */
        //Sort Availability
        //*********************************************************** */
        sortedAscendingAvailability() {
            function compare(a, b) {
                if (a.availableInventory > b.availableInventory) return 1;
                if (a.availableInventory < b.availableInventory) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
        sortedDescendingAvailability() {
            function compare(a, b) {
                if (a.availableInventory < b.availableInventory) return 1;
                if (a.availableInventory > b.availableInventory) return -1;
                return 0;
            }
            return this.products.sort(compare);
        },
    },

    methods: {
        // Add product to cart array and substract availableInventory
        addToCart: function (product) {
            this.cart.push(product);
            product.availableInventory--;
        },
        //Remove item from checkout and add availableInventory back
        removeFromCheckout: function (item) {
            this.cart.pop(item);
            item.availableInventory++;
        },
        //Display main page if showProduct is true
        showCheckout() {
            this.showProduct = this.showProduct ? false : true;
        },
        canAddToCart(product) {
            return product.availableInventory > this.cartItemCount(product.id)
        },
        // Checkout counter 
        cartItemCount() {
            let count = 0;
            return count;
        },

        //*********************************************************** */
        //                      FORM VALIDATION
        //*********************************************************** */

        checkForm: function (e) {
            this.errors = [];

            if (!name) {
                this.errors.push("Name required.");
            } else if (!this.validName(this.name)) {
                this.errors.push('Valid name required.');
            }
            if (!phone) {
                this.errors.push("Phone required.");
            } else if (!this.validPhone(this.phone)) {
                this.errors.push('Valid phone required.');
            }
            if (!this.errors.length) {
                return true;
            }
            e.preventDefault();
            console.log(e);
        },
        validName: function (name) {
            var re = /^[A-Za-z]+$/g;
            return re.test(name);
        },
        validPhone: function (phone) {
            var re = /((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/g;
            return re.test(phone);
        },
    }
});