var sofS = 0;
var armS = 0;
var price = 0;
var tmp;
var selectedSeats = [];
var entireSS = true;
$(function() {
    $.ajax({
        url: 'a42580.json',
        //url: 'booking2.json',
        success: function(d) {
            tmp = d;
            sofS = tmp.sofaRequired;
            armS = tmp.armchairRequire;
            price = ((sofS * 2) * d.pricing.L) + (armS * d.pricing.A);
            try 
            {
                selectedSeats = [d.seatData[0][1], d.seatData[1][1], d.seatData[2][1]];
            } 
            catch (err) 
            {
                sofS = 0;
                armS = 0;
                price = 0;
            }

            //Initialise button on start up, if seats pre-selected in JSON enable, else, disable
            if (sofS === tmp.sofaRequired && armS === tmp.armchairRequire && entireSS) 
                document.getElementById("btn1").disabled = false;
            else 
                document.getElementById("btn1").disabled = true;
            

            //Poppulate labels with variables after formatting
            $('#price').text("Price: " + String.fromCharCode('163') + price.toFixed(2));
            $('#ss').text("Selected Seats: " + selectedSeats.join(', '));
            $('#sofasselected').text("Sofas: " + sofS);
            $('#armselected').text("Armchairs: " + armS);
            $('#movie').text(d.title);
            $('#screen').append(d.screen);
            $('#runTime').append(d.runtime);
            $('#rating').append(d.rating);
            $('#date').append(formatDate(new Date(d.date)));
            $('#picture').prepend($('<img>', {
                id: 'picture',
                src: d.image
            }));

            //loop through rows, then seats using nested loops
            for (var i = 0; i < d.rowLabels.length; i++) {
                var tr = $('<tr/>')
                    .append($('<th/>', {
                        text: d.rowLabels[i]
                    }))
                    .appendTo('#theatreTab');
                tr.append($('<td/>'));
                var sn = 1;
                for (var x = 0; x < d.umap[i].length; x++) {
                    //add classes to td's and set color/state through CSS classes
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
                    if (torf != ' ') {
                        ta.text(sn);
                        ta.addClass('seat' + d.rowLabels[i] + '-' + sn);
                        sn += 1;
                    }
                    ta.appendTo(tr);
                }
                tr.append($('<td/>'));
                tr.append($('<th/>', {
                        text: d.rowLabels[i]
                    }))
                    .appendTo('#theatreTab');
            }
        }
    });
    //onclick of table containing seats
    $('body').on('click', 'td', function() {
        var count = 0;
        var indexof = 100;
        for (var iN in $(this).attr('class').split(' ')) 
        {
            if ($(this).attr('class').split(' ')[iN].includes('seat')) 
                indexof = count;
            count++
        }
        var index = selectedSeats.indexOf(($(this).attr('class').split(' ')[indexof].substring(4)));
        //toggles state of seats depending on their current class
        if (($(this).hasClass('left-sofa') && $(this).hasClass('free') || $(this).hasClass('right-sofa') && $(this).hasClass('free')) && sofS < tmp.sofaRequired) 
        {
            $(this).removeClass('free').addClass('selected');
            sofS += 0.5;
            price += tmp.pricing.L;
            selectedSeats.push($(this).attr('class').split(' ')[1].substring(4, 9)); //add to selected seats list div
        } 

        else if ($(this).hasClass('left-sofa') && $(this).hasClass('selected') || $(this).hasClass('right-sofa') && $(this).hasClass('selected'))
        {
            $(this).removeClass('selected').addClass('free');
            sofS -= 0.5;
            price -= tmp.pricing.L;
            selectedSeats.splice(index, 1);
        } 

        else if (($(this).hasClass('armchair') && $(this).hasClass('free')) && armS < tmp.armchairRequire) 
        {
            $(this).removeClass('free').addClass('selected');
            armS += 1;
            price += tmp.pricing.A;
            selectedSeats.push($(this).attr('class').split(' ')[1].substring(4, 9));
        } 

        else if ($(this).hasClass('armchair') && $(this).hasClass('selected')) 
        {
            $(this).removeClass('selected').addClass('free');
            armS -= 1;
            price -= tmp.pricing.A;
            selectedSeats.splice(index, 1);
        }

        if (($(this).hasClass('right-sofa') || $(this).hasClass('left-sofa')) && $(this).hasClass('selected'))
        {
            entireSS = true;
            if ($(this).hasClass('right-sofa') && !$(this).prev().hasClass('selected')) 
                entireSS = false;
             
            else if ($(this).hasClass('left-sofa') && !$(this).next().hasClass('selected')) 
                entireSS = false;
        }

        //button handling
        if (sofS === tmp.sofaRequired && armS === tmp.armchairRequire && entireSS) 
            document.getElementById("btn1").disabled = false;
        else 
            document.getElementById("btn1").disabled = true;
        
        //update pricing, seat selection etc following new events
        $('#ss').text("Selected Seats: " + selectedSeats.join(', '));
        $('#price').text("Price: " + String.fromCharCode('163') + price.toFixed(2));
        $('#sofasselected').text("Sofas: " + sofS);
        $('#armselected').text("Armchairs: " + armS);
    });
	
    function formatDate(now){
        var datstr = "";
        datstr += now.toString().substr(0, 3);
        datstr += now.toString().substr(7, 4);
        datstr += now.toString().substr(4, 4);
        datstr += now.toString().substr(11, 4) + ' @' + now.toString().substr(15, 6);
        return datstr;
    }
});


