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

var animationUtil= (function() {
    var animationUtil = {

    };
    return animationUtil;    
})();

// // Takes in a list of objects and then uses the compare function to determine the ordering. 
// // It's expected that the comparsion functon returns -1 when a is less than b, 1 when a is greater than b, and 0 when they are equal. 
// Array.prototype.quicksort= function (compare){
//     //One element is already sorted.
//     if (this.length <= 1){
//         return this;
//     }
//     //Simple way to pick the pivot point. 
//     var pivotIndex = Math.floor(this.length/2);
//     var pivot = this[pivotIndex];

//     //Arrays holding the elements that have been seperated into less and more
//     var less = [];
//     var more = [];

//     //Simple for look using compare
//     for(var i = 0; i <this.length; i++){
//         if(i != pivotIndex){
//             var next = this[i];
//             if(-1 == compare(next,pivot)){
//                 less.push(next);
//             }
//             else {
//                 more.push(next);
//             }            
//         }
//     }    
//     //Return the array recursively sorted
//     return less.quicksort(compare).concat([pivot],more.quicksort(compare));
// };

// //Takes in two numbers and compares them in the standard way. 
// var numCompare = function(a,b){
//     var state = 0;
//     if (a<b){
//         state = -1;
//     }
//     else if (b<a){
//         state = 1;
//     }
//     return state;            
// };

// //Numberical quicksort. 
// Array.prototype.numQuicksort = function(){return this.quicksort(numCompare);};

// //Takes in a list and outputs an object that contains a pivot point, all the items in the list "less" than the pivot , and all the items  in the "more" than the pivot. 
// //Example input: [3,2,4,5], numCompare
// //Example output: {less:[2],pivot:3, more:[4,5]}
// Array.prototype.quicksortStep = function (compare){
//     if (this.length <= 1){
//         return this;
//     }
//     var pivotIndex = Math.floor(this.length/2);
//     var pivot = this[pivotIndex];
//     var less = [];
//     var more = [];
//     for(var i = 0; i <this.length; i++){
//         if(i != pivotIndex){
//             var next = this[i];
//             if(-1 == compare(next,pivot)){
//                 less.push(next);
//             }
//             else {
//                 more.push(next);
//             }            
//         }
//     }    
//     return {less:less, pivot:pivot, more: more};
// };

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


//Displaying everything
//https://github.com/mrdoob/three.js/blob/master/examples/canvas_particles_random.html
//http://mrdoob.com/projects/voxels/#A/afhaddadkShahhShaffShSh
//Modified to get the quicksort out there correctly. 
var container;
var camera, scene, renderer, group, particle;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var projector,ray, objectHovered,
    mouse3D, isMouseDown = false, onMouseDownPosition,
    radious = 5000, theta = 45, onMouseDownTheta = 45, phi = 60, onMouseDownPhi = 60,
    isShiftDown = false;
var buttons; 
var speed = 1000;

//The particles that need to be quicksorted away 
var leftovers;

setup();
init();
animate();

function setup(){
    //Setting up the controls and container
    buttons = $( "#radio" ).buttonset()
        .click(function(event){
        var target = $(event.target);
        switch(target.attr('id')){
            case("speed1"):
            speed = 3000;
            break;

            case("speed2"):
            speed = 1000; 
            break;

            case("speed3"):
            speed = 333;
            break;
            
            default: break;
        }

        })
        .parent()
        .offset({top:10, left:100});

    container = document.createElement( 'div' );

    document.body.appendChild( container );

    //Getting the camera ready to be moved correctly.
    camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
    camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
    camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

    scene = new THREE.Scene();
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
            scene.add(line);
    };       

    var axisLength= 3000;
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
    group = new THREE.Object3D();
    scene.add( group );
}



function init() {

    var PI2 = Math.PI * 2;
    var program = function ( context ) {
	context.beginPath();
	context.arc( 0, 0, 1, 0, PI2, true );
	context.closePath();
	context.fill();
    };        
    
    //Creating a group to hold all the particles
    for ( var i = 0; i < 600; i++ ) {
	particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: 0, program: program } ) );
	particle.position.x = Math.random() * 2000 - 1000;
	particle.position.y = Math.random() * 2000 - 1000;
	particle.position.z = Math.random() * 2000 - 1000;
	particle.scale.x = particle.scale.y = 50;
	group.add( particle );
    }

    //Three js stuff
    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    onMouseDownPosition = new THREE.Vector2();

    //Set up event controls
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    leftovers =[group.children]; 
}


//Capture the mouse down positon
function onDocumentMouseDown( event ) {
    event.preventDefault();

    isMouseDown = true;

    onMouseDownTheta = theta;
    onMouseDownPhi = phi;
    onMouseDownPosition.x = event.clientX;
    onMouseDownPosition.y = event.clientY;
}

//Track information and update view
function onDocumentMouseMove( event ) {
    event.preventDefault();

    if ( isMouseDown ) {
        
	theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 ) + onMouseDownTheta;
	phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 ) + onMouseDownPhi;
        
	phi = Math.min( 180, Math.max( 0, phi ) );

	camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
	camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
	camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
	camera.updateMatrix();

    }
    render();

}

//Stop tracking info
function onDocumentMouseUp( event ) {
    event.preventDefault();
    isMouseDown = false;
}


function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}



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

    setTimeout(changePivotColor.bind(quicksorted),speed*0.2);    
    setTimeout(changeMoreColor.bind(quicksorted),speed*0.4);
    setTimeout(changeLessColor.bind(quicksorted),speed*0.6);

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
        group.children.forEach(function(point){
            point.material.color.setRGB(0,0,0);
            });
        };

    setTimeout(moveLess.bind(quicksorted,lessZ),0.7*speed);
    setTimeout(movePivot.bind(quicksorted,pivotZ),0.8*speed);
    setTimeout(moveMore.bind(quicksorted,moreZ),0.9*speed);
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

    setTimeout(changeFunction,speed);
};

setTimeout(changeFunction,speed);

