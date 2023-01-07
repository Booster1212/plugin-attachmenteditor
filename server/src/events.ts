import * as alt from 'alt-server';
import { AttachmentEditorEvents } from '../../shared/enums/events';
import fs from 'fs';
import path from 'path';
import util from 'util';
import IAttachable from '../../../../shared/interfaces/iAttachable';
import { config } from '../../shared/config';

type attachment = {
    prop: string;
    boneId: number;
    animationDictionary: string;
    animationName: string;
    animationFlag: number;
};

alt.onClient(AttachmentEditorEvents.GENERATE_FILE, (_player, current, posData) => {
    try {
        if (config.useFileSystem) {
            const transformedObject: IAttachable = {
                bone: current.boneId,
                pos: {
                    x: +posData.pos.x,
                    y: +posData.pos.y,
                    z: +posData.pos.z,
                },
                rot: {
                    x: +posData.rot.x,
                    y: +posData.rot.y,
                    z: +posData.rot.z,
                },
                model: current.prop,
                uid: `FileSystem-${current.prop}`,
            };

            const writeFile = util.promisify(fs.writeFile);
            const currentPath = path.join(
                process.cwd(),
                '/src/core/plugins/plugin-attachmenteditor/server/src/generated-objects/',
            );
            writeFile(`${currentPath}${current.prop}.json`, JSON.stringify(transformedObject, undefined, 4))
                .then(() => {
                    alt.log(`[AttachmentEditor] Generated File for ${current.prop}`);
                })
                .catch((error) => {
                    alt.logError(error);
                });
        } else {
            const transformedObject: IAttachable = {
                bone: current.boneId,
                pos: {
                    x: +posData.pos.x,
                    y: +posData.pos.y,
                    z: +posData.pos.z,
                },
                rot: {
                    x: +posData.rot.x,
                    y: +posData.rot.y,
                    z: +posData.rot.z,
                },
                model: current.prop,
                uid: `Console-${current.prop}`,
            };
            alt.log(JSON.stringify(transformedObject, undefined, 4));
        }
    } catch (e) {
        alt.logError(`[AttachmentEditor] Filesystem permission denied! ${e}`);
    }
});
