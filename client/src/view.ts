import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';

import { Vector3 } from 'alt-worker';
import { playAnimation } from '../../../../client/systems/animations';
import { AttachmentEditorEvents } from '../../shared/enums/events';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';

const PAGE_NAME = 'AttachmentEditor';
let createdObject: number | undefined;

type currentAttachment = {
    prop: string;
    boneId: number;
    animationDictionary: string;
    animationName: string;
    animationFlag: string;
};

function init() {
    const page = new AthenaClient.webview.Page({
        name: 'AttachmentEditor',
        callbacks: {
            onReady: async () => {
                alt.Player.local.setMeta('AttachmentEditor', true);
            },
            onClose: () => {
                alt.Player.local.deleteMeta('AttachmentEditor');
            },
        },
        keybind: {
            key: 122, // F12
            useSameKeyToClose: true,
            description: 'YourPluginPage',
            identifier: 'your-plugin-page-menu',
            allowInSpecificPage: 'YourPluginPage',
        },
        options: {
            onOpen: {
                focus: true,
                hideHud: true,
                hideOverlays: true,
                setIsMenuOpenToTrue: true,
                showCursor: true,
                disableControls: 'all',
                disablePauseMenu: true,
            },
            onClose: {
                hideCursor: true,
                showHud: true,
                showOverlays: true,
                unfocus: true,
                setIsMenuOpenToFalse: true,
                enableControls: true,
                enablePauseMenu: true,
            },
        },
    });
}

onTicksStart.add(init);

AthenaClient.webview.on(
    AttachmentEditorEvents.EMIT_DATA,
    (current: currentAttachment, posData: { pos: Vector3; rot: Vector3 }) => {
        try {
            removeObject();
        } catch (e) {
            alt.log(`[AttachmentEditor] ${e}`);
        }

        native.requestModel(alt.hash(current.prop));
        if (native.hasModelLoaded(alt.hash(current.prop))) {
            createdObject = native.createObject(
                alt.hash(current.prop),
                +posData.pos.x,
                +posData.pos.y,
                +posData.pos.z,
                true,
                true,
                true,
            );

            native.attachEntityToEntity(
                createdObject,
                alt.Player.local.scriptID,
                native.getPedBoneIndex(alt.Player.local, current.boneId),
                +posData.pos.y,
                +posData.pos.x,
                +posData.pos.z,
                +posData.rot.x,
                +posData.rot.y,
                +posData.rot.z,
                false,
                true,
                false,
                false,
                1,
                true,
                false,
            );
        }
    },
);

AthenaClient.webview.on(
    AttachmentEditorEvents.INPUT_CHANGED,
    (current: currentAttachment, posData: { pos: Vector3; rot: Vector3 }) => {
        try {
            removeObject();
        } catch (e) {
            alt.log(`[AttachmentEditor] ${e}`);
        }

        native.requestModel(alt.hash(current.prop));
        if (native.hasModelLoaded(alt.hash(current.prop))) {
            createdObject = native.createObject(
                alt.hash(current.prop),
                +posData.pos.x,
                +posData.pos.y,
                +posData.pos.z,
                true,
                true,
                true,
            );

            native.attachEntityToEntity(
                createdObject,
                alt.Player.local.scriptID,
                native.getPedBoneIndex(alt.Player.local, current.boneId),
                +posData.pos.x,
                +posData.pos.y,
                +posData.pos.z,
                +posData.rot.x,
                +posData.rot.y,
                +posData.rot.z,
                false,
                true,
                true,
                false,
                1,
                true,
                false,
            );
        }
    },
);

AthenaClient.webview.on(AttachmentEditorEvents.PLAY_ANIMATION, (current: currentAttachment, isPlaying: boolean) => {
    console.log(`Animation Flag: ${current.animationFlag}`);
    const animationFlagInt = parseInt(current.animationFlag, 10);
    if (current.animationDictionary != '' && current.animationName != '') {
        isPlaying
            ? playAnimation(current.animationDictionary, current.animationName, animationFlagInt)
            : native.clearPedTasks(alt.Player.local.scriptID);
    }
});

AthenaClient.webview.on(AttachmentEditorEvents.DETACH_OBJECT, () => {
    try {
        removeObject();
    } catch (e) {
        alt.log(`[AttachmentEditor] ${e}`);
    }
});

function removeObject() {
    if (createdObject) {
        native.detachEntity(createdObject, true, true);
        native.deleteObject(createdObject);
        createdObject = undefined;
    }
}

alt.setInterval(() => {
    native.invalidateIdleCam();
    native.invalidateCinematicVehicleIdleMode();
}, 15000);
