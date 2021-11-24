MODELS_MODULE.bar = function(width, height, thickness, mass, texture){

    //public members
    this.width = width;
    this.height = height;
    this.thickness = thickness;
    this.texture = texture;
    this.mass = mass;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;
    const matrix = new THREE.Matrix4();
    //private instance member
    var that = this;

    //private method
    function __init() {
        /*
            * Initialize the geometry, material, mesh, and body of this Pallet.
            */
        that.geometry = __build_bar();
        that.material = new THREE.MeshLambertMaterial({map: that.texture, side: THREE.DoubleSide});
        that.mesh = new THREE.Mesh(that.geometry, that.material);
        that.mesh.castShadow = true;
        that.body = new CANNON.Body({
            mass: that.mass,
            type: CANNON.Body.DYNAMIC,
            shape: new CANNON.Box(new CANNON.Vec3(that.width/2, that.height/2, that.thickness/2))
        });
        MODELS_MODULE.Model.call(that, that.geometry, that.material, that.mesh, that.body);
    }
    function __build_bar() {
        /*
         * Build the support beams of the pallet shaped geometry.
         *
         * @return: An array of mesh's which represent the support beams of this Pallet. ([THREE.Mesh, ...])
         */
        var bar_geometry = new THREE.BoxBufferGeometry(that.width, that.height, that.thickness);
        var beam_mesh = new THREE.Mesh(bar_geometry, that.material);
        return beam_mesh.geometry;
    }
    __init();
};
MODELS_MODULE.bar.prototype = Object.create(MODELS_MODULE.Model.prototype); //This class inherits the Model class.