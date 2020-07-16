
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
					<th colspan="3">position</th>
					<th></th>
				</tr>
				<tr>
					<td align="center" id="spotlight_position_x" style="width: 25%"></td>
					<td align="center" id="spotlight_position_y" style="width: 25%"></td>
					<td align="center" id="spotlight_position_z" style="width: 25%"></td>
					<td align="right" id="copy_spotlight_position" style="width: 25%">
						<img name="copyPosition" title="copy" class="button-icon" src="${copyIconPath}" style="width: 16px; height: 16px"/>
					</td>
				</tr>
				<tr>
					<th colspan="3">target</th>
					<th></th>
				</tr>
				<tr>
					<td align="center" id="spotlight_target_x" style="width: 25%"></td>
					<td align="center" id="spotlight_target_y" style="width: 25%"></td>
					<td align="center" id="spotlight_target_z" style="width: 25%"></td>
					<td align="right" id="copy_spotlight_target" style="width: 25%">
						<img name="copyTarget" title="copy" class="button-icon" src="${copyIconPath}" style="width: 16px; height: 16px"/>
					</td>
				</tr>
			</table>
		</div>
		`);

		this.elCopyPosition = this.elContent.find("img[name=copyPosition]");
		this.elCopyPosition.click( () => {
			//let pos = this.viewer.scene.getActiveCamera().position.toArray();
			//let msg = pos.map(c => c.toFixed(3)).join(", ");
			//Utils.clipboardCopy(msg);

			//this.viewer.postMessage(
			//		`Copied value to clipboard: <br>'${msg}'`,
			//		{duration: 3000});
		});

		this.elCopyTarget = this.elContent.find("img[name=copyTarget]");
		this.elCopyTarget.click( () => {
			//let pos = this.viewer.scene.view.getPivot().toArray();
			//let msg = pos.map(c => c.toFixed(3)).join(", ");
			//Utils.clipboardCopy(msg);

			//this.viewer.postMessage(
			//		`Copied value to clipboard: <br>'${msg}'`,
			//		{duration: 3000});
		});

		//this.propertiesPanel.addVolatileListener(viewer, "spotlight_changed", this._update);
		
		this.update();
	}

	update(){
		//console.log("updating spotlight panel");
		
		let distance = (this.spotlight.distance > 0) ? this.spotlight.distance / 4 : 5 * 1000;
		let position = this.spotlight.position;
		let target = new THREE.Vector3().addVectors(
					position, 
					this.spotlight.getWorldDirection(new THREE.Vector3()).multiplyScalar(-distance));
		
		let pos = position.toArray().map(c => Utils.addCommas(c.toFixed(3)));
		this.elContent.find("#spotlight_position_x").html(pos[0]);
		this.elContent.find("#spotlight_position_y").html(pos[1]);
		this.elContent.find("#spotlight_position_z").html(pos[2]);
		
		
		let tgt = target.toArray().map(c => Utils.addCommas(c.toFixed(3)));
		this.elContent.find("#spotlight_target_x").html(tgt[0]);
		this.elContent.find("#spotlight_target_y").html(tgt[1]);
		this.elContent.find("#spotlight_target_z").html(tgt[2]);
	}
};