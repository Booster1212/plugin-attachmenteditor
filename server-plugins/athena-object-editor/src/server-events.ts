import * as alt from 'alt-server';
import * as fs from 'fs';
import * as util from 'util';

import path from 'path';

import IAttachable from '../../../shared/interfaces/iAttachable';

alt.onClient('WriteToFS', (player: alt.Player, objectData) => {
    const changeMe: IAttachable = {
        model: objectData.model,
        bone: objectData.boneId,
        pos: objectData.position,
        rot: objectData.rotation,
        uid: 'ChangeMe!',
    };
    const resolvedPath = path.resolve(
        process.cwd() + `/src/core/server-plugins/athena-object-editor/src/fs-objects/${objectData.model}.json`,
    );
    const writeFile = util.promisify(fs.writeFile);
    writeFile(resolvedPath, JSON.stringify(changeMe), null)
        .then(() => {
            console.log('File created successfully');
        })
        .catch((error) => {
            console.log(error);
        });
});
