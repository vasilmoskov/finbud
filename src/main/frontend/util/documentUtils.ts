export const visualizeDocument = (document: string) => {
    const win = window.open();
    if (!win) return;

    if (document.startsWith('data:application/pdf')) {
        win.document.write(`
            <iframe src="${document}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>
        `);
    } else if (document.startsWith('data:image/')) {
        win.document.write(`
            <html>
                <body style="margin:0; display:flex; justify-content:center; align-items:center; height:100vh; background-color:#f0f0f0;">
                    <img src="${document}" style="max-width:100%; max-height:100%; object-fit:contain;"/>
                </body>
            </html>
        `);
    } else {
        win.document.write(`<p>Unsupported document format.</p>`);
    }
};
