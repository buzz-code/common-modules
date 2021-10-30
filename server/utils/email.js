export async function getAndParseExcelEmail(req, res){
    res.send('success')
    const keys = Object.keys(req.body);
    console.log('keys: ', keys)
    const fromAddress = req.body.from.value;
    console.log('from: ', fromAddress);
    const attachments = req.body.attachments;
    console.log('attachment length: ', attachments.length)
    return {}
}