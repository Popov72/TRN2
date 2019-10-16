TRN.Ponytail = function(lara, scene, world) {

	this.m4 = new THREE.Matrix4();

	this.lara = lara;
	this.scene = scene;
	this.world = world;
	this.numElements = 6;
	this.counter = 0;

//	this.init();
	
}

TRN.Ponytail.prototype = {

	constructor : TRN.Ponytail,

	init : function() {

		this.lara.updateMatrix();
		this.lara.updateMatrixWorld();

		this.m4.copy(this.lara.matrixWorld);
		this.m4.multiply(this.lara.bones[14].skinMatrix);

		var rs = this.m4.decompose(), pos = rs[0], quat = rs[1];

pos.x += 200;
        var mass = 0;
        var last, lastSize, lastMin, lastMax;

        this.boxes = [];

/*        for(var i = 0; i < this.numElements; i++){
			var obj = this.scene.objects['moveable' + TRN.ObjectID.Ponytail + '_mesh' + i];

			obj.geometry.computeBoundingBox();

            obj.position.set(pos.x + obj.initPos.x, pos.y + obj.initPos.y, pos.z + obj.initPos.z);
			obj.updateMatrix();
			obj.updateMatrixWorld();
        }

return;*/
        for(var i = 0; i < this.numElements; i++){
			var obj = this.scene.objects['moveable' + TRN.ObjectID.Ponytail + '_mesh' + i];

			obj.geometry.computeBoundingBox();

			var min = obj.geometry.boundingBox.min, max = obj.geometry.boundingBox.max;
			var size = new THREE.Vector3();

			size.copy(max);
			size.sub(min);

			//min.add(obj.initPos);
			//max.add(obj.initPos);

			console.log(min, max)
			console.log(size.x, size.y, size.z)

			var cbox = new CANNON.Box(new CANNON.Vec3(size.x/2,size.y/2,size.z/2-5));

		    var V = CANNON.Vec3;
		    var h = new CANNON.ConvexPolyhedron([new V(min.x,min.y,min.z),
		                                         new V(max.x,min.y,min.z),
		                                         new V(max.x,max.y,min.z),
		                                         new V(min.x,max.y,min.z),
		                                         new V(min.x,min.y,max.z),
		                                         new V(max.x,min.y,max.z),
		                                         new V(max.x,max.y,max.z),
		                                         new V(min.x,max.y,max.z)],
		                                         [[3,2,1,0], // -z
		                                          [4,5,6,7], // +z
		                                          [5,4,1,0], // -y
		                                          [2,3,6,7], // +y
		                                          [0,4,7,3], // -x
		                                          [1,2,5,6], // +x
		                                          ],
		                                        [new V( 0, 0,-1),
		                                         new V( 0, 0, 1),
		                                         new V( 0,-1, 0),
		                                         new V( 0, 1, 0),
		                                         new V(-1, 0, 0),
		                                         new V( 1, 0, 0)]);
		    cbox.convexPolyhedronRepresentation = h;

            var boxbody = new CANNON.RigidBody(mass, cbox);

            //boxbody.position.set(pos.x + obj.initPos.x, pos.y + obj.initPos.y, pos.z + obj.initPos.z);
            boxbody.position.set(pos.x, pos.y, pos.z);

            if (i == 0) {
            	//boxbody.quaternion.set(ponytail.quaternion.x, ponytail.quaternion.y, ponytail.quaternion.z, ponytail.quaternion.w);
            }
            boxbody.linearDamping 	= 0.01*10;
            boxbody.angularDamping 	= 0.01*10;

            this.boxes.push(boxbody);
            this.world.add(boxbody);

            if (i != 0){
                // Connect this body to the last one
                var c1 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(-size.x/2, 0, size.z/2+0.5), last, new CANNON.Vec3(-size.x/2, 0, -lastSize.z/2-0.5));
                var c2 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3( size.x/2, 0, size.z/2+0.5), last, new CANNON.Vec3( size.x/2, 0, -lastSize.z/2-0.5));
                //var c1 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(min.x/2, 0, max.z/2+0.5), last, new CANNON.Vec3(min.x/2, 0, lastMin.z/2-0.5));
                //var c2 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(max.x/2, 0, max.z/2+0.5), last, new CANNON.Vec3(max.x/2, 0, lastMin.z/2-0.5));
                this.world.addConstraint(c1);
                this.world.addConstraint(c2);
            } else {
                mass = 0.3;
            }

            last = boxbody;
            lastSize = size;
            lastMin = min;
            lastMax = max;
        }
        console.log(this.boxes)

	},

	update : function(delta) {

		if (!this.boxes) return;
		
        this.world.step(1/60);//delta);

		for (var i = 0; i < this.numElements; ++i) {
			var obj = this.scene.objects['moveable' + TRN.ObjectID.Ponytail + '_mesh' + i];

			//if (this.counter < 6) console.log(delta,this.boxes[i].position)

            this.boxes[i].position.copy(obj.position);
            this.boxes[i].quaternion.copy(obj.quaternion);
//            obj.position.add(pos);

			obj.updateMatrix();
			obj.updateMatrixWorld();
		}

        this.counter++;

	}

}