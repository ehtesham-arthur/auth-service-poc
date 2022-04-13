exports.parseBody = (event) => {
    if(!event.body) { 
        throw new Error('No body found in event');
    }
    const body = JSON.parse(event.body || '{}');
    return body;
}