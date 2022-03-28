import * as alt from 'alt-server';
import fs from 'fs';
import path from 'path';

import IAttachable from '../../../shared/interfaces/iAttachable';

alt.onClient('WriteToFS', (player: alt.Player, objectData) => {
    const changeMe: IAttachable = {
        model: objectData.model,
        bone: objectData.boneId,
        pos: objectData.position,
        rot: objectData.rotation,
        uid: 'ChangeMe!'
    };
    const resolvedPath = path.resolve(process.cwd() + `/src/core/server-plugins/athena-object-editor/src/fs-objects/${objectData.model}.json`);
    fs.writeFile(resolvedPath, JSON.stringify(changeMe), null, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('File created successfully');
        }
    });
});