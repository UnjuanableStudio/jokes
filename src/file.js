/**
 * 将文件转换为二进制并下载
 * @param content 需要保存的内容
 * @param name 文件名
 * @param opt 文件保存选项
 * @returns {boolean}
 */
export function toDownload(content, name, opt) {
    let url = URL.createObjectURL(new Blob([content], opt));
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link); // 下载完成移除元素
    URL.revokeObjectURL(url); // 释放掉blob对象
    return true
}