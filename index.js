class shoppingItem {
    constructor(name, fullName, price){
        this.name = name;
        this.fullName = fullName;
        this.price = price;
    }
}

let shirt = new shoppingItem("shirt", "Enzo Plain Shirt", "24.99");
let pants = new shoppingItem("pants", "Ripped Patchwork Pants", "29.99");
let jacket = new shoppingItem("jacket", "Utility Compartment Jacket", "54.99");
let socks = new shoppingItem("socks", "Zoe Socks (3 Pack)", "9.99");

const allItems = [shirt, pants, jacket, socks];

// Variables to keep the state of the cart.
let cartTotal = 0.00;
let inCart = [];

let sizeHolder = {
    size: "",
    allSizes: ["S","M","L"],
    openSelectorFullName: "",
    openSelectorName: ""
};



// display the size options for the selected item
function showSizes(fullName, name){

    // close and reset any other item active size selector
    if (sizeHolder.openSelectorFullName !== ""){
        const openSizeElementName = sizeHolder.openSelectorName;
        const openSizeElementFullName = sizeHolder.openSelectorFullName;
        closeSizeContainer(openSizeElementFullName, name);
        const openSizeElementId = `${openSizeElementName}-cart-button`;
        document.getElementById(openSizeElementId).style.display = "flex";
    }

    // hide add to cart button
    const addToCartButtonId = `${name}-cart-button`;
    document.getElementById(addToCartButtonId).style.display = "none";

    // display sizes
    sizeHolder.openSelectorFullName = fullName;
    sizeHolder.openSelectorName = name;
    const sizeElementId = `${fullName}-sizes`;
    document.getElementById(sizeElementId).style.visibility = "visible";

}


// attach the selected size to the item.
function setItemSize(size, Id) {
    sizeHolder.size = size;
    let sizeId = '';

    (sizeHolder.allSizes).forEach(possibleSize => {
        if (possibleSize === size){
            sizeId = `${Id}-${size}`;
            document.getElementById(sizeId).style.backgroundColor = "#c4c4c4";
        } else {
            sizeId = `${Id}-${possibleSize}`;
            document.getElementById(sizeId).style.backgroundColor = "#ffffff";
        }
    })
    const submitId = `${Id}-submit`
    document.getElementById(submitId).style.visibility = "visible";
}





// The user has submitted an item to the cart.
function addToCart(item){
    const size = sizeHolder.size;
    const fullName = item.fullName;
    const name = item.name;
    const price = item.price;

    closeSizeContainer(fullName, name);
    isInCart(fullName, price, size);

    //show items in cart
    document.getElementById("empty-cart-container").style.display = "none";
    document.getElementById("cart-info").style.visibility = "visible";

    showAddedConfirmation(fullName,name);    
}



// confirm to the user an item was added to the cart
function showAddedConfirmation(fullName,name){
    const confirmationButtonId = `${fullName}-confirmation`;
    const addToCartButtonId = `${name}-cart-button`;
    document.getElementById(addToCartButtonId).style.display = "none";
    document.getElementById(confirmationButtonId).style.display = "flex";

    setTimeout(function(){
        document.getElementById(confirmationButtonId).style.display = "none";
        document.getElementById(addToCartButtonId).style.display = "flex";
    }, 800);
}





// close the size options for an item
function closeSizeContainer(fullName, name){
    const submitId = `${fullName}-submit`;
    const sizeContainerId = `${fullName}-sizes`;
    const sizeButtonId = `${fullName}-${sizeHolder.size}`
    document.getElementById(sizeButtonId).style.backgroundColor = "#ffffff";
    document.getElementById(sizeContainerId).style.visibility = "hidden";
    document.getElementById(submitId).style.visibility = "hidden";

    const addToCartButtonId = `${name}-cart-button`;
    document.getElementById(addToCartButtonId).style.display = "flex";
}





// Check if the item is already in the cart
function isInCart(fullName, price, size){
    const label = fullName + size;

    if ( (inCart.length == 0) || (inCart.includes(label) === false) ){
        inCart.push(label);
        editOrderTotal(price, "increase");
        displayItemInCart(fullName, price, "1", size);

    } else {
        increaseQty(fullName, price, size);     
    }
}





// display an item in the cart
function displayItemInCart(item, price, Qty, size){
    let htmlcode = `<div id='${item}-${size}-container' class='cart-item-container'>`;
    // first column in the cart - item

    htmlcode += `<div class='cart-image-container cart-first-column'>`;
    htmlcode += `<img src='images/${item}.png' class='cart-image'/>`;
    htmlcode += `<div>`
    htmlcode += `<p class='cart-item-title'> ${item} </p>`;
    htmlcode += `<p class='cart-item-title'>Size: ${size}</p>`
    htmlcode += `</div>`
    htmlcode += '</div>';

    // second column in the cart - qty
    htmlcode += `<div id='qty-container' class='cart-section'>`;
    htmlcode += `<div class='qty-icon'>`;
    htmlcode += `<i id="${item}${size}-increase-qty" class="material-icons" onclick="increaseQty('${item}','${price}','${size}')">add_circle</i>`;
    htmlcode += `</div>`;
    htmlcode += `<p id="${item}-${size}-qty" class='qty'>${Qty}</p>`;
    htmlcode += `<div class='qty-icon'>`;
    htmlcode += `<i id="${item}${size}-decrease-qty" class="material-icons" onclick="decreaseQty('${item}','${price}','${size}')">remove_circle</i>`;
    htmlcode += `</div>`;
    htmlcode += `</div>`;

    // third column - price
    htmlcode += `<p class='cart-section'>$${price}</p>`;

    // fourth column - total price for item
    htmlcode += `<p id="total-${item}-${size}-price" class='cart-section'>$${price}</p>`;

    // the delete button
    htmlcode += `<div class="delete-button">`;
    htmlcode += `<i id="${item}${size}-delete"class="material-icons" onclick="deleteItem('${item}','${size}')">delete</i>`;
    htmlcode += `</div>`;

    htmlcode += `</div>`;

    document.getElementById("cart-items").insertAdjacentHTML("beforeend", htmlcode);
    // displayInCart(htmlcode);
}




