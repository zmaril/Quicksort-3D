// Takes in a list of objects and then uses the compare function to determine the ordering. 
// It's expected that the comparsion functon returns -1 when a is less than b, 1 when a is greater than b, and 0 when they are equal. 
var quicksort = function (list,compare){
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
    return quicksort(less,compare).concat([pivot],quicksort(more,compare));
};

//Takes in two numbers and compares them in the standard way. 
var numCompare = function(a,b){
    var state = 0;
    if (a<b){
        state = -1;
    }
    else if (b<a){
        state = 1;
    }
    return state;            
};

//Numberical quicksort. 
var numQuicksort = function(list){return quicksort(list, numCompare);};

//Sort points by distance from origin. Expects the form {x: 12123, y:32121} to work with. 
var pointSort = function (list){
    return quicksort(list, 
                     function(a,b){
                         var distA= Math.sqrt(Math.pow(a.x,2) + Math.pow(a.y,2));
                         var distB= Math.sqrt(Math.pow(b.x,2) + Math.pow(b.y,2));
                         return numCompare(distA,distB);
                     });
};


/*
 * Animating everything happens below here.
 * 
 * 
 */

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


//Copied and pasted from 
//https://github.com/mrdoob/three.js/blob/master/examples/canvas_particles_random.html
//Modified to get the quicksort out there correctly. 
var container, stats;
var camera, scene, renderer, group, particle;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

    container = document.createElement( 'div' );
    
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.x = 3000;    
    camera.position.z = 3000;    


    scene = new THREE.Scene();

    var PI2 = Math.PI * 2;
    var program = function ( context ) {
	context.beginPath();
	context.arc( 0, 0, 1, 0, PI2, true );
	context.closePath();
	context.fill();
    };

    group = new THREE.Object3D();
    scene.add( group );
    //300300910 red
    // 0 black
    // 1000 blue
    for ( var i = 0; i < 100; i++ ) {
	particle = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: 0
                                                                           //Math.random() * 0x808008 + 0x808080
                                                                           , program: program } ) );
	particle.position.x = Math.random() * 2000 - 1000;
	particle.position.y = Math.random() * 2000 - 1000;
	particle.position.z = Math.random() * 2000 - 1000;
	particle.scale.x = particle.scale.y = 50;
	group.add( particle );
    }

    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
}

//

function onDocumentMouseMove( event ) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {

    if ( event.touches.length == 1 ) {

	event.preventDefault();

	mouseX = event.touches[ 0 ].pageX - windowHalfX;
	mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}

function onDocumentTouchMove( event ) {

    if ( event.touches.length == 1 ) {

	event.preventDefault();

	mouseX = event.touches[ 0 ].pageX - windowHalfX;
	mouseY = event.touches[ 0 ].pageY - windowHalfY;
    }
}

//

function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}



function render() {

    camera.position.x += ( mouseX - camera.position.x )*0.05;;
    camera.position.y += ( - mouseY - camera.position.y )*0.05;
    camera.lookAt( scene.position );

    group.rotation.x += 0.01;
    renderer.render( scene, camera );

}


//Takes in a list and outputs an object that contains a pivot point, all the items in the list "less" than the pivot , and all the items  in the "more" than the pivot. 
//Example input: [3,2,4,5], numCompare
//Example output: {less:[2],pivot:3, more:[4,5]}

var quicksortStep = function (list,compare){
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
};


var leftovers =[group.children]; 

var pickPivot = function(){
    var pivot = kids[Math.floor(Math.random()*kids.length)];

    messyState.pivot= pivot;
    messyState.turn=1;
};

var id = setInterval(function(){
    if(leftovers.length == 0){
        clearInterval(id);
        return;
    }

    var next = leftovers.pop();

    if (next.length == 0){
        return;
    }

    var quicksorted= quicksortStep(next,function(a,b){
                         var distA= Math.sqrt(Math.pow(a.position.x,2) + Math.pow(a.position.y,2));
                         var distB= Math.sqrt(Math.pow(b.position.x,2) + Math.pow(b.position.y,2));
                         return numCompare(distA,distB);
                     });
    
    var listOfZ =[];
    next.forEach(function(point){
        listOfZ.push(point.position.z);
        });

    var sortedZ= numQuicksort(listOfZ);
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

    setTimeout(changePivotColor.bind(quicksorted),200);    
    setTimeout(changeMoreColor.bind(quicksorted),400);
    setTimeout(changeLessColor.bind(quicksorted),600);

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

    setTimeout(moveLess.bind(quicksorted,lessZ),700);
    setTimeout(movePivot.bind(quicksorted,pivotZ),800);
    setTimeout(moveMore.bind(quicksorted,moreZ),700);


    if (quicksorted.more.length > 1){
        leftovers.push(quicksorted.more);
    }
    if (quicksorted.less.length > 1){
        leftovers.push(quicksorted.less);
    }

    },1000);
