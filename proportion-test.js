
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
                        });;
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
                        equals( round10th( $(labels[0]).position().left / slider.width() ),
                                ( opts.labels[0].value/opts.max ) / 2, 'First label positioned correctly');
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

        });
        
});