function displayInCart(htmlcode){
    
}




// Increase the quantity of an item in the cart
function increaseQty(fullName, price, size){
    elementId = `${fullName}-${size}-qty`;
    itemQty = document.getElementById(elementId).innerText;
    const newQty = (parseInt(itemQty) + 1).toString();

    // limit the quantity to 10 items only
    if (newQty !== "11"){
        document.getElementById(elementId).innerText = newQty;
        editOrderTotal(price, "increase");
        editItemTotal(fullName, price, size, "increase");
    }
}



// Decrease the quantity of an item in the cart
function decreaseQty(fullName, price, size){
    elementId = `${fullName}-${size}-qty`;
    itemQty = document.getElementById(elementId).innerText;

    const newQty = (parseInt(itemQty) - 1).toString();
    if (newQty !== "0"){
        document.getElementById(elementId).innerText = newQty;
        editItemTotal(fullName, price, size, "decrease");
        editOrderTotal(price, "decrease");
    } else {
        deleteItem(fullName, size); 
    }
}




// Edit the total price for an object in the cart
function editItemTotal(fullName, price, size, direction){
    const elementId = `total-${fullName}-${size}-price`;
    var itemTotal = document.getElementById(elementId).innerText;
    itemTotal = itemTotal.substring(1);
    let newTotal = 0.00;
    if (direction === "increase" ){
        newTotal = (parseFloat(itemTotal) + parseFloat(price)).toFixed(2).toString();
    } else {
        newTotal = (parseFloat(itemTotal) - parseFloat(price)).toFixed(2).toString();
    }

    document.getElementById(elementId).innerText = `$${newTotal}`;
}




// edit the order total displayed in the cart
function editOrderTotal(price, direction){
    if (direction === "increase" ){
        cartTotal += parseFloat(price);
    }
    else {
        cartTotal -= parseFloat(price);
    }
    showOrderTotal();
}






// display the order total in the cart
function showOrderTotal(){
    const stringTotal = (cartTotal.toFixed(2)).toString();
    document.getElementById("total-amount").innerHTML = `$${stringTotal}`;
}




// get the total for an item in the cart
function getItemTotal(item, size){
    const elementId = `total-${item}-${size}-price`;
    const itemTotal = parseFloat((document.getElementById(elementId).innerText).substring(1));
    return itemTotal;
}




// delete an item from the cart
function deleteItem(item, size){

    //decrease total before you delete the element
    const itemTotal = getItemTotal(item, size);
    editOrderTotal(itemTotal, "decrease");

    //from html
    const elementId = `${item}-${size}-container`;
    const itemElement = document.getElementById(elementId);
    itemElement.parentNode.removeChild(itemElement);

    //from cart array
    var updatedArray = inCart.filter(function(element){
        return element != item + size;
    });
    inCart = updatedArray;

    // if cart is empty reset the display
    if (inCart.length === 0){
        document.getElementById("empty-cart-container").style.display = "flex";
        document.getElementById("cart-info").style.visibility = "hidden";
    }

}




// Do these tasks when the window loads
window.onload = function() {
    // if there is a cart state saved recreate it
    if (sessionStorage.getItem("cart") != null){
        document.getElementById('cart-container').innerHTML = sessionStorage.getItem("cart");
        cartTotal = parseFloat(sessionStorage.getItem("OrderTotal"));
        inCart = (sessionStorage.getItem("inCartItems")).split(",");
        document.getElementById("empty-cart-container").style.display = "none";
        document.getElementById("cart-info").style.visibility = "visible";
        }
    
        
    createItemEventListners();
}
   
// before unloading the window save the cart state
window.onbeforeunload = function () {
    if (inCart.length > 0){
        sessionStorage.setItem("cart",document.getElementById('cart-container').innerHTML);
        sessionStorage.setItem("OrderTotal", cartTotal);
        sessionStorage.setItem("inCartItems", inCart);
    }

}

// Event Listners --------------------------------------------------------------------------------------------------------------
function createItemEventListners(){
    allItems.forEach(item =>{
        const name = item.name;
        const fullName = item.fullName;

        document.getElementById(`${name}-cart-button`).addEventListener("click", function() {
            showSizes(fullName, name);
        });

        document.getElementById(`${fullName} close-size-button`).addEventListener("click", function() {
            closeSizeContainer(fullName, name);
        });

        document.getElementById(`${fullName}-submit`).addEventListener("click", function() {
            addToCart(item);
        });

        (sizeHolder.allSizes).forEach(size => {
            document.getElementById(`${fullName}-${size}`).addEventListener("click", function() {
                setItemSize(size, fullName);
            });
        })
    });
}

document.getElementById("title").addEventListener("click", function() {
    window.scrollTo(0,0);
});

document.getElementById("header-cart-icon").addEventListener("click", function() {
    document.getElementById("cart-section").scrollIntoView()
});





