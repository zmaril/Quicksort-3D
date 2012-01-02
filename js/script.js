var quicksortUtil = (function (){
    var quicksortUtil = {
        genericQuicksort: function(list, compare){
            //One element is already sorted.
            if (list.length <= 1){
                return list;
            }
            //Simple way to pick the pivot point. 
            var pivotIndex = Math.floor(list.length/2);
            var pivot = list[pivotIndex];

            //Arrays holding the elements that have been seperated into less and more
            var less = [];
            var more = [];

            //Simple for look using compare
            for(var i = 0; i <list.length; i++){
                if(i != pivotIndex){
                    var next = list[i];
                    if(-1 == compare(next,pivot)){
                        less.push(next);
                    }
                    else {
                        more.push(next);
                    }            
                }
            }    
            //Return the array recursively sorted
            return quicksortUtil.genericQuicksort(less,compare).concat([pivot],quicksortUtil.genericQuicksort(more,compare));
        }
        //Takes in two numbers and compares them in the standard way. 
        ,numericalCompare: function(a,b){
            if(a<b)
                return -1;
            else if (b<a)
                return 1;
            return 0;
        }
        //Numberical quicksort. 
        ,numericalQuicksort: function(list){
            return quicksortUtil.genericQuicksort(list,quicksortUtil.numericalCompare);
            }
        //Takes in a list and outputs an object that contains a pivot point, all the items in the list "less" than the pivot , and all the items  in the "more" than the pivot. 
        //Example input: [3,2,4,5], numCompare
        //Example output: {less:[2],pivot:3, more:[4,5]}
        ,genericQuicksortStep: function(list,compare){
            if (list.length <= 1){
                return list;
            }
            var pivotIndex = Math.floor(list.length/2);
            var pivot = list[pivotIndex];
            var less = [];
            var more = [];
            for(var i = 0; i <list.length; i++){
                if(i != pivotIndex){
                    var next = list[i];
                    if(-1 == compare(next,pivot)){
                        less.push(next);
                    }
                    else {
                        more.push(next);
                    }            
                }
            }    
            return {less:less, pivot:pivot, more: more};
        }
        
    };

    return quicksortUtil;
})();

//Used to display everything
//https://github.com/mrdoob/three.js/blob/master/examples/canvas_particles_random.html
//http://mrdoob.com/projects/voxels/#A/afhaddadkShahhShaffShSh
//Modified to get the quicksort out there correctly. 
var animationUtil= (function() {
    //Set up some variables and independent variables
    var animationUtil = {
        windowHalfX : window.innerWidth / 2
        ,windowHalfY : window.innerHeight / 2
        ,isMouseDown: false
        ,radius: 5000
        ,theta : 45
        ,onMouseDownTheta: 45
        ,phi: 60
        ,onMouseDownPhi: 60
        ,speed : 1000
        ,scene: (function(){
            var scene = new THREE.Scene();
            return scene;
            })()
        ,group: new THREE.Object3D()
        ,onMouseDownPosition: new THREE.Vector2()
    };

    //Set up the first round of variables that depends on other constants defined previously
    $.extend(animationUtil,{     
        camera: (function(){
            var camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
            camera.position.x = animationUtil.radius * Math.sin( animationUtil.theta * Math.PI / 360 ) * Math.cos( animationUtil.phi * Math.PI / 360 );
            camera.position.y = animationUtil.radius * Math.sin( animationUtil.phi * Math.PI / 360 );
            camera.position.z = animationUtil.radius * Math.cos( animationUtil.theta * Math.PI / 360 ) * Math.cos( animationUtil.phi * Math.PI / 360 );
            return camera;
            })()
        ,renderer: (function(){
            var renderer = new THREE.CanvasRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            $("#container").append( renderer.domElement );
            return renderer;
            })()
        ,createParticles: (function(){            
            var PI2 = Math.PI * 2;
            var program = function ( context ) {
	        context.beginPath();
	        context.arc( 0, 0, 1, 0, PI2, true );
	        context.closePath();
	        context.fill();
            };        
            
            //Creating a group to hold all the particles
            for ( var i = 0; i < 600; i++ ) {
	        var particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: 0, program: program } ) );
	        particle.position.x = Math.random() * 2000 - 1000;
	        particle.position.y = Math.random() * 2000 - 1000;
	        particle.position.z = Math.random() * 2000 - 1000;
	        particle.scale.x = particle.scale.y = 50;
	        animationUtil.group.add( particle );
            }
            })
        ,animate: function() {
            requestAnimationFrame( animationUtil.animate );
            animationUtil.render();
        }
        ,render : function() {
            animationUtil.camera.lookAt( animationUtil.scene.position );
            animationUtil.renderer.render( animationUtil.scene, animationUtil.camera );
        }
        ,startup: function(){
            this.createParticles();
            }
        });
    
    return animationUtil;    
})();

