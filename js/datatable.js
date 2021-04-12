const flights_data = "./data/flights_data.json";

const flight_table = {
	id:"flight_table",
	view:"datatable",
	scheme:{
		$init:function(obj){
			obj.date = webix.Date.strToDate("%Y-%m-%d")(obj.date);
		}
	},
	select:true,
	columns:[
		{ id:"id", header:"#", width:40, sort:"int" },
		{ id:"no", header:"Number", sort:"string" },
		{ id:"from", header:"From", sort:"string", collection:cities_data },
		{ id:"to", header:"To", sort:"string", collection:cities_data },
		{ id:"date", header:"Date", width:130, sort:"date", format:webix.i18n.longDateFormatStr },
		{ id:"price", header:"Price", format:webix.i18n.priceFormat, sort:"int" },
		{ id:"save", header:"Save", format:webix.i18n.priceFormat, sort:"int" },
		{ id:"places", header:"Places", sort:"int" },
		{ id:"depart", header:"Depart" },
		{ id:"arrive", header:"Arrive", fillspace:true },
		{ header:"", width:110, css:"webix_primary", template:"<button class='webix_button book'>Book</button>" }
	],
	onClick:{
		"webix_button":function(e,id){
			bookFlight(id);
		}
	},
	url:flights_data
}

const search_bar = {
	view:"search",
	id:"search",
	inputWidth:400,
	placeholder:"Type the city name or flight number...",
	clear:"replace",
	on:{
		onTimedKeyPress:function(){ // when you type some text
			searchFlight();
		},
		onChange:function(){ // when you click on the clear button
			if(!this.getValue()){
				$$("flight_table").clearCss("marker");
			}
		}
	}
}

function searchFlight(){
	const value = $$("search").getValue().toLowerCase();
	const table = $$("flight_table");
	const res = table.find(function(obj){
		return value && (
			cities_data.getItem(obj.from)["value"].toLowerCase().indexOf(value) != -1 ||
			cities_data.getItem(obj.to)["value"].toLowerCase().indexOf(value) != -1 ||
			obj.no.toLowerCase().indexOf(value) != -1
		)
	});

	table.clearCss("marker", true);
	for(let i = 0; i < res.length; i++){
		table.addCss(res[i].id, "marker", true);
	}
	table.refresh();
}

function bookFlight(id){
	const flight_table = $$("flight_table");
	const required_tickets = $$("search_form").getValues().tickets;
	const available_places = flight_table.getItem(id).places;

	$$("tickets_counter").define("max", available_places);

	$$("flight_booking_form").setValues({
		tickets: Math.min(required_tickets,available_places),
		// hidden input
		price:flight_table.getItem(id).price,
		// economy by default
		class:1
	});

	$$("flight_booking").show();
	$$("label").define("label", "Flight Booking");
	$$("label").refresh();
}
