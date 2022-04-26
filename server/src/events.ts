import * as alt from 'alt-server';
import { Vector3 } from 'alt-server';
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

alt.onClient(
    AttachmentEditorEvents.generateFile,
    (player: alt.Player, current: attachment, posData: { pos: Vector3; rot: Vector3 }) => {
        if(!config.useFileSystem) {
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
            return;
        }
        try {
            const writeFile = util.promisify(fs.writeFile);
            const currentPath = path.join(
                process.cwd() + '/src/core/plugins/plugin-attachmenteditor/server/src/generated-objects/',
            );
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
            writeFile(currentPath + `${current.prop}.json`, JSON.stringify(transformedObject, undefined, 4))
                .then(() => {
                    alt.log(`~lg~[AttachmentEditor] ==> Generated File for ${current.prop}`);
                })
                .catch((error: string) => {
                    alt.logError(error);
                });
        } catch (e) {
            alt.logError(`[AttachmentEditor] ==> Filesystem permission denied! ${e}`);
        }
    },
);
