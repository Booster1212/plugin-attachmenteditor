import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../client/extensions/view2';
import { playAnimation } from '../../../client/systems/animations';
import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';
import IAttachable from '../../../shared/interfaces/iAttachable';

const view = await WebViewController.get();
let createdObject: number;
let isAttached = false;
alt.setInterval(() => {
    native.invalidateIdleCam();
    native.invalidateVehicleIdleCam();
}, 20000);

view.on('LittleTest', (data) => {
    try {
        removeObject();
    } catch (e) {}

    native.requestModel(alt.hash(data.model));
    if (native.hasModelLoaded(alt.hash(data.model))) {
        createdObject = native.createObject(
            alt.hash(data.model),
            data.position.x,
            data.position.y,
            data.position.z,
            true,
            true,
            true,
        );

        native.attachEntityToEntity(
            createdObject,
            alt.Player.local.scriptID,
            native.getPedBoneIndex(alt.Player.local, data.boneId),
            data.position.x,
            data.position.y,
            data.position.z,
            data.rotation.x,
            data.rotation.y,
            data.rotation.z,
            false,
            true,
            true,
            false,
            1,
            true,
        );
        alt.toggleGameControls(false);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
    }
});

function removeObject() {
    if (createdObject) {
        native.detachEntity(createdObject, true, true);
        native.deleteObject(createdObject);
        isAttached = false;
    }
}

view.on('PlayAnimation', (dict: string, name: string) => {
    playAnimation(dict, name, ANIMATION_FLAGS.STOP_LAST_FRAME);
});

view.on('CancelAnimation', () => {
    native.clearPedTasks(alt.Player.local.scriptID);
});

view.on('WriteToFS', (objectData) => {
    alt.emitServer('WriteToFS', objectData);
});