var interfaceUtil = (function (){
    var interfaceUtil = {
        createInterface: function(){
            $( "#radio" ).buttonset()
                .click(function(event){
                    var target = $(event.target);
                    switch(target.attr('id')){
                    case("speed1"):
                        animationUtil.speed = 3000;
                        break;
                        
                    case("speed2"):
                        animationUtil.speed = 1000; 
                        break;
                        
                    case("speed3"):
                        animationUtil.speed = 333;
                        break;
                        
                    default: break;
                    }

                })
                .parent()
                .offset({top:10, left:100});
        }
        ,findRequestAnimationFrame: function() {
            /**
             * Provides requestAnimationFrame in a cross browser way.
             * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
             */
            if ( !window.requestAnimationFrame ) {
	        window.requestAnimationFrame = ( function() {
		    return window.webkitRequestAnimationFrame ||
		        window.mozRequestAnimationFrame ||
		        window.oRequestAnimationFrame ||
		        window.msRequestAnimationFrame ||
		        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			    window.setTimeout( callback, 1000 / 60 );
		        };
	        } )();
            }

        }
        ,drawAxis: function(){
            //Getting the camera ready to be moved correctly.    
            //http://nooshu.com/debug-axes-in-three-js
            //Adding in an axis
            var v = function (x,y,z){ 
                return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
            };
            
            //Create axis (point1, point2, colour)
            var createAxis = function (p1, p2, color){
                var line, lineGeometry = new THREE.Geometry(),
                    lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});
                lineGeometry.vertices.push(p1, p2);
                line = new THREE.Line(lineGeometry, lineMat);
                animationUtil.scene.add(line);
            };       

            var axisLength= 3000;
            createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);

            animationUtil.scene.add( animationUtil.group );
        }
        //Track information and update view
        , onDocumentMouseMove: function( event ) {
            event.preventDefault();
            if ( animationUtil.isMouseDown ) {
                
	        animationUtil.theta = - ( ( event.clientX - animationUtil.onMouseDownPosition.x ) * 0.5 ) + animationUtil.onMouseDownTheta;
	        animationUtil.phi = ( ( event.clientY - animationUtil.onMouseDownPosition.y ) * 0.5 ) + animationUtil.onMouseDownPhi;
                
	        animationUtil.phi = Math.min( 180, Math.max( 0, animationUtil.phi ) );

	        animationUtil.camera.position.x = animationUtil.radius * Math.sin( animationUtil.theta * Math.PI / 360 ) * Math.cos( animationUtil.phi * Math.PI / 360 );
	        animationUtil.camera.position.y = animationUtil.radius * Math.sin( animationUtil.phi * Math.PI / 360 );
	        animationUtil.camera.position.z = animationUtil.radius * Math.cos( animationUtil.theta * Math.PI / 360 ) * Math.cos( animationUtil.phi * Math.PI / 360 );
	        animationUtil.camera.updateMatrix();

            }
            animationUtil.render();
        }
        //Capture the mouse down positon
        , onDocumentMouseDown: function ( event ) {
            event.preventDefault();
            animationUtil.isMouseDown = true;
            animationUtil.onMouseDownTheta = animationUtil.theta;
            animationUtil.onMouseDownPhi = animationUtil.phi;
            animationUtil.onMouseDownPosition.x = event.clientX;
            animationUtil.onMouseDownPosition.y = event.clientY;
        }
        , onDocumentMouseUp: function( event ) {
            //Stop tracking info
            event.preventDefault();
            animationUtil.isMouseDown = false;
        }

        ,createAnimationControls: function(){
            $(document).mousemove( this.onDocumentMouseMove)
                .mousedown(this.onDocumentMouseDown)
                .mouseup(this.onDocumentMouseUp);
 
        }
        ,startup: function(){
            this.createInterface();
            this.findRequestAnimationFrame();
            this.drawAxis();
            this.createAnimationControls();
        }
        

    };
    return interfaceUtil;
})();


