/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2011 Zynga Inc.
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#pragma once

#include <memory>
#include "base/std/container/string.h"

#include "base/Macros.h"
#include "platform/FileUtils.h"

namespace cc {

//! @brief  Helper class to handle file operations
class CC_DLL FileUtilsApple : public FileUtils {
public:
    FileUtilsApple();
    ~FileUtilsApple() override = default;
    /* override functions */
    ccstd::string getWritablePath() const override;
    ccstd::string getFullPathForDirectoryAndFilename(const ccstd::string &directory, const ccstd::string &filename) const override;

    ValueMap getValueMapFromFile(const ccstd::string &filename) override;
    ValueMap getValueMapFromData(const char *filedata, int filesize) override;
    bool writeToFile(const ValueMap &dict, const ccstd::string &fullPath) override;

    ValueVector getValueVectorFromFile(const ccstd::string &filename) override;
#if CC_FILEUTILS_APPLE_ENABLE_OBJC
    void setBundle(NSBundle *bundle);
#endif

    bool createDirectory(const ccstd::string &path) override;

private:
    bool isFileExistInternal(const ccstd::string &filePath) const override;
    bool removeDirectory(const ccstd::string &dirPath) override;
    void valueMapCompact(ValueMap &valueMap) override;
    void valueVectorCompact(ValueVector &valueVector) override;

    struct IMPL;
    std::unique_ptr<IMPL> pimpl_;
};

} // namespace cc
