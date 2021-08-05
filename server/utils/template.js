import ejs from "ejs";
import pdf from "html-pdf";

export function renderEjsTemplate(template, data) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(template, data, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    });
}

export function getPdfStreamFromHtml(html, options) {
    return new Promise((resolve, reject) => {
        let pdfOptions = {
            format: 'A4',
            header: {
                height: '7mm'
            },
            footer: {
                height: '7mm',
            },
            ...options
        };
        pdf.create(html, pdfOptions).toStream(function (err, stream) {
            if (err) {
                reject(err);
            } else {
                resolve(stream);
            }
        });
    });
}

export function getFileName(name, ext) {
    return name + ' ' + new Date().toISOString() + '.' + ext;
}