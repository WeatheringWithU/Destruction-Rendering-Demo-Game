MODELS_MODULE.cylinder = function(radius_top, radius_bottom, height, radialSegments, mass, texture){

    //public members
    this.radius_top = radius_top;
    this.radius_bottom = radius_bottom;
    this.height = height;
    this.radialSegments = radialSegments;
    this.texture = texture;
    this.mass = mass;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.body = null;
    //private instance member
    var that = this;

    //private method
    function __init() {
        /*
            * Initialize the geometry, material, mesh, and body of this Pallet.
            */
        that.geometry = __build_cylinder();
        that.material = new THREE.MeshLambertMaterial({map: that.texture});
        that.mesh = new THREE.Mesh(that.geometry, that.material);
        that.mesh.castShadow = true;
        // that.mesh.rotation.set(degrees_to_radians(0), degrees_to_radians(0), degrees_to_radians(90));
        that.body = new CANNON.Body({
            mass: that.mass,
            type: CANNON.Body.DYNAMIC,
            shape: new CANNON.Cylinder(that.radius_top , that.radius_bottom , that.height, that.radialSegments),
        });
        var quat = new CANNON.Quaternion();
        quat.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), - Math.PI/2);
        var translation = new CANNON.Vec3(0, 0, 0);
        that.body.shapes[0].transformAllPoints(translation, quat);
        MODELS_MODULE.Model.call(that, that.geometry, that.material, that.mesh, that.body);
    }
    function __build_cylinder() {
        /*
         * Build the support beams of the pallet shaped geometry.
         *
         * @return: An array of mesh's which represent the support beams of this Pallet. ([THREE.Mesh, ...])
         */
        var cylinder_geometry = new THREE.CylinderBufferGeometry(that.radius_top, that.radius_bottom, that.height, that.radialSegments);
        var cylinder_mesh = new THREE.Mesh(cylinder_geometry, that.material);
        
        return cylinder_mesh.geometry;
    }
    __init();
};
MODELS_MODULE.cylinder.prototype = Object.create(MODELS_MODULE.Model.prototype); //This class inherits the Model class.