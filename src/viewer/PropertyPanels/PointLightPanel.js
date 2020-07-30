
import {Utils} from "../../utils.js";

export class PointLightPanel{
	constructor(viewer, pointlight, propertiesPanel){
		this.viewer = viewer;
		this.pointlight = pointlight;
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
					<label>x:</label><input id="pointlight_position_x" />
				</td></tr>
				<tr><td>
					<label>y:</label><input id="pointlight_position_y" />
				</td></tr>
				<tr><td>
					<label>z:</label><input id="pointlight_position_z" />
				</td></tr>
				
				<tr><td>
					<label>distance:</label><input id="pointlight_distance" />
				</td></tr>
				
				<tr>
					<th colspan="6">target</th>
					<th></th>
				</tr>
				<tr>
								
				<tr>
				</tr>
			</table>
		</div>
		`);


		//this.propertiesPanel.addVolatileListener(viewer, "pointlight_changed", this._update);
		
		this.elContent.find("#pointlight_position_x")[0].addEventListener('change', function () {
			var x = parseFloat(this.elContent.find("#pointlight_position_x")[0].value);
			this.positionChange(x, null, null);
        }.bind(this));
		
		this.elContent.find("#pointlight_position_y")[0].addEventListener('change', function () {
			var y = parseFloat(this.elContent.find("#pointlight_position_y")[0].value);
			this.positionChange(null, y, null);
        }.bind(this));
		
		this.elContent.find("#pointlight_position_z")[0].addEventListener('change', function () {
			var z = parseFloat(this.elContent.find("#pointlight_position_z")[0].value);
			this.positionChange(null, null, z);
        }.bind(this));
		
		this.elContent.find("#pointlight_distance")[0].addEventListener('change', function () {
			var d = parseFloat(this.elContent.find("#pointlight_distance")[0].value);
			this.distanceChange(d);
        }.bind(this));
		
		this.update();
	}
	
	positionChange(x,y,z) {
		let pos = this.pointlight.position;
		if(x != null) pos.x = x;
		if(y != null) pos.y = y;
		if(z != null) pos.z = z;
		this.pointlight.position.copy(pos);
	}
	
	distanceChange(d) {		
		this.pointlight.distance = d;
	}
	
	update(){
		//console.log("updating pointlight panel");
		
		let distance = (this.pointlight.distance > 0) ? this.pointlight.distance / 4 : 5 * 1000;
		
		let position = this.pointlight.position;
		
		let pos = position.toArray().map(c => Utils.addCommas(c.toFixed(3)));
		
		this.elContent.find("#pointlight_position_x")[0].value = pos[0];
		this.elContent.find("#pointlight_position_y")[0].value = pos[1];
		this.elContent.find("#pointlight_position_z")[0].value = pos[2];
		
		this.elContent.find("#pointlight_distance")[0].value = distance;
				
	}
};