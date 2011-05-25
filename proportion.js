(function( $, undefined ){

        var Label = function( opts ){
                this.name  = 'object' == typeof(opts) ? opts.name : opts;
                this.position = '50%';
                
        };
        Label.prototype.render = function(){
                this.el = $('<div class="ui-widget-content ui-proportion-label" style="left:' +
                            this.position + '%"><p class="ui-widget-content ui-label">' + this.name + '</p></div>');
                return this;
        };
        Label.prototype.setPosition = function( pos, height, right ){
                this.position = pos;
                if ( ! this.el ){
                        this.render();
                }
                this.el.css('left', pos + '%' ).
                        css('height', (height+1)*12 + 'px' ).
                        toggleClass( 'right', right ).
                        toggleClass( 'left', ! right );
                return this;
        };
        Label.prototype.destroy = function(){
                this.el.remove();
                return this;
        };

        var Slider = function(el, opts ){
                this.el = el;
                this.labels = [];
                this.options = opts;
                this.setLabels( this.options.labels || [] );
        };

        Slider.prototype.onSlide = function(ev,ui){
                if ( ui ){
                        var indx = ui.values.indexOf( ui.value );
                        if ( indx && ( ui.value < ui.values[indx-1] || ui.value > ui.values[indx+1] ) ){
                                return false;
                        }
                }
                var last = 0, pos;
                for ( var i=0, handles=this.el.find('.ui-slider-handle'), len=handles.length; i< len; i++){
                        
                        pos = parseInt( $(handles[i]).css('left') );
                        var perc = last + ( ( pos - last ) / 2 );
                        console.log("Setting " + i + ' last: ' + last + " pos: " + pos + ' perc: ' + perc );
                        var asc = i<len/2;
                        this.labels[i].setPosition(  perc, asc ? i+1 : len+1-i, asc );
                        last = pos;
                }
                pos = last + ( (100 - last) / 2 );
                console.log( "Last set to: " + pos );
                this.labels[i].setPosition( pos, 1, false );
                return true;
        };

        Slider.prototype.setLabels = function( new_labels ){
                this.destroy();
                this.labels = [];
                var handles=[],
                    ttl = 0,
                    scaleFactor = 100 / this.options.max,
                    name, width;
                
                for ( var i=0,len=new_labels.length; i < len; i++ ){

                        if ('object' == typeof( new_labels[i] ) ){
                                name  = new_labels[i].name;
                                width = new_labels[i].value*scaleFactor;
                        } else {
                                name = new_labels[i];
                                width = 100 / len * i;
                        }

                        var label = new Label( new_labels[i] );

//                        console.log( name + ' width: ' + width + ' ttl: ' + ttl );
                        if ( this.labels.length ){
                                handles.push( ttl );
                        }
                        ttl += width;
                        this.labels.push( label );
                        this.el.append( label.render().el );
                }
                
                if ( handles.length ){
                        this.el.slider({
                                values: handles,
                                slide: jQuery.proxy(this.onSlide,this)
                        });
                } else {
                        this.el.slider().find('.ui-slider-handle').remove();
                        
                }
                this.onSlide();
                return this;
        };
        Slider.prototype.destroy = function(){
                
                for ( var i=0,len=this.labels.length; i < len; ++i ){
                        this.labels[i].destroy();
                }
                this.el.slider('destroy');
                return this;
        };
        
    $.fn.proportion = function( options ) {
        
                var args     = arguments,
                    defaults = {
                        'max'         : 100
                    };
                    
                if ( options ) { 
                        $.extend( defaults, options );
                } else {
                        options = defaults;
                }
                
                return this.each(function() {
                        var $this = $(this),
                            obj = $this.data('proportion');

                        if ( ! args.length || 'object' == typeof( args[0] ) ) {
                                if ( obj ){
                                        obj.destroy();
                                }
                                obj = new Slider( $this, options );
                                $(this).data('proportion',obj);
                        } else if ( args.length && 'string' == typeof(args[0]) ){
                                if ( obj && obj[ args[0] ] ) {
                                        return obj[ args[0] ].apply( obj, Array.prototype.slice.call( args, 1 ) );
                                } else {
                                        $.error( 'Method ' +  args[0] + ' does not exist on jQuery.proportion' );
                                }
                        } else {
                                $.error( 'invalid arguments to initialize jQuery.proportion' );
                        }
                        return this;
                });
        };

})( jQuery );