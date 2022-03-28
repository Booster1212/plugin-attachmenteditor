import * as alt from 'alt-server';
import { PluginSystem } from '../../server/systems/plugins';

import './src/server-events';

const ObjectEditor = {
    name: 'ObjectEditor',
}

PluginSystem.registerPlugin(ObjectEditor.name, () => {
    alt.log('ObjectEditor plugin loaded');
});