/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { InputAssembler, InputAssemblerInfo } from '../input-assembler';
import { WebGL2Buffer } from './webgl2-buffer';
import { WebGL2CmdFuncCreateInputAssember, WebGL2CmdFuncDestroyInputAssembler } from './webgl2-commands';
import { WebGL2Device } from './webgl2-device';
import { IWebGL2GPUInputAssembler, IWebGL2GPUBuffer } from './webgl2-gpu-objects';

export class WebGL2InputAssembler extends InputAssembler {

    public get gpuInputAssembler (): IWebGL2GPUInputAssembler {
        return  this._gpuInputAssembler!;
    }

    private _gpuInputAssembler: IWebGL2GPUInputAssembler | null = null;

    public initialize (info: InputAssemblerInfo): boolean {

        if (info.vertexBuffers.length === 0) {
            console.error('InputAssemblerInfo.vertexBuffers is null.');
            return false;
        }

        this._attributes = info.attributes;
        this._attributesHash = this.computeAttributesHash();
        this._vertexBuffers = info.vertexBuffers;

        if (info.indexBuffer) {
            this._indexBuffer = info.indexBuffer;
            this._indexCount = this._indexBuffer.size / this._indexBuffer.stride;
            this._firstIndex = 0;
        } else {
            const vertBuff = this._vertexBuffers[0];
            this._vertexCount = vertBuff.size / vertBuff.stride;
            this._firstVertex = 0;
            this._vertexOffset = 0;
        }
        this._instanceCount = 0;
        this._firstInstance = 0;

        this._indirectBuffer = info.indirectBuffer || null;

        const gpuVertexBuffers: IWebGL2GPUBuffer[] = new Array<IWebGL2GPUBuffer>(info.vertexBuffers.length);
        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            const vb = info.vertexBuffers[i] as WebGL2Buffer;
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: IWebGL2GPUBuffer | null = null;
        let glIndexType = 0;
        if (info.indexBuffer) {
            gpuIndexBuffer = (info.indexBuffer as WebGL2Buffer).gpuBuffer;
            if (gpuIndexBuffer) {
                switch (gpuIndexBuffer.stride) {
                    case 1: glIndexType = 0x1401; break; // WebGLRenderingContext.UNSIGNED_BYTE
                    case 2: glIndexType = 0x1403; break; // WebGLRenderingContext.UNSIGNED_SHORT
                    case 4: glIndexType = 0x1405; break; // WebGLRenderingContext.UNSIGNED_INT
                    default: {
                        console.error('Illegal index buffer stride.');
                    }
                }
            }
        }

        let gpuIndirectBuffer: IWebGL2GPUBuffer | null = null;
        if (info.indirectBuffer) {
            gpuIndirectBuffer = (info.indirectBuffer as WebGL2Buffer).gpuBuffer;
        }

        this._gpuInputAssembler = {
            attributes: info.attributes,
            gpuVertexBuffers,
            gpuIndexBuffer,
            gpuIndirectBuffer,

            glAttribs: [],
            glIndexType,
            glVAOs: new Map<WebGLProgram, WebGLVertexArrayObject>(),
        };

        WebGL2CmdFuncCreateInputAssember(this._device as WebGL2Device, this._gpuInputAssembler);

        return true;
    }

    public destroy () {
        const webgl2Dev = this._device as WebGL2Device;
        if (this._gpuInputAssembler && webgl2Dev.useVAO) {
            WebGL2CmdFuncDestroyInputAssembler(webgl2Dev, this._gpuInputAssembler);
        }
        this._gpuInputAssembler = null;
    }
}
