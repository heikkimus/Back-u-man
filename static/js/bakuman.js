var BakuRouter = Backbone.Router.extend({

    routes: {
        ""                  : "list",
        "user/:id"         : "userDetails",
        "user/new"         : "userDetails",
        "user/:id/delete"  : "userRemove",
    },

    initialize: function () {
       // this.headerView = new HeaderView();
       // $('.header').html(this.headerView.el);
    },

	list: function(page) {
        var uList = new UserCollection();
        uList.fetch({success: function(){
            $("#content").html(new UserListView({ model: uList }).el);
        }});
       // this.headerView.selectMenuItem('home-menu');
    },

	userDetails: function (id) {
	 	
	 	if(id == 'new')
	 	{
	 		var user = new User();
	 		$("#content").html(new UserView({model: user}).el);
	 	}
	 	else
	 	{
	 		utils.toggleLoader(null);
	 		var user = new User({id: id});
	 		user.fetch({success: function(){
	            $("#content").html(new UserView({model: user}).el);
	            utils.toggleLoader(null);
       		}});
	 	}
    },
    userRemove: function(id){
    	if ( confirm('Are you sure?') ){
    		utils.toggleLoader(null);
	    	var user = new User({id: id});
	    	
	 		user.fetch({success: function(delUser){
			 		delUser.destroy({
		            success: function () {
		                app.navigate('#', true);
		                window.location.reload();
		            }
		        });
	            utils.toggleLoader(null);
	   		}});
    	}
    	app.navigate('#', false, true);
    	return false;
    }

});


window.UserListView = Backbone.View.extend({
	tagName:"table",
	className:"table table-condensed",
    initialize: function () {
        this.render();
       
    },
    render: function () {
    	
        var users = this.model.models;
        var len = users.length;
        $(this.el).html('<a href="#user/new" title="Add new"><i class="icon-plus"></i></a><br/><br/>');
        for (var i = 0; i < len; i++) {
        	var view = new UserListItemView({model: users[i]})
            $(this.el).append(view.render().el);
        }
        return this;
    }
});

window.UserListItemView = Backbone.View.extend({

    tagName: "tr",
    className: "",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});


window.UserView = Backbone.View.extend({
	initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
       "change"        : "change",
       "click .save"   : "beforeSave",
       // "click .delete" : "deleteWine",
       // "drop #picture" : "dropHandler"
    },

    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        /*var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }*/
    },

    beforeSave: function () {
        var self = this;
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
        this.saveUser();
        //}
        return false;
    },

    saveUser: function () {
    	utils.toggleLoader(null);
        var self = this;
        this.model.save(null, {
            success: function (model) {
                //self.render();
                utils.toggleLoader(null);
                app.navigate('user/' + model.toJSON()._id, false, true);
                //utils.showAlert('Success!', 'Wine saved successfully', 'alert-success');
            },
            error: function () {
            	utils.toggleLoader(null);
                //utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteUser: function () {
        this.model.destroy({
            success: function () {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

});


utils.loadTemplate(['UserListItemView', 'UserView'], function() {
    app = new BakuRouter();
    Backbone.history.start();
});