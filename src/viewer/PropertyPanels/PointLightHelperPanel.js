
import {Utils} from "../../utils.js";

export class PointLightHelperPanel{
	constructor(viewer, pointlighthelper, propertiesPanel){
		this.viewer = viewer;
		this.pointlighthelper = pointlighthelper;
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
					<label>x:</label><input id="pointlight_helper_position_x" />
				</td></tr>
				<tr><td>
					<label>y:</label><input id="pointlight_helper_position_y" />
				</td></tr>
				<tr><td>
					<label>z:</label><input id="pointlight_helper_position_z" />
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
		
		this.elContent.find("#pointlight_helper_position_x")[0].addEventListener('change', function () {
			var x = parseFloat(this.elContent.find("#pointlight_helper_position_x")[0].value);
			this.positionChange(x, null, null);
        }.bind(this));
		
		this.elContent.find("#pointlight_helper_position_y")[0].addEventListener('change', function () {
			var y = parseFloat(this.elContent.find("#pointlight_helper_position_y")[0].value);
			this.positionChange(null, y, null);
        }.bind(this));
		
		this.elContent.find("#pointlight_helper_position_z")[0].addEventListener('change', function () {
			var z = parseFloat(this.elContent.find("#pointlight_helper_position_z")[0].value);
			this.positionChange(null, null, z);
        }.bind(this));
				
		this.update();
	}
	
	positionChange(x,y,z) {
		let pos = this.pointlighthelper.position;
		if(x != null) pos.x = x;
		if(y != null) pos.y = y;
		if(z != null) pos.z = z;
		this.pointlighthelper.setPosition(0,pos);
	}
	
	update(){
		//console.log("updating spotlight panel");
		
		let position = this.pointlighthelper.position;
		
		let pos = position.toArray().map(c => Utils.addCommas(c.toFixed(3)));
		
		this.elContent.find("#pointlight_helper_position_x")[0].value = pos[0];
		this.elContent.find("#pointlight_helper_position_y")[0].value = pos[1];
		this.elContent.find("#pointlight_helper_position_z")[0].value = pos[2];
				
	}
};