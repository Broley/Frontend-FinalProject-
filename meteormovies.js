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
  },
  editText: function(post){
    Posts.update(this.text, {
      $set: this._id, text
    });
  }
});

if (Meteor.isClient) {
   Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
   Template.body.rendered = function() {
  $(".editbox").hide();
}

  Template.body.helpers({
    posts: function () {
      return Posts.find({}, { sort: { createdAt: -1 }, limit: 15});
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
      }
    },
//testing post editing
    'submit #post-edit': function(event) {
      event.preventDefault();
    
        Meteor.call('createPost',  event.target.text.value);
        event.target.text.value='';
        $(".editbox").hide();
    }
  });

  Template.post.events({
    'click .delete-post': function(event) {
      //only delete if user this.userId matches Meteor.user()._id
      Meteor.call('deletePost', this._id); 
    },
    'click .edit-post': function(event) {
      /*console.log('hello');
      console.log(this._id);
      console.log(this.text);*/
     
      $("#editPostText").val(this.text);
       $(".editbox").show();
      Meteor.call('deletePost', this._id);


    }
  });

}

if (Meteor.isServer) {

  Meteor.methods({
addMessage: function(messageData){
  //Check if the user is logged in
  if(!Meteor.userId()){
    throw new Meteor.Error("not-authorized");
  }
  //Message needs it have content
  if(!messageData.content){
    throw new Meteor.Error('invalid')
  }

}
  });




  Meteor.startup(function () {
    // code to run on server at startup

  });
}



