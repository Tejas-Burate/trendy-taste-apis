const express = require('express');
const Razorpay = require('razorpay');


const razorpayInstance = new Razorpay({

	// Replace with your key_id
	key_id: 'rzp_test_4cWB86mbFXsYF3',

	// Replace with your key_secret
	key_secret: 'g9hJEn88RiwY2mGkM2fpyrOs'

});

module.exports = razorpayInstance;