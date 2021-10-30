import XLSX from 'xlsx';

export async function getAndParseExcelEmail(req, res) {
    res.send('success');
    const fromAddress = req.body.from.value;
    console.log('got email from: ', fromAddress);
    const attachments = req.body.attachments;

    if (attachments.length == 1) {
        console.log('got attachment: ', attachments[0].filename, attachments[0].contentType);
        const buffer = attachments[0].content.data;
        const wb = XLSX.read(buffer, { type: 'array' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        /* Update state */
        console.log(data);

        return [];
    } else {
        console.log('no data was received');
        return [];
    }
}