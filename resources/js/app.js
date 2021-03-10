import axios from "axios";
import moment from "moment";
import Noty from 'noty';
import { initAdmin } from "./admin";

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

const updateCart = (pizza) => {
    axios.post('/update-cart',pizza).then(res => {
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type:"success",
            text:"Item added to cart",
            timeout:1000,
            progressBar:false,
        }).show();
    }).catch(err => {
        new Noty({
            type:"error",
            text:"Somenthing went wrong!",
            timeout:1000,
            progressBar:false,
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)
        // console.log(pizza);
    })
})


// Remove alert message after X sec.
const alertMsg = document.querySelector('#success-alert');
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove();
    },2000)
}



// Change order status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');

let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small')

const updateStatus = (order) => {
    statuses.forEach((status) => {
        status.classList.remove('step_completed');
        status.classList.remove('current');
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step_completed')
        }
        if(dataProp === order.status){
            stepCompleted=false;
            time.innerText = moment(order.updatedAt).format('hh:mm:ss A');
            status.appendChild(time);
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            }
        }
    })
}

updateStatus(order);


// Socket
let socket = io();
initAdmin(socket);

// Join
if(order){
    socket.emit('join',`order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom');

}

socket.on('orderUpdated',(data) => {
    const updatedOrder = {...order};
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    new Noty({
        type:"success",
        text:"Order updated",
        timeout:1000,
        progressBar:false,
    }).show();
    // console.log(data);
})