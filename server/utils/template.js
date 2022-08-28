import ejs from "ejs";
import pdf from "html-pdf";
import path from 'path';
import moment from 'moment';
import fs from 'fs';
import { Readable } from 'stream';
import XlsxTemplate from 'xlsx-template';


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
            // header: {
            //     height: '7mm'
            // },
            // footer: {
            //     height: '7mm',
            // },
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

export async function renderEjsTemplateToStream(template, data) {
    const html = await renderEjsTemplate(template, data);
    const fileStream = await getPdfStreamFromHtml(html);
    return fileStream;
}

export function getFileName(name, ext) {
    return name + ' ' + new Date().toISOString() + '.' + ext;
}

export function downloadFileFromStream(fileStream, filename, ext, res) {
    res.attachment(getFileName(filename, ext));
    fileStream.pipe(res);
}

function getTemplateData(data, columns, filename) {
    return {
        data,
        columns,
        title: filename,
        printedAt: moment().format('DD/MM/yyyy hh:mm:ss'),
    };
}

async function getPdfExport({ data, columns, fileName: filename }) {
    const templatePath = path.join(__filename, '..', '..', '..', 'templates', 'export.ejs');
    const templateData = getTemplateData(data, columns, filename);
    const html = await renderEjsTemplate(templatePath, templateData);
    const fileStream = await getPdfStreamFromHtml(html);
    return { fileStream, filename };
}

export function exportPdf(req, res) {
    getPdfExport(req.body)
        .then(({ fileStream, filename }) => downloadFileFromStream(fileStream, filename, 'pdf', res))
        .catch(err => res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: err.message
        }));
}

export async function renderExcelTemplate(template, data) {
    const templateStr = await fs.promises.readFile(template);
    var template = new XlsxTemplate(templateStr);
    var sheetNumber = 1;
    template.substitute(sheetNumber, data);
    var buffer = template.generate({ type: 'nodebuffer' });
    return buffer;
}

export async function renderExcelTemplateToStream(template, data) {
    const buffer = await renderExcelTemplate(template, data);
    return Readable.from(buffer);
}