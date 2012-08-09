var BakuRouter = Backbone.Router.extend({

    routes: {
        ""                  : "list",
        "user/:id"         : "userDetails",
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
        var user = new User({id: id});
        
        user.fetch({success: function(){
        	console.log(user)
            $("#content").html(new UserView({model: user}).el);
        }});
    },
   /* wineDetails: function (id) {
        var wine = new Wine({id: id});
        wine.fetch({success: function(){
            $("#content").html(new WineView({model: wine}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addWine: function() {
        var wine = new Wine();
        $('#content').html(new WineView({model: wine}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }*/

});


window.UserListView = Backbone.View.extend({
	tagName:"table",
	
    initialize: function () {
        this.render();
    },
    render: function () {
    	
        var users = this.model.models;
        var len = users.length;
        $(this.el).html('');
        for (var i = 0; i < len; i++) {
        	var view = new UserListItemView({model: users[i]})
            $(this.el).append(view.render().el);
        }
        return this;
    }
});

window.UserListItemView = Backbone.View.extend({

    tagName: "tr",
    className: "span3",

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
    	console.log(this.model.toJSON());
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
    events: {
       //"change"        : "change",
       // "click .save"   : "beforeSave",
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
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        // Upload picture file if a new file was dropped in the drop area
        if (this.pictureFile) {
            this.model.set("picture", this.pictureFile.name);
            utils.uploadFile(this.pictureFile,
                function () {
                    self.saveWine();
                }
            );
        } else {
            this.saveWine();
        }
        return false;
    },

    saveUser: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('wines/' + model.id, false);
                utils.showAlert('Success!', 'Wine saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
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