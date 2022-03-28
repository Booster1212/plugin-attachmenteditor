<template>
    <div class="wrapper">
        <button class="close-btn">Close</button>
        <input class="object-model-input" placeholder="Object Model" v-model="objectData.model" />
        <input class="bone-id-input" placeholder="<BoneID 18610>" v-model="objectData.boneId" />
        <input class="animation-input" placeholder="Some Animation" v-model="objectData.animation" />
        <input class="animation-name-input" placeholder="Some Animation" v-model="objectData.animationName" />
        <input class="animation-flag-input" placeholder="49" v-model="objectData.animationFlag" />

        <button class="attach-button">Attach Object</button>
        <button class="detach-button">Detach Object</button>
        <button class="animation-button" @click="playAnim">Play Animation</button>
        <button class="cancel-animation-button" @click="cancelAnim">Cancel Animation</button>
        <button class="filesystem-button" @click="createFile">Write to Filesystem</button>
        <div class="sliders">
            <div class="stack">
                <p style="text-align: center">Position Data</p>
                <div class="split split-full space-between">
                    <RangeInput
                        :minIndex="minIndex"
                        :increment="increment"
                        :indexValue="indexValue"
                        :maxIndex="maxIndex"
                        @input="(e) => generateAttachable('posX', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                    <RangeInput
                        :minIndex="minIndex"
                        :increment="increment"
                        :indexValue="indexValue"
                        :maxIndex="maxIndex"
                        @input="(e) => generateAttachable('posY', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                    <RangeInput
                        :minIndex="minIndex"
                        :increment="increment"
                        :indexValue="indexValue"
                        :maxIndex="maxIndex"
                        @input="(e) => generateAttachable('posZ', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                </div>
                <br />
                <p style="text-align: center">Rotation Data</p>
                <div class="split split-full space-between">
                    <RangeInput
                        :minIndex="rotMinIndex"
                        :increment="rotIncrement"
                        :indexValue="rotIndexValue"
                        :maxIndex="rotMaxIndex"
                        @input="(e) => generateAttachable('rotX', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                    <RangeInput
                        :minIndex="rotMinIndex"
                        :increment="rotIncrement"
                        :indexValue="rotIndexValue"
                        :maxIndex="rotMaxIndex"
                        @input="(e) => generateAttachable('rotY', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                    <RangeInput
                        :minIndex="rotMinIndex"
                        :increment="rotIncrement"
                        :indexValue="rotIndexValue"
                        :maxIndex="rotMaxIndex"
                        @input="(e) => generateAttachable('rotZ', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                </div>
            </div>
        </div>
        <div class="json-wrapper">
            <p class="json-title" style="text-align: center">
                const changeMe: IAttachable = <br />{ bone: {{ objectData.boneId }}, model: {{ objectData.model }},
                <br />pos: { x: {{ objectData.position.x }}, y: {{ objectData.position.y }}, z:
                {{ objectData.position.z }} }, <br />rot: { x: {{ objectData.rotation.x }}, y:
                {{ objectData.rotation.y }}, z: {{ objectData.rotation.z }} }, uid: 'Change Me!' }
            </p>
        </div>

        <button class="generate-btn">Generated JSON</button>
        <img class="logo" src="./images/LordDevelopment.png" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from '../../components/Button.vue';
import Frame from '../../components/Frame.vue';
import Icon from '../../components/Icon.vue';
import Input from '../../components/Input.vue';
import Modal from '../../components/Modal.vue';
import Module from '../../components/Module.vue';
import RangeInput from '../../components/RangeInput.vue';
import Toolbar from '../../components/Toolbar.vue';

