var Display = function(size, step, vm){
    this.vm = vm;
    this.size = size || 500;
    this.step = step || 50;
    this.objects = [];
    this._dragging = 0;
};

Display.CUBE_TEXTURE = THREE.ImageUtils.loadTexture( __uri('./cube_texture.png') );

Display.prototype.init = function(el){
    this.container = el;
    this._initCamera();
    this._initControls();
    this._initScene();
    this._initGrid();
    this._initRaycaster();
    this._initLight();
    this._initRender();
    this._bindEvents();
    this.render();
};

Display.prototype._initCamera = function(){
    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.set( 500, 800, 1300 );
    this.camera.lookAt( new THREE.Vector3() );
};

Display.prototype._initControls = function(){
    this.controls = new THREE.OrbitControls( this.camera );
    this.controls.target.set( 0, 0, 0 );
    this.controls.update();
};

Display.prototype._initScene = function(){
    this.scene = new THREE.Scene();
};

Display.prototype._initGrid = function(){
    var size = this.size, step = this.step;
    var geometry = new THREE.Geometry();
    for ( var i = - size; i <= size; i += step ) {
        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );
    }
    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );
    var grid = new THREE.LineSegments( geometry, material );
    this.scene.add( grid );
};

Display.prototype._initRaycaster = function(){
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
    geometry.rotateX( - Math.PI / 2 );

    this.plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
    this.scene.add( this.plane );

    this.objects.push( this.plane );
};

Display.prototype._initLight = function(){
    var ambientLight = new THREE.AmbientLight( 0x606060 );
    this.scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
    this.scene.add( directionalLight );
};

Display.prototype._initRender = function(){
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0xf0f0f0 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.container.appendChild( this.renderer.domElement );
};

Display.prototype.render = function(){
    this.renderer.render( this.scene, this.camera );
};

Display.prototype._bind = function(host, type, fn){
    var self = this;
    return host.addEventListener(type, function( event ){
        event.preventDefault();
        fn.call( self, event );
        self.render();
    }, false);
};

Display.prototype._bindEvents = function(){
    this._bind(window, 'resize', this._onWindowResize);
    this._bind(this.container, 'touchstart', this._onTouchStart);
    this._bind(this.container, 'touchmove', this._onTouchMove);
    this._bind(this.container, 'touchend', this._onTouchEnd);
};

Display.prototype._onWindowResize = function(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
};

Display.prototype._onTouchEnd = function( event ){
    if(event.touches.length === 0 && this._dragging < 3){
        var evt = event.changedTouches[ 0 ];
        this._click( evt.clientX, evt.clientY );
    }
};

Display.prototype._click = function( x, y ){
    var intersect = this._getIntersect( x, y );
    if(intersect){
        if(this.vm.earse){
            this._delCube( intersect );
        } else {
            this._addCube( intersect );
        }
    }
};

Display.prototype._onTouchMove = function(){
    this._dragging++;
};

Display.prototype._onTouchStart = function( event ){
    if( event.touches.length === 1 ){
        this._dragging = 0;
    }
};

Display.prototype._getIntersect = function( x, y ){
    this.mouse.set(
        ( x / window.innerWidth ) * 2 - 1,
        - ( y / window.innerHeight ) * 2 + 1
    );
    this.raycaster.setFromCamera( this.mouse, this.camera );
    var intersects = this.raycaster.intersectObjects( this.objects );
    if ( intersects.length > 0 ) {
        return intersects[ 0 ];
    }
};

Display.prototype._addCube = function( intersect ){
    if(intersect){
        var cube = new THREE.BoxGeometry( this.step, this.step, this.step );
        var material = new THREE.MeshLambertMaterial({
            color: this.vm.color,
            map: Display.CUBE_TEXTURE
        });
        var voxel = new THREE.Mesh( cube, material );
        var position = voxel.position;
        position.copy( intersect.point ).add( intersect.face.normal );
        position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
        if(
            position.y <  0         ||
            position.x >  this.size ||
            position.z >  this.size ||
            position.z < -this.size ||
            position.x < -this.size
        ){
            return;
        }
        this.scene.add( voxel );
        this.objects.push( voxel );
    }
};

Display.prototype._delCube = function( intersect ){
    if(intersect){
        if ( intersect.object != this.plane ) {
            this.scene.remove( intersect.object );
            this.objects.splice( this.objects.indexOf( intersect.object ), 1 );
        }
    }
};

module.exports = Vue.extend({
    template: __inline('./display.html'),
    data: function(){
        return {
            color: '#f00',
            earse: false,
            colors: [
                { value: '#f00', text: '红色' },
                { value: '#0f0', text: '绿色' },
                { value: '#00f', text: '蓝色' },
                { value: '#ff0', text: '黄色' },
                { value: '#f0f', text: '紫色' },
                { value: '#0ff', text: '青色' },
                { value: '#fff', text: '白色' },
                { value: '#000', text: '黑色' }
            ]
        }
    },
    ready: function(){
        if ( ! Detector.webgl ) {
            // TODO 判断不支持webgl
        }
        this.display = new Display(500, 50, this);
        this.display.init(this.$el.querySelector('.w-display_viewer'));
    }
});