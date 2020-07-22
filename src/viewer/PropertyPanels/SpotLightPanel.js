
import {Utils} from "../../utils.js";

export class SpotLightPanel{
	constructor(viewer, spotlight, propertiesPanel){
		this.viewer = viewer;
		this.spotlight = spotlight;
		this.propertiesPanel = propertiesPanel;

		this._update = () => { this.update(); };

		let copyIconPath = Potree.resourcePath + '/icons/copy.svg';
		this.elContent = $(`
		<div class="propertypanel_content">
			<table>
				<tr>
					<th colspan="6">position</th>
					<th></th>
				</tr>
				
				<tr><td>
					<label>x:</label><input id="spotlight_position_x" />
				</td></tr>
				<tr><td>
					<label>y:</label><input id="spotlight_position_y" />
				</td></tr>
				<tr><td>
					<label>z:</label><input id="spotlight_position_z" />
				</td></tr>
				
				<tr>
					<th colspan="6">target</th>
					<th></th>
				</tr>
				<tr>
				
				<tr><td>
					<label>x:</label><input id="spotlight_target_x" />
				</td></tr>
				<tr><td>
					<label>y:</label><input id="spotlight_target_y" />
				</td></tr>
				<tr><td>
					<label>z:</label><input id="spotlight_target_z" />
				</td></tr>
				
				<tr>
					<th colspan="6">distance & angle</th>
					<th></th>
				</tr>
				<tr>
				
				<tr><td>
					<label>distance:</label><input id="spotlight_distance" />
				</td></tr>
				<tr><td>
					<label>angle:</label><input id="spotlight_angle" />
				</td></tr>
				
				<tr>
				</tr>
			</table>
		</div>
		`);


		//this.propertiesPanel.addVolatileListener(viewer, "spotlight_changed", this._update);
		
		this.elContent.find("#spotlight_position_x")[0].addEventListener('change', function () {
			var x = parseFloat(this.elContent.find("#spotlight_position_x")[0].value);
			this.positionChange(x, null, null);
        }.bind(this));
		
		this.elContent.find("#spotlight_position_y")[0].addEventListener('change', function () {
			var y = parseFloat(this.elContent.find("#spotlight_position_y")[0].value);
			this.positionChange(null, y, null);
        }.bind(this));
		
		this.elContent.find("#spotlight_position_z")[0].addEventListener('change', function () {
			var z = parseFloat(this.elContent.find("#spotlight_position_z")[0].value);
			this.positionChange(null, null, z);
        }.bind(this));
		
		this.elContent.find("#spotlight_target_x")[0].addEventListener('change', function () {
			var x = parseFloat(this.elContent.find("#spotlight_target_x")[0].value);
			this.targetChange(x, null, null);
        }.bind(this));
		
		this.elContent.find("#spotlight_target_y")[0].addEventListener('change', function () {
			var y = parseFloat(this.elContent.find("#spotlight_target_y")[0].value);
			this.targetChange(null, y, null);
        }.bind(this));
		
		this.elContent.find("#spotlight_target_z")[0].addEventListener('change', function () {
			var z = parseFloat(this.elContent.find("#spotlight_target_z")[0].value);
			this.targetChange(null, null, z);
        }.bind(this));
		
		this.elContent.find("#spotlight_distance")[0].addEventListener('change', function () {
			var d = parseFloat(this.elContent.find("#spotlight_distance")[0].value);
			this.distanceChange(d);
        }.bind(this));
		
		this.elContent.find("#spotlight_angle")[0].addEventListener('change', function () {
			var a = parseFloat(this.elContent.find("#spotlight_angle")[0].value);
			this.angleChange(a);
        }.bind(this));
		
		this.update();
	}
	
	positionChange(x,y,z) {
		let pos = this.spotlight.position;
		if(x != null) pos.x = x;
		if(y != null) pos.y = y;
		if(z != null) pos.z = z;
		this.spotlight.position.copy(pos);
	}
		
	targetChange(x,y,z) {
		let distance = (this.spotlight.distance > 0) ? this.spotlight.distance / 4 : 5 * 1000;
		let position = this.spotlight.position;
		let angle = this.spotlight.angle * 180 / Math.PI;
		let target = new THREE.Vector3().addVectors(
					position, 
					this.spotlight.getWorldDirection(new THREE.Vector3()).multiplyScalar(-distance));
		
		if(x != null) target.x = x;
		if(y != null) target.y = y;
		if(z != null) target.z = z;
		this.spotlight.lookAt(target);
	}
	
	distanceChange(d) {		
		this.spotlight.distance = d;
	}
	
	angleChange(a) {
		this.spotlight.angle = (a / 180) * Math.PI;
	}
	
	update(){
		//console.log("updating spotlight panel");
		
		let distance = (this.spotlight.distance > 0) ? this.spotlight.distance / 4 : 5 * 1000;
		let position = this.spotlight.position;
		let angle = this.spotlight.angle * 180 / Math.PI;
		let target = new THREE.Vector3().addVectors(
					position, 
					this.spotlight.getWorldDirection(new THREE.Vector3()).multiplyScalar(-distance));
		
		let pos = position.toArray().map(c => Utils.addCommas(c.toFixed(3)));
		let temp = this.elContent.find("#spotlight_position_x");
		
		this.elContent.find("#spotlight_position_x")[0].value = pos[0];
		this.elContent.find("#spotlight_position_y")[0].value = pos[1];
		this.elContent.find("#spotlight_position_z")[0].value = pos[2];
		
		
		let tgt = target.toArray().map(c => Utils.addCommas(c.toFixed(3)));
		let temp2 = this.elContent.find("#spotlight_target_x");
		
		this.elContent.find("#spotlight_target_x")[0].value = tgt[0];
		this.elContent.find("#spotlight_target_y")[0].value = tgt[1];
		this.elContent.find("#spotlight_target_z")[0].value = tgt[2];
		
		this.elContent.find("#spotlight_distance")[0].value = distance;
		this.elContent.find("#spotlight_angle")[0].value = angle;
		
	}
};