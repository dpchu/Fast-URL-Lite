function OthercoolAssistant() {

	this.items = []; 
	this.url = 'http://d136ozarjsjv4f.cloudfront.net/guy-labs_othercool.xml';
}

OthercoolAssistant.prototype.setup = function() {
	
	this.spinAttr = {
		spinnerSize: "large",
		
	};
	
	this.spinModel = {
		spinning: true,
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, appmenuAttr, appmenuSubModel);
	this.controller.setupWidget("theSpinner", this.spinAttr,  this.spinModel);
	
	this.guylistAttr = {
		itemTemplate: 'othercool/guylistentry',
		listTemplate: 'othercool/guylistcontainer',
		swipeToDelete: false,
		reorderable: false
	};
	
	this.guylistModel = {items:[]};
	
	this.controller.setupWidget(Mojo.Menu.appMenu, appmenuAttr, appmenuSubModel);
	
	this.controller.setupWidget("guylist", this.guylistAttr, this.guylistModel);
	
	this.guyAjaxCall(event);
	
	
};
OthercoolAssistant.prototype.guyAjaxCall = function(event){
	if (Mojo.Host.current === Mojo.Host.mojoHost) {
		// same original policy means we need to use the proxy on mojo-host
		this.url = '/proxy?url=' + encodeURIComponent(this.url);
	}
	
	var request = new Ajax.Request(this.url, 
		{
		method: 'get',
		evalJSON: 'false',
		onCreate: function(){Mojo.Log.info("onGuyCreated.")},
		onLoading: function(){Mojo.Log.info("onGuyLoading.")},
		onLoaded: function(){Mojo.Log.info("onGuyLoaded.")},
		onSuccess: function(){Mojo.Log.info("onGuySuccessed.")},
		onComplete: this.guyCallWin.bind(this),
		onFailure: function(){Mojo.Log.info("onGuyFailed.")},
		}
	);
};

OthercoolAssistant.prototype.guyCallWin = function(transport){

	guyMoreList = [];

	var guyxml = transport.responseText;
	
	Mojo.Log.info("****** The XML string has loaded " + this.url);
	
	var guynodes = transport.responseXML.getElementsByTagName('item');
	
	for(j = 0; j < guynodes.length; j++){
		
		var atitle = guynodes[j].childNodes[1].firstChild.nodeValue;
		var aversion = guynodes[j].childNodes[3].firstChild.nodeValue;
		var alink = guynodes[j].childNodes[5].firstChild.nodeValue;
		var adesc = guynodes[j].childNodes[7].firstChild.nodeValue;
		var aimage = guynodes[j].childNodes[9].firstChild.nodeValue;

		
		adesc = adesc.substr(0,140);
		
		var daslist = {title : atitle, version : aversion, link : alink, desc : adesc, image : aimage};
		
		myguylist = Object.toJSON(daslist);
		
		guyMoreList[j] = daslist;
	}
	
	this.guyNewModel = {
		items : guyMoreList
	};

	this.controller.setWidgetModel("guylist", this.guyNewModel);
	
	this.controller.get("theSpinner").mojo.stop();
};
OthercoolAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

OthercoolAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

OthercoolAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
};
