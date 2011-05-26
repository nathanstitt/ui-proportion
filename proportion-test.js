
$(document).ready(function(){

        $(document).ready(function(){
                function round10th( num ){
                        return Math.round( 10 *  num ) / 10;
                };
                var make_slider = function(){
                        return $('#slider').proportion({
                                max: 442.32,
                                labels: [
                                        { name: 'One', value: 100 }
                                ]
                        });
                };

                test("has a slider", function() {
                        var el=make_slider();
                        ok( el.hasClass('ui-slider'), "initialized a slider" );
                });
                test("Can be destroyed", function() {
                        var el=make_slider();
                        equals( $('.ui-slider').length, 1, 'created a single slider' );

                        $('#slider').proportion('destroy');

                        equals( $('#slider').length,1, 'Slider div still remains' );
                        equals( $('.ui-slider').length, 0, 'Has no sliders'  );
                        equals( $('.ui-proportion-label').length,0,'Has no labels' );
                });
                test("only creates one slider, with one label", function() {
                        var slider=make_slider(),
                            label = $('.ui-slider .ui-proportion-label');

                        equals( $('.ui-slider').length, 1, 'only one slider was created');
                        equals( label.length, 1, 'with one label' );
                        equals( round10th(slider.width() / label.position().left), 2.0, 'Label positioned in middle');
                });

                test("creates multiple handles & labels", function(){
                        var opts={ max: 500, labels: [
                                        { name: 'First', value: 200 },
                                        { name: 'Second', value: 300 } ] },
                            slider=$('#slider').proportion( opts ),
                            labels = $('.ui-slider .ui-proportion-label');
                        
                        equals( 2, $('.ui-slider .ui-proportion-label').length, 'Has two labels' );
                        var perc =  $(labels[0]).position().left / slider.width();
                        equals( round10th( perc ),
                                ( opts.labels[0].value/opts.max ) / 2, 'First label positioned correctly');
                });
                test("can be enabled/disabled", function(){
                        var slider=make_slider();
                        equals( $('.ui-slider.ui-disabled').length, 0, 'is not disabled');
                        slider.proportion('disable');
                        equals( $('.ui-slider.ui-disabled').length, 1, 'is disabled');
                        slider.proportion('enable');
                        equals( $('.ui-slider.ui-disabled').length, 0, 'is not disabled');
                });
                test("handles a large amount of labels",function(){
                        var opts={ max: 500, labels: [
                                        { name : 'First',   value: 100 },
                                        { name : 'Second',  value: 300 },
                                        { name : 'Third',   value: 20 },
                                        { name : 'Fourth',  value: 20 },
                                        { name : 'Fifth',   value: 20 },
                                        { name : 'Sixth',   value: 10 },
                                        { name : 'Seventh', value: 30 }
                        ] },
                            slider=$('#slider').proportion( opts ),
                            labels = $('.ui-slider .ui-proportion-label');

                        equals( 7, $('.ui-proportion-label').length, 'Has seven labels' );
                });
                
                test("returns proper values for labels", function(){
                        var opts={ max: 600, labels: [
                                        { name : 'First',   value: 100 },
                                        { name : 'Second',  value: 300 },
                                        { name : 'Third',   value: 200 } ] },
                            slider=$('#slider').proportion( opts ),
                            labels = slider.proportion('getLabels');
 
                        equals( labels.length, 3, 'Have proper count' );
                        equals( labels[0].value, 100 );
                        equals( labels[0].name, 'First' );
                        equals( labels[1].value, 300 );
                        equals( labels[1].name, 'Second' );
                        equals( labels[2].value, 200 );
                        equals( labels[2].name, 'Third' );
                });

                test("works with uneven values",function(){
                        var opts={ max: 330, labels: [
                                        { name : 'First',   value: 100 },
                                        { name : 'Second',  value: 600 },
                                        { name : 'Third',   value: 100 } ] },
                             slider = $('#slider').proportion( opts ),
                             labels = slider.proportion('getLabels');

                         equals( labels[0].value, 100 );
                         equals( labels[1].value, 230 );
                         equals( labels[2].value, 0 );
                });
                
                test("uses renders",function(){
                        var r = function(label){
                                return label.name + '-' + label.value;
                        },
                            opts={ max: 600, labels: [
                                        { name : 'First',   value: 100, renderer: r },
                                        { name : 'Second',  value: 300, renderer: r  },
                                        { name : 'Third',   value: 200, renderer: r  } ] },
                            slider=$('#slider').proportion( opts );
                        equals( $(".ui-label:contains('First-100')").length, 1 );
                        equals( $(".ui-label:contains('Second-300')").length, 1 );
                        equals( $(".ui-label:contains('Third-200')").length, 1 );
                });
        });
        
});
