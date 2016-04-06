Posts = new Mongo.Collection('posts');

Meteor.methods({
  createPost: function(text) {
    if (!Meteor.userId())
     throw new Meteor.Error('not-authorized');

    Posts.insert({
      text: text,
      createdAt: new Date(),
      userId: Meteor.user()._id
    });
  },
  deletePost: function(postId) {
    //todo check  the user
    Posts.remove(postId);
  }
});

if (Meteor.isClient) {
   Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.helpers({
    posts: function () {
      return Posts.find({}, {
        sort: { createdAt: -1 }
      });
    }
  });

  Template.post.helpers({
    time: function() {
      return moment(this.createdAt).fromNow();
    },
    username: function() {
      return Meteor.users.findOne(this.userId).username;
    },
  isMyPost: function() {
 //return true if this.userId matches Meteor.user()._id
 return Meteor.user() && Meteor.user()._id === this.userId;
    }
  });

 /*removed 
  Template.post.events({
    "click .delete-post": function(event) {
      Posts.remove(this._id);
    }
  });
  */

  Template.body.events({
    'submit .new-post': function(event) {
      event.preventDefault(); 

      if (event.target.text.value ==" ") {
        alert('Post must have content.');
      } else {
           Meteor.call('createPost', event.target.text.value);
      event.target.text.value = " ";
       /* Posts.insert({
          text: event.target.text.value,
          createdAt: new Date(),
          userId: Meteor.user()._id
        });*/
      }s
    }
  });

  Template.post.events({
    'click .delete-post': function(event) {
      //only delete if user this.userId matches Meteor.user()._id
      Meteor.call('deletePost', this._id); 
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}