import {Utils} from "../utils.js";
import {SphereVolume, BoxVolume} from "./Volume.js";

export class PointLightHelper extends THREE.Object3D{

	constructor(light, color){
		super();

		this.light = light;
		this.color = color;
		
		this.spheres = [];

		//this.up.set(0, 0, 1);
		this.updateMatrix();
		this.updateMatrixWorld();
		
		this.pointclouds = []; // This is used to control dragging
		
		this.scene = new THREE.Scene();
		this.scene.name = 'scene_pointlighthelper';
		
		{
			this.volume = new SphereVolume();
			this.add(this.volume);
			this.scene.add(this.volume);
			this.volume.sphere.visible = true;
			this.volume.visible = true;
		}


		{ // SPHERE
			let sg = new THREE.SphereGeometry(1, 32, 32);
			sg.computeBoundingBox();
			let sm = new THREE.MeshNormalMaterial();
			
			this.sphere = new THREE.Mesh(sg, sm);
			//this.sphere.scale.set(0.1, 0.1, 0.1);
			//Sthis.sphere.geometry.computeBoundingBox();
			
			this.add(this.sphere);
			this.spheres.push(this.sphere);
		}
		
		
		{ // Event Listeners
			let drag = (e) => {
				let I = Utils.getMousePointCloudIntersection(
					e.drag.end, 
					e.viewer.scene.getActiveCamera(), 
					e.viewer, 
					this.pointclouds.length > 0 ? this.pointclouds : e.viewer.scene.pointclouds,
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
						'type': 'pointlight_helper_dropped',
						'pointlight_helper': this,
						'index': i
					});
				}
			};

			let mouseover = (e) => {
				e.object.material.wireframe = true;
			};
			let mouseleave = (e) => {
				e.object.material.wireframe = false;
			};
			
			let onPositionChanged = (e) => {
				this.setPosition(0, e.object.position);
			}

			this.sphere.addEventListener('drag', drag);
			this.sphere.addEventListener('drop', drop);
			this.sphere.addEventListener('mouseover', mouseover);
			this.sphere.addEventListener('mouseleave', mouseleave);
			
			this.volume.addEventListener('position_changed', onPositionChanged);
		}

		this.updateProperties();
	}
	
	
	
	setPosition (index, position) {
		//let point = this.points[index];
		//point.position.copy(position);
		this.light.position.copy(position);
		//this.volume.position.copy(position);

		let event = {
			type: 'pointlight_helper_moved',
			measure:	this,
			index:	index,
			position: position.clone()
		};
		this.dispatchEvent(event);

		this.updateProperties();
	};
		
	setDistance(d) {
		this.light.distance = d;
		
		let event = {
			type: 'pointlight_helper_distance_changed',
			measure:	this,
			distance: d
		};
		this.dispatchEvent(event);
		
		this.updateProperties();
	}
	
	getDistance() {
		return (this.light.distance > 0) ? this.light.distance / 4 : 5 * 1000;
	}
		
	setViewer(viewer) {
		this.viewer = viewer;
		//this.viewer.inputHandler.startDragging(this.volume);
		this.viewer.scene.addVolume(this.volume);
	}

	updateProperties(){
		
		this.light.updateMatrix();
		this.light.updateMatrixWorld();

		let position = this.light.position;
		//let target = new THREE.Vector3().addVectors(
		//	light.position,
		//	new THREE.Vector3().subVectors(light.position, this.light.getWorldDirection(new THREE.Vector3())));
		
		this.position.copy(position);
		this.volume.position.copy(position);
		

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
		
	update() {
		if(this.viewer) {
			let camera = this.viewer.scene.getActiveCamera();
			
			const renderAreaSize = this.viewer.renderer.getSize(new THREE.Vector2());
			let clientWidth = renderAreaSize.width;
			let clientHeight = renderAreaSize.height;
			
			// make size independant of distance
			// spheres
			for(let sphere of this.spheres){
				let distance = camera.position.distanceTo(sphere.getWorldPosition(new THREE.Vector3()));
				let pr = Utils.projectedRadius(1, camera, distance, clientWidth, clientHeight);
				let scale = (10 / pr);
				sphere.scale.set(scale, scale, scale);
			}
			
			let distance = camera.position.distanceTo(this.volume.getWorldPosition(new THREE.Vector3()));
			let pr = Utils.projectedRadius(1, camera, distance, clientWidth, clientHeight);
			let scale = (10 / pr);
			this.volume.scale.set(scale, scale, scale);
			//this.volume.update();
		}

	}
	
	render(params){
		
		const renderer = this.viewer.renderer;

		const oldTarget = renderer.getRenderTarget();
		
		if(params.renderTarget){
			renderer.setRenderTarget(params.renderTarget);
		}
		renderer.render(this.scene, this.viewer.scene.getActiveCamera());
		renderer.setRenderTarget(oldTarget);
	}

}