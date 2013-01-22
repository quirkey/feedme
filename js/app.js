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
    $feed_button
      .attr('disabled', 'disabled')
      .addClass('feeding')
      .text('FEEDING');
  });

  socket.on('done-feeding', function() {
    isFeeding = false;
    $feed_button
      .removeAttr('disabled')
      .removeClass('feeding')
      .text('FEED');
  });

  function cameraRefresh($camera, rate) {
    $camera.on('load', function() {
      setTimeout(function() {
        cameraRefresh($camera, rate);
      }, rate);
    });
    $camera.attr('src', function(i, current) {
      return current.replace(/\?\d+/, '') + '?' + (new Date()).getTime();
    });
  }
  cameraRefresh($('#camera'), 1000);
});
