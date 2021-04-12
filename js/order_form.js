const order_form = {
	id:"flight_booking_form",
	view:"form",
	width:500,
	elementsConfig:{ labelWidth:160 },
	scroll:false,
	elements:[
		{ view:"text", clear:true, label:"First Name",  name:"first_name", placeholder:"John", invalidMessage:"First Name can not be empty"},
		{ view:"text", clear:true, label:"Last Name", name:"last_name", placeholder:"Smith", invalidMessage:"Last Name can not be empty" },
		{ view:"text", clear:true, label:"Email", name:"email", placeholder:"johnsmith@gmail.com", invalidMessage:"Incorrect email address" },
		{ view:"counter", id:"tickets_counter", name:"tickets", label:"Tickets", min:1 },
		{ view:"checkbox", name:"baggage", label:"Checked-in Baggage", checkValue:15 },
		{ view:"checkbox", name:"food", label:"Food", checkValue:10 },
		{ view:"radio", name:"class", label:"Class",
			options:[
				{ id:1, value:"Economy" },
				{ id:2, value:"Business" }
			]
		},
		{
			cols:[
				{ view:"label", width:160, label:"Order price" },
				{ view:"label", id:"order_price"}
			]
		},
		{ margin:5, cols:[
			{ view:"button", value:"Go Back", click:goBack },
			{ view:"button", value:"Make Order", css:"webix_primary", click:makeOrder }
		]},
		{}
	],
	rules:{ // rules for validation
		first_name:webix.rules.isNotEmpty,
		last_name:webix.rules.isNotEmpty,
		email:webix.rules.isEmail
	},
	on:{
		onChange:function(){
			orderPrice(this.getValues());
		},
		onValues:function(){
			orderPrice(this.getValues());
		}
	}
}

function makeOrder(){
	const order_form = $$("flight_booking_form");
	if(order_form.validate()){
		webix.alert({
			title: "Order is successfull",
			text: "We will send you information to confirm the Order"
		}).then(function(){
			goBack();
		});
	}
}

function goBack(){
	const order_form = $$("flight_booking_form");
	const label = $$("label");

	order_form.clearValidation();

	label.define("label", "Flight Search");
	label.refresh();

	$$("flight_search").show();
}

function orderPrice(vals){
	const tickets = vals.tickets;
	const price = vals.price*1*vals.class*tickets;

	const baggage = vals.baggage * tickets;
	const food = vals.food * tickets;

	const total = price+baggage+food;

	$$("order_price").setValue(total+"$");
}
