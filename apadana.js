// Global killswitch
if (Drupal.jsEnabled) {
  $(document).ready(apadanaAutoAttach);
}

//  I have NO idea what this does, but it looks good!  & I'm sure we can use it.
function apadanaAutoAttach() {
  var span = $("<span></span>");
  span.attr("id", "SNData");
  span.css('top', '0');
  span.css('left', '0');
  span.css('color', '#000000');
  span.css('background', 'silver');
  span.css('zIndex', '999');
  span.css('textAlign', 'left');
  span.css('position', 'absolute');
  span.hide();

	for (i=0; i<6; i++) {
 		var img = $('<img class=vset />');
		img.attr("id", "vsetimg"+i);
		img.css('cursor', 'pointer');
		span.append(img);
	}
	var bibleimgurl = Drupal.settings.bibleimgurl;
	var chapverse;

  span.append($('<div id=sntext />'));
  $('body').append(span);
  var baseurl = window.location.href.substr(0, window.location.href.lastIndexOf('bible'));
  var ajaxobj;

  $("span.biblesn a")
    .mouseover(function(E) {
      var dat = ($(this).attr("href")).split('/');
      var SN = dat[dat.length-1];
      if (this.SN==SN) return;
      this.SN = SN;

      for (i=0; i<6; i++) {
	  		$("#vsetimg"+i).hide();
      }
		  span.width(300);
		  span.height(200);
      $('#sntext').html("Wait...["+SN+"]");
      span.css('left', $(this).offset().left + $(this).width());
      span.css('top', $(this).offset().top);
      span.show();
      ajaxobj = $.ajax({
        type: "GET",
        url: baseurl+"/bible/snajax/"+SN,
        success: function (data) {
          // Parse back result
          if (data=='""') { span.html('No Data of ['+SN+']'); return; }
          data = data.substring(1, data.length-2);
          lines = data.split('|');
          var HTMLStr = '';
          for (i=0; i<lines.length; i++)
          	HTMLStr += lines[i]+"<br/>";
      		$('#sntext').html(HTMLStr);
      		$("#sntext").show();
        },
        error: function (xmlhttp) {
          alert('An HTTP error '+ xmlhttp.status +' occured.\n');
        }
      });
      return false;
    })
    .mouseout(function() {
      span.hide();
      this.SN = "";
      ajaxobj.abort();
    });

  $("span.chap-verse")
    .mouseover(function(E) {
    	chapverse = $(this);
    	var alink = $(this).children("verse");

      $("#sntext").hide();
		  span.width(16*6);
		  span.height(16);
      var vsetpara = $(this).attr("vset");
      for (i=0; i<6; i++) {
	  		var imgsrc = bibleimgurl+ 'vset_'+i;
     		if (vsetpara.substr(i,1)=='1') imgsrc += '_dis';
     		imgsrc += '.gif';
				$("#vsetimg"+i).css('top', 0);
				$("#vsetimg"+i).attr("src", imgsrc);
	  		$("#vsetimg"+i).show();
      }
      span.css('left', alink.offset().left + alink.width());
      span.css('top', alink.offset().top);
      span.show();
    })
    .mouseout(function() {
      span.hide();
    });
 
  $("#SNData")
    .mouseover(function(E) {
    	span.show();
    })
    .mouseout(function() {
    	span.hide();
    });

  $("img.vset")
    .click(function(E) {
    	span.show();
      var dat = (chapverse.children("verse").attr("para")).split('/');
      var bls = dat[dat.length-1];
      var bid = dat[dat.length-2];
      var vsetno = E.target.id.substr(E.target.id.length-1,1);
      $.ajax({
        type: "GET",
        url: baseurl+"/bible/vset/ajax/"+bls+"/"+vsetno,
        success: function (data) {
        	data = data.replace(/"/g, '');
        	chapverse.attr("vset", data);
    			chapverse.children("span").empty();
        	var HTMLStr = '';
        	for (i=0; i<data.length; i++) {
        		if (data.substr(i,1)=='1') {
        			HTMLStr += '<img src='+ bibleimgurl+ 'vset_'+ i+ '.gif />';
        		}
        	}
        	chapverse.children("span").html(HTMLStr);
        	// refresh span
		      for (i=0; i<6; i++) {
			  		var imgsrc = bibleimgurl+ 'vset_'+i;
		     		if (data.substr(i,1)=='1') imgsrc += '_dis';
		     		imgsrc += '.gif';
						$("#vsetimg"+i).css('top', 0);
						$("#vsetimg"+i).attr("src", imgsrc);
			  		$("#vsetimg"+i).show();
		      }
        },
        error: function (xmlhttp) {
          alert('An HTTP error '+ xmlhttp.status +' occured.\n');
        }
      });
      return false;
    })
    .mouseout(function() {
    	span.hide();
    });

	$("span.vref")
		.hover(function(E) {
		  span.width(200);
		  span.height(100);
      span.css('left', $(this).offset().left + $(this).width() + 5);
      span.css('top', $(this).offset().top);
    	span.show();
      ajaxobj = $.ajax({
        type: "GET",
        url: baseurl+"/bible/ajax/vcontent/"+E.target.id,
        success: function (data) {
        	data = data.replace(/"/g, '');
      		span.html(data);
      		span.show();
        },
        error: function (xmlhttp) {
          alert('An HTTP error '+ xmlhttp.status +' occured.\n');
        }
      });
      return false;
		},
		function() {
    	span.hide();
    	span.html('');
		});
	$("input.selectall")
		.click(function() {
			var chk = $(this).attr("checked");
			$("input.mr_check").each(function() {
				this.checked = chk;
			})
		});
}
