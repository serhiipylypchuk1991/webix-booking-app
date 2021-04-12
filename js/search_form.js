const cities_data = new webix.DataCollection({
	url:"./data/cities.json"
});

const search_form = {
	view:"form",
	id:"search_form",
	width:370,
	elements:[
		{
			view:"radio",
			label:"Trip",
			name:"trip_type",
			value:1,
			options:[
				{ id:1, value:"One-Way" },
				{ id:2, value:"Return" }
			],
			on:{
				onChange:function(newv){
					if(newv == 2){
						$$("return_date").show();
					}else{
						$$("return_date").hide();
					}
				}
			}
		},
		{
			view:"combo",
			id:"from",
			clear:"replace",
			name:"from_city",
			label:"From",
			placeholder:"Select departure point",
			options:cities_data,
			on:{
				onShow:function(v){
					filterOptions("from","to");
				}
			}
		},
		{
			view:"combo",
			id:"to",
			clear:"replace",
			name:"to_city",
			label:"To",
			placeholder:"Select destination",
			options:cities_data,
			on:{
				onShow:function(v){
					filterOptions("to", "from");
				}
			}
		},
		{
			view:"datepicker",
			clear:"replace",
			name:"departure_date",
			label:"Departure",
			placeholder:"Select departure date",
			format:"%d %M %Y"
		},
		{
			view:"datepicker",
			clear:"replace",
			id:"return_date",
			name:"return_date",
			label:"Return",
			placeholder:"Select return date",
			format:"%d %M %Y",
			hidden:true
		},
		{ view:"counter", name:"tickets", label:"Tickets", min:1 },
		{
			margin:10,
			cols:[
				{	view:"button", value:"Reset", click:resetForm },
				{	view:"button", value:"Search", css:"webix_primary", click:lookForFlights }
			]
		},
		{}
	]
}

function filterOptions(first_id, second_id){
	const options = $$(first_id).getList();
	const exception = $$(second_id).getValue();
	options.filter(obj => obj.id != exception);
}

function resetForm(){
	const form = $$("search_form");
	form.clear();
	form.setValues({trip_type:1});
	$$("flight_table").filter(); // unfilter datatable
}

function lookForFlights(){
	const vals = $$("search_form").getValues(); // get object with values
	const table = $$("flight_table");

	table.filter(function(obj){
		if(
			(!vals.from_city || obj.from == vals.from_city) &&
			(!vals.to_city || obj.to == vals.to_city) &&
			(!vals.departure_date || obj.date >= vals.departure_date) &&
			vals.tickets <= obj.places
		)
		return true;
		if(vals.trip_type == 2 &&
			(!vals.to_city || obj.from == vals.to_city) &&
			(!vals.from_city || obj.to == vals.from_city) &&
			(!vals.return_date || obj.date <= vals.return_date) &&
			(!vals.departure_date || obj.date >= vals.departure_date) &&
			vals.tickets <= obj.places
		)
		return true;
		return false;
	});
}