var model = (function() {
    
});

//The particles that need to be quicksorted away 
var leftovers;

(function(){
    interfaceUtil.startup();
    animationUtil.startup();
    animationUtil.animate();
    leftovers =[animationUtil.group.children]; 
})();





//The function that loops through the leftovers and sets up the timing for animation. 
var changeFunction = function(){
    if(leftovers.length == 0){
        return;
    }

    var next = leftovers.pop();

    if (next.length == 0){
        return;
    }

    var quicksorted= quicksortUtil.genericQuicksortStep(next,function(a,b){
                         var distA= Math.pow(a.position.x,2) + Math.pow(a.position.y,2);
                         var distB= Math.pow(b.position.x,2) + Math.pow(b.position.y,2);
                         return quicksortUtil.numericalCompare(distA,distB);
                     });
    
    var listOfZ =[];

    next.forEach(function(point){
        listOfZ.push(point.position.z);
        point.material.color.setRGB(0,0,0);        
        });

    var sortedZ= quicksortUtil.numericalQuicksort(listOfZ);
    var lessZ= sortedZ.slice(0,quicksorted.less.length);
    var pivotZ= sortedZ.slice(quicksorted.less.length,quicksorted.less.length+1);
    var moreZ= sortedZ.slice(quicksorted.less.length+1);

    var changePivotColor = function(){
        quicksorted.pivot.material.color.setRGB(100,0,0);        
    };
    var changeMoreColor = function(){
        quicksorted.more.forEach(function(i){
            i.material.color.setRGB(0,100,0);
        });
    };

    var changeLessColor = function(){
        quicksorted.less.forEach(function(i){
            i.material.color.setRGB(0,0,100);
        });
    };

    setTimeout(changePivotColor.bind(quicksorted),animationUtil.speed*0.2);    
    setTimeout(changeMoreColor.bind(quicksorted),animationUtil.speed*0.4);
    setTimeout(changeLessColor.bind(quicksorted),animationUtil.speed*0.6);

    var moveLess = function(){
        quicksorted.less.forEach(function(point){
            point.position.z = lessZ.pop();
            });
    };

    var movePivot = function(){
        quicksorted.pivot.z= pivotZ.pop();
    };

    var moveMore = function(){
        quicksorted.more.forEach(function(point){
            point.position.z = moreZ.pop();
            });
    };

    var clear = function(){
        animationUtil.group.children.forEach(function(point){
            point.material.color.setRGB(0,0,0);
            });
        };

    setTimeout(moveLess.bind(quicksorted,lessZ),0.7*animationUtil.speed);
    setTimeout(movePivot.bind(quicksorted,pivotZ),0.8*animationUtil.speed);
    setTimeout(moveMore.bind(quicksorted,moreZ),0.9*animationUtil.speed);
    setTimeout(clear,950);
    
    
    if (quicksorted.more.length > 0){
        var pivotAndMore = [quicksorted.pivot].concat(quicksorted.more);
        leftovers.push(pivotAndMore);
    }
    if (quicksorted.less.length > 1){
        leftovers.push(quicksorted.less);
    }

    //Sort the arrays with quicksort. It looks better to do all the big stuff first.
    leftovers = quicksortUtil.genericQuicksort(leftovers,function(a,b){
        return quicksortUtil.numericalCompare(a.length,b.length);
    });

    setTimeout(changeFunction,animationUtil.speed);
};

setTimeout(changeFunction,animationUtil.speed);

