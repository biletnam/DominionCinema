var armC;
var sofaR;
var sofS = 0;
var armS = 0;
var price = 0;
var tmp;
$(function() {
    $.ajax({
        url: 'a42580.json',
        //url: 'booking2.json',
        success: function(d) {
            tmp=d;
            armC = d.armchairRequire;
            sofaR = d.sofaRequired;
	    sofS = sofaR;
	    armS = armC;
            price = ((sofS*2)*d.pricing.L) + (armS*d.pricing.A);
            $('#price').text("Price: " + price);
            var now = new Date(d.date);
            $('#movie').text(d.title);
            $('#screen').append(d.screen);
            $('#runTime').append(d.runtime);
            $('#rating').append(d.rating);
            $('#date').text(now.toString('dddd, MMMM ,yyyy').substr(0, 15));
            $('#date').append(' @' + now.toString('dddd, MMMM ,yyyy').substr(15, 6));
            $('#picture').prepend($('<img>', {
                id: 'picture',
                src: d.image
            }));
            for (var i = 0; i < d.rowLabels.length; i++) {
                var tr = $('<tr/>')
                    .append($('<th/>', {
                        text: d.rowLabels[i]
                    }))
                    .appendTo('#theatreTab');
	        tr.append($('<td/>'));
                for (var x = 0; x < d.umap[i].length; x++) {
		    var ta = $('<td/>');
                    var z = d.tmap[i].charAt(x);
                    var torf = d.umap[i].charAt(x);
                    if (z === 'L')
                        ta.addClass('left-sofa');
                    if (z === 'R')
                        ta.addClass('right-sofa');
                    if (z === 'A')
                        ta.addClass('armchair');
                    if (torf === 'O')
                        ta.addClass('free');
                    if (torf === 'X')
                        ta.addClass('taken');
		      if (torf === 'M')
			   ta.addClass('selected');
                    ta.appendTo(tr);
                }
		   tr.append($('<td/>'));
                   tr.append($('<th/>', {
                        text: d.rowLabels[i]
                    }))
                    .appendTo('#theatreTab');	
            }
            if ($('.selected').length<1){i
                sofS = 0;
                armS = 0;
            }
        }
    });

    $('body').on('click', 'td', function() {
        if (($(this).hasClass('left-sofa') && $(this).hasClass('free') || $(this).hasClass('right-sofa') && $(this).hasClass('free')) && sofS < sofaR) {
            $(this).removeClass('free').addClass('selected');
            sofS += 0.5;
            price += tmp.pricing.L
        } else if ($(this).hasClass('left-sofa') && $(this).hasClass('selected') || $(this).hasClass('right-sofa') && $(this).hasClass('selected')) {
            $(this).removeClass('selected').addClass('free');
            sofS -= 0.5;
            price -= tmp.pricing.L;
        } 
	 else if (($(this).hasClass('armchair') && $(this).hasClass('free')) && armS < armC){
	     $(this).removeClass('free').addClass('selected');
	     armS += 1;
             price += tmp.pricing.A;
	 }
	 else if ($(this).hasClass('armchair') && $(this).hasClass('selected')){
	      $(this).removeClass('selected').addClass('free');
	      armS -= 1;
              price -= tmp.pricing.A;
        }
       if (sofS===sofaR && armS===armC){
          document.getElementById("btn1").disabled = false;
       }
       else{document.getElementById("btn1").disabled = true;} 
       $('#price').text("Price: " + price);
    });
});





//- Get rid of global variables, list seat selected.
//- add seat numbers
//- add handling for price of left and right sofa
//- change rating to picture?

