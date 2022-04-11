import * as alt from 'alt-client';
import * as native from 'natives';
import { WebViewController } from '../../../client/extensions/view2';
import { playAnimation } from '../../../client/systems/animations';
import { showNotification } from '../../../client/utility/notification';
import { ANIMATION_FLAGS } from '../../../shared/flags/animationFlags';

const view = await WebViewController.get();
let createdObject: number;

alt.setInterval(() => {
    native.invalidateIdleCam();
    native.invalidateVehicleIdleCam();
}, 20000);

view.on('AttachObject', (data) => {
    try {
        removeObject();
    } catch (e) {}

    alt.Player.local.setMeta('AttachedObjectPosition', data.position);
    alt.Player.local.setMeta('AttachedObjectRotation', data.rotation);
    alt.Player.local.setMeta('AttachedObjectModel', data.model);
    alt.Player.local.setMeta('RagdollBone', data.boneId);
    alt.Player.local.setMeta('AnimationDict', data.animation);
    alt.Player.local.setMeta('AnimationName', data.animationName);

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
            false,
            false,
            1,
            true,
        );
        alt.Player.local.setMeta('ObjectIsAttached', true);
    }
});

view.on('ChangeAttachedObject', (data) => {
    if (alt.Player.local.hasMeta('ObjectIsAttached')) {
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

            alt.Player.local.setMeta('AttachedObjectPosition', data.position);
            alt.Player.local.setMeta('AttachedObjectRotation', data.rotation);
            alt.Player.local.setMeta('AttachedObjectModel', data.model);
            alt.Player.local.setMeta('RagdollBone', data.boneId);
            alt.Player.local.setMeta('AnimationDict', data.animation);
            alt.Player.local.setMeta('AnimationName', data.animationName);
        }
    } else { 
        showNotification('You need to attach an object first!');
        return;
    }
});

function removeObject() {
    if (createdObject) {
        native.detachEntity(createdObject, true, true);
        native.deleteObject(createdObject);
        alt.Player.local.deleteMeta('AttachedObjectPosition');
        alt.Player.local.deleteMeta('AttachedObjectRotation');
        alt.Player.local.deleteMeta('AttachedObjectModel');
        alt.Player.local.deleteMeta('RagdollBone');
        alt.Player.local.deleteMeta('AnimationDict');
        alt.Player.local.deleteMeta('AnimationName');
    } else {
        return;
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
