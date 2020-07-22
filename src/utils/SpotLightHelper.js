import {Utils} from "../utils.js";

export class SpotLightHelper extends THREE.Object3D{

	constructor(light, color){
		super();

		this.light = light;
		this.color = color;
		
		this.spheres = [];

		//this.up.set(0, 0, 1);
		this.updateMatrix();
		this.updateMatrixWorld();

		{ // SPHERE
			let sg = new THREE.SphereGeometry(1, 32, 32);
			let sm = new THREE.MeshNormalMaterial();
			this.sphere = new THREE.Mesh(sg, sm);
			this.sphere.scale.set(0.5, 0.5, 0.5);
			this.add(this.sphere);
			this.spheres.push(this.sphere);
		}

		{ // LINES
			

			let positions = new Float32Array([
				+0, +0, +0,     +0, +0, -1,

				+0, +0, +0,     -1, -1, -1,
				+0, +0, +0,     +1, -1, -1,
				+0, +0, +0,     +1, +1, -1,
				+0, +0, +0,     -1, +1, -1,

				-1, -1, -1,     +1, -1, -1,
				+1, -1, -1,     +1, +1, -1,
				+1, +1, -1,     -1, +1, -1,
				-1, +1, -1,     -1, -1, -1,
			]);

			let geometry = new THREE.BufferGeometry();
			geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

			let material = new THREE.LineBasicMaterial();

			this.frustum = new THREE.LineSegments(geometry, material);
			this.add(this.frustum);

		}
		
		{ // Event Listeners
			let drag = (e) => {
				let I = Utils.getMousePointCloudIntersection(
					e.drag.end, 
					e.viewer.scene.getActiveCamera(), 
					e.viewer, 
					e.viewer.scene.pointclouds,
					{pickClipped: true});

				if (I) {
					let i = this.spheres.indexOf(e.drag.object);
					if (i !== -1) {
						//let point = this.points[i];
						//for (let key of Object.keys(I.point).filter(e => e !== 'position')) {
						//	point[key] = I.point[key];
						//}

						this.setPosition(i, I.location);
					}
				}
			};

			let drop = e => {
				let i = this.spheres.indexOf(e.drag.object);
				if (i !== -1) {
					this.dispatchEvent({
						'type': 'spotlight_helper_dropped',
						'spotlight_helper': this,
						'index': i
					});
				}
			};

			let mouseover = (e) => e.object.material.wireframe = true;
			let mouseleave = (e) => e.object.material.wireframe = false;

			this.sphere.addEventListener('drag', drag);
			this.sphere.addEventListener('drop', drop);
			this.sphere.addEventListener('mouseover', mouseover);
			this.sphere.addEventListener('mouseleave', mouseleave);
		}

		this.update();
	}
	
	setPosition (index, position) {
		//let point = this.points[index];
		//point.position.copy(position);
		this.light.position.copy(position);

		let event = {
			type: 'spotlight_helper_moved',
			measure:	this,
			index:	index,
			position: position.clone()
		};
		this.dispatchEvent(event);

		this.update();
	};
	
	setLookAt (index, lookAtPosition) {
		//let point = this.points[index];
		//point.position.copy(position);

		this.light.lookAt(lookAtPosition);

		let event = {
			type: 'spotlight_helper_rotated',
			measure:	this,
			index:	index,
			lookAt: lookAtPosition.clone()
		};
		this.dispatchEvent(event);

		this.update();
	};
	
	setDistance(d) {
		this.light.distance = d;
		
		this.update();
	}
	
	setAngle(a) {
		this.light.angle = a;
		
		this.update();
	}
	
	getTarget() {
		let target = new THREE.Vector3().addVectors(
			this.light.position, this.light.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1));
			
		return target;
	}
	
	getDistance() {
		return (this.light.distance > 0) ? this.light.distance / 4 : 5 * 1000;
	}
	
	getAngle() {
		return this.light.angle * 180 / Math.PI;
	}
	

	update(){
		
		this.light.updateMatrix();
		this.light.updateMatrixWorld();

		let position = this.light.position;
		//let target = new THREE.Vector3().addVectors(
		//	light.position,
		//	new THREE.Vector3().subVectors(light.position, this.light.getWorldDirection(new THREE.Vector3())));
		let target = new THREE.Vector3().addVectors(
			this.light.position, this.light.getWorldDirection(new THREE.Vector3()).multiplyScalar(-1));
		
		let quat = new THREE.Quaternion().setFromRotationMatrix(
			new THREE.Matrix4().lookAt( position, target, new THREE.Vector3( 0, 0, 1 ) )
		);

		this.setRotationFromQuaternion(quat);
		this.position.copy(position);


		let coneLength = (this.light.distance > 0) ? this.light.distance : 1000;
		let coneWidth = coneLength * Math.tan( this.light.angle * 0.5 );

		this.frustum.scale.set(coneWidth, coneWidth, coneLength);
		


		//{
		//	let fov = (180 * light.angle) / Math.PI;
		//	let aspect = light.shadow.mapSize.width / light.shadow.mapSize.height;
		//	let near = 0.1;
		//	let far = light.distance === 0 ? 10000 : light.distance;
		//	this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		//	this.camera.up.set(0, 0, 1);
		//	this.camera.position.copy(light.position);

		//	let target = new THREE.Vector3().addVectors(light.position, light.getWorldDirection(new THREE.Vector3()));
		//	this.camera.lookAt(target);

		//	this.camera.updateProjectionMatrix();
		//	this.camera.updateMatrix();
		//	this.camera.updateMatrixWorld();
		//	this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
		//}

	}

}