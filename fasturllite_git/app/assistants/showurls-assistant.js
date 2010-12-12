function ShowurlsAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
	   
	   
	   
	   this.db = openDatabase("fasturl", 1, "fast url");
	   
	   var sql = "SELECT * FROM myfasturl; GO;";
	   
	   this.db.transaction(function(transaction){
			transaction.executeSql(sql, [],
			this.successHandler.bind(this),
			this.failureHandler.bind(this));
		}.bind(this));
		Mojo.Log.info('showurls asst activated.');
		
		
		
}

ShowurlsAssistant.prototype.setup = function() {

	
	this.controller.setupWidget(Mojo.Menu.appMenu, appmenuAttr, appmenuModel);
	
	
	listItems = [];
	
	this.listAttributes = {
		itemTemplate: "showurls/listitem",
		listTemplate: "showurls/listcontainer",
		swipeToDelete: true,
		reorderable: false,
		autoconfirmDelete: false,
	};
	this.listModel = {
		items: listItems
	};
	
	
	this.controller.setupWidget("list", this.listAttributes, this.listModel);
	this.controller.listen("list", Mojo.Event.listDelete, this.listDelete.bindAsEventListener(this));
	this.controller.listen("list", Mojo.Event.listTap, this.handleButtonPress.bindAsEventListener(this));
	
	//widget setup for 'send to email' button
	
	this.allemailModel = {
		"label" : "Export JSON to Email",
		"buttonClass" : "",
		"disabled" : false
		
	};
	
	this.controller.setupWidget("sendEmailButton", {}, this.allemailModel);
	
	this.controller.listen("sendEmailButton", Mojo.Event.tap, this.allemail.bindAsEventListener(this));
	
};

ShowurlsAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

ShowurlsAssistant.prototype.successHandler = function(transaction, SQLResultSet){
	
	listItems = [];
	
	for(i=0; i < SQLResultSet.rows.length; i++){
		
		var mynum = SQLResultSet.rows.item(i).link;
		
		Mojo.Log.info('extract... ' + mynum);
		
		var infoOut = {link : mynum};
		listItems[i] = infoOut;
	}
	
	this.newModel = {
		items: listItems
	};
	
	this.controller.setWidgetModel( "list", this.newModel );
};

ShowurlsAssistant.prototype.allemail = function(event){
	
	Mojo.Log.info("List length is " + this.newModel.items.length);
	
	var jsonified = Object.toJSON(this.newModel);
		
	Mojo.Log.info("jsonified: " + jsonified);

	this.controller.serviceRequest(
	    "palm://com.palm.applicationManager", {
	        method: 'open',
	        parameters: {
	            id: "com.palm.app.email",
	            params: {
	                summary: "Fast URL data",
	                text: jsonified,
	                recipients: [{
	                    type:"email",
	                    role:1,
	                    value:"address@email.com ",
	                    contactDisplay:"Your name"
	                }]
	            }
	        }
	    }
	);
};


ShowurlsAssistant.prototype.listDelete = function(event){
	
	var sql = "DELETE FROM myfasturl WHERE link='" + event.item.link + "';";
	
	this.db.transaction(function(transaction){
			transaction.executeSql(sql, [],
			this.successHandlerTwo.bind(this),
			this.failureHandler.bind(this));
		}.bind(this));
		Mojo.Log.info(sql + " completed.");
		
};
ShowurlsAssistant.prototype.handleButtonPress = function(event){
	Mojo.Log.info("this should be... " + event.item.link);
	this.controller.serviceRequest("palm://com.palm.applicationManager", {
  		method: "open",
  		parameters:  {
      		id: 'com.palm.app.browser',
      		params: {
        	  target: event.item.link
      		}
  		}
	});
}
ShowurlsAssistant.prototype.successHandlerTwo = function(transaction){

	this.controller.modelChanged(this.listModel);
};
ShowurlsAssistant.prototype.failureHandler = function(transaction, error){
	Mojo.Log.Error('An error occurred', error.message);
};

ShowurlsAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

ShowurlsAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	   Mojo.Event.stopListening(this.controller.get("list"), Mojo.Event.listDelete, this.listDelete);
	   Mojo.Event.stopListening(this.controller.get("list"), Mojo.Event.listTap, this.handleButtonPress);
	   Mojo.Event.stopListening(this.controller.get("sendEmailButton"), Mojo.Event.tap, this.allemail);
};
