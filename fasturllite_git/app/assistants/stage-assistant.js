function StageAssistant() {
	/* this is the creator function for your stage assistant object */
		
}

StageAssistant.prototype.setup = function() {

	appmenuAttr = {omitDefaultItems: true};
    appmenuModel = {
        visible: true,
        items: [ 
            Mojo.Menu.editItem,
            {label: "Other Cool Apps", command: 'do-othercool'},
            { label: "About", command: 'do-about' }
        ]
    };
	
	appmenuSubModel = {
		 visible: true,
        items: [ 
            Mojo.Menu.editItem,
            { label: "About", command: 'do-about' }
        ]
	}	

	this.controller.pushScene('welcome');
	
};

StageAssistant.prototype.handleCommand = function(event){

	var currentScene = Mojo.Controller.stageController.activeScene();
	
	this.appTitle = Object.toJSON(Mojo.appInfo.title);
	this.appVersion = Object.toJSON(Mojo.appInfo.version);
	this.appVendor = Object.toJSON(Mojo.appInfo.vendor);
	
	if (event.type === Mojo.Event.command) {
        switch (event.command) {
            case 'do-othercool':
            	this.controller.pushScene('othercool');
            
            case 'do-about':
            	currentScene.showAlertDialog({
			    onChoose: function(inValue){},
			    title: $L(this.appTitle),
			    message: $L("Version: " + this.appVersion + " by " + this.appVendor),
			    choices:[
			        {label: "Ok", value:""}    
			    	]
				});
				break;		
    	}
    }
};
