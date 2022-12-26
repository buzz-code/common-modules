import XLSX from 'xlsx';

export async function getAndParseExcelEmail(req, res = null) {
    console.warn('this method is depracated, use v2 method');
    if (res) {
        res.send('success');
    }

    const attachments = getAttachments(req);
    if (attachments.length == 1) {
        return parseAttachment(attachment, req.body.subject)
    } else {
        console.log('no data was received');
        return { data: [] };
    }
}

export function getAndParseExcelEmailV2(req) {
    const attachments = getAttachments(req);
    return attachments.map(attachment => parseAttachment(attachment, req.body.subject));
}

export async function getAndParseExcelEmailV2WithResponse(req, callback) {
    const attachments = getAndParseExcelEmailV2(req);
    if (attachments.length === 0) {
        throw new Error('לא ניתן לשמור אם אין קבצים מצורפים');
    }

    const responses = [];
    for (const attachment of attachments) {
        const ans = await callback(attachment)
            .then(() => `${attachment.attachmentName}: ${attachment.data.length} רשומות נשמרו בהצלחה`)
            .catch(e => `${attachment.attachmentName}: שגיאה, פני לאחראית - ${e.message}`);
        console.log(ans);
        responses.push(ans);
    }
    return responses.join('\n')
}

function getAttachments(req) {
    const fromAddress = req.body.from.value;
    console.log('got email from: ', fromAddress);
    const attachments = req.body.attachments;

    return attachments;
}

function parseAttachment(attachment, requestedSheetName) {
    console.log('got attachment: ', attachment.filename, attachment.contentType);
    const buffer = attachment.content.data;
    const wb = XLSX.read(buffer, { type: 'array' });
    /* Get first worksheet */
    const { ws, sheetName } = getWorkingSheet(requestedSheetName, wb);
    /* Convert array of arrays */
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });

    return {
        data: data.slice(1),
        sheetName,
        attachmentName: attachment.filename,
    };
}

function getWorkingSheet(requestedSheetName, wb) {
    for (const key in wb.Sheets) {
        if (requestedSheetName && requestedSheetName.includes(key)) {
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
