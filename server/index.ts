import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

import './src/events';

const PLUGIN_NAME = 'AttachmentEditor';
const AUTHORS = ['Der Lord!'];

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    alt.log(`~lg~[PLUGIN] ==> ${PLUGIN_NAME} has been loaded! (~w~Authors: ${AUTHORS.join(', ')}~lg~)`);
});
