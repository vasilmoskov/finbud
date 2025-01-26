export const visualizeDocument = (document: string) => {
    const win = window.open();
    if (win) {
        win.document.write(`<iframe src="${document}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
};