const ComponentName = 'ObjectEditor';
export default defineComponent({
    name: ComponentName,
    components: {
        Button,
        Frame,
        Icon,
        Input,
        Modal,
        Module,
        RangeInput,
        Toolbar,
    },
    data() {
        return {
            // Position =>
            minIndex: -15,
            indexValue: 0,
            increment: 0.1,
            maxIndex: 15,
            // Rotation =>
            rotMinIndex: 0,
            rotIndexValue: 0,
            rotIncrement: 1,
            rotMaxIndex: 360,

            objectData: {
                model: 'prop_tool_blowtorch',
                boneId: 57005,
                animation: 'Animation Dictionary',
                animationName: 'Animation Name',
                animationFlag: 49,
                position: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
            },
        };
    },
    mounted() {
        if ('alt' in window) {
            alt.on(`${ComponentName}:SendSomeData`, this.sendSomeData);
            alt.emit(`${ComponentName}:Ready`);
        }

        // Add Keybinds for In-Menu
        document.addEventListener('keyup', this.handleKeyPress);
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:Close`, this.close);
        }
        document.removeEventListener('keyup', this.handleKeyPress);
    },
    methods: {
        generateAttachable(slot: string, data: number) {
            switch (slot) {
                case 'posX':
                    this.objectData.position.x = data;
                    break;
                case 'posY':
                    this.objectData.position.y = data;
                    break;
                case 'posZ':
                    this.objectData.position.z = data;
                    break;
                case 'rotX':
                    this.objectData.rotation.x = data;
                    break;
                case 'rotY':
                    this.objectData.rotation.y = data;
                    break;
                case 'rotZ':
                    this.objectData.rotation.z = data;
                    break;
                default:
                    break;
            }
            alt.emit('LittleTest', this.objectData);
        },
        playAnim() {
            alt.emit('PlayAnimation', this.objectData.animation, this.objectData.animationName);
        },
        cancelAnim() {
            alt.emit('CancelAnimation');
        },
        createFile() {
            alt.emit('WriteToFS', this.objectData);
        },
        handleKeyPress(e) {
            if (e.keyCode === 27 && 'alt' in window) {
                alt.emit(`${ComponentName}:Close`);
            }
        },
    },
});
</script>

<style scoped>
.wrapper {
    position: absolute;
    height: 870px;
    width: 650px;
    left: 25px;
    top: 40px;
    border-radius: 25px;

    background: #000000;
    border-radius: 25px 25px 0px 0px;
    display: flex;
    justify-content: center;
}
.close-btn {
    position: absolute;
    width: 199px;
    height: 46px;

    background: #ff0000;
    border-radius: 0px 25px;
    right: 0px;
    border: 0px;
    font-family: monospace;
    font-size: 20px;
    color: white;
}
.close-btn:hover {
    transition: 0.5s !important;
    color: rgba(43, 126, 172, 0.8);
    cursor: pointer;
}
.object-model-input {
    width: 183px;
    height: 48px;
    background: url('./images/textinput.png') no-repeat;
    position: absolute;
    height: 46px;
    top: 100px;
    left: 0px;
    border-radius: 0px;
    border: 0px;
}
.bone-id-input {
    width: 183px;
    height: 48px;
    background: url('./images/textinput.png') no-repeat;
    position: absolute;
    height: 46px;
    top: 160px;
    left: 0px;
    border-radius: 0px;
    border: 0px;
}
.animation-input {
    /* Rectangle 5 */
    width: 183px;
    height: 48px;
    background: url('./images/textinput.png') no-repeat;
    position: absolute;
    height: 46px;
    top: 220px;
    left: 0px;
    border-radius: 0px;
    border: 0px;
}
.animation-name-input {
    width: 183px;
    height: 48px;
    background: url('./images/textinput.png') no-repeat;
    position: absolute;
    height: 46px;
    top: 280px;
    left: 0px;
    border-radius: 0px;
    border: 0px;
}
.animation-flag-input {
    width: 183px;
    height: 48px;
    background: url('./images/textinput.png') no-repeat;
    position: absolute;
    height: 46px;
    top: 340px;
    left: 0px;
    border-radius: 0px;
    border: 0px;
}
.attach-button {
    position: absolute;
    width: 176.53px;
    height: 48px;
    top: 100px;
    right: 15px;
    background: url('./images/button.png') no-repeat;
    border: 0px;
    font-family: monospace;
    color: white;
    font-size: 20px;
    transition: 0.5s !important;
}
.attach-button:hover {
    transition: 0.5s !important;
    color: green;
    cursor: pointer;
}
.detach-button {
    position: absolute;
    width: 176.53px;
    height: 48px;
    top: 160px;
    right: 15px;
    background: url('./images/button.png') no-repeat;
    border: 0px;
    font-family: monospace;
    color: white;
    font-size: 20px;
    transition: 0.5s !important;
}
.detach-button:hover {
    transition: 0.5s !important;
    color: green;
    cursor: pointer;
}
.animation-button {
    position: absolute;
    width: 176.53px;
    height: 48px;
    top: 220px;
    right: 15px;
    background: url('./images/button.png') no-repeat;
    border: 0px;
    font-family: monospace;
    color: white;
    font-size: 20px;
    transition: 0.5s !important;
}
.animation-button:hover {
    transition: 0.5s !important;
    color: green;
    cursor: pointer;
}
.cancel-animation-button {
    position: absolute;
    width: 176.53px;
    height: 48px;
    top: 280px;
    right: 15px;
    background: url('./images/button.png') no-repeat;
    border: 0px;
    font-family: monospace;
    color: white;
    font-size: 20px;
    transition: 0.5s !important;
}
.cancel-animation-button:hover {
    transition: 0.5s !important;
    color: green;
    cursor: pointer;
}
.filesystem-button {
    position: absolute;
    width: 176.53px;
    height: 48px;
    top: 340px;
    right: 15px;
    background: url('./images/button.png') no-repeat;
    border: 0px;
    font-family: monospace;
    color: white;
    font-size: 20px;
    transition: 0.5s !important;
}
.filesystem-button:hover {
    transition: 0.5s !important;
    color: green;
    cursor: pointer;
}
.sliders {
    position: absolute;
    top: 450px;
}
.json-wrapper {
    /* Frame 1 */
    position: absolute;
    width: 604px;
    height: 112px;
    top: 670px;
    border-radius: 0px;

    background: rgba(43, 126, 172, 0.8);
    z-index: 100;
    user-select: all;
}
.json-title {
    user-select: all;
    z-index: 150;
}
.generate-btn {
    /* Generate */

    position: absolute;
    width: 269px;
    height: 46px;

    background: rgba(43, 126, 172, 0.8);
    border-radius: 25px 25px 0px 0px;
    border: 0px;
    top: 625px;
    font-family: 'Inter';
    font-style: normal;
    font-size: 30px;
    line-height: 39px;
    color: white;
    text-align: center;
}
.logo {
    position: absolute;
    height: 50px;
    width: 500px;
    top: 800px;
    border-radius: 0px;
}
::placeholder {
    color: lightblue;
    text-align: center;
}
input {
    color: white;
    text-align: center;
}
</style>
