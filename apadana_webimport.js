//This is useful to us if we want to enable web importing of Bibles - I think!
if (Drupal.jsEnabled) {
  	$(document).ready(function() {
	    $('#progress').each(function () {
	      var holder = this;
				var url = Drupal.settings.apadanaurl;
				var para = Drupal.settings.apadanapara;
				var inimsg = Drupal.settings.apadanaimsg;
				var errmsg = Drupal.settings.apadanaemsg;
				
	      // Success: redirect to the summary.
	      var updateCallback = function (progress, status, pb) {
	        if (progress == 100) {
	          pb.stopMonitoring();
	          window.location = url;
	        }
	      }
	
	      // Failure: point out error message and provide link to the summary.
	      var errorCallback = function (pb) {
	        var div = document.createElement('p');
	        div.className = 'error';
	        $(div).html(errmsg);
	        $(holder).prepend(div);
	        $('#wait').hide();
	      }
	
	      var progress = new Drupal.progressBar('updateprogress', updateCallback, "POST", errorCallback);
	      progress.setProgress(-1, inimsg);
	      $(holder).append(progress.element);
	      progress.startMonitoring(url + para + "&op=update", 0);
	    });
 	});
}
