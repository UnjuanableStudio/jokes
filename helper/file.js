/**
 * 将文件转换为二进制并下载
 * @param {File} file
 * @returns {boolean}
 */
export const toDownload = (file) => {
    let url = URL.createObjectURL(file);
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link); // 下载完成移除元素
    URL.revokeObjectURL(url); // 释放掉blob对象
    return true
}

/**
 * 将Base64图片转为File
 * @param {string} dataURL 图像Base64
 * @param {string} filename 文件名，不需要后缀
 * @returns {File}
 */
export const dataURLImageToFile = (dataURL, filename) => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const suffix = mime.split('/')[1]
    const bStr = atob(arr[1])
    const options = {type: mime}
    let n = bStr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bStr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, options)
}

/**
 * 字符保存为文件
 * @param content 内容
 * @param {string} filename 文件名，不需要后缀
 * @param mime
 * @param suffix 指定后缀名，为空时默认从mime中选取
 * @returns {File}
 */
export const stringToFile = (content, filename = 'file', mime = "application/json", suffix = null) => {
    suffix = suffix ?? mime.split('/')[1]
    const options = {
        type: mime,
        lastModified: Date.now()
    }
    return new File([content], `${filename}.${suffix}`, options);
}
