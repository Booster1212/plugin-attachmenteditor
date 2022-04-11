<template>
    <div class="wrapper">
        <button class="close-btn">Close</button>
        <input class="object-model-input" placeholder="Object Model" v-model="objectData.model" />
        <input class="bone-id-input" placeholder="<BoneID 18610>" v-model="objectData.boneId" />
        <input class="animation-input" placeholder="Some Animation" v-model="objectData.animation" />
        <input class="animation-name-input" placeholder="Some Animation" v-model="objectData.animationName" />
        <input class="animation-flag-input" placeholder="49" v-model="objectData.animationFlag" />

        <button class="attach-button" @click="attachObject">Attach Object</button>
        <button class="detach-button">Detach Object</button>
        <button class="animation-button" @click="playAnim">Play Anim</button>
        <button class="cancel-animation-button" @click="cancelAnim">Cancel Anim</button>
        <button class="filesystem-button" @click="createFile">Use Filesystem</button>
        <div class="sliders">
            <div class="stack mt-6" style="min-width: 100px">
                <div class="split split-full space-between">
                    <RangeInput
                        :minIndex="minIndex"
                        :increment="0.01"
                        :indexValue="parseInt(objectData.position.x.toFixed(2))"
                        :maxIndex="maxIndex"
                        @input="(e) => generateAttachable('posX', parseFloat(e.target['value']))"
                        class="position-slider"
                        @click="null"
                    />
                    <RangeInput
                        :minIndex="rotMinIndex"
                        :increment="rotIncrement"
                        :indexValue="parseInt(objectData.rotation.x.toFixed(2))"
                        :maxIndex="rotMaxIndex"
                        @input="(e) => generateAttachable('rotX', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                </div>

                <div class="split split-full space-between mt-6">
                    <RangeInput
                        :minIndex="minIndex"
                        :increment="0.01"
                        :indexValue="parseInt(objectData.position.y.toFixed(2))"
                        :maxIndex="maxIndex"
                        @input="(e) => generateAttachable('posY', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                    <RangeInput
                        :minIndex="rotMinIndex"
                        :increment="rotIncrement"
                        :indexValue="parseInt(objectData.rotation.y.toFixed(2))"
                        :maxIndex="rotMaxIndex"
                        @input="(e) => generateAttachable('rotY', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                </div>

                <div class="split split-full space-between mt-6">
                    <RangeInput
                        :minIndex="minIndex"
                        :increment="0.01"
                        :indexValue="parseInt(objectData.position.z.toFixed(2))"
                        :maxIndex="maxIndex"
                        @input="(e) => generateAttachable('posZ', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                    <RangeInput
                        :minIndex="rotMinIndex"
                        :increment="rotIncrement"
                        :indexValue="parseInt(objectData.rotation.z.toFixed(2))"
                        :maxIndex="rotMaxIndex"
                        @input="(e) => generateAttachable('rotZ', parseFloat(e.target['value']))"
                        class="position-slider"
                    />
                </div>
            </div>
        </div>
        <img src="./images/LordDevelopment.png" class="logo" />
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
            increment: 0.0001,
            maxIndex: 15,
            // Rotation =>
            rotMinIndex: 0,
            rotIndexValue: 0,
            rotIncrement: 1,
            rotMaxIndex: 360,

            objectData: {
                model: 'p_amb_phone_01',
                boneId: 57005,
                animation: 'cellphone@',
                animationName: 'cellphone_text_in',
                animationFlag: 'Not supported atm',
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
            alt.on(`SetEditorData`, this.setEditorData);
            alt.emit(`${ComponentName}:Ready`);
        }

        document.addEventListener('keyup', this.handleKeyPress);
    },
    unmounted() {
        if ('alt' in window) {
            alt.off(`${ComponentName}:Close`, this.close);
        }
        document.removeEventListener('keyup', this.handleKeyPress);
    },
    methods: {
        setEditorData(pos, rot, model, bone, animationDict, animationName) {
            this.objectData.position.x = pos.x;
            this.objectData.position.y = pos.y;
            this.objectData.position.z = pos.z;

            this.objectData.rotation.x = rot.x;
            this.objectData.rotation.y = rot.y;
            this.objectData.rotation.z = rot.z;

            this.objectData.model = model,
            this.objectData.boneId = bone,
            this.objectData.animation = animationDict,
            this.objectData.animationName = animationName;  

            console.log("Vue " + model, bone, animationDict, animationName);
        },
        attachObject() {
            alt.emit('AttachObject', this.objectData);
        },
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
            alt.emit('ChangeAttachedObject', this.objectData);
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
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
.wrapper {
    position: absolute;
    width: 500px;
    height: 700px;
    left: 1%;
    background: linear-gradient(180.04deg, #000000 75.25%, rgba(188, 49, 174, 0.8) 99.97%);
    border-radius: 0px;
    display: flex;
    justify-content: center;
}
.close-btn {
    position: absolute;
    width: 120px;
    height: 46px;

    background: #ff0000;
    border-radius: 0px 0px 0px 25px;
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
    position: absolute;
    width: 200px;
    height: 30px;
    background: rgba(125, 224, 255, 0.8);
    background-size: 50%;
    border-radius: 0px 25px 25px 0px;
    top: 105px;
    left: 0px;
    border: 0px;
}
.bone-id-input {
    position: absolute;
    width: 200px;
    height: 30px;
    background: rgba(125, 224, 255, 0.8);
    background-size: 50%;
    border-radius: 0px 25px 25px 0px;
    top: 165px;
    left: 0px;
    border: 0px;
}
.animation-input {
    position: absolute;
    width: 200px;
    height: 30px;
    background: rgba(125, 224, 255, 0.8);
    background-size: 50%;
    border-radius: 0px 25px 25px 0px;
    top: 225px;
    left: 0px;
    border: 0px;
}
.animation-name-input {
    position: absolute;
    width: 200px;
    height: 30px;
    background: rgba(125, 224, 255, 0.8);
    background-size: 50%;
    border-radius: 0px 25px 25px 0px;
    top: 285px;
    left: 0px;
    border: 0px;
}
.animation-flag-input {
    position: absolute;
    width: 200px;
    height: 30px;
    background: rgba(125, 224, 255, 0.8);
    background-size: 50%;
    border-radius: 0px 25px 25px 0px;
    top: 345px;
    left: 0px;
    border: 0px;
}
.attach-button {
    position: absolute;
    width: 220px;
    height: 40px;
    right: -7px;
    top: 100px;
    background: url('./images/button.png') no-repeat;
    background-size: 100%;
    border: 0px;
    font-family: 'Poppins';
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
    width: 220px;
    height: 40px;
    top: 160px;
    right: -7px;
    background: url('./images/button.png') no-repeat;
    background-size: 100%;
    border: 0px;
    font-family: 'Poppins';
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
    width: 220px;
    height: 40px;
    top: 220px;
    right: -7px;
    background: url('./images/button.png') no-repeat;
    background-size: 100%;
    border: 0px;
    font-family: 'Poppins';
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
    width: 220px;
    height: 40px;
    top: 280px;
    right: -7px;
    float: right;
    background: url('./images/button.png') no-repeat;
    background-size: 100%;
    border: 0px;
    font-family: 'Poppins';
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
    width: 220px;
    height: 40px;
    top: 340px;
    right: -7px;
    background: url('./images/button.png') no-repeat;
    background-size: 100%;
    border: 0px;
    font-family: 'Poppins';
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
    top: 430px;
    color: white;
}
.position-slider {
    position: relative;
    width: 220px;
    height: 30px;
    font-family: 'Poppins';
    font-size: 50px;
}
.logo {
    position: absolute;
    width: 400px;
    top: 620px;
}
::placeholder {
    color: lightblue;
    text-align: center;
}
input {
    color: white;
    text-align: center;
    font-size: 16px;
    font-family: 'Poppins';
}
</style>
