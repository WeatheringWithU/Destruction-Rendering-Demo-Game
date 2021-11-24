MODELS_MODULE.Cannon = function (barrel_radius, barrel_length, barrel_rotation, texture) {
    /*
     * A Class for representing and manipulating a model which represents a Cannon.
     *
     * @param barrel_radius: The radius of this Cannon's barrel (Number)
     * @param barrel_length: The length of this Cannon's barrel (Number)
     * @param barrel_rotation: The x-axis rotation of this Cannon's barrel in radians (Number)
     * @param texture: The texture to apply to the material of this Cannon
     * @inherits: MODELS_MODULE.Model
     */

    //public members
    this.barrel_radius = barrel_radius;
    this.barrel_length = barrel_length;
    this.barrel_rotation = barrel_rotation;
    this.texture = texture;

    this.geometry = null;
    this.material = null;
    this.mesh = null;
    const matrix = new THREE.Matrix4();
    //private instance member
    var that = this;

    //private method
    function __init() {
        /*
         * Initialize this Cannon's geometry, material, and mesh.
         */
        that.geometry = __build_cannon();
        that.material = new THREE.MeshPhongMaterial({map: that.texture, side: THREE.DoubleSide});
        that.mesh = new THREE.Mesh(that.geometry, that.material);
        that.mesh.castShadow = true;
        MODELS_MODULE.Model.call(that, that.geometry, that.material, that.mesh);
    }
    //private method
    function __build_cannon() {
        /*
         * Build the cannon shaped geometry.
         *
         * @return: The cannon shaped geometry. (THREE.Geometry)
         */
        var cannon = new THREE.BufferGeometry();

        var base = __build_base();
        var barrel = __build_barrel();

        base.updateMatrix();
        barrel.updateMatrix();
        cannon = THREE.BufferGeometryUtils.mergeBufferGeometries([base.geometry, barrel.geometry]);
        // cannon.merge(base.geometry, base.matrix);
        // cannon.merge(barrel.geometry, barrel.matrix);

        return cannon;
    }
    //private method
    function __build_base() {
        /*
         * Build the base of the cannon shaped geometry.
         *
         * @return: The mesh which represents the base of this cannon. (THREE.Mesh)
         */
        var base_geometry = new THREE.BufferGeometry();

        var right_leg_geometry = new THREE.BoxBufferGeometry(that.barrel_radius/2, that.barrel_radius*2, that.barrel_length/2);
        var left_leg_geometry = new THREE.BoxBufferGeometry(that.barrel_radius/2, that.barrel_radius*2, that.barrel_length/2);
        var connector_geomerty = new THREE.BoxBufferGeometry(that.barrel_radius*3, that.barrel_radius/5, that.barrel_length/2);
        
        right_leg_geometry.translate(-(1.5*that.barrel_radius), -that.barrel_radius, 0);
        left_leg_geometry.translate((1.5*that.barrel_radius), -that.barrel_radius, 0);
        connector_geomerty.translate(0, -(1.25*that.barrel_radius), 0);

        base_geometry = THREE.BufferGeometryUtils.mergeBufferGeometries([right_leg_geometry.applyMatrix4( matrix ), left_leg_geometry.applyMatrix4( matrix ), connector_geomerty.applyMatrix4( matrix )]);
        base_mesh = new THREE.Mesh(base_geometry, that.material);
        // base_mesh.castShadow = true;
        // base_mesh.receiveShadow = true;
        return base_mesh;
    }
    //private method
    function __build_barrel() {
        /*
         * Build the barrel of the cannon shaped geometry.
         *
         * @return: The mesh which represents the barrel of this cannon. (THREE.Mesh)
         */
        var barrel_geometry = new THREE.BufferGeometry();

        var tube_geometry = new THREE.CylinderBufferGeometry(
            that.barrel_radius, that.barrel_radius, that.barrel_length, 100, 100, true
        );
        var tube_base_geometry = new THREE.SphereBufferGeometry(
            that.barrel_radius, 100, 100
        );
        var tube_end_geometry = new THREE.TorusBufferGeometry(
            that.barrel_radius, .05, 100, 100
        );

        var y2 = Math.cos(degrees_to_radians(90 - that.barrel_rotation)) * that.barrel_length;
        var z2 = Math.sin(degrees_to_radians(90 - that.barrel_rotation)) * that.barrel_length;

        tube_geometry.translate(0, 2 * y2, 0);
        tube_geometry.rotateX(degrees_to_radians(90 - that.barrel_rotation));
        tube_base_geometry.translate(0, 0, 0);
        tube_end_geometry.rotateX(degrees_to_radians(180 - that.barrel_rotation));
        tube_end_geometry.translate(0, y2, z2);

        barrel_geometry = THREE.BufferGeometryUtils.mergeBufferGeometries([tube_geometry.applyMatrix4( matrix ), tube_base_geometry.applyMatrix4( matrix ), tube_end_geometry.applyMatrix4( matrix )]);
        
        barrel_mesh = new THREE.Mesh(barrel_geometry, that.material);
        // barrel_mesh.castShadow = true;
        // barrel_mesh.receiveShadow = true;

        return new THREE.Mesh(barrel_geometry, that.material);
    }
    __init();
};
MODELS_MODULE.Cannon.prototype = Object.create(MODELS_MODULE.Model.prototype); //This class inherits the Model class