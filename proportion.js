(function( $, undefined ){

        var Label = function( opts ){
                this.name  = 'object' == typeof(opts) ? opts.name : opts;
                this.position = '50%';
                
        };
        Label.prototype.render = function(){
                this.el = $('<div class="ui-widget-content ui-proportion-label" style="left: "' +
                            this.position + '%"><p class="ui-label">' + this.name + '</p></div>');
                return this;
        };
        Label.prototype.setPosition = function( pos ){
                this.position = pos;
                this.render();
                return this;
        };
        Label.prototype.destroy = function(){
                this.el.remove();
                return this;
        };
        
        var Slider = function(el, opts ){
                this.el = el;
                this.options = opts;
                if ( this.options.labels.length ) {
                        this.setLabels( this.options.labels );
                }
        };
        Slider.prototype.setLabels = function( new_labels ){
                this.labels = [];
                var handles=[],
                    qty = 0,
                name, width;
                
                for ( var i=0,len=new_labels.length; i < len; ++i ){
                        if ('object' == typeof( new_labels[i] ) ){
                                name  = new_labels[i].name;
                                width = new_labels[i].value;
                        } else {
                                name = new_labels[i];
                                width = ( this.options.max / len ) * i;
                        }

                        qty += width;
                                
                        var label = new Label( new_labels[i] );
                        
                        if ( this.labels.length ){
                                handles.push( qty );
                                label.setPosition( this.options.max / ( qty - (width/2) ) );
                        } else {
                                label.setPosition( 50 );
                        }

                        this.labels.push( label );
                        this.el.append( label.render().el );
                }

                if ( handles.lenth ){
                        this.el.slider({
                                values: handles,
                                max: this.options.max
                        });
                } else {
                        this.el.slider( {max: this.options.max } ).find('.ui-slider-handle').remove();
                }

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
                        if ( ! obj ){
                                obj = new Slider( $this, options );
                                $(this).data('proportion',obj);
                        } else if ( obj[options] ) {
                                return obj[options].apply( obj, Array.prototype.slice.call( args, 1 ) );
                        } else if ( args.length ){
                                $.error( 'Method ' +  args[0] + ' does not exist on jQuery.proportion' );
                        }
                        return this;
                });
        };

})( jQuery );