
$(document).ready(function(){

        $(document).ready(function(){

                var el = $('#slider').proportion({
                        max: 442.32,
                        labels: [
                                { name: 'One', value: 100 }

                        ]
                });
                
                test("has a slider", function() {
                        ok( el.hasClass('ui-slider'), "initialized a slider" );
                });

                test("only creates one slider, with one label", function() {
                        var slider = $('#slider').proportion(),
                            label = $('.ui-slider .ui-proportion-label');

                        equals( 1, $('.ui-slider').length );
                        equals( 1, label.length );
                        equals( 2, parseInt( 100 * ( slider.width() / label.position().left ) ) / 100 );
                });
                
                test("Can be destroyed", function() {
                        var slider = $('#slider').proportion();

                        equals( 1, $('.ui-slider').length );

                        $('#slider').proportion('destroy');
                        
                        equals( 1, $('#slider').length,'Slider div still remains' );
                        equals( 0, $('.ui-slider').length );
                        equals( 0, $('.ui-proportion-label').length );
                });
        });
        
});
