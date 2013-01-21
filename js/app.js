/*global io:true */
var socket = io.connect();

jQuery(function($) {
  var $feed_button = $('#feed-button');

  var isFeeding = false;

  $feed_button.click(function(e) {
    e.preventDefault();
    if (!isFeeding) {
      console.log("FEED CLICKED");
      socket.emit('feed');
    }
  });

  socket.on('feeding', function() {
    isFeeding = true;
    $feed_button.addClass('feeding').text('FEEDING');
  });

  socket.on('done-feeding', function() {
    isFeeding = false;
    $feed_button.removeClass('feeding').text('FEED');
  });

});
