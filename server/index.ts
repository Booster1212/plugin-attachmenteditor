import * as alt from 'alt-server';
import { PluginSystem } from '../../../server/systems/plugins';

import './src/events';

const PLUGIN_NAME = 'AttachmentEditor';
const AUTHORS = ['Der Lord!'];

PluginSystem.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~[PLUGIN] ==> ${PLUGIN_NAME} has been loaded! (~w~Authors: ${AUTHORS.join(', ')}~lg~)`);
});
