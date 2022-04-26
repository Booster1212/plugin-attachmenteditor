<template v-slot:toolbar>
    <div class="flex-wrapper">
        <Toolbar @close-page="relayClosePage" pageName="AttachmentEditor">AttachmentEditor</Toolbar>
        <div class="main-wrapper">
            <div class="general-section">
                <p>General Section</p>
            </div>
            <div class="input-wrapper">
                <input type="text" placeholder="<Prop to Edit>" class="general-input" v-model="editorObject.prop" />
                <input type="number" placeholder="57005" class="general-input" />
                <input type="text" placeholder="<Animation Dictionary>" class="general-input" />
                <input type="text" placeholder="<Animation Name>" class="general-input" />
                <input type="text" placeholder="<Animation Flag>" class="general-input" />
            </div>

            <div class="position-section">
                <p>Position Section</p>
            </div>
            <div class="position-wrapper">
                <div class="pos">
                    Position X {{ posData.pos.x }}
                    <input
                        type="range"
                        min="0"
                        max="360"
                        class="pos-input"
                        v-model="posData.pos.x"
                        @input="handlePosSwitch"
                    />

                    Position Y {{ posData.pos.y }}
                    <input
                        type="range"
                        min="0"
                        max="360"
                        class="pos-input"
                        v-model="posData.pos.y"
                        @input="handlePosSwitch"
                    />

                    Position Z {{ posData.pos.z }}
                    <input
                        type="range"
                        min="0"
                        max="360"
                        class="pos-input"
                        v-model="posData.pos.z"
                        @input="handlePosSwitch"
                    />
                </div>
                <div class="rot">
                    Rotation X {{ posData.rot.x }}
                    <input
                        type="range"
                        min="0"
                        max="360"
                        class="pos-input"
                        v-model="posData.rot.x"
                        @input="handlePosSwitch"
                    />

                    Rotation Y {{ posData.rot.y }}
                    <input
                        type="range"
                        min="0"
                        max="360"
                        class="pos-input"
                        v-model="posData.rot.y"
                        @input="handlePosSwitch"
                    />

                    Rotation Z {{ posData.rot.z }}
                    <input
                        type="range"
                        min="0"
                        max="360"
                        class="pos-input"
                        v-model="posData.rot.z"
                        @input="handlePosSwitch"
                    />
                </div>
            </div>
            <div class="management-section">
                <p>Management Section</p>
            </div>
            <div class="button-wrapper">
                <button @click="attachObject">Attach Object</button>
                <button>Detach Object</button>
                <button>Play Animation</button>
                <button @click="saveEditing">Save Editing</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { AttachmentEditorEvents } from '../shared/enums/events';
import Toolbar from '@components/Toolbar.vue';
defineComponent({
    name: 'AttachmentEditor',
    components: {
        Toolbar,
    },
});

let editorObject = ref({
    prop: ref('prop_tool_blowtorch'),
    boneId: ref(57005),
    animationDictionary: ref(''),
    animationName: ref(''),
    animationFlag: ref(0),
});

let posData = ref({
    pos: {
        x: ref(0),
        y: ref(0),
        z: ref(0),
    },
    rot: {
        x: ref(0),
        y: ref(0),
        z: ref(0),
    },
});

function attachObject() {
    if (editorObject.value.prop !== '') {
        if ('alt' in window) {
            alt.emit(AttachmentEditorEvents.emitDataToClient, editorObject.value, posData.value);
        }
    }
}

function detachObject() {}

function saveEditing() {
    if (editorObject.value.prop !== '') {
        if('alt' in window) {
            alt.emit(AttachmentEditorEvents.generateFile, editorObject.value, posData.value);
        }
    }
}

function handlePosSwitch() {
    alt.emit(AttachmentEditorEvents.inputChanged, editorObject.value, posData.value);
}

function relayClosePage() {
    alt.emit(`AttachmentEditor:Close`);
}
</script>

<style scoped>
.flex-wrapper {
    position: absolute;
    left: 2.5%;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;

    width: 400px;
    height: 1000px;
    max-height: 1000px;
}

.main-wrapper {
    max-height: 900px;
    overflow-y: auto;
    overflow-x: hidden;

    display: flex;
    flex-direction: column;

    align-self: flex-start;
    align-content: center;
    align-items: center;

    background: rgb(0, 0, 0);
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

.input-wrapper {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    background: rgb(0, 0, 0);
    margin: 20px;
}

.general-input {
    width: 100%;
    border: 0px;
    border-radius: 5px;
    padding: 5px;
    transition: 0.5s !important;
    margin: 10px;
}

.position-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    width: 70%;
    margin: 20px;
}

.pos-input {
    display: flex;
    align-self: center;
    border: 1px solid rgba(255, 255, 255, 0.268);
    width: 100%;
    margin: 25px;
}

.pos {
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: flex-start;
    align-items: center;
    width: 40%;
}
.rot {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    justify-content: flex-end;
    align-items: center;
    width: 40%;
}
::placeholder {
    text-align: center;
}

.button-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    width: 100%;
    margin: 20px;
}

.general-section {
    width: 100%;
    height: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    background: linear-gradient(90deg, rgba(11, 42, 70, 1) 0%, rgba(4, 128, 221, 1) 35%, rgba(0, 212, 255, 1) 100%);
    border-bottom: 1px inset rgb(255, 255, 255, 0.5);
}

.position-section {
    width: 100%;
    height: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    background: linear-gradient(90deg, rgba(11, 42, 70, 1) 0%, rgba(4, 128, 221, 1) 35%, rgba(0, 212, 255, 1) 100%);
    border-bottom: 1px inset rgb(255, 255, 255, 0.5);
}

.management-section {
    width: 100%;
    height: 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
    background: linear-gradient(90deg, rgba(11, 42, 70, 1) 0%, rgba(4, 128, 221, 1) 35%, rgba(0, 212, 255, 1) 100%);
    border-bottom: 1px inset rgb(255, 255, 255, 0.5);
}

button {
    background: rgb(61, 60, 60);
    color: white;
    border: 0px;
    border-radius: 5px;
    height: 30px;
    width: 150px;
    transition: 0.5s !important;
    margin: 10px;
}

button:hover {
    transition: 0.5s !important;
    background: rgb(0, 0, 0);
    color: rgb(10, 123, 23);
    cursor: pointer;
}

input {
    text-align: center;
    color: white;
    background: rgb(66, 86, 90);
}

* {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1em;
}
</style>
