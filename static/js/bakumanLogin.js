var BakuLogin = Backbone.Router.extend({

    routes: {
        ""                  : "login",
    },

    initialize: function () {
    },

	login: function(page) {
        var user = new User();
        $("#content").html(new LoginView({model:user}).el);
    },

});


window.LoginView = Backbone.View.extend({
	initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
        
    },
    events: {
       //"change"        : "beforeSave",
       "submit #login-form"   : "beforeSave",
       // "click .delete" : "deleteWine",
       // "drop #picture" : "dropHandler"
    },

    beforeSave: function (event) {
        event.preventDefault();
        var self = this;
        var username = $("input[name='name']", event.target).val()
        var password = $("input[name='psw']", event.target).val()
        var u  = new User({username: username, psw: password})
        $.post('api/login', {username: username, password: password}, function(res){
        	if(res === '1')
        	{
        		window.location.href = "/";
        	}
        	else{
        		//TODO notify
        	}
        });
        
        //var check = this.model.validateAll();
        /*if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }*/
        // Upload picture file if a new file was dropped in the drop area
       /* if (this.pictureFile) {
            this.model.set("picture", this.pictureFile.name);
            utils.uploadFile(this.pictureFile,
                function () {
                    self.saveWine();
                }
            );
        } else {*/
        //this.saveUser();
        //}
        return false;
    },

});


utils.loadTemplate(['LoginView'], function() {
    app = new BakuLogin();
    Backbone.history.start();
});