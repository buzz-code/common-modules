import XLSX from 'xlsx';

export async function getAndParseExcelEmail(req, res = null) {
    if (res) {
        res.send('success');
    }

    const fromAddress = req.body.from.value;
    console.log('got email from: ', fromAddress);
    const attachments = req.body.attachments;

    if (attachments.length == 1) {
        console.log('got attachment: ', attachments[0].filename, attachments[0].contentType);
        const buffer = attachments[0].content.data;
        const wb = XLSX.read(buffer, { type: 'array' });
        /* Get first worksheet */
        const { ws, sheetName } = getWorkingSheet(req, wb);
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        /* Update state */
        return {
            data: data.slice(1),
            sheetName,
        };
    } else {
        console.log('no data was received');
        return [];
    }
}

function getWorkingSheet(req, wb) {
    for (const key in wb.Sheets) {
        if (req.body.subject && req.body.subject.includes(key)) {
            return {
                ws: wb.Sheets[key],
                sheetName: key
            };
        }
    }
    const firstSheet = wb.SheetNames[0];
    return {
        ws: wb.Sheets[firstSheet],
        sheetName: firstSheet
    };
}
