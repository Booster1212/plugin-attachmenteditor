import * as alt from 'alt-client';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import native from 'natives';

// You should change this to match your Vue Template's ComponentName.
const PAGE_NAME = 'ObjectEditor';
let editorPosition = null;
let editorRotation = null;

class InternalFunctions implements ViewModel {
    static async open() {
        // Check if any other menu is open before opening this.
        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        // This is where we bind our received events from the WebView to
        // the functions in our WebView.
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);

        // This is where we open the page and show the cursor.
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        // Turn off game controls, hide the hud.
        alt.toggleGameControls(false);

        // Let the rest of the script know this menu is open.
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        // Turn off bound events.
        // If we do not turn them off we get duplicate event behavior.
        // Also will cause a memory leak if you do not turn them off.
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);

        // Close the page.
        WebViewController.closePages([PAGE_NAME]);

        // Turn on game controls, show the hud.
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        // Let the rest of the script know this menu is closed.
        alt.Player.local.isMenuOpen = false;
    }

    /**
     * You should call this from the WebView.
     * What this will let you do is define local data in the client.
     *
     * Then when the WebView is ready to receieve that data we can send it.
     * The flow is:
     *
     * Send From WebView -> Get the Data Here -> Send to the WebView
     *
     * @static
     * @memberof InternalFunctions
     */
    static async ready() {
        const view = await WebViewController.get();
        if (alt.Player.local.hasMeta('AttachedObjectPosition') && alt.Player.local.hasMeta('AttachedObjectRotation')) {
            view.emit('SetEditorData', editorPosition, editorRotation);
        } else {
            console.log('No Data to Emit.');
        }
    }
}

alt.on('keydown', (key) => {
    if (key === 120) {
        if (alt.Player.local.hasMeta('AttachedObjectPosition') && alt.Player.local.hasMeta('AttachedObjectRotation')) {
            editorPosition = {
                x: alt.Player.local.getMeta('AttachedObjectPosition').x,
                y: alt.Player.local.getMeta('AttachedObjectPosition').y,
                z: alt.Player.local.getMeta('AttachedObjectPosition').z,
            }
            editorRotation = { 
                x: alt.Player.local.getMeta('AttachedObjectRotation').x,
                y: alt.Player.local.getMeta('AttachedObjectRotation').y,
                z: alt.Player.local.getMeta('AttachedObjectRotation').z,
            }

            alt.log(JSON.stringify(editorPosition));
            alt.log(JSON.stringify(editorRotation));
        } else {
            console.log('No Data');
        }
        InternalFunctions.open();
    }
});
