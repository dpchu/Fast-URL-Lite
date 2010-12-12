function WelcomeAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */

		this.db = openDatabase("fasturl", 1, "fast url");

		this.db.transaction(function(transaction){
			transaction.executeSql('CREATE TABLE IF NOT EXISTS myfasturl (link TEXT); GO;', [], this.successHandler.bind(this), this.failureHandler.bind(this));
		}.bind(this));
		Mojo.Log.info("link table successfully created.");
		
}

WelcomeAssistant.prototype.setup = function() {

	this.controller.setupWidget(Mojo.Menu.appMenu, appmenuAttr, appmenuModel);


	this.controller.setupWidget("prefixId", 
		this.prefixAttributes = {
			hintText: $L("  enter a prefix"),
			multiline: true,
			enterSubmits: false,
			textCase: Mojo.Widget.steModeLowerCase,
		},
		this.prefixModel = {
			value: "www",
			disabled: false
		}
	);
	
	this.controller.setupWidget("suffixId",
		this.suffixAttributes ={ 
		label: "Suffix", 
		choices: [
				{label: "com", value: "com"},
				{label: "net", value: "net"},
				{label: "org", value: "org"},
				{label: "edu", value: "edu"},
				{label: "ac", value: "ac"},
				{label: "gov", value: "gov"},
				{label: "biz", value: "biz"},
				{label: "info", value: "info"},
				{label: "co.uk", value: "co.uk"},
				{label: "co.kr", value: "co.kr"}
			]},
		this.suffixModel = {
			value: "com",
			disabled: false,
		});
	this.controller.setupWidget("domainId",
        this.domainAttributes = {
            hintText: $L("  enter the domain"),
            multiline: false,
            enterSubmits: false,
            autoFocus: true,
            textCase: Mojo.Widget.steModeLowerCase,
         },
         this.domainModel = {
             value: "",
             disabled: false
         }
    );
	this.controller.setupWidget("submitButton", {},
		this.model = {
			"label" : "Submit",
			"buttonClass" : "",
			"disabled" : false,
		}
	);
	
	this.controller.setupWidget("showurlsButton", {},
		this.model = {
			"label" : "View URLs",
			"buttonClass" : "",
			"disabled" : false,
		}
	);
	
	
	Mojo.Event.listen(this.controller.get("submitButton"), Mojo.Event.tap, this.Whoopee.bindAsEventListener(this));
	Mojo.Event.listen(this.controller.get("showurlsButton"), Mojo.Event.tap, this.showurls.bind(this));
	Mojo.Event.listen(this.controller.get("prefixId"), Mojo.Event.propertyChange, this.listresult.bind(this));
	Mojo.Event.listen(this.controller.get("suffixId"), Mojo.Event.propertyChange, this.listresult.bind(this));
	Mojo.Event.listen(this.controller.get("domainId"), Mojo.Event.propertyChange, this.listresult.bind(this));
};

WelcomeAssistant.prototype.Whoopee = function(event){
	
	//puts the url together
	var fullurl = this.prefixModel.value + "." + this.domainModel.value + "." + this.suffixModel.value;

	this.controller.showAlertDialog({
     onChoose: function(value) {
     	if(value === "yes"){
     		Mojo.Log.info("Virtual insert of " + fullurl);
			//inserts url into db
			this.db.transaction(function(transaction){
			transaction.executeSql('INSERT INTO myfasturl (link) values ("' + fullurl + '"); GO;', [], this.successHandler.bind(this), this.failureHandler.bind(this));
			}.bind(this));
     	}  	
     },
     title: $L(fullurl),
     message: $L("Save URL?"),
     choices:[
          {label:$L('Yes'), value: "yes"},  
          {label:$L('No'), value:"no"} 
     ]
     });	 	
};

WelcomeAssistant.prototype.showurls = function(event){
	this.controller.stageController.pushScene("showurls");
};
WelcomeAssistant.prototype.listresult = function(event){
	Mojo.Log.info("something has awakened from the deep.");
};

WelcomeAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */

};
WelcomeAssistant.prototype.successHandler = function(transaction, SQLResultSet){
	Mojo.Log.info('great success!');
};

WelcomeAssistant.prototype.failureHandler = function(transaction, error){
	Mojo.Log.Error('An error occurred', error.message);
};

WelcomeAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

WelcomeAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
	   
	Mojo.Event.stopListening(this.controller.get("submitButton"), Mojo.Event.tap, this.Whoopee);
	Mojo.Event.stopListening(this.controller.get("showurlsButton"), Mojo.Event.tap, this.showurls);
	Mojo.Event.stopListening(this.controller.get("prefixId"), Mojo.Event.propertyChange, this.listresult);
	Mojo.Event.stopListening(this.controller.get("submitButton"), Mojo.Event.propertyChange, this.listresult);
	Mojo.Event.stopListening(this.controller.get("suffixId"), Mojo.Event.propertyChange, this.listresult);
};
