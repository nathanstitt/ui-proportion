(function( $, undefined ){
        
       var Label = function( opts ){
               this.name  = 'object' == typeof(opts) ? opts.name : opts;
               this.renderer = opts.renderer;
               this.position = '50%';
        };
        Label.prototype.render = function(){
                this.el = $('<div class="ui-widget-content ui-proportion-label" style="left:' + this.position + '%">' +
                            '<p class="ui-widget-content ui-label"></p></div>');
                return this;
        };
        Label.prototype.visibleString = function(){
                return ( 'function' == typeof(this.renderer) ? this.renderer(this) : this.name );
        };
        Label.prototype.update = function( pos, height, right, value ){
                this.value = value;
                this.position = pos;
                if ( ! this.el ){
                        this.render();
                }
                this.el.css('left', pos + '%' ).
                        css('height', (height+1)*12 + 'px' ).
                        toggleClass( 'right', right ).
                        toggleClass( 'left', ! right ).
                        find('p').html( this.visibleString() );
                return this;
        };
        Label.prototype.destroy = function(){
                this.el.remove();
        };
 
$.widget("ui.proportion", {

         options: { 
                 max: 100
         },
        _create: function(){
                this.labels = [];
                this.setLabels( this.options.labels || [] );
        },
        _setOption: function( key, value ) {
                switch( key ) {
                    case "max":
                        this.element.slider('option','max', value );
                        this.options.max = value;
                        break;
                    case "labels":
                        this.setLabels( value );
                        break;
                    case "disabled":
                        this.element.slider( value ? 'disable' : 'enable' );
                        break;
                }
                // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
                $.Widget.prototype._setOption.apply(this,arguments);
                
                // In jQuery UI 1.9 and above, you use the _super method instead
                if ( 'function' == typeof(this._super) ){
                        this._super( "_setOption", key, value );
                }
        },
 
        // Use the destroy method to clean up any modifications your widget has made to the DOM 

        destroy: function() {
                for ( var i=0,len=this.labels.length; i < len; ++i ){
                        this.labels[i].destroy();
                }
                this.labels = [];
                this.element.slider('destroy');

                // In jQuery UI 1.8, you must use invoke the destroy method from the base widget

                $.Widget.prototype.destroy.call(this);
                // In jQuery UI 1.9 and above, this step is not necessary
                return this;
        },
        
        _onSlide: function(ev,ui){
                if ( ui ){
                        var indx = ui.values.indexOf( ui.value );
                        if ( ( indx && ui.value < ui.values[indx-1] || 
                               ( indx<ui.values.length && ui.value > ui.values[indx+1] ) ) ){
                                return false;
                        }
                }
                var last = 0, pos;
                for ( var i=0, handles=this.element.find('.ui-slider-handle'), len=handles.length; i< len; i++){
                        pos = parseFloat( $(handles[i]).css('left') );
                        var perc = last + ( ( pos - last ) / 2 );
                        console.log("Setting " + i + ' last: ' + last + " pos: " + pos + ' perc: ' + perc );
                        var asc = i<len/2;
                        this.labels[i].update(  perc, asc ? i+1 : len+1-i, asc, this.valueFromPercent( pos-last ) );
                        
                        last = pos;
                }
                pos = last + ( (100 - last) / 2 );
//                console.log( "Last set to: " + pos );
                this.labels[i].update( pos, 1, false, this.valueFromPercent( 100-last ) );
                return true;
        },
        valueFromPercent:function( perc ){
                return Math.round( 100 * this.options.max * ( perc /100 ) ) / 100;
        },
        getLabels: function(){
                var values = [], pos, last=0, label;
                for ( var i=0, handles=this.element.find('.ui-slider-handle'), len=handles.length; i< len; i++){
                        pos = parseFloat( $(handles[i]).css('left') );
                        this.labels[i].value = this.valueFromPercent( pos - last );
                        last = pos;
                }
                this.labels[i].value = this.valueFromPercent( 100 - last );
                return this.labels;
        },

        setLabels: function( new_labels ){
                this.element.slider('destroy');
                for ( var i=0,len=this.labels.length; i < len; ++i ){
                        this.labels[i].destroy();
                }

                this.labels = [];
                var handles=[],
                    ttl = 0,
                    scaleFactor = 100 / this.options.max,
                    name, width;
                
                for ( i=0,len=new_labels.length; i < len; i++ ){

                        if ('object' == typeof( new_labels[i] ) ){
                                name  = new_labels[i].name;
                                width = new_labels[i].value*scaleFactor;
                        } else {
                                name = new_labels[i];
                                width = 100 / len * i;
                        }

                        var label = new Label( new_labels[i] );

//                        console.log( name + ' value: ' + new_labels[i].value + ' width: ' + width + ' ttl: ' + ttl );
                        if ( this.labels.length ){
                                handles.push( this.options.max *  ttl / 100 );
                        }
                        ttl += width;
                        this.labels.push( label );
                        this.element.append( label.render().el );
                }
                
                if ( handles.length ){
                        this.element.slider({
                                max: this.options.max || 100,
                                values: handles,
                                slide: jQuery.proxy(this._onSlide,this)
                        });
                } else {
                        this.element.slider({ max: this.options.max || 100 }).find('.ui-slider-handle').remove();
                }
                this._onSlide();
                return this;
        }

});
        
     

        
    // $.fn.proportion = function( options ) {
        
    //             var args     = arguments,
    //                 defaults = {
    //                     'max'         : 100
    //                 };
                    
    //             if ( options ) { 
    //                     $.extend( defaults, options );
    //             } else {
    //                     options = defaults;
    //             }
                
    //             return this.each(function() {
    //                     var $this = $(this),
    //                         obj = $this.data('proportion');

    //                     if ( ! args.length || 'object' == typeof( args[0] ) ) {
    //                             if ( obj ){
    //                                     obj.destroy();
    //                             }
    //                             obj = new Slider( $this, options );
    //                             $(this).data('proportion',obj);
    //                     } else if ( args.length && 'string' == typeof(args[0]) ){
    //                             if ( obj && obj[ args[0] ] ) {
    //                                     return obj[ args[0] ].apply( obj, Array.prototype.slice.call( args, 1 ) );
    //                             } else {
    //                                     $.error( 'Method ' +  args[0] + ' does not exist on jQuery.proportion' );
    //                             }
    //                     } else {
    //                             $.error( 'invalid arguments to initialize jQuery.proportion' );
    //                     }
    //                     return this;
    //             });
    //     };

})( jQuery );