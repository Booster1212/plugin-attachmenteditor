import * as alt from 'alt-client';
import { Vector3 } from 'alt-worker';
import * as native from 'natives';
import { WebViewController } from '../../../../client/extensions/view2';
import ViewModel from '../../../../client/models/viewModel';
import { playAnimation } from '../../../../client/systems/animations';
import { isAnyMenuOpen } from '../../../../client/utility/menus';
import { AttachmentEditorEvents } from '../../shared/enums/events';

const view = await WebViewController.get();
const PAGE_NAME = 'AttachmentEditor';
let createdObject: number | undefined;

type currentAttachment = {
    prop: string;
    boneId: number;
    animationDictionary: string;
    animationName: string;
    animationFlag: number;
};

class InternalFunctions implements ViewModel {
    static async open() {
        if (isAnyMenuOpen()) {
            return;
        }

        await WebViewController.setOverlaysVisible(false);

        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);

        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);

        WebViewController.closePages([PAGE_NAME]);

        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        console.log('ready');
    }
}

view.on(AttachmentEditorEvents.EMIT_DATA, (current: currentAttachment, posData: { pos: Vector3; rot: Vector3 }) => {
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
        );
    }
});

view.on(AttachmentEditorEvents.INPUT_CHANGED, (current: currentAttachment, posData: { pos: Vector3; rot: Vector3 }) => {
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
        );
    }
});

view.on(AttachmentEditorEvents.PLAY_ANIMATION, (current: currentAttachment, isPlaying: boolean) => {
    if (current.animationDictionary != '' && current.animationName != '') {
        isPlaying ? playAnimation(current.animationDictionary, current.animationName, current.animationFlag) : native.clearPedTasks(alt.Player.local.scriptID);
    }
});

view.on(AttachmentEditorEvents.DETACH_OBJECT, () => {
    try {
        removeObject();
    } catch (e) {
        alt.log(`[AttachmentEditor] ${e}`);
    }
});

view.on(AttachmentEditorEvents.GENERATE_FILE, (current: currentAttachment, posData: { pos: Vector3; rot: Vector3 }) => {
    alt.emitServer(AttachmentEditorEvents.GENERATE_FILE, current, posData);
});

function removeObject() {
    createdObject ? (
        native.detachEntity(createdObject, true, true),
        native.deleteObject(createdObject),
        createdObject = undefined
    ) : undefined;
}

alt.on('keyup', (key) => {
    if (key === 123 && !alt.Player.local.hasMeta('AttachmentEditor')) {
        alt.Player.local.setMeta('AttachmentEditor', true);
        InternalFunctions.open();
    } else if (key === 123 && alt.Player.local.hasMeta('AttachmentEditor')) {
        InternalFunctions.close();
        alt.Player.local.deleteMeta('AttachmentEditor');
    }

    if (key === 27 && alt.Player.local.hasMeta('AttachmentEditor')) {
        InternalFunctions.close();
        alt.Player.local.deleteMeta('AttachmentEditor');
    }
});
